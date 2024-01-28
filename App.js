import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import useBLE from './useBle'; // Import the useBLE hook

export default function App() {
  // const { getDataFromDevice } = useBLE(); // Use the useBLE hook

  const tankHeight = 400; // Height of the tank in pixels

  const [waterLevel, setWaterLevel] = useState(70); // Initial water level

  // useEffect(() => {
  //   const updateWaterLevel = () => {
  //     const newDataFromDevice = getDataFromDevice(); // Get data from the Bluetooth module

  //     // Assuming newDataFromDevice is a number representing the water level percentage
  //     if (!isNaN(newDataFromDevice) && newDataFromDevice >= 0 && newDataFromDevice <= 100) {
  //       setWaterLevel(newDataFromDevice);
  //     }
  //   };

  //   // Update water level on component mount and whenever the data from the device changes
  //   updateWaterLevel();
  //   const intervalId = setInterval(updateWaterLevel, 1000); // You can adjust the interval as needed

  //   // Cleanup on component unmount
  //   return () => clearInterval(intervalId);
  // }, [getDataFromDevice]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#073435', lineHeight: 60, textAlign: 'center' }}>
        Your Current Water Level
      </Text>
      <Svg height={tankHeight} width="100%" style={{ alignItems: 'center'}}>
        <Rect
          x="35%"
          rx="15"
          width="30%"
          height={tankHeight}
          fill="#3498db" // Color of the water
        />
        <Rect
          x='35%'
          rx="15"
          ry="15"
          width="30%"
          height={(1 - (waterLevel * 0.01)) * tankHeight}
          fill="#2ecc71" // Color of the tank
        />
      </Svg>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#27ae60', lineHeight: 30, textAlign: 'center' }}>
        Water Level: {waterLevel}%
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
