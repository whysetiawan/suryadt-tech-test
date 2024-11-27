import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { BleErrorCode, type BleError } from 'react-native-ble-plx';

import type BLEService from '#/shared/services/BLEService';

const DEFAULT = '#ffffff';

export const useBLEColor = (service: BLEService) => {
  const [color, setColor] = useState('');

  const askNewColor = async () => {
    try {
      const color = await service.readCharacteristic(service.device?.id!);
      setColor(color ?? DEFAULT);
    } catch (error) {
      // console.log('ERROR', error.message);
      Alert.alert('ERROR', (error as BleError).message);
    }
  };

  const resetColor = async () => {
    try {
      await service.writeCharacteristic(service.device?.id!, DEFAULT);
      setColor(DEFAULT);
    } catch (error) {
      Alert.alert('ERROR', (error as BleError).message);
    }
  };

  useEffect(() => {
    const unsub = service.subscribeCharacteristic(service.device?.id!, setColor, (error) => {
      if (error.errorCode !== BleErrorCode.OperationCancelled) {
        Alert.alert('ERROR', (error as BleError).message);
      }
    });

    return () => {
      unsub();
    };
  }, [service]);
  const subscribeColor = () => {
    return;
  };

  return {
    color,
    askNewColor,
    resetColor,
    setColor,
    subscribeColor,
  };
};
