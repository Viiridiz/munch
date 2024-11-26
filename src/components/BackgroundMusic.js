import React, { useRef, useState, useEffect } from 'react';
import './BackgroundMusic.css';
import backgroundMusic from '../assets/background.mp3';

const BackgroundMusic = () => {
  const audioRef = useRef(null); // Ensure it's null initially
  const [volume, setVolume] = useState(1); // Default volume (1 = 100%)
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Sync volume on render
      audioRef.current.muted = isMuted; // Sync mute state on render
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="background-music-container">
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop />
      <div className="controls">
        <button className="mute-button" onClick={toggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          disabled={isMuted} // Disable slider when muted
        />
      </div>
    </div>
  );
};

export default BackgroundMusic;
