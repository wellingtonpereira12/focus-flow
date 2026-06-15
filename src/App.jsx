import React, { useState, useEffect, useRef } from 'react';
import SoundController from './components/SoundController';
import FocusTimer from './components/FocusTimer';

// Translation dictionaries
const translationsDict = {
  pt: {
    appTitle: "FocusFlow",
    logoSub: "Espaço Zen de Foco",
    soundTitle: "Sons de Fundo",
    soundBrown: "Ruído Marrom",
    soundPink: "Ruído Rosa",
    soundRain: "Chuva Suave",
    play: "Tocar",
    stop: "Pausar",
    statsTitle: "Estatísticas da Sessão",
    statWords: "Palavras",
    statWpm: "Velocidade",
    statWpmVal: "PPM",
    statGoals: "Metas Concluídas",
    statThoughts: "Pensamentos",
    persistenceLabel: "Salvar Sessão Local",
    clearBoard: "Limpar Tela",
    clearConfirm: "Apagar todos os pensamentos da sessão atual?",
    exportMarkdown: "Exportar Sessão (.md)",
    inputPlaceholder: "Escreva seu pensamento aqui. Solte e aperte Enter...",
    inputPlaceholderGoal: "Qual é a sua Meta principal agora? Digite para começar...",
    shortcutHint: "Atalhos: Esc Limpar",
    emptyTitle: "Defina sua Meta",
    emptyDesc: "Antes de entrar no fluxo, defina claramente qual é o seu objetivo para esta sessão. Seu Coach de IA irá te guiar.",
    emptyShortcuts: "Atalhos Rápidos de Teclado",
    emptyKey1: "Escrever e apertar Enter",
    emptyKey1Desc: "Envia o pensamento ou a meta instantaneamente",
    emptyKey3: "Limpar digitação atual",
    emptyKey3Desc: "Aperte Esc para limpar o campo de digitação",
    timerPomodoroDesc: "Pomodoro: Foco por 25 minutos com alarme.",
    timerFlowDesc: "Flow: Cronômetro livre para monitorar sua atividade.",
    pause: "Pausar",
    start: "Iniciar",
    reset: "Reiniciar",
    thoughtBadge: "Pensamento",
    goalBadge: "Meta",
    deleteTooltip: "Excluir",
    sidebarToggleOpen: "Configurações",
    sidebarToggleClose: "Fechar",
    themeToggleLight: "Tema Claro",
    themeToggleDark: "Tema Escuro",
    aiTitle: "Configuração do Coach IA",
    aiKeyPlaceholder: "Cole sua Gemini API Key...",
    aiKeyHelp: "Chave API grátis no Google AI Studio",
    aiBadge: "Coach IA",
    aiError: "Erro ao consultar o Gemini. Usando Coach local...",
    aiHelpNote: "Por padrão, o site usa o Coach local (grátis e sem configuração). Para um Coach inteligente, cole sua Gemini API Key acima.",
    goalMetBtn: "Meta Batida!",
    activeGoalLabel: "Meta Atual",
    coachTitle: "Coach IA",
    coachInputPlaceholder: "Converse com seu coach...",
    coachThinking: "Coach digitando...",
    coachSendBtn: "Enviar",
    coachGreetingText: "Olá! Vi que você definiu uma nova meta: '{goal}'. Como posso te ajudar a quebrar isso em passos menores para começarmos?"
  },
  en: {
    appTitle: "FocusFlow",
    logoSub: "Zen Focus Space",
    soundTitle: "Ambient Sounds",
    soundBrown: "Brown Noise",
    soundPink: "Pink Noise",
    soundRain: "Gentle Rain",
    play: "Play",
    stop: "Pause",
    statsTitle: "Session Stats",
    statWords: "Words",
    statWpm: "Speed",
    statWpmVal: "WPM",
    statGoals: "Goals Met",
    statThoughts: "Thoughts",
    persistenceLabel: "Save Session Locally",
    clearBoard: "Clear Canvas",
    clearConfirm: "Delete all thoughts in the current session?",
    exportMarkdown: "Export Session (.md)",
    inputPlaceholder: "Write your thought. Dump it and press Enter...",
    inputPlaceholderGoal: "What is your main Goal right now? Type to start...",
    shortcutHint: "Shortcuts: Esc Clear",
    emptyTitle: "Define your Goal",
    emptyDesc: "Before entering the flow, clearly define your objective for this session. Your AI Coach will guide you.",
    emptyShortcuts: "Quick Keyboard Shortcuts",
    emptyKey1: "Write and press Enter",
    emptyKey1Desc: "Logs your thought or goal instantly",
    emptyKey3: "Clear current typing",
    emptyKey3Desc: "Press Esc to clear the typing field",
    timerPomodoroDesc: "Pomodoro: 25 minutes of deep focus with chime.",
    timerFlowDesc: "Flow: Free-running stopwatch to track active session.",
    pause: "Pause",
    start: "Start",
    reset: "Reset",
    thoughtBadge: "Thought",
    goalBadge: "Goal",
    deleteTooltip: "Delete",
    sidebarToggleOpen: "Settings",
    sidebarToggleClose: "Close",
    themeToggleLight: "Light Theme",
    themeToggleDark: "Dark Theme",
    aiTitle: "AI Coach Config",
    aiKeyPlaceholder: "Paste your Gemini API Key...",
    aiKeyHelp: "Get a free API key at Google AI Studio",
    aiBadge: "AI Coach",
    aiError: "Error calling Gemini API. Falling back to local Coach...",
    aiHelpNote: "By default, the site uses the local Coach (free & zero-config). For a smart Coach, paste your Gemini API Key above.",
    goalMetBtn: "Goal Met!",
    activeGoalLabel: "Current Goal",
    coachTitle: "AI Coach",
    coachInputPlaceholder: "Chat with your coach...",
    coachThinking: "Coach is typing...",
    coachSendBtn: "Send",
    coachGreetingText: "Hi! I see you set a new goal: '{goal}'. How can I help you break this down into smaller steps to get started?"
  }
};

