using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Android;
using UnityEngine.UI;
using NRKernal;
using OpenCVForUnity.Calib3dModule;
using OpenCVForUnity.CoreModule;
using OpenCVForUnity.ImgcodecsModule;
using OpenCVForUnity.ImgprocModule;
using OpenCVForUnity.ObjdetectModule;
using OpenCVForUnity.UnityUtils;
using OpenCVForUnity.DnnModule;
using UnityEngine.Networking;
using Newtonsoft.Json;
using TMPro;
using GalleryDataProvider = NRKernal.NRExamples.NativeGalleryDataProvider;

namespace test2
{
    public class Yolo : MonoBehaviour
    {
        
        [Serializable]
        public class FaceData
        {
            public string name;
            public string note;
            public float[] embedding;
            public string id;
        }
        [Serializable]
        public class FaceDatabase
        {
            public FaceData[] faces;
        }
        
        FaceDetectorYN faceDetector;

        public RawImage CaptureImage;
        private NRRGBCamTexture RGBCamTexture { get; set; }

        string fd_modelPath;
        protected static readonly string MODEL_FILENAME = "OpenCVForUnity/objdetect/face_detection_yunet_2023mar.onnx";
        protected static readonly string MFN_FILENAME = "OpenCVForUnity/objdetect/mbf.onnx";
        
        CancellationTokenSource cts = new CancellationTokenSource();
        int inputSizeW = 640;
        int inputSizeH = 640;

        float scoreThreshold = 0.7f; // 얼굴인식 score 0.5-> 0.7로 수정
        float nmsThreshold = 0.4f;
        int topK = 1;

        private bool isInitialized = false;

        // 인식 결과 캐시 관련 변수
        private float lastDetectedTime = -10f;
        private float keepDuration = 2.0f; // 2초 유지
        private List<float[]> lastDetectedFaces = new List<float[]>();
        private Texture2D lastFrame;
        private Color32[] lastPixels;
        
        Dictionary<string, float[]> knownFaces;
        private Dictionary<string, string> nameToIdMap;
        private Dictionary<string, string> knownNotes;

        [Header("UI")]
        [SerializeField] private TextMeshProUGUI faceInfoText;

        Net mobileFaceNet;
        
        GalleryDataProvider galleryDataTool;
        private bool takeflag;
        private float victory_count;
        private List<string> lastDetectedTargetIds = new List<string>();

        public Image ledIndicator;

        IEnumerator Start()
        {
#if UNITY_ANDROID && !UNITY_EDITOR
            if (!Permission.HasUserAuthorizedPermission(Permission.Camera))
            {
                Permission.RequestUserPermission(Permission.Camera);
                Debug.Log("카메라 권한 요청됨");
                yield return new WaitForSeconds(1.5f);
            }
#endif
            faceInfoText.text = "모델 불러오는 중...";
            int retry = 0;
            const int maxRetry = 5;
            
            victory_count = 0f;
            takeflag = false;


            while (retry < maxRetry)
            {
                if (!NRDevice.Subsystem.IsFeatureSupported(NRSupportedFeature.NR_FEATURE_RGB_CAMERA))
                {
                    Debug.LogError("RGB Camera not supported");
                    yield break;
                }

                RGBCamTexture = new NRRGBCamTexture();
                RGBCamTexture.Play();
                Debug.Log("[DEBUG] RGBCamTexture.Play() 호출됨");


                yield return new WaitForSeconds(1.0f);
                Debug.Log($"[DEBUG] RGBCamTexture 상태: IsPlaying = {RGBCamTexture.IsPlaying}");

                if (RGBCamTexture.IsPlaying && RGBCamTexture.GetTexture() != null)
                {
                    Debug.Log("[OK] RGBCamTexture 시작됨");
                    CaptureImage.texture = RGBCamTexture.GetTexture();
                    Debug.Log("[OK] RGBCamTexture 시작됨2");
                    StartCoroutine(LoadModelCoroutine(() => isInitialized = true));
                    yield break;
                }

                Debug.LogWarning($"[Retry] RGB Camera 연결 실패. 재시도 중... ({retry + 1}/{maxRetry})");
                RGBCamTexture.Stop();
                RGBCamTexture = null;
                yield return new WaitForSeconds(3.0f);
                retry++;
            }

            Debug.LogError("RGB Camera를 시작할 수 없습니다. 앱을 재시작하거나 권한을 확인하세요.");
        }

