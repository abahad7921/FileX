'use client'
import React, { useState } from 'react';
import FileSystemFolder from "./components/FileSystemFolder";
import UploadFile from "./components/UploadFile";

export default function Home() {
  const folderDescriptions = [
    {
      folderName: "Documents",
      description: "Documents folder",
      supportedFileTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
      displaySupportedFileTypes: "PDF, DOC, DOCX, TXT"
    },
    {
      folderName: "Images",
      description: "Images folder",
      supportedFileTypes: ["image/jpeg", "image/png", "image/gif"],
      displaySupportedFileTypes: "JPEG, PNG, GIF"
    },
    {
      folderName: "Music",
      description: "Music folder",
      supportedFileTypes: ["audio/mpeg", "audio/wav", "audio/aac"],
      displaySupportedFileTypes: "MP3, WAV, AAC"
    },
    {
      folderName: "Videos",
      description: "Videos folder",
      supportedFileTypes: ["video/mp4", "video/quicktime", "video/x-msvideo"],
      displaySupportedFileTypes: "MP4, QuickTime, AVI"
    }
  ];

  const [selectedFolder, setSelectedFolder] = useState<{ folderName: string, supportedFileTypes: string[] } | null>(null);

  const openModal = (folder: { folderName: string, supportedFileTypes: string[] }) => {
    setSelectedFolder(folder); // Set the selected folder data
    const modal = document.getElementById('my_modal_4') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <main>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">FileX</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><a className="justify-between">Profile <span className="badge">New</span></a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Folder Cards */}
      <div className="flex flex-wrap gap-4">
        {folderDescriptions.map((folder) => (
          <FileSystemFolder
            key={folder.folderName}
            folderName={folder.folderName}
            displaySupportedFileTypes={folder.displaySupportedFileTypes}
            onOpenModal={() => openModal(folder)}
          />
        ))}
      </div>

      {/* Modal for Upload */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">File Upload</h3>
          <div className="modal-action">
            {selectedFolder && (
              <UploadFile
                folderName={selectedFolder.folderName}
                supportedFileType={selectedFolder.supportedFileTypes.join(",")}
              />
            )}
            <button
              className="btn"
              onClick={() => (document.getElementById('my_modal_4') as HTMLDialogElement)?.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
