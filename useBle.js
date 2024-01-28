import { useMemo, useState } from "react";
import { Platform } from "react-native";
import { BleError, BleManager } from "react-native-ble-plx";
// import * as ExpoDevice from "expo-device";
import base64 from "react-native-base64";

const YOUR_DEVICE_UUID = "00001101-0000-1000-8000-00805F9B34FB";
const YOUR_CHARACTERISTIC_UUID = "00001101-0000-1000-8000-00805F9B34FB";

function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [dataFromDevice, setDataFromDevice] = useState("");

  const requestPermissions = async () => {
    try {
      if (Platform.OS === "web") {
        // Check if the browser supports Bluetooth API
        if (!navigator.bluetooth) {
          throw new Error("Bluetooth not supported in this browser.");
        }

        // Request Bluetooth permission using the Web Bluetooth API
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
        });

        // You may need additional steps based on your Bluetooth device

        return true; // Return a boolean indicating whether the permissions were granted
      } else {
        // Add your own logic for requesting permissions based on your device and platform
        return true; // Return a boolean indicating whether the permissions were granted
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  };

  const isDuplicateDevice = (devices, nextDevice) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device) {
        setAllDevices((prevState) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setDataFromDevice("");
    }
  };

  const onDataUpdate = (error, characteristic) => {
    if (error) {
      console.log(error);
    } else if (characteristic?.value) {
      const rawData = base64.decode(characteristic.value);
      setDataFromDevice(rawData);
    }
  };

  const startStreamingData = async (device) => {
    if (device) {
      device.monitorCharacteristicForService(
        YOUR_DEVICE_UUID,
        YOUR_CHARACTERISTIC_UUID,
        onDataUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  // Function to retrieve the data from the Bluetooth module
  const getDataFromDevice = () => dataFromDevice;

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    getDataFromDevice,
  };
}

export default useBLE;
