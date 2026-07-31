import { createContext, useEffect, useState } from "react";
import { getMe } from "./auth.api";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const restoreSession = async () => {
            setLoading(true);
            try {
                const data = await getMe();
                if (isMounted) {
                    setUser(data?.user ?? null);
                }
            } catch (error) {
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        restoreSession();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <authContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </authContext.Provider>
    );
};