import { Download, X } from 'lucide-react';
import React from 'react'

const ImageModal = (
    {setShowImage,
    setImageUrl,
    imageUrl,
    handleDownloadFile,}
) => {
    console.log(imageUrl);
    
    return (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
            <div className="bg-white">
                <img src={imageUrl} alt="image" className="h-[80vh] w-full bg-cover" />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
                <button
                    onClick={() => handleDownloadFile(imageUrl)}
                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                    <Download />
                </button>
                <button
                    onClick={() => {
                        setShowImage(false);
                        setImageUrl("");
                    }}
                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                    <X />
                </button>
            </div>
        </div>
    )
}

export default ImageModal
