import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.remixts.app',
  appName: 'capacitor-template-remix-ts',
  webDir: 'public/build',
  bundledWebRuntime: false,
  server: {
    url: "http://10.0.2.2:3000",
    cleartext: true
  }
};

export default config;
