/**
 * App Context
 * =============
 *
 * Global application context for shared state across components.
 * Currently handles:
 * - Theme mode (light/dark) - prepared for future dark mode support
 * - App-wide configuration
 *
 * This context is designed to be extended as the app grows.
 * Add new global state here instead of prop drilling through components.
 *
 * Usage:
 *   // In a component
 *   import { useAppContext } from '@/client/context';
 *   const { isDarkMode, toggleTheme } = useAppContext();
 *
 *   // Wrap app with provider (already done in index.jsx)
 *   <AppProvider>
 *     <App />
 *   </AppProvider>
 */

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { logout } from "../services/auth";
/**
 * Default context values
 * @type {Object}
 */
const defaultContextValue = {
    // Theme
    isDarkMode: false,
    toggleTheme: () => { },

    // Auth
    user: null,
    token: null,
    setAuth: () => { },
    clearAuth: () => { },

    // App config
    appName: "Simple Vite React Express",
    version: "2.1.0",
};

/**
 * Create the context with default values
 */
const AppContext = createContext(defaultContextValue);

/**
 * Custom hook to use the app context
 * Throws an error if used outside of AppProvider
 * @returns {Object} App context value
 */
export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}

/**
 * App Provider Component
 * Wraps the application and provides global state
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 */
export function AppProvider({ children }) {
    // Theme state - can be extended to persist in localStorage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check for saved preference in localStorage
        const saved = localStorage.getItem("theme");
        if (saved) {
            return saved === "dark";
        }
        // Check system preference
        return window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
    });

    const [authState, setAuthState] = useState(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        return {
            user: savedUser ? JSON.parse(savedUser) : null,
            token: savedToken,
        };
    });

    /**
     * Toggle between light and dark theme
     * Persists preference to localStorage
     */
    const toggleTheme = useCallback(() => {
        setIsDarkMode((prev) => {
            const newValue = !prev;
            localStorage.setItem("theme", newValue ? "dark" : "light");
            return newValue;
        });
    }, []);

    /**
     * Set a specific theme mode
     * @param {boolean} dark - Whether to enable dark mode
     */
    const setTheme = useCallback((dark) => {
        setIsDarkMode(dark);
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, []);

    const setAuth = useCallback((user, token) => {
        setAuthState({ user, token });

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }

        if (token) {
            localStorage.setItem("token", token);
        }
    }, []);

    const clearAuth = useCallback(() => {
        setAuthState({ user: null, token: null });
        logout(); // xóa localStorage
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            // Theme
            isDarkMode,
            toggleTheme,
            setTheme,

            // Auth
            user: authState.user,
            token: authState.token,
            setAuth,
            clearAuth,

            // App config
            appName: "Simple Vite React Express",
            version: "2.1.0",
        }),
        [authState.user, authState.token, isDarkMode, toggleTheme, setTheme, setAuth, clearAuth]
    );

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;
