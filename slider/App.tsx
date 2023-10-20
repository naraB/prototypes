/* eslint-disable global-require */
import {useCallback} from 'react';
import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import {SoundSlider} from './src';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'SF-Mono-Bold': require('./src/fonts/SF-Mono-Bold.otf'),
    'SF-Mono-Medium': require('./src/fonts/SF-Mono-Medium.otf'),
    'SF-Mono-Regular': require('./src/fonts/SF-Mono-Regular.otf'),
    'SF-Mono-Semibold': require('./src/fonts/SF-Mono-Semibold.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={{flex: 1}} onLayout={onLayoutRootView}>
          <SoundSlider />
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
