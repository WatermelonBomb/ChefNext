import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../common/Card';
import { Upload, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

interface ImageUploaderProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  maxImages?: number;
  maxSize?: number; // MB
  allowedTypes?: string[];
  className?: string;
}

export function ImageUploader({
  onImagesUploaded,
  maxImages = 5,
  maxSize = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `サポートされていないファイル形式です。(${allowedTypes.join(', ')})`;
    }

    if (file.size > maxSize * 1024 * 1024) {
      return `ファイルサイズが大きすぎます。${maxSize}MB以下にしてください。`;
    }

    return null;
  };

  const simulateUpload = async (image: UploadedImage): Promise<void> => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));

      setImages(prev => prev.map(img =>
        img.id === image.id ? { ...img, progress } : img
      ));
    }

    // Simulate EXIF removal and processing
    await new Promise(resolve => setTimeout(resolve, 500));

    setImages(prev => prev.map(img =>
      img.id === image.id
        ? { ...img, status: 'success' as const, progress: 100 }
        : img
    ));
  };

  const handleFiles = (files: FileList) => {
    setError(null);

    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;

    if (fileArray.length > remainingSlots) {
      setError(`最大${maxImages}枚までアップロードできます。`);
      return;
    }

    const newImages: UploadedImage[] = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const id = Date.now().toString() + Math.random().toString(36);
      const preview = URL.createObjectURL(file);

      const newImage: UploadedImage = {
        id,
        file,
        preview,
        status: 'uploading',
        progress: 0
      };

      newImages.push(newImage);

      // Start upload simulation
      simulateUpload(newImage);
    });

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.preview);
        return false;
      }
      return true;
    });

    setImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <Card
        variant="outline"
        className={`transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-[#CDAE58] bg-[#CDAE58]/10'
            : 'border-[#CDAE58]/40 hover:border-[#CDAE58]'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="text-center py-8">
          <motion.div
            animate={{ scale: isDragOver ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
              isDragOver ? 'text-[#CDAE58]' : 'text-[#CDAE58]/70'
            }`} />
          </motion.div>

          <h4 className="mb-2">写真をアップロード</h4>
          <p className="text-sm text-[#1C1C1C]/60 mb-2">
            クリックまたはドラッグ&ドロップで写真を追加
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-[#1C1C1C]/50">
            <span>JPEG, PNG, WebP</span>
            <span>最大{maxSize}MB</span>
            <span>最大{maxImages}枚</span>
          </div>

          <div className="mt-4 inline-block px-4 py-2 bg-[#CDAE58]/10 rounded-full">
            <span className="text-xs text-[#CDAE58] font-medium">
              自動でEXIF情報を除去します
            </span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </Card>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-red-600 text-sm">{error}</span>
        </motion.div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <Card variant="outline" size="sm" className="p-2">
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    <img
                      src={image.preview}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />

                    {/* Upload Progress */}
                    {image.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <div className="text-xs">{image.progress}%</div>
                        </div>
                      </div>
                    )}

                    {/* Success Indicator */}
                    {image.status === 'success' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="absolute top-2 left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>

                  <div className="mt-2 text-center">
                    <div className="text-xs text-[#1C1C1C]/60 truncate">
                      {image.file.name}
                    </div>
                    <div className="text-xs text-[#1C1C1C]/40">
                      {(image.file.size / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Summary */}
      {images.length > 0 && (
        <div className="mt-4 text-center text-sm text-[#1C1C1C]/60">
          {images.filter(img => img.status === 'success').length} / {images.length} 枚アップロード完了
        </div>
      )}
    </div>
  );
}