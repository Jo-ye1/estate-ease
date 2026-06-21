import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, FileImage, CheckCircle, RefreshCw, X } from "lucide-react";

export default function CoverImageUploader({ profile, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const clearSelection = (e) => {
    e.preventDefault();
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || isUploading) return;

    const formData = new FormData();
    formData.append("image", selectedFile); 
    formData.append("type", "cover"); 

    try {
      setIsUploading(true);
      
      const res = await axios.post("http://localhost:5000/api/profiles/v1/upload-media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data?.success) {
        alert("Cover banner artwork updated successfully inside backend clusters!");
        setSelectedFile(null);
        setPreviewUrl(null);
        if (onUploadSuccess && res.data.profile) {
          onUploadSuccess(res.data.profile);
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload processing execution failure encountered.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    /* 🟢 Keep it full width across your container column layout */
    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-3xs w-full">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        <FileImage size={13} className="text-blue-500" />
        <h3 className="font-black uppercase tracking-wider text-[10px] text-slate-400">Media Assets Panel</h3>
      </div>

      {/* 🟢 FIXED: Kept the width at w-full but shortened the vertical height significantly using aspect-[32/9] to shrink the vertical thickness down by half */}
      <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl aspect-[32/9] min-h-0 w-full overflow-hidden bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center group">
        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full relative group">
            <img 
              src={previewUrl} 
              alt="Selected Cover Preview" 
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
              <button 
                onClick={clearSelection}
                className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-transform cursor-pointer shadow-md"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer p-2 select-none">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <UploadCloud size={15} />
            </div>
            <div className="space-y-0">
              <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 block">Upload Cover Image</span>
              <span className="text-[9px] text-slate-400 font-medium block">PNG, JPG, or JPEG up to 15MB</span>
            </div>
          </label>
        )}
      </div>

      {selectedFile && (
        <button
          onClick={handleUploadSubmit}
          disabled={isUploading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white font-black text-[11px] uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isUploading ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle size={12} />}
          <span>{isUploading ? "Uploading..." : "Submit Cover Artwork"}</span>
        </button>
      )}
    </div>
  );
}
