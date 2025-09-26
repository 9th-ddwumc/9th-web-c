import { createContext, useContext, useState, type PropsWithChildren } from "react";

export enum THEME{
    LIGHT ='LIGHT',
    DARK ='DARK',
}
type ITheme = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
    theme:THEME;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext|undefined>(undefined);

export const ThemeProvider = ({children} : PropsWithChildren)=> {
    const [theme, setTheme] = useState<THEME>(THEME.LIGHT);
    const toggleTheme = () => {
        setTheme((prevTheme) => prevTheme ===THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
    }
    return(
        <ThemeContext.Provider value={{theme: theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if(!context){
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
