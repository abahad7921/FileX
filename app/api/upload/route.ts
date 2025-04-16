import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile, mkdir, stat } from "fs/promises";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const file = formData.get("file");
  const folderName = formData.get("folderName");

  // Validate file
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No valid file received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const originalFilename = file.name.replaceAll(" ", "_");

  // Construct the full path for the directory
  const dirPath = path.join("D:/Data", folderName as string);

  try {
    // Ensure the directory exists
    await mkdir(dirPath, { recursive: true });

    // Function to generate a unique filename
    const generateUniqueFilename = async (baseName: string) => {
      let fileName = baseName;
      let counter = 1;

      // Check if the file already exists
      while (true) {
        const filePath = path.join(dirPath, fileName);
        try {
          await stat(filePath); // Check if the file exists
          // If it does, create a new name with a counter
          fileName = `${baseName.replace(/\.[^/.]+$/, "")}(${counter++})${path.extname(baseName)}`;
        } catch (error: unknown) {
          // If the error is not a file not found error, rethrow it
          if ((error as { code?: string }).code !== 'ENOENT') throw error;
          // If it doesn't exist, we can break the loop
          break;
        }
      }
      return fileName;
    };

    // Generate a unique filename if needed
    const uniqueFilename = await generateUniqueFilename(originalFilename);

    // Write the file to the specified directory
    await writeFile(path.join(dirPath, uniqueFilename), buffer);
    
    return NextResponse.json({ message: "File uploaded successfully!", filename: uniqueFilename }, { status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed", error: (error as Error).message }, { status: 500 });
  }
};
