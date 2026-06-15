import React, { useState, useEffect, useRef } from 'react';

/**
 * SoundController component uses Web Audio API to synthesize focus noises
 * (Brown Noise, Pink Noise, and a synthesized Rain effect) directly in the browser,
 * and integrates the Lofi Girl YouTube live radio feed and standard study radio options.
 * Supports persistence of the selected lofi track.
 */
export default function SoundController({ translations }) {
  const [activeSounds, setActiveSounds] = useState({
    brown: false,
    pink: false,
    rain: false,
  });

  const [volumes, setVolumes] = useState({
    brown: 0.5,
    pink: 0.5,
    rain: 0.5,
  });

  // State to toggle the Lofi Girl YouTube embed player
  const [lofiActive, setLofiActive] = useState(false);

  // State to track selected Lofi track (saved in localStorage)
  const [selectedLofiTrack, setSelectedLofiTrack] = useState(() => {
    return localStorage.getItem('focusflow_selected_lofi') || 'live';
  });

  const audioCtxRef = useRef(null);
  
  // Audio node references
  const nodesRef = useRef({
    brown: { source: null, gain: null },
    pink: { source: null, gain: null },
    rain: { source: null, gain: null, filter: null, lfo: null },
  });

  // Save selected track choice
  useEffect(() => {
    localStorage.setItem('focusflow_selected_lofi', selectedLofiTrack);
  }, [selectedLofiTrack]);

  // Helper: Initialize Audio Context
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Noise Buffer Generators
  const createBrownNoiseBuffer = (ctx) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    return noiseBuffer;
  };

  const createPinkNoiseBuffer = (ctx) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return noiseBuffer;
  };

  // Start a specific sound type
  const startSound = (type) => {
    initAudio();
    const ctx = audioCtxRef.current;
    
    stopSound(type);

    let buffer;
    if (type === 'brown') {
      buffer = createBrownNoiseBuffer(ctx);
    } else if (type === 'pink' || type === 'rain') {
      buffer = createPinkNoiseBuffer(ctx);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volumes[type], ctx.currentTime);

    if (type === 'rain') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.15, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start();

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      nodesRef.current[type] = { source, gain: gainNode, filter, lfo };
    } else {
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      nodesRef.current[type] = { source, gain: gainNode };
    }

    source.start(0);
    setActiveSounds(prev => ({ ...prev, [type]: true }));
  };

  // Stop a specific sound type
  const stopSound = (type) => {
    const node = nodesRef.current[type];
    if (node && node.source) {
      try {
        node.source.stop();
      } catch (e) {}
      
      if (node.lfo) {
        try {
          node.lfo.stop();
        } catch (e) {}
      }

      nodesRef.current[type] = { source: null, gain: null };
      setActiveSounds(prev => ({ ...prev, [type]: false }));
    }
  };

  // Toggle Sound State
  const toggleSound = (type) => {
    if (activeSounds[type]) {
      stopSound(type);
    } else {
      startSound(type);
    }
  };

  // Handle volume change
  const handleVolumeChange = (type, val) => {
    const newVol = parseFloat(val);
    setVolumes(prev => ({ ...prev, [type]: newVol }));
    
    const node = nodesRef.current[type];
    if (node && node.gain && audioCtxRef.current) {
      node.gain.gain.linearRampToValueAtTime(newVol, audioCtxRef.current.currentTime + 0.1);
    }
  };

  useEffect(() => {
    return () => {
      ['brown', 'pink', 'rain'].forEach(type => {
        stopSound(type);
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Sleek SVG play/pause icons
  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  );

  const SoundIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  );

  return (
    <div className="sound-controller">
      {/* Brown Noise */}
      <div className="sound-item">
        <div className="sound-header">
          <div className="sound-info">
            <SoundIcon />
            <span>{translations.soundBrown}</span>
          </div>
          <button
            onClick={() => toggleSound('brown')}
            className={`btn-play ${activeSounds.brown ? 'playing' : ''}`}
            title={activeSounds.brown ? translations.stop : translations.play}
            aria-label={activeSounds.brown ? translations.stop : translations.play}
          >
            {activeSounds.brown ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volumes.brown}
          onChange={(e) => handleVolumeChange('brown', e.target.value)}
          disabled={!activeSounds.brown}
          aria-label={`${translations.soundBrown} Volume`}
        />
      </div>

      {/* Pink Noise */}
      <div className="sound-item">
        <div className="sound-header">
          <div className="sound-info">
            <SoundIcon />
            <span>{translations.soundPink}</span>
          </div>
          <button
            onClick={() => toggleSound('pink')}
            className={`btn-play ${activeSounds.pink ? 'playing' : ''}`}
            title={activeSounds.pink ? translations.stop : translations.play}
            aria-label={activeSounds.pink ? translations.stop : translations.play}
          >
            {activeSounds.pink ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volumes.pink}
          onChange={(e) => handleVolumeChange('pink', e.target.value)}
          disabled={!activeSounds.pink}
          aria-label={`${translations.soundPink} Volume`}
        />
      </div>

      {/* Rain Sound */}
      <div className="sound-item">
        <div className="sound-header">
          <div className="sound-info">
            <SoundIcon />
            <span>{translations.soundRain}</span>
          </div>
          <button
            onClick={() => toggleSound('rain')}
            className={`btn-play ${activeSounds.rain ? 'playing' : ''}`}
            title={activeSounds.rain ? translations.stop : translations.play}
            aria-label={activeSounds.rain ? translations.stop : translations.play}
          >
            {activeSounds.rain ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volumes.rain}
          onChange={(e) => handleVolumeChange('rain', e.target.value)}
          disabled={!activeSounds.rain}
          aria-label={`${translations.soundRain} Volume`}
        />
      </div>

      {/* Lofi Girl YouTube Radio Integration */}
      <div className="sound-item">
        <div className="sound-header">
          <div className="sound-info">
            <SoundIcon />
            <span>{translations.soundLofi}</span>
          </div>
          <button
            onClick={() => setLofiActive(!lofiActive)}
            className={`btn-play ${lofiActive ? 'playing' : ''}`}
            title={lofiActive ? translations.stop : translations.play}
            aria-label={translations.soundLofi}
          >
            {lofiActive ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>

        {lofiActive && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <select
              value={selectedLofiTrack}
              onChange={(e) => setSelectedLofiTrack(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '8px',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem'
              }}
            >
              <option value="live">{translations.soundLofiRadio}</option>
              <option value="study">{translations.soundLofiStudy}</option>
            </select>

            <iframe
              src={
                selectedLofiTrack === 'live'
                  ? "https://www.youtube.com/embed/live_stream?channel=UCSJ4gkVC6NrvII8umztf0Ow&autoplay=1"
                  : "https://www.youtube.com/embed/-FlxM_0S2lA?autoplay=1"
              }
              title="Lofi Girl Radio"
              style={{ width: '100%', height: '140px', borderRadius: '8px', border: 'none', background: '#000' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
