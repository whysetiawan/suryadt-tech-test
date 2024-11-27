import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import { useBLEService } from '#/modules/ble/application/useBLEService';
import PeripheralListItem from '#/modules/ble/presentation/PeripheralListItem';
import type { DeviceRef } from '#/shared/services/BLEService';
const PeripheralList: React.FC = () => {
  const [devices, setDevices] = useState<Map<string, DeviceRef>>(new Map());
  const [service, requestBluetoothPermission] = useBLEService();

  useEffect(() => {
    requestBluetoothPermission();
  }, [requestBluetoothPermission]);

  useEffect(() => {
    service?.scanPeripherals((err, device) => {
      if (err) {
        console.error(err);
        return;
      }
      setDevices((prev) => {
        if (prev.has(device.id ?? '')) {
          return prev;
        }
        const newDevices = new Map(prev);
        newDevices.set(device.id ?? '', device);
        return newDevices;
      });
    });

    return () => {
      service?.stopPeripheralScan();
    };
  }, [service]);

  const scannedDevices = Array.from(devices.values());

  const _renderItem = ({ item }: { item: DeviceRef }) => {
    return <PeripheralListItem item={item} service={service} />;
  };

  return <FlatList data={scannedDevices} renderItem={_renderItem} />;
};

export default PeripheralList;
