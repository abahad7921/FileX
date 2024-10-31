import { useRouter } from 'next/navigation';
import React from 'react';

interface FileSystemFolderProps {
    folderName: string;
    onOpenModal: () => void;
    displaySupportedFileTypes: string;
}

const FileSystemFolder: React.FC<FileSystemFolderProps> = ({ folderName, onOpenModal, displaySupportedFileTypes }) => {
    const router = useRouter();
    const routeToDetails = () => {
        router.push(`/details/${folderName}`);
    }
    return (
        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{folderName}</h2>
                <p>File types supported: {displaySupportedFileTypes}</p>
                <div className="card-actions justify-end gap-2">
                    <button className="btn btn-primary" onClick={onOpenModal}>Upload</button>
                    <button className="btn btn-primary" onClick={routeToDetails}>Details</button>
                </div>
            </div>
        </div>
    );
};

export default FileSystemFolder;
