import React, { useRef, useState } from 'react';
import './BackgroundMusic.css';
import backgroundMusic from '../assets/background.mp3';

const BackgroundMusic = () => {
  const audioRef = useRef();
  const [volume, setVolume] = useState(1); // Default volume (1 = 100%)

  const toggleMute = () => {
    if (audioRef.current.muted) {
      audioRef.current.muted = false;
    } else {
      audioRef.current.muted = true;
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    <div className="background-music-container">
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop />
      <div className="controls">
        <button className="mute-button" onClick={toggleMute}>
          {audioRef.current?.muted ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default BackgroundMusic;