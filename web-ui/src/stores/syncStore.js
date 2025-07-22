// web-ui/src/stores/syncStore.js
import create from 'zustand';
import api from '../services/api';
import { decrypt } from '../utils/crypto';

const useSyncStore = create((set, get) => ({
  credentials: [],
  otps: [],
  lastSync: null,
  ws: null,
  
  setCredentials: (credentials) => set({ credentials }),
  setOtps: (otps) => set({ otps }),
  setLastSync: (lastSync) => set({ lastSync }),
  
  syncAllData: async () => {
    const { masterPassword, encryptionKey } = useAuthStore.getState();
    try {
      const response = await api.get('/sync');
      const decrypted = response.data.credentials.map(cred => ({
        ...cred,
        username: decrypt(cred.username, encryptionKey),
        password: decrypt(cred.password, encryptionKey),
        notes: cred.notes ? decrypt(cred.notes, encryptionKey) : null
      }));
      
      set({
        credentials: decrypted,
        otps: response.data.otps,
        lastSync: new Date()
      });
      
      return { credentials: decrypted, otps: response.data.otps };
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  },
  
  initWebSocket: (token) => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
    
    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      const { encryptionKey } = useAuthStore.getState();
      
      if (type === 'CREDENTIAL_UPDATE') {
        const decrypted = data.map(cred => ({
          ...cred,
          username: decrypt(cred.username, encryptionKey),
          password: decrypt(cred.password, encryptionKey),
          notes: cred.notes ? decrypt(cred.notes, encryptionKey) : null
        }));
        set({ credentials: decrypted });
      } else if (type === 'OTP_UPDATE') {
        set({ otps: data });
      }
    };
    
    set({ ws });
    return ws;
  }
}));

export { useSyncStore, SyncProvider };
