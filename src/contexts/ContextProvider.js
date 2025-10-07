import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#03C9D7');
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  // Roles: 'admin' | 'manager' | 'viewer'
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'admin');

  // Activity logs: { id, time, actorRole, action, meta }
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const raw = localStorage.getItem('activityLogs');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const persistLogs = useCallback((logs) => {
    try {
      localStorage.setItem('activityLogs', JSON.stringify(logs));
    } catch (_) {
      // ignore quota errors
    }
  }, []);

  const logActivity = useCallback((action, meta = {}) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: new Date().toISOString(),
      actorRole: role,
      action,
      meta,
    };
    setActivityLogs((prev) => {
      const next = [entry, ...prev].slice(0, 500);
      persistLogs(next);
      return next;
    });
  }, [persistLogs, role]);

  // Bind window event to log analytics visit (decoupled from components)
  useEffect(() => {
    const onAnalyticsVisit = () => logActivity('nav:visit', { page: 'analytics' });
    window.addEventListener('analytics-visit', onAnalyticsVisit);
    return () => window.removeEventListener('analytics-visit', onAnalyticsVisit);
  }, [logActivity]);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
    logActivity('theme:set-mode', { mode: e.target.value });
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
    logActivity('theme:set-color', { color });
  };

  const setAppRole = useCallback((nextRole) => {
    setRole(nextRole);
    localStorage.setItem('role', nextRole);
    logActivity('auth:set-role', { role: nextRole });
  }, [logActivity]);

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  const value = useMemo(() => ({
    currentColor,
    currentMode,
    activeMenu,
    screenSize,
    setScreenSize,
    handleClick,
    isClicked,
    initialState,
    setIsClicked,
    setActiveMenu,
    setCurrentColor,
    setCurrentMode,
    setMode,
    setColor,
    themeSettings,
    setThemeSettings,
    // new
    role,
    setAppRole,
    activityLogs,
    logActivity,
  }), [currentColor, currentMode, activeMenu, screenSize, isClicked, themeSettings, role, activityLogs, logActivity, setAppRole]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
