'use client';
import React, { useEffect, useState } from 'react'

interface fileInfo {
    path: string;
    name: string;
    ext: string;
    size: number;
}

const Documents = () => {
    const [files, setFiles] = useState<fileInfo[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/details?folderName=documents');
            const data = await response.json();
            setFiles(data.files);
        };
        fetchData();
    }, []);
  
  return (
    <div>
        {files.map((file) => (
            <div key={file.path}>
                {file.name}
            </div>
        ))}
    </div>
  );
}

export default Documents;
