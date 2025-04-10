// components/ImageUploader.js
import { useState } from 'react';

export default function ImageUploader({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Post the file to your backend upload endpoint.
      const response = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed.');
      }

      const data = await response.json();
      // Call the provided callback with the URL of the uploaded file.
      onUploadComplete(data.url);
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  return (
    <div style={uploaderStyles.container}>
      <input type="file" onChange={handleFileChange} style={uploaderStyles.fileInput} />
      {uploading && <p style={uploaderStyles.uploadingText}>Uploading...</p>}
      {error && <p style={uploaderStyles.errorText}>Error: {error}</p>}
    </div>
  );
}

const uploaderStyles = {
  container: {
    margin: '1rem 0',
    textAlign: 'center',
  },
  fileInput: {
    margin: '0 auto',
  },
  uploadingText: {
    color: '#0070f3',
    marginTop: '0.5rem',
  },
  errorText: {
    color: 'red',
    marginTop: '0.5rem',
  },
};
