import React, { useState, useEffect, useRef } from 'react';

/**
 * FocusTimer provides a minimalist circular/badge timer.
 * Features:
 * - Pomodoro mode (25:00 count down)
 * - Flow mode (count up stopwatch to track free writing session)
 * - Auto play sound on Pomodoro completion (synthesised chime)
 * - Clean SVG icons instead of raw text characters.
 */
export default function FocusTimer({ translations }) {
  const [isPomodoro, setIsPomodoro] = useState(true);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const timerRef = useRef(null);

  const toggleTimerType = () => {
    setIsActive(false);
    if (isPomodoro) {
      setIsPomodoro(false);
      setSeconds(0);
    } else {
      setIsPomodoro(true);
      setSeconds(25 * 60);
    }
  };

  const toggleStart = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (isPomodoro) {
      setSeconds(25 * 60);
    } else {
      setSeconds(0);
    }
  };

  const playCompletionChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.3);
      gain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.5);
      gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 1.5);
      osc2.stop(audioCtx.currentTime + 2.0);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (isPomodoro) {
            if (prev <= 1) {
              setIsActive(false);
              clearInterval(timerRef.current);
              playCompletionChime();
              return 25 * 60;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, isPomodoro]);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Icons
  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  );

  const ResetIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
    </svg>
  );

  return (
    <div className="timer-container" title={isPomodoro ? translations.timerPomodoroDesc : translations.timerFlowDesc}>
      <button className="timer-mode-btn active" onClick={toggleTimerType}>
        {isPomodoro ? 'Pomodoro' : 'Flow'}
      </button>
      <div className="timer-display">
        {formatTime(seconds)}
      </div>
      <div className="timer-controls" style={{ display: 'flex' }}>
        <button 
          onClick={toggleStart} 
          className={`timer-action-btn ${isActive ? 'active' : ''}`} 
          aria-label={isActive ? translations.pause : translations.start}
          title={isActive ? translations.pause : translations.start}
        >
          {isActive ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button 
          onClick={resetTimer} 
          className="timer-action-btn" 
          aria-label={translations.reset}
          title={translations.reset}
        >
          <ResetIcon />
        </button>
      </div>
    </div>
  );
}
