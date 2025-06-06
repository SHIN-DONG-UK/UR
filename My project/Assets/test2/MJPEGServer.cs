using UnityEngine;
using System.Net.Sockets;
using System.Net;
using System.Threading;
using System.IO;
using System.Collections.Generic;

/// <summary>
/// Android에서 작동 가능한 MJPEG 서버 (Unity Camera 화면을 실시간 스트리밍)
/// </summary>
public class SimpleMJPEGServer : MonoBehaviour
{
    public Camera captureCamera;        // 스트리밍할 카메라
    public int port = 8080;             // 접속 포트 (예: http://<ip>:8080/)

    private TcpListener server;
    private Thread serverThread;

    private Queue<byte[]> frameQueue = new Queue<byte[]>();
    private object frameLock = new object();

    void Start()
    {
        // MJPEG 서버 시작
        serverThread = new Thread(ServerLoop);
        serverThread.IsBackground = true;
        serverThread.Start();
        Debug.Log($"✅ MJPEG 서버 시작됨: http://<device-ip>:{port}/");
    }

    void LateUpdate()
    {
        // 매 프레임 후에 카메라 이미지 캡처
        if (captureCamera == null) return;

        RenderTexture rt = new RenderTexture(1280, 800, 40);
        captureCamera.targetTexture = rt;

        Texture2D screenShot = new Texture2D(1280, 800, TextureFormat.RGB24, false);
        captureCamera.Render();
        RenderTexture.active = rt;
        screenShot.ReadPixels(new Rect(0, 0, 1280, 800), 0, 0);
        screenShot.Apply();

        captureCamera.targetTexture = null;
        RenderTexture.active = null;
        Destroy(rt);

        byte[] jpg = screenShot.EncodeToJPG();
        Destroy(screenShot);

        lock (frameLock)
        {
            frameQueue.Enqueue(jpg);
            while (frameQueue.Count > 3)
                frameQueue.Dequeue();
        }
    }

    void ServerLoop()
    {
        try
        {
            server = new TcpListener(IPAddress.Any, port);
            server.Start();

            while (true)
            {
                TcpClient client = server.AcceptTcpClient();
                Debug.Log("📡 클라이언트 연결됨");

                Thread clientThread = new Thread(() => HandleClient(client));
                clientThread.IsBackground = true;
                clientThread.Start();
            }
        }
        catch (SocketException e)
        {
            Debug.LogError($"❌ MJPEG 서버 오류: {e.Message}");
        }
    }

    void HandleClient(TcpClient client)
    {
        NetworkStream stream = client.GetStream();
        StreamWriter writer = new StreamWriter(stream);

        try
        {
            // MJPEG header
            writer.Write("HTTP/1.0 200 OK\r\n");
            writer.Write("Content-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n");
            writer.Flush();

            while (client.Connected)
            {
                byte[] jpg = null;
                lock (frameLock)
                {
                    if (frameQueue.Count > 0)
                        jpg = frameQueue.Dequeue();
                }

                if (jpg != null)
                {
                    writer.Write("--frame\r\n");
                    writer.Write("Content-Type: image/jpeg\r\n");
                    writer.Write($"Content-Length: {jpg.Length}\r\n\r\n");
                    writer.Flush();

                    stream.Write(jpg, 0, jpg.Length);
                    stream.Flush();
                }

                Thread.Sleep(20);  // 약 10fps
            }

            client.Close();
        }
        catch (IOException e)
        {
            Debug.LogWarning($"⚠️ 클라이언트 연결 끊김: {e.Message}");
        }
    }

    void OnApplicationQuit()
    {
        if (server != null)
        {
            server.Stop();
            serverThread.Abort();
        }
    }
}