        IEnumerator LoadModelCoroutine(Action onComplete)
        {
            Debug.Log("[ok]LoadModelCoroutine 시작");
            Task<string> modelTask = Utils.getFilePathAsyncTask(MODEL_FILENAME, cancellationToken: cts.Token);
            Task<string> modelFaceTask = Utils.getFilePathAsyncTask(MFN_FILENAME, cancellationToken: cts.Token);
            
            while (!modelTask.IsCompleted || !modelFaceTask.IsCompleted) yield return null;

            fd_modelPath = modelTask.Result;
            string mfnPath = modelFaceTask.Result;

            if (string.IsNullOrEmpty(fd_modelPath) || string.IsNullOrEmpty(mfnPath))
            {
                Debug.LogError("모델 파일 로딩 실패");
                yield break;
            }

            try
            {
                Debug.Log("[ok]모델 로딩 시작");
                faceDetector = FaceDetectorYN.create(fd_modelPath, "", new Size(inputSizeW, inputSizeH), scoreThreshold, nmsThreshold, topK);
                mobileFaceNet = Dnn.readNetFromONNX(mfnPath);
                Debug.Log("모델 로딩 완료");
            }
            catch (Exception ex)
            {
                Debug.LogError($"모델 로딩 중 오류: {ex.Message}");
                yield break;
            }

            string jsonPath = Path.Combine(Application.streamingAssetsPath, "faces/known_faces.json");
            string json = null;

        #if UNITY_ANDROID && !UNITY_EDITOR
            if (jsonPath.Contains("://") || jsonPath.Contains("jar:"))
            {
                UnityWebRequest www = UnityWebRequest.Get(jsonPath);
                yield return www.SendWebRequest(); // ✅ try 밖에서 실행

                if (www.result == UnityWebRequest.Result.Success)
                {
                    json = www.downloadHandler.text;
                }
                else
                {
                    Debug.LogWarning($"[WARNING] Face DB 로딩 실패: {www.error}");
                }
            }
            else
        #endif
            {
                try
                {
                    json = File.ReadAllText(jsonPath);
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"[WARNING] 로컬 Face DB 로딩 실패: {ex.Message}");
                }
            }

            if (!string.IsNullOrEmpty(json))
            {
                try
                {
                    ParseAndSetFaceDB(json);
                }
                catch (Exception ex)
                {
                    Debug.LogError($"[ERROR] Face DB 파싱 중 오류: {ex.Message}");
                    knownFaces = new Dictionary<string, float[]>();
                    nameToIdMap = new Dictionary<string, string>();
                }
            }
            else
            {
                Debug.LogWarning("[WARNING] Face DB 로딩 실패 또는 파일 없음");
                knownFaces = new Dictionary<string, float[]>();
                nameToIdMap = new Dictionary<string, string>();
            }
            Debug.Log("[DEBUG] 모델 로딩 루틴 끝까지 도달, isInitialized 실행됨");
            onComplete?.Invoke();
        }


