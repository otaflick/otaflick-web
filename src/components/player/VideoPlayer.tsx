// VideoPlayer.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  SkipBack, 
  SkipForward,
  Clock,
  Check
} from 'lucide-react';
import '../../css/VideoPlayer.css';

interface VideoPlayerProps {
  videoUri: string;
  contentType: 'show' | 'movie' | 'anime';
  onFullscreenToggle?: (isFullscreen: boolean) => void;
  autoPlay?: boolean;
  muted?: boolean;
}

export default function VideoPlayer({ 
  videoUri, 
  contentType,
  onFullscreenToggle,
  autoPlay = false,
  muted = false
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Playback rate options
  const playbackRates = [
    { label: '0.25x', value: 0.25 },
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: 'Normal', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '1.75x', value: 1.75 },
    { label: '2x', value: 2 }
  ];

  // Format time in MM:SS or HH:MM:SS
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle mouse movement for showing controls
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying && !showSettings && !isSeeking) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Auto-play was prevented
          setIsPlaying(false);
        });
      }
    }
    handleMouseMove();
  };

  // Handle play
  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  // Handle pause
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
      
      // Calculate buffered amount
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        const bufferedPercentage = (bufferedEnd / videoRef.current.duration) * 100;
        setBuffered(isNaN(bufferedPercentage) ? 0 : bufferedPercentage);
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
    handleMouseMove();
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
    handleMouseMove();
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current && !isSeeking) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
    handleMouseMove();
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        onFullscreenToggle?.(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        onFullscreenToggle?.(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
    handleMouseMove();
  };

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    const fullscreen = !!document.fullscreenElement;
    setIsFullscreen(fullscreen);
    onFullscreenToggle?.(fullscreen);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!videoRef.current) return;

    switch (e.key.toLowerCase()) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        break;
      case 'f':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'm':
        e.preventDefault();
        toggleMute();
        break;
      case 'arrowleft':
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        break;
      case 'arrowright':
        e.preventDefault();
        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
        break;
      case 'arrowup':
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.1));
        if (videoRef.current) videoRef.current.volume = Math.min(1, volume + 0.1);
        break;
      case 'arrowdown':
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.1));
        if (videoRef.current) videoRef.current.volume = Math.max(0, volume - 0.1);
        break;
    }
  }, [volume, duration]);

  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    handleMouseMove();
  };

  // Handle video error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Retry loading video
  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      if (autoPlay) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
    handleMouseMove();
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Add event listeners
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  // Handle auto-play
  useEffect(() => {
    if (autoPlay && videoRef.current && !hasError) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [autoPlay, hasError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (hasError) {
    return (
      <div className="video-player-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Unable to load video</h3>
          <p>The video could not be loaded. Please check your connection and try again.</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="video-player-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying && !showSettings) {
          setShowControls(false);
        }
      }}
    >
      <video
        ref={videoRef}
        className="video-element"
        src={videoUri}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onError={handleError}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        autoPlay={autoPlay}
        muted={muted}
        crossOrigin="anonymous"
        playsInline
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`controls-overlay ${showControls ? 'visible' : 'hidden'}`}>
        
        {/* Top controls */}
        <div className="top-controls">
          <div className="content-type-badge">
            {contentType === 'movie' ? 'Movie' : contentType === 'anime' ? 'Anime' : 'TV Show'}
          </div>
        </div>

        {/* Center play button */}
        <div className="center-controls">
          <button 
            className="play-pause-button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={48} />
            ) : (
              <Play size={48} />
            )}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="bottom-controls">
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            className="progress-container"
            onClick={handleProgressClick}
          >
            <div className="progress-background">
              <div 
                className="progress-buffered" 
                style={{ width: `${buffered}%` }}
              />
              <div 
                className="progress-played" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <input
              type="range"
              className="progress-slider"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              onMouseDown={() => setIsSeeking(true)}
              onMouseUp={() => setIsSeeking(false)}
              step="0.1"
            />
          </div>

          <div className="controls-bar">
            <div className="left-controls">
              <button 
                className="control-button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>

              <div className="volume-control">
                <button 
                  className="control-button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={24} />
                  ) : (
                    <Volume2 size={24} />
                  )}
                </button>
                <div className="volume-slider-container">
                  <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume"
                  />
                </div>
              </div>

              <div className="time-display">
                <Clock size={16} />
                <span className="current-time">{formatTime(currentTime)}</span>
                <span className="time-separator"> / </span>
                <span className="total-time">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="right-controls">
              <button 
                className="control-button skip-button"
                onClick={() => skip(-10)}
                aria-label="Skip back 10 seconds"
              >
                <SkipBack size={24} />
                <span className="skip-label">10</span>
              </button>

              <button 
                className="control-button skip-button"
                onClick={() => skip(10)}
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward size={24} />
                <span className="skip-label">10</span>
              </button>

              <div className="settings-container">
                <button 
                  className="control-button"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Settings"
                >
                  <Settings size={24} />
                </button>

                {showSettings && (
                  <div className="settings-dropdown">
                    <div className="settings-section">
                      <h4>Playback Speed</h4>
                      <div className="playback-speed-options">
                        {playbackRates.map(({ label, value }) => (
                          <button
                            key={value}
                            className={`speed-option ${playbackRate === value ? 'active' : ''}`}
                            onClick={() => changePlaybackRate(value)}
                          >
                            {label}
                            {playbackRate === value && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                className="control-button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize size={24} />
                ) : (
                  <Maximize size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}