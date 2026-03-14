import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent } from '../ui/card';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PhotoCropModalProps {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (croppedFile: File) => void;
}

// Helper: get cropped image as a File
async function getCroppedImg(imageSrc: string, pixelCrop: CropArea): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const size = Math.min(pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob!], 'foto_profil.jpg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.92);
  });
}

export default function PhotoCropModal({ imageSrc, onCancel, onConfirm }: PhotoCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: unknown, croppedPixels: CropArea) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      onConfirm(file);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-hidden">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-none">
        {/* Header */}
        <CardHeader className="border-b border-gray-100 px-6 py-4 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-none">
                Atur Foto Profil
              </h3>
              <p className="text-xs text-gray-500 mt-1.5">Sesuaikan ukuran dan posisi foto</p>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-0 overflow-y-auto flex-1 bg-white">
          <div className="flex flex-col h-full">
            {/* Crop Area */}
            <div className="relative w-full h-[300px] sm:h-[400px] bg-[#1e1e1e] flex-shrink-0">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-6 space-y-6 flex-1 bg-gray-50/30">
              {/* Zoom controls */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                  Zoom Control
                </label>
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}
                    className="p-2 md:ml-2 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors"
                    title="Reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 sticky bottom-0 border-t border-gray-100">
                <Button type="button" variant="outline" className="flex-1 rounded-xl h-11" onClick={onCancel} disabled={processing}>
                  Batal
                </Button>
                <Button type="submit" variant="default" className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl h-11 shadow-lg shadow-blue-200" onClick={handleConfirm} disabled={processing}>
                  {processing ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Memproses...</>
                  ) : (
                    <><Check className="w-4 h-4 mr-2" /> Gunakan Foto</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
