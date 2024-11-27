import type { BleError } from 'react-native-ble-plx';
import { BleManager } from 'react-native-ble-plx';

export interface DeviceRef {
  id?: string | null;
  name?: string | null;
}

/**
 * for the sake of simplicity, we are using global scope UUID for the color characteristic and service.
 * however, if you want to add the custom UUID, you should add the custom UUID to the function parameters.
 * or you can create a constant variable that store the custom UUID
 * example:
 * const DEVICE_CHARACTERISTICS = {
 *   COLOR_CHARACTERISTIC: '2A37',
 * }
 *
 * const DEVICE_SERVICES = {
 *   COLOR_SERVICE: '180D',
 * }
 */
const COLOR_CHARACTERISTIC_UUID = '2A37'; // Custom UUID for the color characteristic
const COLOR_SERVICE_UUID = '180D'; // Custom UUID for the color service

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

  async readSignalStrength(deviceId: string) {
    if (!this.device) {
      return 0;
    }

    const isConnected = await this.manager.isDeviceConnected(this.device.id!);
    if (isConnected) {
      const device = await this.manager.readRSSIForDevice(deviceId);
      return device.rssi!;
    }
    return 0;
  }

  destroy() {
    this.manager.destroy();
    this.device = null;
    BLEService.instance = null;
  }

  /**
   * Reads the color characteristic from a connected device.
   *
   * @param deviceId - The ID of the device from which to read the characteristic.
   * @returns A promise that resolves to a string representing the color value
   *          if available, or undefined if not.
   *
   * NOTE - this methods only accept deviceId because currently the app will only using
   * variable that previousely defined at the global scope.
   * @const COLOR_CHARACTERISTIC_UUID
   * @const COLOR_SERVICE_UUID
   *
   * Recomendations:
   * - if you want the extend the functionality, you should add the custom UUID to the
   * function parameters.
   */
  async readCharacteristic(deviceId: string) {
    const characteristic = await this.manager.readCharacteristicForDevice(
      deviceId,
      COLOR_SERVICE_UUID,
      COLOR_CHARACTERISTIC_UUID,
    );
    if (characteristic.value) {
      const color = atob(characteristic.value);
      return color;
    }
  }

  /**
   * Writes a color characteristic to a connected device.
   *
   * @param deviceId - The ID of the device to which to write the characteristic.
   * @param hexColor - The color value to write, in the format of a hexadecimal
   *                   string (e.g. '#FF0000' for red).
   * @returns A promise that resolves when the write operation completes.
   *
   * NOTE - this methods only accept deviceId and hexColor because currently the app
   * will only using variable that previousely defined at the global scope.
   * @const COLOR_CHARACTERISTIC_UUID
   * @const COLOR_SERVICE_UUID
   *
   * Recomendations:
   * - if you want the extend the functionality, you should add the custom UUID to the
   * function parameters
   */
  async writeCharacteristic(deviceId: string, hexColor: string) {
    const colorData = btoa(hexColor);
    await this.manager.writeCharacteristicWithResponseForDevice(
      deviceId,
      COLOR_SERVICE_UUID,
      COLOR_CHARACTERISTIC_UUID,
      colorData,
    );
  }

  /**
   * Subscribes to updates for a specific characteristic from a device.
   *
   * Adds a listener to be notified whenever the characteristic value changes.
   * The listener will be called with the updated value. This function initiates
   * monitoring of the characteristic and logs any error encountered during
   * monitoring.
   *
   * @param deviceId - The ID of the device to subscribe to.
   * @param onUpdate - A callback function that is invoked with the updated
   *                   characteristic value as a string.
   *
   * @returns A function that can be called to unsubscribe the listener and
   *          stop monitoring the characteristic.
   *
   * NOTE - this methods only accept deviceId and hexColor because currently the app
   * will only using variable that previousely defined at the global scope.
   * @const COLOR_CHARACTERISTIC_UUID
   * @const COLOR_SERVICE_UUID
   *
   * Recomendations:
   * - if you want the extend the functionality, you should add the custom UUID to the
   * function parameters
   */
  subscribeCharacteristic(
    deviceId: string,
    onUpdate: (value: string) => void,
    onError?: (error: BleError) => void,
  ) {
    // Add the listener to the Set
    this.listeners.add(onUpdate);
    const subscription = this.manager.monitorCharacteristicForDevice(
      deviceId,
      COLOR_SERVICE_UUID,
      COLOR_CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          return onError?.(error);
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
