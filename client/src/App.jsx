import { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import React from 'react';
import './App.scss';
import { uploadFile } from './services/api';

const App = () => {
  const fileInputRef = useRef();
  const fileDownloadRef = useRef();
  const [file, setFile] = useState('');
  const [result, setResult] = useState('');
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress

  const generateQRCode = async () => {
    try {
      const dataURL = await QRCode.toDataURL(result);
      setQRCodeDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const onClickUpload = () => {
    fileInputRef.current.click();
  };

  const onClickDownload = () => {
    fileDownloadRef.current.click();
  };

  const onClickCopyLink = () => {
    navigator.clipboard.writeText(result)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
      })
      .catch((error) => console.error('Failed to copy:', error));
  };

  useEffect(() => {
    const getFile = async () => {
      if (file) {
        const data = new FormData();
        data.append('name', file.name);
        data.append('file', file);

        const response = await uploadFile(data, (progressEvent) => {
          // Update upload progress
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        });
        setResult(response.path);
      }
    };
    getFile();
  }, [file]);

  useEffect(() => {
    generateQRCode();
  }, [result]);

  return (
    <div className="container">
      <div className="box">
        <div className="content">
          <h1>FILEFLOW</h1>
          <p>Upload & Share</p>
          <button onClick={onClickUpload} className='upload'> UPLOAD FILE </button>
          <input
            type="file"
            name="fileUpload"
            id="upload"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {uploadProgress > 0 && uploadProgress < 100 && ( // Show progress bar while uploading
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${uploadProgress}%`}
              </div>
            </div>
          )}
          {qrCodeDataURL && (
            <>
              <div className="scanner">
                <img src={qrCodeDataURL} alt="QR Code" />
              </div>
              <div>
                <button onClick={onClickCopyLink} className="download">
                  {copied ? 'Copied' : 'Copy Link'}
                  <div class="arrow-wrapper">
                    <div class="arrow"></div>
                  </div>
                </button>
                <a href={result} target="_blank" rel="noopener noreferrer" ref={fileDownloadRef} style={{ display: 'none' }}></a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
