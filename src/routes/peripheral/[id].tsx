import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

import BLEService from '#/shared/services/BLEService';
import { cn } from '#/shared/utils';

const DEFAULT = '#ffffff';

const PeripheralDetailById = () => {
  // we don't need to destroy the BLEService here
  const serviceRef = useRef<BLEService>(BLEService.getInstance());
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [color, setColor] = useState<string>(DEFAULT);

  const navigation = useNavigation();
  useEffect(() => {
    const ref = serviceRef.current;

    return () => {
      ref.disconnectFromDevice();
    };
  }, [name, navigation]);

  useEffect(() => {
    const unsub = serviceRef.current.subscribeCharacteristic(id, setColor);

    return () => {
      unsub();
    };
  }, [id]);

  const readColor = async () => {
    const color = await serviceRef.current.readCharacteristic(id);
    setColor(color ?? DEFAULT);
  };

  const resetColor = async () => {
    await serviceRef.current.writeCharacteristic(id, DEFAULT);
    setColor(DEFAULT);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: color,
          },
        }}
      />
      <View
        className={cn('flex-1 items-center justify-center gap-y-3')}
        style={{
          backgroundColor: color,
        }}>
        <StatusBar backgroundColor={color} />
        <Button title="Read Color" onPress={readColor} />
        <Button title="Reset" onPress={resetColor} />

        <Text className="text-2xl">{color}</Text>
      </View>
    </>
  );
};

export default PeripheralDetailById;
