import path from 'path';
import sharp from 'sharp';

// Resize image function
export const resizeImage = async (filePath) => {
    console.log('Resizing image:', filePath); // Debug log
    const resizedFilePath = filePath.replace(
        path.extname(filePath),
        "-small.jpg"
    );
    await sharp(filePath)
        .resize(200, 200)
        .toFile(resizedFilePath);
    console.log('Resized image saved at:', resizedFilePath); // Debug log
    return resizedFilePath;
};

