import { Download, X } from 'lucide-react';
import React from 'react'

const MusicModal = ({
    musicURl,
    handleDownloadFile,
    setMusicUrl,
    setShowMusic,
}) => {
    return (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
            <audio controls src={musicURl} alt="audio" className="w-[80vw] h-50vh" />

            <div className="flex gap-5 fixed top-0 mt-5">
                <button
                    onClick={() => handleDownloadFile(musicURl)}
                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                    <Download />
                </button>
                <button
                    onClick={() => {
                        setMusicUrl("");
                        setShowMusic(false);
                    }}
                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                    <X />
                </button>
            </div>
        </div>
    )
}

export default MusicModal
