// using System;
// using System.Collections;
// using System.Collections.Generic;
// using System.IO;
// using System.Linq;
// using System.Threading;
// using System.Threading.Tasks;
// using UnityEngine;
// using UnityEngine.Android;
// using UnityEngine.UI;
// using NRKernal;
// using OpenCVForUnity.Calib3dModule;
// using OpenCVForUnity.CoreModule;
// using OpenCVForUnity.ImgcodecsModule;
// using OpenCVForUnity.ImgprocModule;
// using OpenCVForUnity.ObjdetectModule;
// using OpenCVForUnity.UnityUtils;
// using OpenCVForUnity.DnnModule;
// using UnityEngine.Networking;
//
// namespace test2
// {
//     public class Yolo : MonoBehaviour
//     {
//         
//         [Serializable]
//         public class FaceData
//         {
//             public string name;
//             public float[] embedding;
//         }
//         [Serializable]
//         public class FaceDatabase
//         {
//             public FaceData[] faces;
//         }
//         
//         FaceDetectorYN faceDetector;
//
//         public RawImage CaptureImage;
//         private NRRGBCamTexture RGBCamTexture { get; set; }
//
//         string fd_modelPath;
//         protected static readonly string MODEL_FILENAME = "OpenCVForUnity/objdetect/face_detection_yunet_2023mar.onnx";
//         protected static readonly string MFN_FILENAME = "OpenCVForUnity/objdetect/mbf.onnx";
//         
//         CancellationTokenSource cts = new CancellationTokenSource();
//         int inputSizeW = 640;
//         int inputSizeH = 640;
//
//         float scoreThreshold = 0.5f;
//         float nmsThreshold = 0.4f;
//         int topK = 1;
//
//         private bool isInitialized = false;
//
//         // 인식 결과 캐시 관련 변수
//         private float lastDetectedTime = -10f;
//         private float keepDuration = 2.0f; // 2초 유지
//         private List<float[]> lastDetectedFaces = new List<float[]>();
//         private Texture2D lastFrame;
//         private Color32[] lastPixels;
//         
//         Dictionary<string, float[]> knownFaces;
//         Net mobileFaceNet;
//         IEnumerator Start()
//         {
// #if UNITY_ANDROID && !UNITY_EDITOR
//             if (!Permission.HasUserAuthorizedPermission(Permission.Camera))
//             {
//                 Permission.RequestUserPermission(Permission.Camera);
//                 Debug.Log("카메라 권한 요청됨");
//                 yield return new WaitForSeconds(1.5f);
//             }
// #endif
//
//             int retry = 0;
//             const int maxRetry = 5;
//
//             while (retry < maxRetry)
//             {
//                 if (!NRDevice.Subsystem.IsFeatureSupported(NRSupportedFeature.NR_FEATURE_RGB_CAMERA))
//                 {
//                     Debug.LogError("RGB Camera not supported");
//                     yield break;
//                 }
//
//                 RGBCamTexture = new NRRGBCamTexture();
//                 RGBCamTexture.Play();
//
//                 yield return new WaitForSeconds(1.0f);
//
//                 if (RGBCamTexture.IsPlaying && RGBCamTexture.GetTexture() != null)
//                 {
//                     Debug.Log("[OK] RGBCamTexture 시작됨");
//                     CaptureImage.texture = RGBCamTexture.GetTexture();
//                     StartCoroutine(LoadModelCoroutine(() => isInitialized = true));
//                     yield break;
//                 }
//
//                 Debug.LogWarning($"[Retry] RGB Camera 연결 실패. 재시도 중... ({retry + 1}/{maxRetry})");
//                 RGBCamTexture.Stop();
//                 RGBCamTexture = null;
//                 yield return new WaitForSeconds(1.5f);
//                 retry++;
//             }
//
//             Debug.LogError("RGB Camera를 시작할 수 없습니다. 앱을 재시작하거나 권한을 확인하세요.");
//         }
//
//         IEnumerator LoadModelCoroutine(Action onComplete)
//         {
//             Task<string> modelTask = Utils.getFilePathAsyncTask(MODEL_FILENAME, cancellationToken: cts.Token);
//             Task<string> modelFaceTask = Utils.getFilePathAsyncTask(MFN_FILENAME, cancellationToken: cts.Token);
//             
//             while (!modelTask.IsCompleted || !modelFaceTask.IsCompleted) yield return null;
//
//             fd_modelPath = modelTask.Result;
//             string mfnPath = modelFaceTask.Result;
//
//             if (string.IsNullOrEmpty(fd_modelPath) || string.IsNullOrEmpty(mfnPath))
//             {
//                 Debug.LogError("모델 파일 로딩 실패");
//                 yield break;
//             }
//
//             try
//             {
//                 faceDetector = FaceDetectorYN.create(fd_modelPath, "", new Size(inputSizeW, inputSizeH), scoreThreshold, nmsThreshold, topK);
//                 mobileFaceNet = Dnn.readNetFromONNX(mfnPath);
//                 Debug.Log("모델 로딩 완료");
//             }
//             catch (Exception ex)
//             {
//                 Debug.LogError($"모델 로딩 중 오류: {ex.Message}");
//                 yield break;
//             }
//
//             string jsonPath = Path.Combine(Application.streamingAssetsPath, "faces/known_faces.json");
//             string json = null;
//
//         #if UNITY_ANDROID && !UNITY_EDITOR
//             if (jsonPath.Contains("://") || jsonPath.Contains("jar:"))
//             {
//                 UnityWebRequest www = UnityWebRequest.Get(jsonPath);
//                 yield return www.SendWebRequest(); // ✅ try 밖에서 실행
//
//                 if (www.result == UnityWebRequest.Result.Success)
//                 {
//                     json = www.downloadHandler.text;
//                 }
//                 else
//                 {
//                     Debug.LogWarning($"[WARNING] Face DB 로딩 실패: {www.error}");
//                 }
//             }
//             else
//         #endif
//             {
//                 try
//                 {
//                     json = File.ReadAllText(jsonPath);
//                 }
//                 catch (Exception ex)
//                 {
//                     Debug.LogWarning($"[WARNING] 로컬 Face DB 로딩 실패: {ex.Message}");
//                 }
//             }
//
//             if (!string.IsNullOrEmpty(json))
//             {
//                 try
//                 {
//                     ParseAndSetFaceDB(json);
//                 }
//                 catch (Exception ex)
//                 {
//                     Debug.LogError($"[ERROR] Face DB 파싱 중 오류: {ex.Message}");
//                     knownFaces = new Dictionary<string, float[]>();
//                 }
//             }
//             else
//             {
//                 Debug.LogWarning("[WARNING] Face DB 로딩 실패 또는 파일 없음");
//                 knownFaces = new Dictionary<string, float[]>();
//             }
//
//             onComplete?.Invoke();
//         }
//
//
//         void Update()
//         {
//             Debug.Log($"[DEBUG] 상태체크: isInitialized={isInitialized}, RGBCamTexture={RGBCamTexture}, IsPlaying={RGBCamTexture?.IsPlaying}, CaptureImage={CaptureImage}, texture={CaptureImage?.texture}, faceDetector={faceDetector}");
//             if (!isInitialized || RGBCamTexture == null || !RGBCamTexture.IsPlaying || CaptureImage == null || CaptureImage.texture == null || faceDetector == null)
//                 return;
//
//             // int skipRate = 10;
//             // if (Time.frameCount % skipRate != 0)
//             //     return;
//
//             Texture2D texture = RGBCamTexture.GetTexture();
//             if (texture == null)
//             {
//                 Debug.Log($"[DEBUG] texture is null");
//                 return;
//             }
//             Color32[] currentPixels = texture.GetPixels32();
//             if (lastPixels != null && Enumerable.SequenceEqual(currentPixels, lastPixels))
//             {
//                 // 프레임 동일 → skip
//                 return;
//             }
//             lastPixels = currentPixels;
//             Mat rgbaMat = new Mat(texture.height, texture.width, CvType.CV_8UC3);
//             Mat bgrMat = new Mat();
//             Mat resizedMat = new Mat();
//             Mat faces = new Mat();
//
//             Utils.texture2DToMat(texture, rgbaMat);
//             // Core.flip(rgbaMat, rgbaMat, 0);
//             
//             Imgproc.cvtColor(rgbaMat, bgrMat, Imgproc.COLOR_RGBA2BGR);
//             Imgproc.resize(bgrMat, resizedMat, new Size(inputSizeW, inputSizeH));
//
//             // 얼굴 검출
//             faceDetector.detect(resizedMat, faces);
//             if (faces.rows() > 0)
//             {
//                 Debug.Log("[FaceDetector] 얼굴 인식됨");
//                 lastDetectedTime = Time.time;
//                 lastDetectedFaces.Clear();
//
//                 for (int i = 0; i < faces.rows(); i++)
//                 {
//                     float[] faceData = new float[15];
//                     faces.get(i, 0, faceData);
//                     lastDetectedFaces.Add(faceData);
//                 }
//             }
//             else
//             {
//                 Debug.Log("[FaceDetector] 얼굴 인식 안됨");
//             }
//
//             // 결과 그리기: 인식 직후 또는 유지 시간 내라면
//             if (Time.time - lastDetectedTime <= keepDuration)
//             {
//                 foreach (var faceData in lastDetectedFaces)
//                 {
//                     float xRatio = (float)rgbaMat.cols() / inputSizeW;
//                     float yRatio = (float)rgbaMat.rows() / inputSizeH;
//
//                     float x = faceData[0] * xRatio;
//                     float y = faceData[1] * yRatio;
//                     float width = faceData[2] * xRatio;
//                     float height = faceData[3] * yRatio;
//
//                     Imgproc.rectangle(rgbaMat, new Point(x, y), new Point(x + width, y + height), new Scalar(255, 0, 0, 255), 2);
//
//                     for (int j = 0; j < 5; j++)
//                     {
//                         float landmarkX = faceData[4 + j * 2] * xRatio;
//                         float landmarkY = faceData[4 + j * 2 + 1] * yRatio;
//
//                         Imgproc.circle(rgbaMat, new Point(landmarkX, landmarkY), 3, new Scalar(0, 255, 0, 255), -1);
//                     }
//                     
//                     Mat alignedFace = AlignFace(faceData,bgrMat);
//                     if (alignedFace ==null || alignedFace.empty())
//                         continue;
//                     
//                    Mat resized = new Mat();
//                    Imgproc.resize(alignedFace, resized, new Size(112, 112));
//                    Mat blob = Dnn.blobFromImage(
//                        resized,
//                        1.0f / 127.5f,
//                        new Size(112, 112),
//                        new Scalar(127.5, 127.5, 127.5),
//                        true,  // BGR→RGB
//                        false
//                    );
//                    
//                    // 3) 임베딩 추출
//                    mobileFaceNet.setInput(blob);
//                    Mat featMat = mobileFaceNet.forward();
//                    int dim = featMat.cols();
//                    float[] feat = new float[dim];
//                    featMat.get(0, 0, feat);
//
//                    // 4) L2 정규화
//                    float norm = Mathf.Sqrt(feat.Sum(x => x * x));
//                    for (int i = 0; i < dim; i++) feat[i] /= norm;
//
//                    // 5) 코사인 유사도로 매칭
//                    string bestName = "Unknown";
//                    float bestScore = -1f;
//                    foreach (var kv in knownFaces)
//                    {
//                        var other = kv.Value;
//                        float dot = 0, na = 0, nb = 0;
//                        for (int i = 0; i < dim; i++)
//                        {
//                            dot += feat[i] * other[i];
//                            na  += feat[i] * feat[i];
//                            nb  += other[i] * other[i];
//                        }
//                        float score = dot / (Mathf.Sqrt(na) * Mathf.Sqrt(nb));
//                        if (score > bestScore)
//                        {
//                            bestScore = score;
//                            bestName  = kv.Key;
//                        }
//                    }
//
//                    float textX = Mathf.Min(x + width, rgbaMat.cols() - 1);
//                    float textY = Mathf.Min(y + height + 20, rgbaMat.rows() - 1);
//                    // 6) 화면에 결과 그리기
//                    Imgproc.putText(
//                        rgbaMat,
//                        $"{bestName} ({bestScore:F2})",
//                        new Point(textX, textY),
//                        Imgproc.FONT_HERSHEY_SIMPLEX,
//                        0.6,
//                        new Scalar(255, 255, 255, 255),
//                        2
//                    );
//                     
//                 }
//             }
//
//             Utils.matToTexture2D(rgbaMat, texture);
//             CaptureImage.texture = texture;
//         }
//         protected virtual Mat AlignFace(float[] d,Mat bgrMat)
//         {
//             Point[] arcfaceCoords = new Point[]
//             {
//                 new Point(38.2946, 51.6963),
//                 new Point(73.5318, 51.5014),
//                 new Point(56.0252, 71.7366),
//                 new Point(41.5493, 92.3655),
//                 new Point(70.7299, 92.2041)
//             };
//             float imageSize = 112f;
//             float ratio = imageSize / 112f;
//             float diffX = 0f;
//             
//             if (imageSize % 112 != 0f) {
//                 // 128 모드를 쓴다면
//                 ratio = imageSize / 128f;
//                 diffX = 8f * ratio;
//             }
//             Point[] dstPts = arcfaceCoords
//                 .Select(p => new Point(p.x * ratio + diffX, p.y * ratio))
//                 .ToArray();
//
//             MatOfPoint2f dst = new MatOfPoint2f(dstPts);
//             
//             MatOfPoint2f src = new MatOfPoint2f(new Point[] {
//                 new Point(d[4], d[5]),
//                 new Point(d[6], d[7]),
//                 new Point(d[8], d[9]),
//                 new Point(d[10], d[11]),
//                 new Point(d[12], d[13]),
//             });
//
//             Mat warpMat = Calib3d.estimateAffinePartial2D(src, dst);
//             
//             Mat alignedFace = new Mat();
//             Imgproc.warpAffine(
//                 bgrMat,
//                 alignedFace,
//                 warpMat,
//                 new Size(imageSize, imageSize),
//                 Imgproc.INTER_LINEAR,
//                 Core.BORDER_CONSTANT,
//                 new Scalar(0,0,0)
//             );
//             return alignedFace;
//         }
//         void ParseAndSetFaceDB(string json)
//         {
//             try
//             {
//                 FaceDatabase db = JsonUtility.FromJson<FaceDatabase>(json);
//                 if (db?.faces == null)
//                 {
//                     Debug.LogWarning("[WARNING] FaceDatabase 파싱 결과가 null입니다.");
//                     knownFaces = new Dictionary<string, float[]>();
//                 }
//                 else
//                 {
//                     knownFaces = db.faces.ToDictionary(f => f.name, f => f.embedding);
//                     Debug.Log($"[DEBUG] FaceDB 등록 완료: {knownFaces.Count}명");
//                 }
//             }
//             catch (Exception ex)
//             {
//                 Debug.LogError($"[ERROR] Face DB 파싱 오류: {ex.Message}");
//                 knownFaces = new Dictionary<string, float[]>();
//             }
//         }
//
//         void OnDestroy()
//         {
//             RGBCamTexture?.Stop();
//             RGBCamTexture = null;
//         }
//     }
// }
