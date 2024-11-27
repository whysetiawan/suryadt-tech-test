import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import type { DeviceRef } from '#/shared/services/BLEService';
import type BLEService from '#/shared/services/BLEService';

const PeripheralListItem: React.FC<{ item: DeviceRef; service: BLEService | null }> = ({
  item,
  service,
}) => {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      setIsConnecting(true);
      await service?.connectToDevice(item.id!);
      router.navigate({
        pathname: `/peripheral/[id]`,
        params: { id: item.id!, name: item.name! },
      });
      setIsConnected(true);
    } catch (error) {
      Alert.alert('ERROR', error as any);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Pressable
      onPress={connect}
      className="p-5 border-b border-gray-200 bg-white flex-row justify-between items-center">
      <View>
        <Text className="text-lg font-bold">{item.name ?? 'Unknown'}</Text>
        <Text className="text-lg">{item.id}</Text>
      </View>

      <View className="flex-row items-center gap-x-2">
        {isConnected && <Text className="text-xs">Connected</Text>}
        {isConnecting ? (
          <ActivityIndicator size="small" />
        ) : (
          <MaterialIcons name="chevron-right" size={24} />
        )}
      </View>
    </Pressable>
  );
};

export default PeripheralListItem;
