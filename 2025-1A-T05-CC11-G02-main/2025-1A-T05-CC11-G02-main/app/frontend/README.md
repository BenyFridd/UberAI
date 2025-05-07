# Uber Eats Chat Assistant - Setup Guide
# Guia de Configuração - Assistente de Chat Uber Eats

## Prerequisites / Pré-requisitos

- Node.js (version 18 or higher / versão 18 ou superior)
- npm (version 8 or higher / versão 8 ou superior)
- Expo CLI
- iOS Simulator (Mac only) or Android Studio (for emulator)
- Expo Go app (for physical devices / para dispositivos físicos)

## Installation / Instalação

1. Install Expo CLI globally / Instale o Expo CLI globalmente:
```bash
npm install -g expo-cli
```

2. Create a new project / Crie um novo projeto:


```shellscript
npx create-expo-app@latest uber-eats-chat --template
cd uber-eats-chat
```

3. Install required dependencies / Instale as dependências necessárias:


```shellscript
npx expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/native-stack expo-image-picker expo-av expo-splash-screen @react-navigation/bottom-tabs expo-router expo-linking expo-constants expo-status-bar react-native-svg
```

4. Install development dependencies / Instale as dependências de desenvolvimento:


```shellscript
npm install --save-dev @babel/core @types/react @types/react-native typescript
```

5. Update babel.config.js / Atualize o babel.config.js:


```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', 'expo-router/babel'],
  };
};
```

6. Create project structure / Crie a estrutura do projeto:


```shellscript
mkdir -p app/(tabs)
mkdir -p components
mkdir -p assets/images
mkdir -p constants
mkdir -p data
mkdir -p hooks
```

## Running the App / Executando o Aplicativo

1. Start the development server / Inicie o servidor de desenvolvimento:


```shellscript
npx expo start
```

2. Running options / Opções de execução:

1. iOS Simulator (Mac only): Press `i` in terminal
2. Android Emulator: Press `a` in terminal
3. Physical Device / Dispositivo físico:

1. Install Expo Go app / Instale o aplicativo Expo Go
2. Scan QR code / Escaneie o código QR
3. Or open URL shown in terminal / Ou abra a URL mostrada no terminal








## Troubleshooting / Resolução de Problemas

If you encounter any issues / Se encontrar algum problema:

1. Clear Metro bundler cache / Limpe o cache do Metro bundler:


```shellscript
npx expo start --clear
```

2. Reinstall dependencies / Reinstale as dependências:


```shellscript
rm -rf node_modules
rm package-lock.json
npm install
```

3. Check for TypeScript errors / Verifique erros de TypeScript:


```shellscript
npx tsc --noEmit
```

## Common Issues / Problemas Comuns

1. Metro bundler not starting / Metro bundler não inicia:

1. Solution: Clear cache and restart / Solução: Limpe o cache e reinicie


```shellscript
npx expo start --clear
```


2. Dependencies conflicts / Conflitos de dependências:

1. Solution: Reinstall all dependencies / Solução: Reinstale todas as dependências


```shellscript
rm -rf node_modules
rm package-lock.json
npm install
```


3. TypeScript errors / Erros de TypeScript:

1. Solution: Check and fix type errors / Solução: Verifique e corrija erros de tipo


```shellscript
npx tsc --noEmit
```




## Additional Notes / Notas Adicionais

- Make sure your Node.js and npm versions are up to date / Certifique-se de que suas versões do Node.js e npm estão atualizadas
- For iOS development, Xcode is required / Para desenvolvimento iOS, Xcode é necessário
- For Android development, Android Studio and SDK are required / Para desenvolvimento Android, Android Studio e SDK são necessários
- The Expo Go app is required for testing on physical devices / O aplicativo Expo Go é necessário para testes em dispositivos físicos


## Support / Suporte

If you need help, you can:
Se precisar de ajuda, você pode:

1. Check Expo documentation / Consultar a documentação do Expo: [https://docs.expo.dev](https://docs.expo.dev)
2. Visit React Native documentation / Visitar a documentação do React Native: [https://reactnative.dev/docs](https://reactnative.dev/docs)
3. Join Expo Discord community / Participar da comunidade Discord do Expo: [https://chat.expo.dev](https://chat.expo.dev)
