// web-ui/src/stores/authStore.js
import create from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      masterPassword: '',
      encryptionKey: '',
      token: '',
      
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, masterPassword: password });
          set({
            isAuthenticated: true,
            user: response.data.user,
            masterPassword: password,
            encryptionKey: response.data.encryptionKey,
            token: response.data.token
          });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          masterPassword: '',
          encryptionKey: '',
          token: ''
        });
      },
      
      verify2FA: async (token) => {
        try {
          const response = await api.post('/auth/2fa/verify', { token });
          set({
            token: response.data.token,
            isAuthenticated: true
          });
          return true;
        } catch (error) {
          console.error('2FA verification failed:', error);
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      })
    }
  )
);

export { useAuthStore, AuthProvider };
