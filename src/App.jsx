import React, { useState, useEffect, useRef } from 'react';
import SoundController from './components/SoundController';
import FocusTimer from './components/FocusTimer';

// Translation dictionaries
const translationsDict = {
  pt: {
    appTitle: "Destedeagar",
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
    coachGreetingText: "Hi! I see you set a new goal: '{goal}'. How can I help you break this down into smaller steps to get started?",
    modeThought: "Thought",
    modeReminder: "Reminder",
    unpinReminder: "Unpin"
  }
};

// Sleek Inline SVG Icons
const Icons = {
  Pin: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"></line>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 1 0-6 0v4.68a2 2 0 0 1-1.11 1.87l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
    </svg>
  ),
  Brain: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Ponto central de foco (Focus) */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor"></circle>
      {/* Fluxo fluido em espiral que se estabiliza no centro (representação do des-TDAH / Destedeagar) */}
      <path d="M12 2a10 10 0 0 0-7.07 17.07C7.8 21.9 12.2 21.9 15 19.5c2.5-2.2 3-6 1-8.5s-5-3-7-1-2.5 4.5 0 6.5 5 1.5 6.5-1c1.5-2.5 1-6.5-1-8.5" />
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
  ),
  ChevronUp: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  DotsHorizontal: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1.5"></circle>
      <circle cx="19" cy="12" r="1.5"></circle>
      <circle cx="5" cy="12" r="1.5"></circle>
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  BookOpen: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  ),
  Maximize: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    </svg>
  ),
  Minimize: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"></path>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
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
  const [inputMode, setInputMode] = useState('thought'); // 'thought' or 'reminder'
  const [remindersExpanded, setRemindersExpanded] = useState(false);

  // Estados da Barra Lateral e Multi-sessões de Metas
  const [sessions, setSessions] = useState(() => {
    if (localStorage.getItem('focusflow_savesession') === 'false') return [];
    try {
      const saved = localStorage.getItem('focusflow_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    if (localStorage.getItem('focusflow_savesession') === 'false') return null;
    return localStorage.getItem('focusflow_active_session_id') || null;
  });

  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('focusflow_sidebar_expanded');
    return saved === null ? true : saved === 'true';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [renameText, setRenameText] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState(null);
  
  // Discovery Workspace States
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [discoveryContent, setDiscoveryContent] = useState('');
  const [discoveryMode, setDiscoveryMode] = useState('edit'); // 'edit' or 'present'
  const [selectedImage, setSelectedImage] = useState(null);
  const [discoveryFullscreen, setDiscoveryFullscreen] = useState(false);

  const editorRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pointsRef = useRef([]); // Laser pointer trail points
  const pointerPosRef = useRef({ x: -100, y: -100 });

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
    localStorage.setItem('focusflow_sidebar_expanded', String(sidebarExpanded));
    if (!saveSession) {
      localStorage.removeItem('focusflow_thoughts');
      localStorage.removeItem('focusflow_active_goal');
      localStorage.removeItem('focusflow_goal_start_time');
      localStorage.removeItem('focusflow_ai_messages');
      localStorage.removeItem('focusflow_sessions');
      localStorage.removeItem('focusflow_active_session_id');
    } else {
      localStorage.setItem('focusflow_thoughts', JSON.stringify(thoughts));
      localStorage.setItem('focusflow_ai_messages', JSON.stringify(aiMessages));
      localStorage.setItem('focusflow_sessions', JSON.stringify(sessions));
      if (activeSessionId) {
        localStorage.setItem('focusflow_active_session_id', activeSessionId.toString());
      } else {
        localStorage.removeItem('focusflow_active_session_id');
      }
      if (activeGoal) {
        localStorage.setItem('focusflow_active_goal', JSON.stringify(activeGoal));
        localStorage.setItem('focusflow_goal_start_time', goalStartTime.toString());
      } else {
        localStorage.removeItem('focusflow_active_goal');
        localStorage.removeItem('focusflow_goal_start_time');
      }
    }
  }, [saveSession, thoughts, activeGoal, aiMessages, goalStartTime, sessions, activeSessionId, sidebarExpanded]);

  // Sincroniza as alterações do chat ativo de volta para a lista global de sessões
  useEffect(() => {
    if (!activeSessionId) return;
    setSessions(prev => prev.map(s => {
      if (s.id.toString() === activeSessionId.toString()) {
        return {
          ...s,
          text: activeGoal ? activeGoal.text : s.text,
          status: activeGoal ? (activeGoal.status || s.status) : s.status,
          thoughts: thoughts,
          aiMessages: aiMessages,
          goalStartTime: goalStartTime,
          discoveryContent: discoveryContent
        };
      }
      return s;
    }));
  }, [thoughts, activeGoal, aiMessages, goalStartTime, discoveryContent, activeSessionId]);

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

  // Alterna a meta ativa
  const handleSwitchSession = (sessionId) => {
    const target = sessions.find(s => s.id.toString() === sessionId.toString());
    if (target) {
      setActiveSessionId(sessionId.toString());
      setActiveGoal({
        id: target.id,
        text: target.text,
        timestamp: target.timestamp || '',
        category: 'goal',
        status: target.status || 'active'
      });
      setGoalStartTime(target.goalStartTime || target.id);
      setThoughts(target.thoughts || []);
      setAiMessages(target.aiMessages || []);
      setDiscoveryContent(target.discoveryContent || '');
      setDiscoveryOpen(false);
      setDiscoveryFullscreen(false);
      setCoachOpen(false);
    }
  };

  // Limpa a tela para cadastrar uma nova meta
  const handleCreateNewSession = () => {
    setActiveSessionId(null);
    setActiveGoal(null);
    setGoalStartTime(null);
    setThoughts([]);
    setAiMessages([]);
    setDiscoveryContent('');
    setDiscoveryOpen(false);
    setDiscoveryFullscreen(false);
    setCoachOpen(false);
  };

  // Renomeia o título de uma meta
  const handleRenameSession = (sessionId, newText) => {
    if (!newText.trim()) return;
    setSessions(prev => prev.map(s => {
      if (s.id.toString() === sessionId.toString()) {
        return { ...s, text: newText.trim() };
      }
      return s;
    }));
    
    if (activeSessionId?.toString() === sessionId.toString()) {
      setActiveGoal(prev => prev ? { ...prev, text: newText.trim() } : null);
    }
    setEditingSessionId(null);
    setRenameText('');
  };

  // Exclui uma meta permanentemente
  const handleDeleteSession = (sessionId) => {
    setSessionToDelete(sessionId);
    setActiveMenuId(null);
  };

  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;
    setSessions(prev => prev.filter(s => s.id.toString() !== sessionToDelete.toString()));
    if (activeSessionId?.toString() === sessionToDelete.toString()) {
      handleCreateNewSession();
    }
    setSessionToDelete(null);
  };

  // Fixa / desfixa uma meta
  const handleTogglePinSession = (sessionId) => {
    setSessions(prev => prev.map(s => {
      if (s.id.toString() === sessionId.toString()) {
        return { ...s, pinned: !s.pinned };
      }
      return s;
    }));
    setActiveMenuId(null);
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
        status: 'active'
      };
      
      const newSession = {
        id: now,
        text: inputText.trim(),
        timestamp: timestampStr,
        status: 'active',
        pinned: false,
        goalStartTime: now,
        thoughts: [newGoal],
        aiMessages: []
      };

      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(now.toString());
      setActiveGoal(newGoal);
      setGoalStartTime(now);
      setThoughts([newGoal]);
      setAiMessages([]);
      setCoachOpen(false);
    } else {
      // Create new thought or reminder
      const newEntry = {
        id: now,
        text: inputText.trim(),
        timestamp: timestampStr,
        category: inputMode,
      };
      setThoughts(prev => [...prev, newEntry]);
      setInputMode('thought'); // always reset to thought after sending
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

  const handleUnpin = (id) => {
    setThoughts(prev => prev.map(t => t.id === id ? { ...t, unpinned: true } : t));
  };

  const handleGoalMet = () => {
    const timestampStr = new Date().toLocaleTimeString(lang === 'pt' ? 'pt-BR' : 'en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    
    const metEntry = { 
      id: Date.now(), 
      text: `${activeGoal.text} (Concluído)`, 
      timestamp: timestampStr, 
      category: 'goal-met' 
    };

    if (activeSessionId) {
      setSessions(prev => prev.map(s => {
        if (s.id.toString() === activeSessionId.toString()) {
          return {
            ...s,
            status: 'completed',
            thoughts: [...thoughts, metEntry]
          };
        }
        return s;
      }));
    }

    setActiveGoal(null);
    setGoalStartTime(null);
    setThoughts([]);
    setAiMessages([]); // Reset AI context
    setDiscoveryContent('');
    setDiscoveryOpen(false);
    setDiscoveryFullscreen(false);
    setActiveSessionId(null);
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

  // Event listener global para fechar os menus de três pontinhos
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const renderSessionItem = (item) => {
    const isActive = activeSessionId?.toString() === item.id.toString();
    const isEditing = editingSessionId?.toString() === item.id.toString();

    return (
      <div 
        key={item.id} 
        className={`session-item-row ${isActive ? 'active' : ''}`}
        onClick={() => !isEditing && handleSwitchSession(item.id)}
      >
        <div className="session-item-main">
          <Icons.GoalIcon />
          
          {isEditing ? (
            <input
              type="text"
              className="session-rename-input"
              value={renameText}
              onChange={(e) => setRenameText(e.target.value)}
              onBlur={() => handleRenameSession(item.id, renameText)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSession(item.id, renameText);
                if (e.key === 'Escape') setEditingSessionId(null);
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="session-item-text" title={item.text}>
              {item.text}
            </span>
          )}
        </div>

        {!isEditing && (
          <div className="session-item-actions" onClick={(e) => e.stopPropagation()}>
            <button 
              className={`btn-session-action ${item.pinned ? 'pinned' : ''}`}
              onClick={() => handleTogglePinSession(item.id)}
              title={item.pinned ? (lang === 'pt' ? 'Desfixar' : 'Unpin') : (lang === 'pt' ? 'Fixar' : 'Pin')}
            >
              <Icons.Pin />
            </button>
            
            <div className="session-dropdown-container">
              <button 
                className="btn-session-action"
                onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
              >
                <Icons.DotsHorizontal />
              </button>

              {activeMenuId === item.id && (
                <div className="session-dropdown-menu">
                  <button onClick={() => {
                    setEditingSessionId(item.id);
                    setRenameText(item.text);
                    setActiveMenuId(null);
                  }}>
                    <Icons.Edit />
                    <span>{lang === 'pt' ? 'Renomear' : 'Rename'}</span>
                  </button>
                  <button onClick={() => handleTogglePinSession(item.id)}>
                    <Icons.Pin />
                    <span>{item.pinned ? (lang === 'pt' ? 'Desfixar' : 'Unpin') : (lang === 'pt' ? 'Fixar' : 'Pin')}</span>
                  </button>
                  <button className="danger" onClick={() => handleDeleteSession(item.id)}>
                    <Icons.Trash />
                    <span>{lang === 'pt' ? 'Excluir' : 'Delete'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Initialize editor content when workspace opens or session changes
  useEffect(() => {
    if (discoveryOpen && editorRef.current) {
      if (editorRef.current.innerHTML !== discoveryContent) {
        editorRef.current.innerHTML = discoveryContent || '';
      }
    }
  }, [discoveryOpen, activeSessionId]);

  // Laser pointer animation loop
  useEffect(() => {
    if (discoveryMode !== 'present' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const points = pointsRef.current;
      if (points.length > 1) {
        // Draw glow path
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.stroke();
        
        // Draw head spark
        const lastPoint = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 20;
        ctx.fill();
      }
      
      // Draw cursor pointer when hover (not drawing)
      if (!isDrawingRef.current && pointerPosRef.current.x > 0) {
        ctx.beginPath();
        ctx.arc(pointerPosRef.current.x, pointerPosRef.current.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.fill();
      }
      
      // Age trail
      pointsRef.current = points
        .map(p => ({ ...p, age: p.age + 1 }))
        .filter(p => p.age < 30);
        
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, [discoveryMode]);

  // Pointer Handlers for Laser
  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointsRef.current.push({ x, y, age: 0 });
    pointerPosRef.current = { x, y };
  };

  const handlePointerMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointerPosRef.current = { x, y };
    if (isDrawingRef.current) {
      pointsRef.current.push({ x, y, age: 0 });
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  // Image manipulation utilities
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const insertImage = (base64) => {
    const imgId = 'img-' + Date.now();
    const imgHtml = `<img id="${imgId}" src="${base64}" class="discovery-image" style="width: 50%; display: block; margin: 10px 0;" />`;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, imgHtml);
      setDiscoveryContent(editorRef.current.innerHTML);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (discoveryMode !== 'edit') return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Find caret position at drop point
        if (document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(e.clientX, e.clientY);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        } else if (document.caretPositionFromPoint) {
          const position = document.caretPositionFromPoint(e.clientX, e.clientY);
          const range = document.createRange();
          range.setStart(position.offsetNode, position.offset);
          range.collapse(true);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        const base64 = await compressImage(file);
        insertImage(base64);
      }
    }
  };

  const handleEditorClick = (e) => {
    if (discoveryMode !== 'edit') return;
    if (e.target.tagName === 'IMG') {
      setSelectedImage(e.target);
    } else {
      setSelectedImage(null);
    }
  };

  const resizeSelectedImage = (percent) => {
    if (selectedImage) {
      selectedImage.style.width = percent + '%';
      if (editorRef.current) {
        setDiscoveryContent(editorRef.current.innerHTML);
      }
    }
  };

  const deleteSelectedImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      setSelectedImage(null);
      if (editorRef.current) {
        setDiscoveryContent(editorRef.current.innerHTML);
      }
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* LEFT CHATS SIDEBAR */}
      <aside className={`chats-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Toggle Button */}
        <button 
          className="btn-sidebar-toggle-expand" 
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          title={sidebarExpanded ? (lang === 'pt' ? 'Recolher barra lateral' : 'Collapse sidebar') : (lang === 'pt' ? 'Expandir barra lateral' : 'Expand sidebar')}
        >
          {sidebarExpanded ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
        </button>

        {/* Collapsed Sidebar Vibe */}
        {!sidebarExpanded ? (
          <div className="sidebar-collapsed-content">
            <div className="sidebar-logo-icon" onClick={() => setSidebarExpanded(true)}>
              <Icons.Brain />
            </div>
            
            <button className="sidebar-icon-action" onClick={handleCreateNewSession} title={lang === 'pt' ? 'Nova meta' : 'New goal'}>
              <Icons.Plus />
            </button>
            <button className="sidebar-icon-action" onClick={() => { setSidebarExpanded(true); setTimeout(() => { const search = document.querySelector('.search-input-field'); if (search) search.focus(); }, 100); }} title={lang === 'pt' ? 'Buscar metas' : 'Search goals'}>
              <Icons.Search />
            </button>
            <button className="sidebar-icon-action" onClick={() => setSettingsOpen(true)} title={t.sidebarToggleOpen}>
              <Icons.SidebarOpen />
            </button>
          </div>
        ) : (
          /* Expanded Sidebar Vibe */
          <div className="sidebar-expanded-content">
            <div className="sidebar-header-row">
              <div className="logo-group">
                <Icons.Brain />
                <span className="logo-text">{t.appTitle}</span>
              </div>
            </div>

            <button className="btn-new-chat-pomo" onClick={handleCreateNewSession}>
              <Icons.Plus />
              <span>{lang === 'pt' ? 'Nova meta' : 'New goal'}</span>
            </button>

            <div className="search-chats-container">
              <Icons.Search />
              <input
                type="text"
                className="search-input-field"
                placeholder={lang === 'pt' ? 'Buscar metas...' : 'Search goals...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="btn-clear-search" onClick={() => setSearchQuery('')}>✖</button>
              )}
            </div>

            <div className="sidebar-scrollable-lists">
              {/* 1. SEÇÃO FIXADOS */}
              {filteredSessions.filter(s => s.pinned).length > 0 && (
                <div className="sidebar-section-list">
                  <h4 className="section-title">{lang === 'pt' ? 'Fixadas' : 'Pinned'}</h4>
                  <div className="section-items">
                    {filteredSessions.filter(s => s.pinned).map(renderSessionItem)}
                  </div>
                </div>
              )}

              {/* 2. SEÇÃO RECENTES (Ativas, não fixadas) */}
              <div className="sidebar-section-list">
                <h4 className="section-title">{lang === 'pt' ? 'Recentes' : 'Recent'}</h4>
                <div className="section-items">
                  {filteredSessions.filter(s => !s.pinned && s.status !== 'completed').length === 0 ? (
                    <div className="empty-section-text">{lang === 'pt' ? 'Nenhuma meta recente' : 'No recent goals'}</div>
                  ) : (
                    filteredSessions.filter(s => !s.pinned && s.status !== 'completed').map(renderSessionItem)
                  )}
                </div>
              </div>

              {/* 3. SEÇÃO METAS FINALIZADAS */}
              {filteredSessions.filter(s => s.status === 'completed').length > 0 && (
                <div className="sidebar-section-list">
                  <h4 className="section-title">{lang === 'pt' ? 'Metas Finalizadas' : 'Completed Goals'}</h4>
                  <div className="section-items">
                    {filteredSessions.filter(s => s.status === 'completed').map(renderSessionItem)}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Panel */}
            <div className="sidebar-bottom-panel">
              <div className="user-profile-row" onClick={() => setSettingsOpen(true)}>
                <div className="user-avatar">
                  {t.appTitle.substring(0, 2).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{t.appTitle}</span>
                  <span className="user-status">Zen Mode</span>
                </div>
                <Icons.SidebarOpen />
              </div>
            </div>
          </div>
        )}
      </aside>

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
            {!sidebarExpanded ? (
              <button 
                className="btn-sidebar-toggle-left" 
                onClick={() => setSidebarExpanded(true)}
                title={lang === 'pt' ? 'Abrir barra lateral' : 'Open sidebar'}
              >
                <Icons.Menu />
              </button>
            ) : null}
          </div>
          <div className="header-right">
            <FocusTimer 
              translations={t} 
              activeGoal={activeGoal}
              goalStartTime={goalStartTime}
              thoughts={thoughts}
            />
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

        {/* Discovery Workspace overlay */}
        {discoveryOpen && activeGoal && (
          <div className={`discovery-workspace ${discoveryFullscreen ? 'fullscreen' : ''}`}>
            <div className="discovery-header">
              <div className="discovery-meta">
                <span className="discovery-badge">{lang === 'pt' ? 'DESCOBRIR' : 'DISCOVER'}</span>
                <span className="discovery-goal-title">{activeGoal.text}</span>
              </div>
              <div className="discovery-controls">
                <div className="mode-toggle-group">
                  <button 
                    className={`btn-mode-toggle ${discoveryMode === 'edit' ? 'active' : ''}`}
                    onClick={() => { setDiscoveryMode('edit'); setSelectedImage(null); }}
                  >
                    {lang === 'pt' ? 'Edição' : 'Edit'}
                  </button>
                  <button 
                    className={`btn-mode-toggle ${discoveryMode === 'present' ? 'active' : ''}`}
                    onClick={() => { setDiscoveryMode('present'); setSelectedImage(null); }}
                  >
                    {lang === 'pt' ? 'Apresentação' : 'Present'}
                  </button>
                </div>
                <button 
                  className="btn-close-discovery" 
                  onClick={() => setDiscoveryFullscreen(!discoveryFullscreen)}
                  title={discoveryFullscreen ? (lang === 'pt' ? 'Sair da tela cheia' : 'Exit full screen') : (lang === 'pt' ? 'Tela cheia' : 'Full screen')}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {discoveryFullscreen ? <Icons.Minimize /> : <Icons.Maximize />}
                </button>
                <button className="btn-close-discovery" onClick={() => { setDiscoveryOpen(false); setDiscoveryFullscreen(false); setSelectedImage(null); }}>
                  <Icons.SidebarClose />
                </button>
              </div>
            </div>

            <div className="discovery-toolbar">
              {discoveryMode === 'edit' ? (
                <>
                  <div className="toolbar-group">
                    <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold', false, null); }} title="Negrito"><b>B</b></button>
                    <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic', false, null); }} title="Itálico"><i>I</i></button>
                    <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline', false, null); }} title="Sublinhado"><u>U</u></button>
                  </div>
                  <div className="toolbar-group">
                    <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertUnorderedList', false, null); }} title="Lista com Marcadores">• Lista</button>
                    <button className="toolbar-btn" onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertOrderedList', false, null); }} title="Lista Numerada">1. Lista</button>
                  </div>
                  <div className="toolbar-group">
                    <label className="toolbar-btn image-upload-label" title="Inserir Imagem">
                      🖼️ {lang === 'pt' ? 'Imagem' : 'Image'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await compressImage(file);
                            insertImage(base64);
                          }
                          e.target.value = ''; // Reset input
                        }} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>
                  {selectedImage && (
                    <div className="toolbar-group image-controls-group">
                      <span className="control-label">{lang === 'pt' ? 'Tamanho:' : 'Size:'}</span>
                      <button className="toolbar-btn" onClick={() => resizeSelectedImage(25)}>25%</button>
                      <button className="toolbar-btn" onClick={() => resizeSelectedImage(50)}>50%</button>
                      <button className="toolbar-btn" onClick={() => resizeSelectedImage(75)}>75%</button>
                      <button className="toolbar-btn" onClick={() => resizeSelectedImage(100)}>100%</button>
                      <button className="toolbar-btn danger" onClick={deleteSelectedImage}>{lang === 'pt' ? 'Remover' : 'Remove'}</button>
                    </div>
                  )}
                  <div className="toolbar-group" style={{ marginLeft: 'auto' }}>
                    <button className="toolbar-btn danger" onClick={() => { if (window.confirm(lang === 'pt' ? 'Limpar todas as anotações?' : 'Clear all annotations?')) { setDiscoveryContent(''); if (editorRef.current) editorRef.current.innerHTML = ''; } }}>
                      🗑️ {lang === 'pt' ? 'Limpar' : 'Clear'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="presentation-hint">
                  💡 {lang === 'pt' ? 'Modo Apresentação: clique e arraste para destacar com rastro laser vermelho.' : 'Presentation Mode: click and drag to highlight with laser pointer.'}
                </div>
              )}
            </div>

            <div className="discovery-body">
              <div className="discovery-paper-container">
                <div 
                  ref={editorRef}
                  className="discovery-paper"
                  contentEditable={discoveryMode === 'edit'}
                  onInput={(e) => setDiscoveryContent(e.currentTarget.innerHTML)}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={handleEditorClick}
                  placeholder={lang === 'pt' ? 'Escreva suas anotações aqui. Arraste imagens para soltar direto na folha...' : 'Write your notes here. Drag and drop images directly onto the paper...'}
                />
                
                {discoveryMode === 'present' && (
                  <canvas 
                    ref={canvasRef}
                    className="presentation-canvas"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                  />
                )}
              </div>
            </div>
          </div>
        )}

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

        {/* Pinned Reminders */}
        {activeGoal && thoughts.filter(t => t.category === 'reminder' && !t.unpinned).length > 0 && (
          <div className="pinned-reminders-container">
            {(() => {
              const activeReminders = thoughts.filter(t => t.category === 'reminder' && !t.unpinned);
              const visibleReminders = (remindersExpanded || activeReminders.length === 1) 
                ? activeReminders 
                : [activeReminders[activeReminders.length - 1]];

              return (
                <>
                  {visibleReminders.map(rem => (
                    <div key={rem.id} className="pinned-reminder-card">
                      <div className="pinned-reminder-content">
                        <Icons.Pin />
                        <span>{rem.text}</span>
                      </div>
                      <button onClick={() => handleUnpin(rem.id)} className="btn-unpin">
                        <Icons.SidebarClose /> {lang === 'pt' ? 'Desfixar' : t.unpinReminder}
                      </button>
                    </div>
                  ))}
                  {activeReminders.length > 1 && (
                    <button 
                      className="btn-expand-reminders" 
                      onClick={() => setRemindersExpanded(!remindersExpanded)}
                    >
                      {remindersExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                      <span>{remindersExpanded ? (lang === 'pt' ? 'Esconder lembretes' : 'Hide reminders') : (lang === 'pt' ? `Ver todos os ${activeReminders.length} lembretes` : `View all ${activeReminders.length} reminders`)}</span>
                    </button>
                  )}
                </>
              );
            })()}
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
                        {item.category === 'reminder' && <Icons.Pin />}
                        <span style={{ marginLeft: '4px' }}>
                          {item.category === 'thought' && t.thoughtBadge}
                          {item.category === 'goal' && t.goalBadge}
                          {item.category === 'goal-met' && t.goalMetBtn}
                          {item.category === 'reminder' && (lang === 'pt' ? 'Lembrete' : t.modeReminder)}
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

          <div className="input-row-wrapper">
            {activeGoal && (
              <div className="input-mode-tabs">
                <button 
                  className={`mode-tab ${inputMode === 'thought' ? 'active' : ''}`}
                  onClick={() => setInputMode('thought')}
                >
                  <Icons.ThoughtIcon /> {lang === 'pt' ? 'Pensamento' : t.modeThought}
                </button>
                <button 
                  className={`mode-tab ${inputMode === 'reminder' ? 'active' : ''}`}
                  onClick={() => setInputMode('reminder')}
                >
                  <Icons.Pin /> {lang === 'pt' ? 'Lembrete' : t.modeReminder}
                </button>
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
              <>
                <button
                  onClick={() => { setDiscoveryOpen(!discoveryOpen); setSelectedImage(null); }}
                  className={`btn-discovery-inline ${discoveryOpen ? 'open' : ''}`}
                  title={lang === 'pt' ? 'Descobrir' : 'Discover'}
                  style={{ marginRight: '8px' }}
                >
                  <Icons.BookOpen />
                </button>
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
              </>
            )}
            <button onClick={handleSend} className="btn-send">
              <Icons.Send />
            </button>
            </div>
          </div>
          <div className="footer-settings">
            <span>{t.shortcutHint}</span>
          </div>
        </div>
      </main>


      {sessionToDelete && (
        <div className="pomodoro-overlay-backdrop">
          <div className="pomodoro-modal-card">
            <div className="modal-content-stage">
              <div className="modal-icon">⚠️</div>
              <h2>{lang === 'pt' ? 'Excluir Meta?' : 'Delete Goal?'}</h2>
              <p className="modal-desc">
                {lang === 'pt' 
                  ? 'Tem certeza que deseja excluir esta meta permanentemente? Esta ação não pode ser desfeita.' 
                  : 'Are you sure you want to delete this goal permanently? This action cannot be undone.'}
              </p>
              <div className="modal-actions">
                <button className="btn-modal-danger" onClick={confirmDeleteSession}>
                  {lang === 'pt' ? 'Sim, Excluir' : 'Yes, Delete'}
                </button>
                <button className="btn-modal-secondary" onClick={() => setSessionToDelete(null)}>
                  {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
