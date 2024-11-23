import { useRef, useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import PeripheralListItem from '#/modules/ble/presentation/PeripheralListItem';
import type { DeviceRef } from '#/shared/services/BLEService';
import BLEService from '#/shared/services/BLEService';

const PeripheralList: React.FC = () => {
  const [devices, setDevices] = useState<Map<string, DeviceRef>>(new Map());
  const serviceRef = useRef<BLEService>(BLEService.getInstance());

  useEffect(() => {
    const ref = serviceRef.current;
    return () => {
      ref.destroy();
    };
  }, []);

  useEffect(() => {
    serviceRef.current?.scanPeripherals((err, device) => {
      if (err) {
        console.error(err);
        return;
      }
      setDevices((prev) => {
        const newDevices = new Map(prev);
        newDevices.set(device.id ?? '', device);
        return newDevices;
      });
    });
  }, []);

  const scannedDevices = Array.from(devices.values());

  const _renderItem = ({ item }: { item: DeviceRef }) => {
    return <PeripheralListItem item={item} service={serviceRef.current} />;
  };

  return <FlatList data={scannedDevices} renderItem={_renderItem} />;
};

export default PeripheralList;
