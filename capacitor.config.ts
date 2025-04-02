
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9f338c6d42e34167814cf0bf561c213b',
  appName: 'closet-cost-tracker-pro',
  webDir: 'dist',
  bundledWebRuntime: false,
  // Enable hot-reload for development
  server: {
    url: "https://9f338c6d-42e3-4167-814c-f0bf561c213b.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
};

export default config;
