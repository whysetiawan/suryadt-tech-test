import type { BleError } from 'react-native-ble-plx';
import { BleManager } from 'react-native-ble-plx';

export interface DeviceRef {
  id?: string | null;
  name?: string | null;
}

const colorCharacteristicUUID = '2A37'; // Custom UUID for the color characteristic
const colorServiceUUID = '180D'; // Custom UUID for the color service

class BLEService {
  static instance: BLEService | null = null;

  /**
   * Gets the single instance of the BLEService.
   *
   * This implementation of the singleton pattern ensures that only one
   * instance of the BLEService is created and that the same instance is
   * returned every time getInstance() is called.
   *
   * @returns The single instance of the BLEService.
   */
  static getInstance() {
    console.log('BLEService getInstance', BLEService.instance);
    if (!BLEService.instance) {
      BLEService.instance = new BLEService();
    }
    return BLEService.instance;
  }

  private manager: BleManager;
  device: DeviceRef | null = null;
  private listeners: Set<(value: string) => void> = new Set(); // Set to store listeners

  constructor() {
    this.manager = new BleManager();
    if (BLEService.instance) {
      return BLEService.instance;
    }

    BLEService.instance = this;
  }

  scanPeripherals(onDeviceFound: (err: BleError | null, device: DeviceRef) => void) {
    this.manager.startDeviceScan(null, null, (error, scannedDevice) =>
      onDeviceFound(error, {
        id: scannedDevice?.id,
        name: scannedDevice?.localName ?? scannedDevice?.name,
      }),
    );

    return () => this.manager.stopDeviceScan();
  }

  stopPeripheralScan() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(id: string) {
    const device = await this.manager.connectToDevice(id);
    await this.manager.discoverAllServicesAndCharacteristicsForDevice(device.id);
    this.device = {
      id: device.id,
      name: device?.localName ?? device?.name,
    };
    return device;
  }

  async disconnectFromDevice() {
    if (this.device) {
      await this.manager.cancelDeviceConnection(this.device.id!);
      this.device = null;
    }
  }

  destroy() {
    console.log('BLEService destroy');
    this.manager.destroy();
    this.device = null;
    BLEService.instance = null;
  }

  async readCharacteristic(deviceId: string) {
    const characteristic = await this.manager.readCharacteristicForDevice(
      deviceId,
      colorServiceUUID,
      colorCharacteristicUUID,
    );
    if (characteristic.value) {
      const color = atob(characteristic.value);
      return color;
    }
  }

  async writeCharacteristic(deviceId: string, hexColor: string) {
    const colorData = btoa(hexColor);
    await this.manager.writeCharacteristicWithResponseForDevice(
      deviceId,
      colorServiceUUID,
      colorCharacteristicUUID,
      colorData,
    );
  }

  subscribeCharacteristic(deviceId: string, onUpdate: (value: string) => void) {
    // Add the listener to the Set
    this.listeners.add(onUpdate);
    console.log('BLEService subscribeCharacteristic', deviceId);
    const subscription = this.manager.monitorCharacteristicForDevice(
      deviceId,
      colorServiceUUID,
      colorCharacteristicUUID,
      (error, characteristic) => {
        console.log('characteristic');
        if (error) {
          console.error('Error monitoring characteristic:', error.message);
          return;
        }
        if (characteristic?.value) {
          const color = atob(characteristic.value);
          console.log('Received updated color:', color);
          // Notify all listeners of the updated value
          this.notifyOnListener(color);
        }
      },
    );

    // Return an unsubscribe function to remove the listener and stop monitoring
    return () => {
      this.listeners.delete(onUpdate); // Remove the listener from the Set
      subscription.remove(); // Stop monitoring the characteristic
    };
  }

  private notifyOnListener(value: string) {
    this.listeners.forEach((listener) => listener(value));
  }
}

export default BLEService;
