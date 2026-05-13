/**
 * App Context
 * =============
 *
 * Global application context for shared state across components.
 * Currently handles:
 * - Authentication state
 * - App-wide configuration
 *
 * This context is designed to be extended as the app grows.
 * Add new global state here instead of prop drilling through components.
 *
 * Usage:
 *   // In a component
 *   import { useAppContext } from '@/client/context';
 *   const { user, token, setAuth, clearAuth } = useAppContext();
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
    const [authState, setAuthState] = useState(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        return {
            user: savedUser ? JSON.parse(savedUser) : null,
            token: savedToken,
        };
    });

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
            // Auth
            user: authState.user,
            token: authState.token,
            setAuth,
            clearAuth,

            // App config
            appName: "Simple Vite React Express",
            version: "2.1.0",
        }),
        [authState.user, authState.token, setAuth, clearAuth]
    );

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;
