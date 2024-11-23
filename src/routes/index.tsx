import { StatusBar } from 'expo-status-bar';
import { cssInterop } from 'nativewind';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PeripheralList from '#/modules/ble/presentation/PeripheralList';

cssInterop(SafeAreaView, {
  className: {
    target: 'style',
  },
});

const Index = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      <View className="flex-1 gap-y-4">
        <Text className="text-2xl font-bold text-center py-4">BLE Central - React Native</Text>
        <PeripheralList />
      </View>
    </SafeAreaView>
  );
};

export default Index;