        void Update()
        {
            Debug.Log($"[DEBUG] 상태체크: isInitialized={isInitialized}, RGBCamTexture={RGBCamTexture}, IsPlaying={RGBCamTexture?.IsPlaying}, CaptureImage={CaptureImage}, texture={CaptureImage?.texture}, faceDetector={faceDetector}");
            if (faceDetector == null)
                Debug.LogWarning("[WARNING] faceDetector가 null입니다!");
            else
                Debug.Log("[DEBUG] faceDetector 생성 성공");


            if (!isInitialized || RGBCamTexture == null || !RGBCamTexture.IsPlaying || CaptureImage == null || CaptureImage.texture == null || faceDetector == null)
                return;

            // int skipRate = 10;
            // if (Time.frameCount % skipRate != 0)
            //     return;

            Texture2D texture = RGBCamTexture.GetTexture();
            if (texture == null)
            {
                Debug.Log($"[DEBUG] texture is null");
                return;
            }


            if (NRInput.Hands.IsRunning)
            {
                HandState handState = NRInput.Hands.GetHandState(HandEnum.RightHand);

                if (ledIndicator != null)
                {
                    ledIndicator.gameObject.SetActive(handState.isTracked); // 손 추적 중일 때만 표시
                }
                Debug.Log($"[VictoryTrigger] isTracked={handState.isTracked}, isVictory={handState.isVictory}, victory_count={victory_count}, takeflag={takeflag}");



                if (handState.isTracked && handState.isVictory)
                {
                    if (takeflag == false)
                    {
                        if (victory_count <= 20)
                        {
                            victory_count++;
                            ledIndicator.color = Color.yellow;
                        }
                        else
                        {
                            if (ledIndicator != null)
                            {
                                ledIndicator.color = Color.red;
                            }
                            //else
                            //{
                            //    Debug.LogWarning("[WARNING] resultText가 null입니다. UI에 연결되었는지 확인하세요.");
                            //}
                            //Debug.Log("손 인식 성공");
                            CapturePhoto(texture, lastDetectedTargetIds);
                            //Debug.Log("캡처 끝");
                        }
                    }
                    else
                    {
                        takeflag = false;
                        victory_count = 0;
                        if (ledIndicator != null)
                        {
                            ledIndicator.color = Color.green; // 기본색 또는 초기색
                        }
                    }
                }
                else
                {
                    if (ledIndicator != null)
                        ledIndicator.gameObject.SetActive(false);

                    Debug.LogWarning("[HandGesturePhotoCapture] HandTracking이 실행 중이 아님");
                }

                Color32[] currentPixels = texture.GetPixels32();
                if (lastPixels != null && Enumerable.SequenceEqual(currentPixels, lastPixels))
                {
                    // 프레임 동일 → skip
                    return;
                }
                lastPixels = currentPixels;

                // Mat 초기화
                Mat rgbaMat = new Mat(texture.height, texture.width, CvType.CV_8UC3);
                Mat bgrMat = new Mat();
                Mat resizedMat = new Mat();
                Mat faces = new Mat();

                Utils.texture2DToMat(texture, rgbaMat);
                Core.flip(rgbaMat, rgbaMat, 0);

                Imgproc.cvtColor(rgbaMat, bgrMat, Imgproc.COLOR_RGBA2BGR);
                Imgproc.resize(bgrMat, resizedMat, new Size(inputSizeW, inputSizeH));

                // 얼굴 검출
                faceDetector.detect(resizedMat, faces);
                if (faces.rows() > 0)
                {
                    Debug.Log("[FaceDetector] 얼굴 인식됨");
                    lastDetectedTime = Time.time;
                    lastDetectedFaces.Clear();

                    for (int i = 0; i < faces.rows(); i++)
                    {
                        float[] faceData = new float[15];
                        faces.get(i, 0, faceData);
                        lastDetectedFaces.Add(faceData);
                    }
                }
                else
                {
                    Debug.Log("[FaceDetector] 얼굴 인식 안됨");
                }

                // 결과 그리기: 인식 직후 또는 유지 시간 내라면
                if (Time.time - lastDetectedTime <= keepDuration)
                {
                    foreach (var faceData in lastDetectedFaces)
                    {
                        float xRatio = (float)rgbaMat.cols() / inputSizeW;
                        float yRatio = (float)rgbaMat.rows() / inputSizeH;

                        float x = faceData[0] * xRatio;
                        float y = faceData[1] * yRatio;
                        float width = faceData[2] * xRatio;
                        float height = faceData[3] * yRatio;

                        Imgproc.rectangle(rgbaMat, new Point(x, y), new Point(x + width, y + height), new Scalar(0, 255, 0, 255), 2);

                        // for (int j = 0; j < 5; j++)
                        // {
                        //     float landmarkX = faceData[4 + j * 2] * xRatio;
                        //     float landmarkY = faceData[4 + j * 2 + 1] * yRatio;

                        //     Imgproc.circle(rgbaMat, new Point(landmarkX, landmarkY), 3, new Scalar(0, 255, 0, 255), -1);
                        // }

                        Mat alignedFace = AlignFace(faceData, bgrMat, xRatio, yRatio);
                        if (alignedFace == null || alignedFace.empty())
                            continue;// 정렬된 얼굴 저장용 텍스처 변환 및 저장
                        try
                        {
                            // 저장 경로 준비
                            // string saveDir = Path.Combine(Application.persistentDataPath, "XrealShots");
                            // if (!Directory.Exists(saveDir))
                            // {
                            //     Directory.CreateDirectory(saveDir);
                            //     Debug.Log($"[DEBUG] 디렉토리 생성됨: {saveDir}");
                            // }

                            Texture2D alignedTexture = new Texture2D(alignedFace.cols(), alignedFace.rows(), TextureFormat.RGB24, false);
                            Imgproc.cvtColor(alignedFace, alignedFace, Imgproc.COLOR_BGR2RGB);  // 색상 순서 맞추기
                            Utils.matToTexture2D(alignedFace, alignedTexture);
                        }
                        catch (Exception ex)
                        {
                            Debug.LogError("[FaceSaver] 저장 중 예외: " + ex.Message);
                        }

                        Mat resized = new Mat();
                        Imgproc.resize(alignedFace, resized, new Size(112, 112));
                        Mat blob = Dnn.blobFromImage(
                            resized,
                            1.0f / 127.5f,
                            new Size(112, 112),
                            new Scalar(127.5, 127.5, 127.5),
                            false,  // BGR→RGB
                            false
                        );

                        // 3) 임베딩 추출
                        mobileFaceNet.setInput(blob);
                        Mat featMat = mobileFaceNet.forward();
                        int dim = featMat.cols();
                        float[] feat = new float[dim];
                        featMat.get(0, 0, feat);

                        // 4) L2 정규화
                        float norm = Mathf.Sqrt(feat.Sum(x => x * x));
                        for (int i = 0; i < dim; i++) feat[i] /= norm;

                        // 5) 코사인 유사도로 매칭
                        string bestName = "Unknown";
                        float bestScore = -1f;
                        foreach (var kv in knownFaces)
                        {
                            var other = kv.Value;
                            float dot = 0, na = 0, nb = 0;
                            for (int i = 0; i < dim; i++)
                            {
                                dot += feat[i] * other[i];
                                na += feat[i] * feat[i];
                                nb += other[i] * other[i];
                            }
                            float score = dot / (Mathf.Sqrt(na) * Mathf.Sqrt(nb));
                            if (score > bestScore)
                            {
                                bestScore = score;
                                bestName = kv.Key;
                            }
                        }

                        if (bestName != "Unknown" && nameToIdMap.ContainsKey(bestName))
                        {
                            lastDetectedTargetIds.Clear(); // 덮어쓰기
                            lastDetectedTargetIds.Add(nameToIdMap[bestName]);
                            Debug.Log($"[DEBUG] 얼굴 ID 저장됨: {nameToIdMap[bestName]}");
                        }

                        float textX = Mathf.Min(x + width, rgbaMat.cols() - 1);
                        float textY = Mathf.Min(y + height + 20, rgbaMat.rows() - 1);
                        // 6) 화면에 결과 그리기
                        //    Imgproc.putText(
                        //        rgbaMat,
                        //        $"{bestName} ({bestScore:F2})",
                        //        new Point(textX, textY),
                        //        Imgproc.FONT_HERSHEY_SIMPLEX,
                        //        0.6,
                        //        new Scalar(255, 255, 255, 255),
                        //        2
                        //    );
                        //    Debug.Log($"[DEBUG] 얼굴 인식 : {bestName}");
                        if (bestScore > 0.3)
                        {
                            string note = knownNotes.TryGetValue(bestName, out var n) ? n : "특이사항 없음";
                            faceInfoText.text = $"{bestName}\n{note}";
                        }
                        else
                        {
                            faceInfoText.text = "unknown face";
                        }

                        // 메모리 해제
                        //alignedFace.Dispose();
                        //resized.Dispose();
                        //blob.Dispose();
                        //featMat.Dispose();
                    }
                }

                Core.flip(rgbaMat, rgbaMat, 0);
                Utils.matToTexture2D(rgbaMat, texture);
                if (CaptureImage.texture != null)
                {
                    CaptureImage.texture = texture;
                }
                else
                {
                    Debug.LogError("[ERROR] CaptureImage가 null입니다! UI에 연결되어 있는지 확인하세요.");
                }

                // 메모리 해제
                //rgbaMat.Dispose();
                //bgrMat.Dispose();
                //resizedMat.Dispose();
                //faces.Dispose();
            }
        }
        protected virtual Mat AlignFace(float[] d,Mat bgrMat,float xRatio,float yRatio)
        {
            Point[] arcfaceCoords = new Point[]
            {
                new Point(36.0, 52.0),
                new Point(75.0, 50.0),
                new Point(56.0, 71.7),
                new Point(41.0, 92.0),
                new Point(72.0, 91.0)
            };
            float imageSize = 112f;
            float ratio = imageSize / 112f;
            float diffX = 0f;
            
            if (imageSize % 112 != 0f) {
                // 128 모드를 쓴다면
                ratio = imageSize / 128f;
                diffX = 8f * ratio;
            }
            Point[] dstPts = arcfaceCoords
                .Select(p => new Point(p.x * ratio + diffX, p.y * ratio))
                .ToArray();

            MatOfPoint2f dst = new MatOfPoint2f(dstPts);
            
            MatOfPoint2f src = new MatOfPoint2f(new Point[] {
                new Point(d[4]* xRatio, d[5]* yRatio),
                new Point(d[6] * xRatio, d[7] * yRatio),
                new Point(d[8]* xRatio, d[9]* yRatio),
                new Point(d[10]* xRatio, d[11]* yRatio),
                new Point(d[12]* xRatio, d[13]* yRatio),
            });

            Mat warpMat = Calib3d.estimateAffinePartial2D(src, dst);
            
            Mat alignedFace = new Mat();
            Imgproc.warpAffine(
                bgrMat,
                alignedFace,
                warpMat,
                new Size(imageSize, imageSize),
                Imgproc.INTER_LINEAR,
                Core.BORDER_CONSTANT,
                new Scalar(0,0,0)
            );
            return alignedFace;
        }
        
        
        void ParseAndSetFaceDB(string json)
        {
            try
            {
                FaceDatabase db = JsonConvert.DeserializeObject<FaceDatabase>(json);
                if (db?.faces == null || db.faces.Length == 0)
                {
                    Debug.LogWarning("[WARNING] FaceDatabase 파싱 결과가 null입니다.");
                    knownFaces = new Dictionary<string, float[]>();
                    knownNotes = new Dictionary<string, string>();
                }
                else
                {
                    knownFaces = db.faces.ToDictionary(f => f.name, f => f.embedding);
                    knownNotes = db.faces.ToDictionary(f => f.name, f => f.note);
                    nameToIdMap = db.faces.ToDictionary(f => f.name, f => f.id);
                    Debug.Log($"[DEBUG] FaceDB 등록 완료: {knownFaces.Count}명");
                    foreach (var face in db.faces)
                        Debug.Log($"[DEBUG] 이름: {face.name}, 임베딩 길이: {face.embedding?.Length}");
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[ERROR] Face DB 파싱 오류: {ex.Message}");
                knownFaces = new Dictionary<string, float[]>();
                knownNotes = new Dictionary<string, string>();
            }
        }
        private async void CapturePhoto(
            Texture2D texture,
            List<string> lastDetectedTargetIds)
        {
            if (texture == null)
            {
                Debug.LogError("[CapturePhoto] 전달된 texture가 null입니다!");
                return;
            }
            
            if (takeflag)
            {
                Debug.Log("[CapturePhoto] 호출 차단됨 (이미 캡처 중)");
                return;
            }

            if (lastDetectedTargetIds == null)
            {
                Debug.Log("[CapturePhoto] lastDetectedTargetIds가 없음");
                return;
            }
            Debug.Log("CapturePhoto() 호출됨");
            takeflag = true;
            

            Mat mat = new Mat(texture.height, texture.width, CvType.CV_8UC4);
            Utils.texture2DToMat(texture, mat);
            Core.flip(mat, mat, 0);
            
            Texture2D flippedTex = new Texture2D(texture.width, texture.height, TextureFormat.RGBA32, false);
            Utils.matToTexture2D(mat, flippedTex);
            
            // SaveTextureToGallery(flippedTex);
            string fileId = await UploadImageAsync(flippedTex);
            await SendAlbumRequest(fileId, lastDetectedTargetIds);
            
            takeflag =false;
            victory_count = 0;
            Debug.Log("[CapturePhoto] 캡처 완료 및 상태 초기화");
            
        }
        
        private async Task SendAlbumRequest(string fileId, List<string> targetIds)
        {
            if (string.IsNullOrEmpty(fileId) || targetIds == null || targetIds.Count == 0)
            {
                Debug.LogWarning("[SendAlbumRequest] fileId 또는 targetId가 유효하지 않음");
                return;
            }

            var payload = new
            {
                fileId = int.Parse(fileId),
                targetName = targetIds,
                type = "PERSONAL"
            };

            string json = JsonConvert.SerializeObject(payload);

            UnityWebRequest request = new UnityWebRequest("https://c203ur.duckdns.org/api/album/create", "POST");
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);

            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Authorization", "ApiKey c203raspberry");
            request.SetRequestHeader("Content-Type", "application/json");

            var operation = request.SendWebRequest();
            while (!operation.isDone)
                await Task.Yield();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("[SendAlbumRequest] 앨범 등록 성공: " + request.downloadHandler.text);
            }
            else
            {
                Debug.LogError("[SendAlbumRequest] 앨범 등록 실패: " + request.error);
            }
        }

        private async Task<string> UploadImageAsync(Texture2D texture)
        {
            Debug.Log("[AsyncUpload] 사진 보내는 중ㅡ ");
            byte[] imageBytes = texture.EncodeToPNG();

            WWWForm form = new WWWForm();
            form.AddBinaryData("files", imageBytes, "photo.png", "image/png");

            UnityWebRequest request = UnityWebRequest.Post("https://c203ur.duckdns.org/api/file/upload", form);
            request.SetRequestHeader("Authorization", "ApiKey c203raspberry");

            var operation = request.SendWebRequest();

            while (!operation.isDone)
                await Task.Yield();  // 백그라운드 대기

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("[AsyncUpload] 업로드 실패: " + request.error);
                return null;
            }

            string response = request.downloadHandler.text;
            Debug.Log("[AsyncUpload] 성공: " + response);

            return ParseFileIdFromJson(response);  // ← file_id 반환
        }
        
        [Serializable]
        private class UploadResponse
        {
            public Result result;

            [Serializable]
            public class Result
            {
                public List<string> fileIds;
            }
        }

        private string ParseFileIdFromJson(string json)
        {
            try
            {
                UploadResponse response  = JsonConvert.DeserializeObject<UploadResponse>(json);
                if (response?.result?.fileIds != null && response.result.fileIds.Count > 0)
                {
                    return response.result.fileIds[0].ToString();  // 첫 번째 fileId 반환
                }
            }
            catch (Exception ex)
            {
                Debug.LogError("[ParseFileIdFromJson] 예외: " + ex.Message);
            }
            return null;
        }

        private void SaveTextureToGallery(Texture2D texture)
        {
            if (texture == null) return;

            if (galleryDataTool == null)
                galleryDataTool = new GalleryDataProvider();

            string filename = $"Xreal_Shot_{NRTools.GetTimeStamp()}.png";
            byte[] pngBytes = texture.EncodeToPNG();
            galleryDataTool.InsertImage(pngBytes, filename, "Screenshots");

            Debug.Log($"[GallerySave] 이미지가 갤러리에 저장됨: {filename}");
        }
        private Texture2D FlipTextureVertically(Texture2D original)
        {
            int width = original.width;
            int height = original.height;

            Texture2D flipped = new Texture2D(width, height, original.format, false);
            Color32[] pixels = original.GetPixels32();
            Color32[] flippedPixels = new Color32[pixels.Length];

            for (int y = 0; y < height; y++)
            {
                Array.Copy(pixels, y * width, flippedPixels, (height - 1 - y) * width, width);
            }

            flipped.SetPixels32(flippedPixels);
            flipped.Apply();

            return flipped;
        }

        void OnDestroy()
        {
            RGBCamTexture?.Stop();
            RGBCamTexture = null;
            
        }
    }
}
