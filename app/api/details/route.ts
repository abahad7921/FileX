import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readFiles = (dir: string, processFile: (filePath: string, name: string, ext: string, stat: fs.Stats) => void, callback: (files: any[]) => void) => {
    // Read directory
    fs.readdir(dir, (error, fileNames) => {
        if (error) {
            callback([]); // Call the callback with an empty array on error
            return;
        }

        const files: { path: string, name: string, ext: string, size: number }[] = [];

        const fileReadPromises = fileNames.map((filename) => {
            return new Promise<void>((resolve) => {
                const filePath = path.resolve(dir, filename);

                // Get information about the file
                fs.stat(filePath, (error, stat) => {
                    if (error) {
                        resolve(); // Resolve even on error to continue processing other files
                        return;
                    }

                    if (stat.isFile()) {
                        // It's a file, process it
                        const name = path.parse(filename).name;
                        const ext = path.parse(filename).ext;
                        processFile(filePath, name, ext, stat);
                        files.push({
                            path: filePath,
                            name: name,
                            ext: ext,
                            size: stat.size,
                        });
                    } else if (stat.isDirectory()) {
                        // It's a directory, read its contents recursively
                        readFiles(filePath, processFile, (subFiles) => {
                            files.push(...subFiles); // Add files from the subdirectory
                            resolve(); // Resolve after processing the subdirectory
                        });
                        return; // Prevent resolving here; it will resolve in the callback
                    }

                    resolve(); // Resolve for files and unprocessed directories
                });
            });
        });

        // Wait for all file reads to complete
        Promise.all(fileReadPromises).then(() => {
            callback(files); // Call the callback with the collected files
        });
    });
};

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = req.nextUrl;
        const folderName = searchParams.get('folderName') || ''; // Provide a default value

        console.log('folderName =', folderName);
        if (!folderName) {
            return NextResponse.json({ error: "folderName is required" }, { status: 400 });
        }

        const directoryPath = path.join("D:/Data", folderName);
        return new Promise((resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            readFiles(directoryPath, (filePath, name, ext, stat) => {
                // This callback is used to process each file, but the actual response will be handled later
            }, (files) => {
                // This callback is invoked after reading all files
                resolve(NextResponse.json({ files })); // Resolve the promise with the response
            });
        });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) { // Explicitly type error as any
        return NextResponse.json({ error: "Failed to read files.", details: error.message }, { status: 500 });
    }
};
