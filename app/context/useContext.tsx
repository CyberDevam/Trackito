import React, { createContext, ReactNode, useContext, useState } from 'react';
import themes from '../Styles/TheStyle.style';
// Define Theme type
type ThemeType = {
  BUTTON_BG: string;
  BUTTON_TEXT: string;
};

// Define context data shape
type AppContextType = {
  user: string | null;
  setUser: (user: string | null) => void;
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  toggleTheme: () => void;
};

// Create context with placeholder defaults
const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => { },
  theme: { BUTTON_BG: '#FE8F33', BUTTON_TEXT: '#FFF3DB' },
  setTheme: () => { },
  toggleTheme: () => { },
});

// Provider component
const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeType>({
    BUTTON_BG: '#FE8F33',
    BUTTON_TEXT: '#FFF3DB',
  });

  const toggleTheme = () => {
    setTheme((prev) =>
      prev.BUTTON_BG === '#FE8F33'
        ? { BUTTON_BG: '#1E1E1E', BUTTON_TEXT: '#FFFFFF' } // dark mode
        : { BUTTON_BG: '#FE8F33', BUTTON_TEXT: '#FFF3DB' } // light mode
    );
    themes.authentication.BUTTON_BG = theme.BUTTON_BG;
    themes.authentication.BUTTON_TEXT = theme.BUTTON_TEXT;
  };

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
// Custom hook for easy use
export const useAppContext = () => useContext(AppContext);
