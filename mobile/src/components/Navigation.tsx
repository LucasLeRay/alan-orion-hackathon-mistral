import { Box, Stack } from '@mui/joy';

import { Header } from './Header';
import { useEffect, useRef, useState } from 'react';

const WebCam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startWebCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    setMediaStream(stream);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const stopWebCam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const image = canvasRef.current.toDataURL('image/png');
        setCapturedImage(image);
      }
    }
  };

  useEffect(() => {
    startWebCam();
    return () => {
      stopWebCam();
    };
  }, []);

  return (
    <Box>
      <video
        ref={videoRef}
        width={640}
        height={480}
        autoPlay
        style={{
          borderRadius: '8px',
          transform: 'scaleX(-1)'
        }}
      />
      <Stack direction='row' spacing={2}>
        <button onClick={startWebCam}>Start WebCam</button>
        <button onClick={stopWebCam}>Stop WebCam</button>
        <button onClick={captureImage}>Capture Image</button>
      </Stack>

      <canvas ref={canvasRef} width={640} height={480} />

      {capturedImage && <img src={capturedImage} alt='Captured Image' />}
    </Box>
  );
};

export const Navigation = () => {
  return (
    <Box width='100vw' height='100vh'>
      <Header />
      <WebCam />
    </Box>
  );
};
