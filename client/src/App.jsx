// src/App.jsx

import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode";
import "./App.scss";
import { uploadFile } from "./services/api";
import { shortenURL } from "./services/shortenURL";
import Lottie from "lottie-react";
import animationData from "./assets/Loading Animation.json";
import Background from "./Background";

const App = () => {
  const fileInputRef = useRef();
  const fileDownloadRef = useRef();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [shortenedURL, setShortenedURL] = useState("");
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  const [copied, setCopied] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async (url) => {
    try {
      const dataURL = await QRCode.toDataURL(url);
      setQRCodeDataURL(dataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const onClickUpload = () => {
    fileInputRef.current.click();
  };

  const onClickDownload = () => {
    fileDownloadRef.current.click();
  };

  const onClickCopyLink = () => {
    navigator.clipboard
      .writeText(shortenedURL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((error) => console.error("Failed to copy:", error));
  };

  useEffect(() => {
    const getFile = async () => {
      if (file) {
        setLoading(true); // Set loading to true when file upload starts
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
          const response = await uploadFile(data, (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          });
          const longUrl = response.path;
          setResult(longUrl);

          const shortUrl = await shortenURL(longUrl);
          setShortenedURL(shortUrl);
          generateQRCode(shortUrl);
        } catch (error) {
          console.error("Error uploading file:", error);
        } finally {
          setLoading(false); // Set loading to false when the upload is finished
        }
      }
    };
    getFile();
  }, [file]);

  return (
    <div className="container">
      <div className="bg">
        <Background />
      </div>
      <div className="box">
        <div className="content">
          <h1>FILEFLOW</h1>
          <p>Upload & Share</p>
          <button onClick={onClickUpload} className="upload">
            UPLOAD FILE
          </button>
          <input
            type="file"
            name="fileUpload"
            id="upload"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner">
                <Lottie animationData={animationData} />
              </div>
            </div>
          ) : (
            <>
              {qrCodeDataURL && (
                <>
                  <div className="scanner">
                    <img src={qrCodeDataURL} alt="QR Code" />
                  </div>
                  <div>
                    <button onClick={onClickCopyLink} className="download">
                      {copied ? "Copied" : "Copy Link"}
                      <div className="arrow-wrapper">
                        <div className="arrow"></div>
                      </div>
                    </button>
                    <a
                      href={shortenedURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      ref={fileDownloadRef}
                      style={{ display: "none" }}
                    ></a>
                  </div>
                  <div className="shortened-url">
                    <p className="shortlink">
                      File URL:{" "}
                      <a
                        href={shortenedURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {shortenedURL}
                      </a>
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
