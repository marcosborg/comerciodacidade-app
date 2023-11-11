import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pt.comerciodacidade.app',
  appName: 'Comércio da Cidade',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
