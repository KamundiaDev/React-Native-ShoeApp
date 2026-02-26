import React, { createContext, useContext, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: any;
  token: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://192.168.100.101:8000/api';
const TOKEN_KEY = 'APP_AUTH_TOKEN';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: 'YOUR_EXPO_CLIENT_ID',
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
    });
    console.log(AuthSession.makeRedirectUri());
    const loginWithGoogle = async () => {
        const result = await promptAsync();

        if (result.type !== 'success') return;

        const idToken = result.authentication?.idToken;

        if (!idToken) return;

        // Send Google ID token to backend
        const res = await fetch(`${API_BASE}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
            });

            const data = await res.json();

            setUser(data.user);
            setToken(data.token);

            await AsyncStorage.setItem(TOKEN_KEY, data.token);
        }

        const logout = async () => {
            setUser(null);
            setToken(null);
            await AsyncStorage.removeItem(TOKEN_KEY);
        };
        
         return (
            <AuthContext.Provider
            value={{
                user,
                token,
                loginWithGoogle,
                logout,
            }}
            >
            {children}
            </AuthContext.Provider>
        );       
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}