import React, { useState, useEffect, useRef } from 'react';

/**
 * FocusTimer provides a minimalist Pomodoro cycle timer.
 * Features:
 * - Pomodoro mode only (Flow mode disabled per requirements)
 * - Auto play calm Tibetan bell sound on completion (synthesised chime)
 * - Auto-start on the first thought/reminder logged for the current goal
 * - 4-cycle loop: 25m focus / 5m break (with a 25m break on the 4th cycle) repeating eternally
 * - Full-screen modal popup with blurred background (backdrop-filter: blur) for breaks/resets
 * - Confirmation popup on click of Reset Pomodoro
 */
export default function FocusTimer({ translations, activeGoal, goalStartTime, thoughts }) {
  const lang = localStorage.getItem('focusflow_lang') || 'pt';

  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem('focusflow_pomo_seconds');
    return saved ? parseInt(saved, 10) : 25 * 60;
  });
  
  const [isActive, setIsActive] = useState(false);
  
  const [pomodoroCount, setPomodoroCount] = useState(() => {
    const saved = localStorage.getItem('focusflow_pomo_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [timerMode, setTimerMode] = useState(() => {
    const saved = localStorage.getItem('focusflow_pomo_mode');
    return saved ? saved : 'work';
  });

  const [popupStage, setPopupStage] = useState(null); // null, 'break-invitation', 'break-active', 'break-completed', 'reset-confirm'
  
  // Track if we auto-started for the current active goal ID
  const [autoStartedForGoal, setAutoStartedForGoal] = useState(() => {
    return localStorage.getItem('focusflow_pomo_autostarted_goal') || '';
  });

  const [isHovered, setIsHovered] = useState(false);

  const selectPhase = (num) => {
    setIsActive(false);
    setPomodoroCount(num);
    setTimerMode('work');
    setSeconds(25 * 60);
    localStorage.setItem('focusflow_pomo_count', num.toString());
    localStorage.setItem('focusflow_pomo_mode', 'work');
    localStorage.setItem('focusflow_pomo_seconds', (25 * 60).toString());
    setIsHovered(false);
  };

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editMinutes, setEditMinutes] = useState('25');

  const handleTimeClick = () => {
    setIsActive(false); // Pausa o timer ao editar
    setEditMinutes(Math.floor(seconds / 60).toString());
    setIsEditingTime(true);
  };

  const saveTimeEdit = () => {
    const mins = parseInt(editMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      const newSecs = mins * 60;
      setSeconds(newSecs);
      localStorage.setItem('focusflow_pomo_seconds', newSecs.toString());
    }
    setIsEditingTime(false);
  };

  const [isConfirmingSkip, setIsConfirmingSkip] = useState(false);
  const skipConfirmTimerRef = useRef(null);

  const timerRef = useRef(null);

  // Play a very calm, deep zen chime (Tibetan bell / singing bowl)
  const playZenBell = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      // Detuned frequencies for a warm hand-crafted bowl effect
      const freqs = [146.83, 293.66, 440.00, 587.33, 739.99];
      const gains = [0.25, 0.2, 0.15, 0.1, 0.05];
      const decays = [4.0, 3.5, 3.0, 2.0, 1.5]; // low frequencies ring longer
      
      freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        if (index > 0) {
          osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 2.5, now);
        }
        
        // Very soft attack and natural decay
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gains[index], now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decays[index]);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + decays[index]);
      });
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  // 1. Lógica de início automático ao adicionar o primeiro pensamento/lembrete da meta
  useEffect(() => {
    if (!activeGoal) {
      // Se não há meta ativa, limpa tudo e desativa
      setIsActive(false);
      setSeconds(25 * 60);
      setPomodoroCount(0);
      setTimerMode('work');
      setPopupStage(null);
      setAutoStartedForGoal('');
      localStorage.removeItem('focusflow_pomo_seconds');
      localStorage.removeItem('focusflow_pomo_count');
      localStorage.removeItem('focusflow_pomo_mode');
      localStorage.removeItem('focusflow_pomo_autostarted_goal');
      return;
    }

    const currentGoalIdStr = activeGoal.id.toString();
    if (autoStartedForGoal !== currentGoalIdStr) {
      // Filtra pensamentos/lembretes adicionados para a meta atual
      const sessionThoughts = thoughts.filter(t => t.id >= goalStartTime && t.category !== 'goal');
      if (sessionThoughts.length > 0) {
        setAutoStartedForGoal(currentGoalIdStr);
        setIsActive(true);
        setTimerMode('work');
        setSeconds(25 * 60);
        setPomodoroCount(0);
        setPopupStage(null);
        localStorage.setItem('focusflow_pomo_autostarted_goal', currentGoalIdStr);
      }
    }
  }, [activeGoal, goalStartTime, thoughts, autoStartedForGoal]);

  // 2. Loop de contagem regressiva
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            
            // Toca alarme zen
            playZenBell();
            
            if (timerMode === 'work') {
              // Concluiu período de foco
              let nextCount = pomodoroCount + 1;
              if (nextCount > 4) {
                nextCount = 1; // ciclo reseta de volta se passou do limite de contagem local (em andamento)
              }
              setPomodoroCount(nextCount);
              localStorage.setItem('focusflow_pomo_count', nextCount.toString());
              
              setPopupStage('break-invitation');
              return nextCount === 4 ? 25 * 60 : 5 * 60; // retorna os segundos correspondentes
            } else {
              // Concluiu período de pausa
              setPopupStage('break-completed');
              return 25 * 60;
            }
          }
          const nextSec = prev - 1;
          localStorage.setItem('focusflow_pomo_seconds', nextSec.toString());
          return nextSec;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timerMode, pomodoroCount]);

  // Persistir segundos, contagem e modo
  useEffect(() => {
    localStorage.setItem('focusflow_pomo_seconds', seconds.toString());
  }, [seconds]);

  useEffect(() => {
    localStorage.setItem('focusflow_pomo_count', pomodoroCount.toString());
  }, [pomodoroCount]);

  useEffect(() => {
    localStorage.setItem('focusflow_pomo_mode', timerMode);
  }, [timerMode]);

  useEffect(() => {
    setIsConfirmingSkip(false);
    if (skipConfirmTimerRef.current) clearTimeout(skipConfirmTimerRef.current);
  }, [popupStage]);

  useEffect(() => {
    return () => {
      if (skipConfirmTimerRef.current) clearTimeout(skipConfirmTimerRef.current);
    };
  }, []);

  // Funções de Ação
  const toggleStart = () => {
    setIsActive(!isActive);
  };

  const startBreak = () => {
    setTimerMode('break');
    const breakDuration = pomodoroCount === 4 ? 25 * 60 : 5 * 60;
    setSeconds(breakDuration);
    setIsActive(true);
    setPopupStage('break-active');
  };

  const handleSkipClick = () => {
    if (!isConfirmingSkip) {
      setIsConfirmingSkip(true);
      if (skipConfirmTimerRef.current) clearTimeout(skipConfirmTimerRef.current);
      skipConfirmTimerRef.current = setTimeout(() => {
        setIsConfirmingSkip(false);
      }, 3000);
    } else {
      if (skipConfirmTimerRef.current) clearTimeout(skipConfirmTimerRef.current);
      setIsConfirmingSkip(false);

      setTimerMode('work');
      setSeconds(25 * 60);
      setPopupStage(null);
      setIsActive(true);
      if (pomodoroCount === 4) {
        setPomodoroCount(0); // Reseta a contagem de ciclos concluídos ao pular a última pausa longa
      }
    }
  };

  const resumeWork = () => {
    setTimerMode('work');
    setSeconds(25 * 60);
    setPopupStage(null);
    setIsActive(true);
    if (pomodoroCount === 4) {
      setPomodoroCount(0); // Reseta a contagem ao voltar do descanso longo
    }
  };

  const requestReset = () => {
    setIsActive(false);
    setPopupStage('reset-confirm');
  };

  const confirmReset = () => {
    setIsActive(false);
    setSeconds(25 * 60);
    setPomodoroCount(0);
    setTimerMode('work');
    setPopupStage(null);
  };

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
    <>
      <div className="timer-container" title={translations.timerPomodoroDesc}>
        <div 
          className="timer-badge"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span>
            🍅 {timerMode === 'work' ? (lang === 'pt' ? `Foco #${pomodoroCount + 1}` : `Focus #${pomodoroCount + 1}`) : (lang === 'pt' ? 'Pausa' : 'Break')}
          </span>
          
          {isHovered && (
            <div className="timer-badge-dropdown">
              {[0, 1, 2, 3].map((num) => (
                <div 
                  key={num} 
                  className={`dropdown-item ${pomodoroCount === num && timerMode === 'work' ? 'active' : ''}`}
                  onClick={() => selectPhase(num)}
                >
                  {lang === 'pt' ? `Foco #${num + 1}` : `Focus #${num + 1}`}
                </div>
              ))}
            </div>
          )}
        </div>
        {isEditingTime ? (
          <input 
            type="number"
            className="timer-input-edit"
            value={editMinutes}
            onChange={(e) => setEditMinutes(e.target.value)}
            onBlur={saveTimeEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTimeEdit();
              if (e.key === 'Escape') setIsEditingTime(false);
            }}
            min="1"
            max="180"
            autoFocus
          />
        ) : (
          <div className="timer-display" onClick={handleTimeClick} style={{ cursor: 'pointer' }} title={lang === 'pt' ? 'Clique para editar o tempo' : 'Click to edit time'}>
            {formatTime(seconds)}
          </div>
        )}
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
            onClick={requestReset} 
            className="timer-action-btn" 
            aria-label={translations.reset}
            title={translations.reset}
          >
            <ResetIcon />
          </button>
        </div>
      </div>

      {/* POPUP OVERLAY COM FUNDO BORRADO */}
      {popupStage && (
        <div className="pomodoro-overlay-backdrop">
          <div className="pomodoro-modal-card">
            {popupStage === 'break-invitation' && (
              <div className="modal-content-stage">
                <div className="modal-icon">🌸</div>
                <h2>{lang === 'pt' ? 'Hora de Respirar' : 'Time to Breathe'}</h2>
                <p>
                  {lang === 'pt' 
                    ? `Parabéns! Você concluiu o seu ${pomodoroCount}º ciclo de foco profundo.` 
                    : `Congratulations! You finished your ${pomodoroCount}th deep focus cycle.`}
                </p>
                <p className="modal-desc">
                  {pomodoroCount === 4
                    ? (lang === 'pt' ? 'Você acumulou 4 ciclos! Recomendamos uma pausa longa de 25 minutos para recarregar as energias.' : 'You have completed 4 cycles! We recommend a long 25-minute break to recharge.')
                    : (lang === 'pt' ? 'Recomendamos uma pausa curta de 5 minutos para descansar a mente.' : 'We recommend a short 5-minute break to rest your mind.')}
                </p>
                <div className="modal-actions">
                  <button className="btn-modal-primary" onClick={startBreak}>
                    {lang === 'pt' ? `Iniciar Pausa de ${pomodoroCount === 4 ? 25 : 5} min` : `Start ${pomodoroCount === 4 ? 25 : 5} min Break`}
                  </button>
                  <button className="btn-modal-secondary" onClick={handleSkipClick}>
                    {isConfirmingSkip 
                      ? (lang === 'pt' ? 'Tem certeza? Clique para confirmar ➔' : 'Are you sure? Click to confirm ➔') 
                      : (lang === 'pt' ? 'Ignorar Pausa (Skip)' : 'Skip Break')}
                  </button>
                </div>
              </div>
            )}

            {popupStage === 'break-active' && (
              <div className="modal-content-stage">
                <div className="modal-icon-spinning">🍃</div>
                <h2>{lang === 'pt' ? 'Pausa em Andamento' : 'Break in Progress'}</h2>
                <div className="modal-timer-display">
                  {formatTime(seconds)}
                </div>
                <p className="modal-desc">
                  {lang === 'pt' ? 'Aproveite para se alongar, beber água ou fechar os olhos.' : 'Take a moment to stretch, drink water, or close your eyes.'}
                </p>
                <div className="modal-actions">
                  <button className="btn-modal-secondary" onClick={handleSkipClick}>
                    {isConfirmingSkip 
                      ? (lang === 'pt' ? 'Tem certeza? Clique para confirmar ➔' : 'Are you sure? Click to confirm ➔') 
                      : (lang === 'pt' ? 'Pular Descanso (Skip)' : 'Skip Rest')}
                  </button>
                </div>
              </div>
            )}

            {popupStage === 'break-completed' && (
              <div className="modal-content-stage">
                <div className="modal-icon">☀️</div>
                <h2>{lang === 'pt' ? 'Pausa Finalizada!' : 'Break Finished!'}</h2>
                <p className="modal-desc">
                  {lang === 'pt' ? 'Mente descansada? Vamos retomar o foco com energia total.' : 'Mind rested? Let\'s resume focus with full energy.'}
                </p>
                <div className="modal-actions">
                  <button className="btn-modal-primary" onClick={resumeWork}>
                    {lang === 'pt' ? 'Voltar à Concentração' : 'Back to Focus'}
                  </button>
                </div>
              </div>
            )}

            {popupStage === 'reset-confirm' && (
              <div className="modal-content-stage">
                <div className="modal-icon">⚠️</div>
                <h2>{lang === 'pt' ? 'Reiniciar Pomodoro?' : 'Reset Pomodoro?'}</h2>
                <p className="modal-desc">
                  {lang === 'pt' 
                    ? 'Tem certeza que deseja reiniciar todo o ciclo do Pomodoro? Seu progresso atual de ciclos será resetado.' 
                    : 'Are you sure you want to reset the entire Pomodoro cycle? Your current cycle progress will be reset.'}
                </p>
                <div className="modal-actions">
                  <button className="btn-modal-danger" onClick={confirmReset}>
                    {lang === 'pt' ? 'Sim, Reiniciar' : 'Yes, Reset'}
                  </button>
                  <button className="btn-modal-secondary" onClick={() => setPopupStage(null)}>
                    {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
