'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

interface ImageCropModalProps {
  imageSrc: string;
  onCropCompleteAction: (croppedFile: File) => void;
  onClose: () => void;
}

export default function ImageCropModal({ imageSrc, onCropCompleteAction, onClose }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropCompleteAction(croppedFile);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal memotong gambar');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">Sesuaikan Gambar</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="relative flex-1 bg-slate-900 w-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9} // Menggunakan rasio 16:9 yang cocok untuk slider/carousel
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={isProcessing}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-white transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${isProcessing ? 'bg-slate-400' : 'bg-primary hover:bg-primary-light'}`}
              >
                {isProcessing ? 'Memproses...' : 'Simpan Crop'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
