'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface CameraUploadProps {
  image: string | null;
  onImageCapture: (imageUrl: string) => void;
  onReset: () => void;
}

export function CameraUpload({ image, onImageCapture, onReset }: CameraUploadProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageCapture(result);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCountingDown(false);
    setCountdown(3);
    setIsCameraActive(false);
  }, []);

  const startWebcam = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Camera access is not supported in this browser.');
      return;
    }

    setIsStartingCamera(true);
    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCountingDown(false);
      setCountdown(3);
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error('Unable to access webcam', error);
      setErrorMessage('Unable to access the camera. Please check permissions.');
    } finally {
      setIsStartingCamera(false);
    }
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    const stream = streamRef.current;

    if (!isCameraActive || !videoElement || !stream) {
      if (videoElement && !isCameraActive) {
        videoElement.srcObject = null;
      }
      return;
    }

    videoElement.srcObject = stream;
    const playPromise = videoElement.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => {
        /* Autoplay rejection can be ignored because user initiated capture */
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isCameraActive]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current ?? document.createElement('canvas');
    canvasRef.current = canvas;

    const width = video.videoWidth || 720;
    const height = video.videoHeight || 960;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');

    onImageCapture(dataUrl);
    stopWebcam();
  }, [onImageCapture, stopWebcam]);

  const handleCaptureClick = useCallback(() => {
    if (isCountingDown) return;
    setCountdown(3);
    setIsCountingDown(true);
  }, [isCountingDown]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  useEffect(() => {
    if (!isCountingDown) return;

    if (countdown === 0) {
      setIsCountingDown(false);
      setCountdown(3);
      capturePhoto();
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isCountingDown, countdown, capturePhoto]);

  return (
    <>
      <Card className="p-6">
      <h3 className="mb-4">Upload Your Photo</h3>
      
      <div className="flex justify-start">
        <div className="w-full sm:max-w-xs">
          {image ? (
            <div className="space-y-4">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                <ImageWithFallback
                  src={image}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  onReset();
                  setErrorMessage(null);
                }}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="relative w-full aspect-[3/4] rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-6 p-6">
                <Button
                  onClick={startWebcam}
                  variant="outline"
                  className="w-full h-20"
                  disabled={isStartingCamera || isCameraActive}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="w-6 h-6" />
                    <span>
                      {isCameraActive
                        ? 'Camera active...'
                        : isStartingCamera
                          ? 'Starting camera...'
                          : 'Take Photo'}
                    </span>
                  </div>
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-20"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6" />
                    <span>Upload Image</span>
                  </div>
                </Button>
              </div>
            </div>
          )}
          {errorMessage && (
            <p className="text-sm text-destructive mt-2">{errorMessage}</p>
          )}
        </div>
      </div>
      </Card>

      {isCameraActive && (
        <div className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl aspect-[3/4] rounded-[2rem] overflow-hidden bg-black shadow-2xl">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />

            {isCountingDown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-white text-7xl font-semibold drop-shadow-lg">
                  {countdown}
                </span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-8 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="px-10"
                  onClick={handleCaptureClick}
                  disabled={isCountingDown}
                >
                  {isCountingDown ? 'Capturing...' : 'Capture'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10"
                  onClick={stopWebcam}
                  disabled={isCountingDown}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
