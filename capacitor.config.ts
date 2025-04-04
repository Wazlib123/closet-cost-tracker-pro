
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
  plugins: {
    // Add any plugin configuration if needed
  },
  ios: {
    // Tell Capacitor to use modern Swift-style imports rather than Obj-C style
    contentInset: "always",
    // This will help with status bar issues
    backgroundColor: "#ffffff",
    // Ensure status bar is properly handled
    statusBarStyle: "dark",
    // Add this to avoid header import issues
    scheme: "App",
    // Add build settings to fix header import issues
    buildSettings: {
      CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES: "YES",
      HEADER_SEARCH_PATHS: "$(inherited) ${PODS_ROOT}/CapacitorCordova"
    }
  }
};

export default config;