// Sleek Inline SVG Icons
const Icons = {
  Brain: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"></path>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"></path>
    </svg>
  ),
  SidebarOpen: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  SidebarClose: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-14m3 0V9a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  ),
  DeleteSmall: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  ThoughtIcon: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="22"></line>
    </svg>
  ),
  GoalIcon: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
};

export default function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('focusflow_lang') || 'pt';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('focusflow_theme') || 'dark';
  });
  
  const [saveSession, setSaveSession] = useState(() => {
    const saved = localStorage.getItem('focusflow_savesession');
    return saved === null ? true : saved === 'true';
  });

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Gemini API Key state
  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('focusflow_gemini_key') || '';
  });

  // State: Goals & Thoughts
  const [activeGoal, setActiveGoal] = useState(() => {
    if (localStorage.getItem('focusflow_savesession') === 'false') return null;
    const savedGoal = localStorage.getItem('focusflow_active_goal');
    return savedGoal ? JSON.parse(savedGoal) : null;
  });

  const [goalStartTime, setGoalStartTime] = useState(() => {
    if (localStorage.getItem('focusflow_savesession') === 'false') return null;
    const savedTime = localStorage.getItem('focusflow_goal_start_time');
    return savedTime ? parseInt(savedTime) : null;
  });

  const [thoughts, setThoughts] = useState(() => {
    if (localStorage.getItem('focusflow_savesession') === 'false') return [];
    try {
      const savedThoughts = localStorage.getItem('focusflow_thoughts');
      return savedThoughts ? JSON.parse(savedThoughts) : [];
    } catch (e) {
      return [];
    }
  });

  // State: AI Coach
  const [aiMessages, setAiMessages] = useState(() => {
    if (localStorage.getItem('focusflow_savesession') === 'false') return [];
    try {
      const savedMsgs = localStorage.getItem('focusflow_ai_messages');
      return savedMsgs ? JSON.parse(savedMsgs) : [];
    } catch (e) {
      return [];
    }
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [coachOpen, setCoachOpen] = useState(false);

  const [inputText, setInputText] = useState('');
  
  const [sessionStartTime] = useState(Date.now());
  const [wpm, setWpm] = useState(0);

  const textareaRef = useRef(null);
  const streamEndRef = useRef(null);
  const aiChatEndRef = useRef(null);

  const t = translationsDict[lang];

  useEffect(() => {
    localStorage.setItem('focusflow_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('focusflow_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('focusflow_savesession', String(saveSession));
    if (!saveSession) {
      localStorage.removeItem('focusflow_thoughts');
      localStorage.removeItem('focusflow_active_goal');
      localStorage.removeItem('focusflow_goal_start_time');
      localStorage.removeItem('focusflow_ai_messages');
    } else {
      localStorage.setItem('focusflow_thoughts', JSON.stringify(thoughts));
      localStorage.setItem('focusflow_ai_messages', JSON.stringify(aiMessages));
      if (activeGoal) {
        localStorage.setItem('focusflow_active_goal', JSON.stringify(activeGoal));
        localStorage.setItem('focusflow_goal_start_time', goalStartTime.toString());
      } else {
        localStorage.removeItem('focusflow_active_goal');
        localStorage.removeItem('focusflow_goal_start_time');
      }
    }
  }, [saveSession, thoughts, activeGoal, aiMessages, goalStartTime]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thoughts]);

  useEffect(() => {
    if (aiChatEndRef.current) {
      aiChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages]);

  // WPM Calculator
  useEffect(() => {
    const calculateWPM = () => {
      if (thoughts.length === 0) {
        setWpm(0);
        return;
      }
      
      const totalWords = thoughts.reduce((acc, curr) => {
        return acc + curr.text.trim().split(/s+/).filter(Boolean).length;
      }, 0);

      const elapsedMinutes = (Date.now() - sessionStartTime) / 1000 / 60;
      if (elapsedMinutes < 0.1) {
        setWpm(totalWords);
      } else {
        setWpm(Math.round(totalWords / elapsedMinutes));
      }
    };

    calculateWPM();
    const interval = setInterval(calculateWPM, 10000);
    return () => clearInterval(interval);
  }, [thoughts, sessionStartTime]);

  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setInputText('');
    }
  };

  const handleAiTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAiMessage();
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const now = Date.now();
    const timestampStr = new Date().toLocaleTimeString(lang === 'pt' ? 'pt-BR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    if (!activeGoal) {
      // Create new goal
      const newGoal = {
        id: now,
        text: inputText.trim(),
        timestamp: timestampStr,
        category: 'goal',
      };
      setActiveGoal(newGoal);
      setGoalStartTime(now);
      setThoughts(prev => [...prev, newGoal]);
      // Reset coach messages for new goal — AI will greet on first open
      setAiMessages([]);
      setCoachOpen(false);
    } else {
      // Create new thought
      const newThought = {
        id: now,
        text: inputText.trim(),
        timestamp: timestampStr,
        category: 'thought',
      };
      setThoughts(prev => [...prev, newThought]);
    }

    setInputText('');
    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.focus();
    }, 10);
  };

  const triggerAiGreeting = (goalText) => {
    const greeting = t.coachGreetingText.replace('{goal}', goalText);
    setAiMessages([{ id: Date.now(), text: greeting, sender: 'ai' }]);
  };

  // Opens Coach popup; sends greeting only on the very first open for this goal
  const handleCoachOpen = () => {
    const opening = !coachOpen;
    setCoachOpen(prev => !prev);
    if (opening && aiMessages.length === 0 && activeGoal) {
      triggerAiGreeting(activeGoal.text);
    }
  };

  const handleGoalMet = () => {
    const timestampStr = new Date().toLocaleTimeString(lang === 'pt' ? 'pt-BR' : 'en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    
    // Log the completion as a thought
    setThoughts(prev => [...prev, { 
      id: Date.now(), 
      text: `${activeGoal.text} (Concluído)`, 
      timestamp: timestampStr, 
      category: 'goal-met' 
    }]);

    setActiveGoal(null);
    setGoalStartTime(null);
    setAiMessages([]); // Reset AI context
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleDeleteThought = (id) => {
    setThoughts(prev => prev.filter(t => t.id !== id));
  };

  const handleClear = () => {
    if (window.confirm(t.clearConfirm)) {
      setThoughts([]);
      setActiveGoal(null);
      setGoalStartTime(null);
      setAiMessages([]);
      if (saveSession) {
        localStorage.removeItem('focusflow_thoughts');
        localStorage.removeItem('focusflow_active_goal');
        localStorage.removeItem('focusflow_goal_start_time');
        localStorage.removeItem('focusflow_ai_messages');
      }
    }
  };

  const handleExport = () => {
    const dateStr = new Date().toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US');
    let mdContent = `# FocusFlow Session - ${dateStr}nn`;
    
    mdContent += `## ${t.statsTitle}n`;
    mdContent += `- ${t.statWords}: ${getTotalWords()}n`;
    mdContent += `- ${t.statThoughts}: ${getCategoryCount('thought')}n`;
    mdContent += `- ${t.statGoals}: ${getCategoryCount('goal')}nn`;
    
    mdContent += `## Stream of Consciousnessnn`;
    
    thoughts.forEach((item) => {
      let catLabel = item.category.toUpperCase();
      if (lang === 'pt') {
        if (item.category === 'thought') catLabel = 'PENSAMENTO';
        if (item.category === 'goal') catLabel = 'META';
        if (item.category === 'goal-met') catLabel = 'META BATIDA';
      }
      mdContent += `[${item.timestamp}] [${catLabel}] ${item.text}nn`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `focusflow-session-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRecentThoughts = () => {
    if (!goalStartTime) return "";
    // Include all thoughts (not just category 'thought') since the goal was set
    const recent = thoughts.filter(t => t.id >= goalStartTime && t.category === 'thought');
    return recent.map(t => `[${t.timestamp}] ${t.text}`).join('\n');
  };

  const runLocalCoachFallback = (userText) => {
    setTimeout(() => {
      let response = "";
      const lowerText = userText.toLowerCase();
      if (lang === 'pt') {
        if (lowerText.includes("como") || lowerText.includes("ajuda") || lowerText.includes("dificil") || lowerText.includes("difícil")) {
          response = "Quebre essa meta em partes menores. Qual é a ação física mais simples que você pode fazer nos próximos 5 minutos?";
        } else {
          response = "Entendi. Mantenha o foco na sua meta principal. Se os pensamentos fugirem, jogue-os no bloco de notas ao lado e volte para a ação.";
        }
      } else {
        if (lowerText.includes("how") || lowerText.includes("help") || lowerText.includes("hard")) {
          response = "Break this goal down. What is the simplest physical action you can take in the next 5 minutes?";
        } else {
          response = "I hear you. Keep focusing on the main goal. If thoughts drift, dump them in the notepad and get back to action.";
        }
      }
      setAiMessages(prev => [...prev, { id: Date.now(), text: response, sender: 'ai' }]);
      setAiLoading(false);
    }, 1000);
  };

  const handleSendAiMessage = async () => {
    if (!aiInputText.trim() || !activeGoal) return;
    
    const userText = aiInputText.trim();
    const newUserMsg = { id: Date.now(), text: userText, sender: 'user' };
    setAiMessages(prev => [...prev, newUserMsg]);
    setAiInputText('');
    setAiLoading(true);

    if (!geminiKey.trim()) {
      runLocalCoachFallback(userText);
      return;
    }

    try {
      const recentThoughtsText = getRecentThoughts();
      const chatHistoryText = aiMessages
        .map(m => `${m.sender === 'user' ? 'Usuário' : 'Coach'}: ${m.text}`)
        .join('\n');
      
      const systemPrompt = `Você é o FocusFlow AI Coach — um coach de foco e produtividade pessoal.

## META ATUAL DO USUÁRIO
"${activeGoal.text}"
(Meta definida em: ${activeGoal.timestamp})

## ANOTAÇÕES DO USUÁRIO (registradas durante esta sessão de foco)
${recentThoughtsText || '(Nenhuma anotação feita ainda nesta sessão)'}

## HISTÓRICO DA NOSSA CONVERSA
${chatHistoryText || '(Início da conversa)'}

## NOVA MENSAGEM DO USUÁRIO
${userText}

## INSTRUÇÕES PARA RESPOSTA
- Leia TODA a meta e TODAS as anotações do usuário para dar uma resposta contextualizada
- Seja direto, empático e prático — ajude o usuário a dar o próximo passo concreto
- Se o usuário estiver travado, sugira a menor ação possível para destravar
- Se o usuário estiver divagando, traga-o de volta à meta com gentileza
- Máximo de 3 parágrafos curtos. Sem jargões. Sem listas longas.
- Responda em ${lang === 'pt' ? 'Português do Brasil' : 'English'}.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
          })
        }
      );

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      if (!data.candidates || data.candidates.length === 0) throw new Error("No candidates");

      const aiText = data.candidates[0].content.parts[0].text;
      setAiMessages(prev => [...prev, { id: Date.now(), text: aiText, sender: 'ai' }]);
      setAiLoading(false);
    } catch (e) {
      console.warn(e);
      setAiMessages(prev => [...prev, { id: Date.now(), text: t.aiError, sender: 'ai' }]);
      runLocalCoachFallback(userText);
    }
  };

  const getTotalWords = () => {
    return thoughts.reduce((acc, curr) => {
      return acc + curr.text.trim().split(/s+/).filter(Boolean).length;
    }, 0);
  };

  const getCategoryCount = (category) => {
    return thoughts.filter(t => t.category === category).length;
  };

  return (
    <div className="app-container">
      {/* Retractable Settings Overlay */}
      <div 
        className={`sidebar-overlay ${settingsOpen ? 'visible' : ''}`}
        onClick={() => setSettingsOpen(false)}
      ></div>

      {/* Settings Modal/Sidebar */}
      <aside className={`settings-sidebar ${settingsOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>{t.sidebarToggleOpen}</h3>
          <button onClick={() => setSettingsOpen(false)} className="btn-sidebar-close">
            <Icons.SidebarClose />
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">{t.soundTitle}</h3>
            <SoundController translations={t} />
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">{t.aiTitle}</h3>
            <div className="ai-key-input-container">
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value);
                  localStorage.setItem('focusflow_gemini_key', e.target.value);
                }}
                placeholder={t.aiKeyPlaceholder}
                className="ai-input"
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '6px', display: 'block' }}>
                {t.aiHelpNote}
              </span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">{t.statsTitle}</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-val">{getTotalWords()}</span>
                <span className="stat-label">{t.statWords}</span>
              </div>
              <div className="stat-card">
                <span className="stat-val">{wpm} <span style={{ fontSize: '0.6rem' }}>{t.statWpmVal}</span></span>
                <span className="stat-label">{t.statWpm}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section" style={{ marginTop: 'auto' }}>
            <div className={`persistence-toggle-container ${saveSession ? 'toggle-active' : ''}`} onClick={() => setSaveSession(!saveSession)}>
              <div className="toggle-switch"></div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.persistenceLabel}</span>
            </div>
            <div className="sidebar-actions" style={{ marginTop: '14px' }}>
              <button onClick={handleExport} className="btn-secondary" disabled={thoughts.length === 0}>
                <Icons.Download /> {t.exportMarkdown}
              </button>
              <button onClick={handleClear} className="btn-danger-outline" disabled={thoughts.length === 0}>
                <Icons.Trash /> {t.clearBoard}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Left side) */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <div className="logo">
              <Icons.Brain />
              <span>{t.appTitle}</span>
            </div>
          </div>
          <div className="header-right">
            <FocusTimer translations={t} />
            <div className="theme-switcher">
              <button onClick={() => setTheme('light')} className={`btn-theme ${theme === 'light' ? 'active' : ''}`}><Icons.Sun /></button>
              <button onClick={() => setTheme('dark')} className={`btn-theme ${theme === 'dark' ? 'active' : ''}`}><Icons.Moon /></button>
            </div>
            <div className="lang-switcher">
              <button onClick={() => setLang('pt')} className={`btn-lang ${lang === 'pt' ? 'active' : ''}`}>PT</button>
              <button onClick={() => setLang('en')} className={`btn-lang ${lang === 'en' ? 'active' : ''}`}>EN</button>
            </div>
            <button onClick={() => setSettingsOpen(true)} className="btn-sidebar-toggle">
              <Icons.SidebarOpen />
            </button>
          </div>
        </header>

        {/* Goal Banner */}
        {activeGoal && (
          <div className="active-goal-banner">
            <div className="goal-banner-content">
              <div className="goal-banner-icon"><Icons.GoalIcon /></div>
              <div className="goal-banner-text">
                <span className="goal-banner-label">{t.activeGoalLabel}</span>
                <span className="goal-banner-title">{activeGoal.text}</span>
              </div>
            </div>
            <button onClick={handleGoalMet} className="btn-goal-met">
              {t.goalMetBtn}
            </button>
          </div>
        )}

        {/* Thought Flow Stream */}
        <div className={`stream-container ${activeGoal ? 'has-goal' : ''}`}>
          {thoughts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Icons.GoalIcon /></div>
              <h2 className="empty-title">{t.emptyTitle}</h2>
              <p className="empty-desc">{t.emptyDesc}</p>
            </div>
          ) : (
            thoughts.map((item) => (
              <div className="thought-card-wrapper" key={item.id}>
                <div className={`thought-card ${item.category}`}>
                  <div className="thought-content-row">
                    <div className="thought-meta">
                      <span className="category-badge">
                        {item.category === 'thought' && <Icons.ThoughtIcon />}
                        {item.category === 'goal' && <Icons.GoalIcon />}
                        {item.category === 'goal-met' && <Icons.Sparkles />}
                        <span style={{ marginLeft: '4px' }}>
                          {item.category === 'thought' && t.thoughtBadge}
                          {item.category === 'goal' && t.goalBadge}
                          {item.category === 'goal-met' && t.goalMetBtn}
                        </span>
                      </span>
                      <span className="thought-time">{item.timestamp}</span>
                    </div>
                    <div className="thought-text">{item.text}</div>
                  </div>
                  <button onClick={() => handleDeleteThought(item.id)} className="btn-delete-thought">
                    <Icons.DeleteSmall />
                  </button>
                </div>
              </div>
            ))
          )}
          <div ref={streamEndRef} />
        </div>

        {/* Input Area + Coach Button */}
        <div className="input-area-container">
          {/* Coach Popup — anchored above input */}
          {coachOpen && activeGoal && (
            <div className="coach-popup">
              <div className="coach-popup-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icons.Sparkles />
                  <span>{t.coachTitle}</span>
                </div>
                <button className="btn-coach-close" onClick={() => setCoachOpen(false)}>
                  <Icons.SidebarClose />
                </button>
              </div>
              <div className="coach-chat-stream" ref={el => { if (el) el.scrollTop = el.scrollHeight; }}>
                {aiMessages.map(msg => (
                  <div key={msg.id} className={`coach-msg ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                {aiLoading && (
                  <div className="coach-msg ai loading">
                    <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                  </div>
                )}
                <div ref={aiChatEndRef} />
              </div>
              <div className="coach-input-area">
                <textarea
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  onKeyDown={handleAiTextareaKeyDown}
                  placeholder={t.coachInputPlaceholder}
                  disabled={aiLoading}
                  rows={1}
                />
                <button
                  onClick={handleSendAiMessage}
                  disabled={aiLoading || !aiInputText.trim()}
                  className="btn-send-coach"
                >
                  <Icons.Send />
                </button>
              </div>
            </div>
          )}

          <div className="input-row">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder={activeGoal ? t.inputPlaceholder : t.inputPlaceholderGoal}
              className={`thought-textarea ${!activeGoal ? 'pulse-goal' : ''}`}
              rows={1}
            />
            {activeGoal && (
              <button
                onClick={handleCoachOpen}
                className={`btn-coach-inline ${coachOpen ? 'open' : ''}`}
                title={t.coachTitle}
              >
                <Icons.Sparkles />
                {!coachOpen && aiMessages.filter(m => m.sender === 'ai').length > 0 && (
                  <span className="coach-badge">{aiMessages.filter(m => m.sender === 'ai').length}</span>
                )}
              </button>
            )}
            <button onClick={handleSend} className="btn-send">
              <Icons.Send />
            </button>
          </div>
          <div className="footer-settings">
            <span>{t.shortcutHint}</span>
          </div>
        </div>
      </main>


    </div>
  );
}
