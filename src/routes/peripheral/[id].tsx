import { StatusBar } from 'expo-status-bar';

import { useBLEColor } from '#/modules/ble/application/useBLEColor';
import PeripheralDetail from '#/modules/ble/presentation/PeripheralDetail';
import BLEService from '#/shared/services/BLEService';

const PeripheralDetailById = () => {
  // we don't need to destroy the BLEService here

  useBLEColor(BLEService.getInstance());

  return (
    <>
      <StatusBar translucent />

      <PeripheralDetail />
    </>
  );
};

export default PeripheralDetailById;
