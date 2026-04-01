"use client";

import { Upload, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function DocumentUploadDropzone() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // Refresh the page to show the new document in the list
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div 
      style={{
        border: error ? "1px dashed #D94F4F" : "1px dashed #E87213",
        backgroundColor: error ? "rgba(217, 79, 79, 0.04)" : "rgba(232, 114, 19, 0.04)",
        padding: "3rem 2rem",
        textAlign: "center",
        marginBottom: "3rem",
        cursor: isUploading ? "not-allowed" : "pointer",
        position: "relative",
        overflow: "hidden"
      }} 
      className="dropzone-area"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept=".pdf,.doc,.docx,.txt"
        onChange={onFileSelect}
      />

      {isUploading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Loader2 size={32} color="#E87213" className="animate-spin" style={{ margin: "0 auto 1rem", animation: "spin 2s linear infinite" }} />
          <h3 style={{ color: "#F5EDD8", fontFamily: "var(--font-serif)", fontSize: "1.2rem", marginBottom: ".5rem" }}>
            Uploading Document...
          </h3>
          <p style={{ color: "#7A7E96", fontSize: ".8rem" }}>
            Please wait while we encrypt and store your file.
          </p>
        </div>
      ) : (
        <>
          <Upload size={32} color={error ? "#D94F4F" : "#E87213"} style={{ margin: "0 auto 1rem" }} />
          <h3 style={{ color: "#F5EDD8", fontFamily: "var(--font-serif)", fontSize: "1.2rem", marginBottom: ".5rem" }}>
            {error ? "Upload Failed" : "Upload new document"}
          </h3>
          <p style={{ color: "#7A7E96", fontSize: ".8rem", marginBottom: error ? "1rem" : "1.5rem" }}>
            {error || "Supported physical/scanned formats: PDF, DOCX, JPG, PNG (Max 15MB)"}
          </p>
          {!error && (
            <button style={{
              background: "#E87213",
              border: "none",
              color: "#000",
              padding: ".7rem 2rem",
              fontFamily: "var(--font-sans)",
              fontSize: ".8rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              cursor: "pointer"
            }}>
              Browse Files
            </button>
          )}
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
