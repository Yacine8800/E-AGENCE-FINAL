"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

interface MessageContent {
  type: "text" | "image" | "audio" | "pdf" | "doc" | "location";
  content: string;
  duration?: number;
  isPlaying?: boolean;
  progress?: number;
  currentTime?: number;
  name?: string;
  size?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  error?: boolean;
}

interface AttachmentPreviewProps {
  attachments: MessageContent[];
  onRemove: (index: number) => void;
  theme: any;
  formatDuration: (seconds: number) => string;
}

export default function AttachmentPreview({
  attachments,
  onRemove,
  theme,
  formatDuration,
}: AttachmentPreviewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Initialize state for audio elements
  const [audioStates, setAudioStates] = useState<{
    [key: number]: { isPlaying: boolean; progress: number; currentTime: number };
  }>({});

  useEffect(() => {
    // Clean up audio playback when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const toggleAudioPlayback = (index: number) => {
    const attachment = attachments[index];
    if (attachment.type !== "audio") return;

    if (playingIndex === index) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingIndex(null);
      setAudioStates(prev => ({
        ...prev,
        [index]: { ...prev[index], isPlaying: false }
      }));
    } else {
      // Stop any playing audio
      if (audioRef.current && playingIndex !== null) {
        audioRef.current.pause();
        setAudioStates(prev => ({
          ...prev,
          [playingIndex]: { ...prev[playingIndex], isPlaying: false }
        }));
      }

      // Create and play new audio
      audioRef.current = new Audio(attachment.content);
      
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          const duration = audioRef.current.duration;
          const progress = (currentTime / duration) * 100;
          
          setAudioStates(prev => ({
            ...prev,
            [index]: { isPlaying: true, progress, currentTime }
          }));
        }
      });

      audioRef.current.addEventListener("ended", () => {
        setPlayingIndex(null);
        setAudioStates(prev => ({
          ...prev,
          [index]: { ...prev[index], isPlaying: false }
        }));
      });

      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });

      setPlayingIndex(index);
      setAudioStates(prev => ({
        ...prev,
        [index]: { ...prev[index], isPlaying: true }
      }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (attachments.length === 0) return null;

  return (
    <div className={`mt-2 p-2 rounded-lg ${theme.bgSecondary} ${theme.border} border`}>
      <div className="text-sm font-medium mb-2 flex justify-between items-center">
        <span className={theme.text}>Aperçu avant envoi</span>
        <span className={`${theme.textSecondary} text-xs`}>{attachments.length} élément(s)</span>
      </div>
      
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {attachments.map((attachment, index) => (
          <div key={index} className={`relative p-2 rounded-md ${theme.buttonBg} group flex items-center justify-between`}>
            {/* Preview based on attachment type */}
            <div className="flex items-center flex-1 min-w-0">
              {attachment.type === "image" && (
                <div className="relative h-14 w-14 rounded overflow-hidden flex-shrink-0 mr-3">
                  <Image 
                    src={attachment.content}
                    alt="Image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {attachment.type === "audio" && (
                <div className="flex-1 flex items-center">
                  <button
                    onClick={() => toggleAudioPlayback(index)}
                    className={`w-10 h-10 rounded-full ${theme.buttonBg} flex items-center justify-center mr-3`}
                  >
                    {(audioStates[index]?.isPlaying) ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                        <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4.99998V19C5 19.2652 5.10536 19.5196 5.29289 19.7071C5.48043 19.8946 5.73478 20 6 20H8C8.26522 20 8.51957 19.8946 8.70711 19.7071C8.89464 19.5196 9 19.2652 9 19V4.99998C9 4.73476 8.89464 4.48041 8.70711 4.29287C8.51957 4.10534 8.26522 3.99998 8 3.99998H6C5.73478 3.99998 5.48043 4.10534 5.29289 4.29287C5.10536 4.48041 5 4.73476 5 4.99998Z" fill="currentColor" />
                        <path d="M15 4.99998V19C15 19.2652 15.1054 19.5196 15.2929 19.7071C15.4804 19.8946 15.7348 20 16 20H18C18.2652 20 18.5196 19.8946 18.7071 19.7071C18.8946 19.5196 19 19.2652 19 19V4.99998C19 4.73476 18.8946 4.48041 18.7071 4.29287C18.5196 4.10534 18.2652 3.99998 18 3.99998H16C15.7348 3.99998 15.4804 4.10534 15.2929 4.29287C15.1054 4.48041 15 4.73476 15 4.99998Z" fill="currentColor" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${theme.text} truncate`}>
                      {attachment.name || "Enregistrement audio"}
                    </div>
                    {attachment.duration && (
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-600/30 rounded-full h-1.5 mr-2">
                          <div 
                            className="h-1.5 rounded-full bg-red-500" 
                            style={{ width: `${audioStates[index]?.progress || 0}%` }} 
                          />
                        </div>
                        <span className={`text-xs ${theme.textSecondary}`}>
                          {audioStates[index]?.currentTime ? formatDuration(audioStates[index].currentTime) : "0:00"} / {formatDuration(attachment.duration || 0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(attachment.type === "pdf" || attachment.type === "doc") && (
                <>
                  <div className={`w-10 h-10 rounded ${theme.buttonBg} flex items-center justify-center mr-3`}>
                    {attachment.type === "pdf" ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 15H15" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 11H15" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#5496FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="#5496FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="#5496FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="#5496FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 9H9H8" stroke="#5496FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${theme.text} truncate`}>{attachment.name}</div>
                    {attachment.size && (
                      <div className={`text-xs ${theme.textSecondary}`}>
                        {formatFileSize(attachment.size)}
                      </div>
                    )}
                  </div>
                </>
              )}

              {attachment.type === "location" && (
                <>
                  <div className={`w-10 h-10 rounded ${theme.buttonBg} flex items-center justify-center mr-3`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${theme.text} truncate`}>
                      Position actuelle
                    </div>
                    <div className={`text-xs ${theme.textSecondary} truncate`}>
                      {attachment.address || "Chargement..."}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Remove button */}
            <button 
              onClick={() => onRemove(index)}
              className={`p-1.5 rounded-full ${theme.buttonBg} ${theme.buttonHover} opacity-0 group-hover:opacity-100 transition-opacity ml-2`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
