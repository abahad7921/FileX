'use client';

import React, { useState, useEffect, useRef } from 'react';

interface UploadFileProps {
  folderName: string;
  supportedFileType: string;
}

const UploadFile: React.FC<UploadFileProps> = ({ folderName, supportedFileType }) => {
  const [file, setFile] = useState<File | null>(null);
  const [newFolder, setNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [errors, setErrors] = useState<{ file?: string; newFolderName?: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input

  const resetForm = () => {
    setFile(null);
    setNewFolder(false);
    setNewFolderName("");
    setErrors({});
    setHasSubmitted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      if (hasSubmitted) setErrors((prevErrors) => ({ ...prevErrors, file: "" })); // Clear file error
    }
  };

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setHasSubmitted(true); // Mark the form as submitted
    const validationErrors: { file?: string; newFolderName?: string } = {};

    if (!file) {
      validationErrors.file = "Please select a file.";
    }
    if (newFolder && !newFolderName.trim()) {
      validationErrors.newFolderName = "Please enter a name for the new folder.";
    }

    setErrors(validationErrors);

    // Only log if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {
      const folderPath = newFolder ? `${folderName}/${newFolderName}` : folderName;
      if (newFolder) {
        console.log(`Creating new folder: ${newFolderName}`);
      }

      const formData = new FormData();
      formData.append("file", file as Blob);
      formData.append("folderName", folderPath);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        console.log("File uploaded successfully");
        resetForm(); // Reset form after successful upload
      } else {
        console.error("Failed to upload file");
      }
    }
  };

  // Reset form when the component mounts or when folderName changes (new modal open)
  useEffect(() => {
    resetForm();
  }, [folderName]);

  return (
    <div className="p-4 bg-grey rounded shadow-md w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload to {folderName}</h2>

      {/* Checkbox for new folder */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Create New Folder?</span>
          <input
            type="checkbox"
            className="checkbox"
            checked={newFolder}
            onChange={() => setNewFolder(!newFolder)}
          />
        </label>
      </div>

      {/* Input for new folder name (conditionally shown) */}
      {newFolder && (
        <div className="form-control mt-2">
          <label className="label">
            <span className="label-text">Folder Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={newFolderName}
            onChange={(e) => {
              setNewFolderName(e.target.value);
              if (hasSubmitted) setErrors((prevErrors) => ({ ...prevErrors, newFolderName: "" })); // Clear folder name error
            }}
            placeholder="/Images/FolderName"
          />
          {hasSubmitted && errors.newFolderName && (
            <span className="text-red-500 text-sm">{errors.newFolderName}</span>
          )}
        </div>
      )}

      {/* File selection */}
      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text">Select File</span>
        </label>
        <input
          ref={fileInputRef} // Attach ref to file input
          type="file"
          onChange={handleFileChange}
          accept={supportedFileType}
          className="file-input file-input-bordered w-full"
        />
        {hasSubmitted && errors.file && (
          <span className="text-red-500 text-sm">{errors.file}</span>
        )}
      </div>

      {/* Upload Button */}
      <div className="form-control mt-4">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadFile;
