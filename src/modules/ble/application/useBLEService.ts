import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import BLEService from '#/shared/services/BLEService';

export const useBLEService = () => {
  const service = BLEService.getInstance();
  const [isGranted, setIsGranted] = useState(false);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
      return setIsGranted(true);
    }
    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31 && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return setIsGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        const granted =
          result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED;

        return setIsGranted(granted);
      }
    }

    return setIsGranted(false);
  };

  return [!isGranted ? null : service, requestBluetoothPermission] as const;
};
