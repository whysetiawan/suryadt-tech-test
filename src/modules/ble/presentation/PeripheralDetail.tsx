import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { useBLEColor } from '#/modules/ble/application/useBLEColor';
import { useBLEService } from '#/modules/ble/application/useBLEService';
import Button from '#/shared/components/Button';
import SignalBars from '#/shared/components/SignalBars';
import BLEService from '#/shared/services/BLEService';
import { cn, getSignalBars } from '#/shared/utils';

const PeripheralDetail: React.FC = () => {
  // it'll be auto memoized by react-compiler
  const [service] = useBLEService();
  const { name } = useLocalSearchParams<{ id: string; name: string }>();
  const { color, askNewColor, resetColor } = useBLEColor(service ?? BLEService?.getInstance());
  const { id } = useLocalSearchParams<{ id: string; name: string }>();
  const [signalStrength, setSignalStrength] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      service?.readSignalStrength(id).then(setSignalStrength);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [id, service]);

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
        <View className="p-2 bg-white">
          <SignalBars bars={getSignalBars(signalStrength)} />
        </View>
        <Button size="small" onPress={askNewColor}>
          Ask a new Color
        </Button>
        <Button size="small" onPress={resetColor}>
          Reset Color
        </Button>

        <Text className="text-2xl">{color}</Text>
      </View>
    </>
  );
};

export default PeripheralDetail;
