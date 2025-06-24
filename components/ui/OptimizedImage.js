// components/ui/OptimizedImage.js
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

// Optimized Image Component with lazy loading and multiple sizes
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  className,
  style,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback((event) => {
    setIsLoading(false);
    onLoad?.(event);
  }, [onLoad]);

  const handleError = useCallback((event) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(event);
  }, [onError]);

  // Generate blur data URL if not provided
  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(width || 400, height || 300);

  if (hasError) {
    return (
      <div
        style={{
          width: width || '100%',
          height: height || 'auto',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          ...style,
        }}
        className={className}
      >
        <span style={{ color: '#666', fontSize: '14px' }}>Image failed to load</span>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...style }} className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          transition: 'opacity 0.3s ease',
          opacity: isLoading ? 0.7 : 1,
        }}
        {...props}
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #0070f3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  sizes: PropTypes.string,
  quality: PropTypes.number,
  priority: PropTypes.bool,
  placeholder: PropTypes.oneOf(['blur', 'empty']),
  blurDataURL: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

// Image Upload Component with preview and optimization
export const ImageUpload = ({
  onUpload,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  multiple = false,
  preview = true,
  className,
  style,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const processFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      // Generate previews
      if (preview) {
        const previewPromises = validFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({
              file,
              preview: e.target.result,
              id: Math.random().toString(36).substr(2, 9),
            });
            reader.readAsDataURL(file);
          });
        });

        const newPreviews = await Promise.all(previewPromises);
        setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
      }

      // Optimize and upload files
      const optimizedFiles = await Promise.all(
        validFiles.map(file => optimizeImage(file))
      );

      await onUpload(multiple ? optimizedFiles : optimizedFiles[0]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [acceptedTypes, maxSize, multiple, onUpload, preview]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removePreview = useCallback((id) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <div className={className} style={style}>
      <div
        style={{
          ...uploadStyles.dropzone,
          ...(dragActive ? uploadStyles.dropzoneActive : {}),
          ...(uploading ? uploadStyles.dropzoneUploading : {}),
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          style={uploadStyles.input}
          disabled={uploading}
        />
        
        {uploading ? (
          <div style={uploadStyles.uploadingContent}>
            <div style={uploadStyles.spinner} />
            <p>Uploading and optimizing images...</p>
          </div>
        ) : (
          <div style={uploadStyles.content}>
            <svg style={uploadStyles.icon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p style={uploadStyles.text}>
              {dragActive ? 'Drop files here' : 'Click or drag files to upload'}
            </p>
            <p style={uploadStyles.subtext}>
              {acceptedTypes.join(', ')} up to {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div style={uploadStyles.previewGrid}>
          {previews.map((item) => (
            <div key={item.id} style={uploadStyles.previewItem}>
              <img
                src={item.preview}
                alt="Preview"
                style={uploadStyles.previewImage}
              />
              <button
                onClick={() => removePreview(item.id)}
                style={uploadStyles.removeButton}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
  maxSize: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  multiple: PropTypes.bool,
  preview: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

// Utility functions
function generateBlurDataURL(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create a simple gradient blur placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f0f0f0');
  gradient.addColorStop(1, '#e0e0e0');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

async function optimizeImage(file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          const optimizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
}

const uploadStyles = {
  dropzone: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fafafa',
    position: 'relative',
  },
  dropzoneActive: {
    borderColor: '#0070f3',
    backgroundColor: '#f0f8ff',
  },
  dropzoneUploading: {
    backgroundColor: '#f9f9f9',
    cursor: 'not-allowed',
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  content: {
    pointerEvents: 'none',
  },
  uploadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  icon: {
    width: '48px',
    height: '48px',
    color: '#9ca3af',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
    margin: 0,
  },
  subtext: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0.5rem 0 0 0',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #0070f3',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  previewItem: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  previewImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '24px',
    height: '24px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};