import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, RotateCcw } from 'lucide-react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface CameraScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScan,
  onClose,
  isOpen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (isOpen) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen, facingMode]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Check for camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      setHasPermission(true);
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());

      // Initialize the barcode reader
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      // Get available video devices
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error('No camera devices found');
      }

      // Find the appropriate camera (back camera preferred for barcode scanning)
      let selectedDeviceId = videoInputDevices[0].deviceId;
      
      if (facingMode === 'environment') {
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        if (backCamera) {
          selectedDeviceId = backCamera.deviceId;
        }
      }

      // Start decoding from the camera
      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const barcode = result.getText();
            onScan(barcode);
            stopScanning();
          }
          
          if (error && !(error instanceof NotFoundException)) {
            console.warn('Barcode scanning error:', error);
          }
        }
      );

    } catch (err) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else if (err.name === 'NotSupportedError') {
          setError('Camera not supported on this device.');
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('Failed to access camera. Please try again.');
      }
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setIsScanning(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      startScanning();
    } catch (err) {
      setHasPermission(false);
      setError('Camera permission denied');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scan Barcode
              </CardTitle>
              <CardDescription>
                Point your camera at a barcode to scan
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {hasPermission === false ? (
            <div className="text-center space-y-4">
              <div className="p-8 bg-gray-50 rounded-lg">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Camera access is required to scan barcodes
                </p>
                <Button onClick={requestPermission}>
                  Grant Camera Access
                </Button>
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <div className="p-8 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <Button onClick={startScanning} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-black rounded-lg object-cover"
                  playsInline
                  muted
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-32 border-2 border-white border-dashed rounded-lg opacity-75">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  </div>
                </div>
                
                {/* Scanning line animation */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-32 relative overflow-hidden">
                      <div className="absolute w-full h-0.5 bg-blue-500 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={switchCamera}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Switch Camera
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Position the barcode within the frame to scan automatically
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};