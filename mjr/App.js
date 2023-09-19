import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import { useState } from 'react';
const bkImage = require('./assets/mj.jpg');
export default function App() {
  const [showAppOptions, setShowAppOptions] =  useState(false);
  return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer placeholderImageSource={bkImage} />
        </View>
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Start Game" />
          <Button label="Set up game" />
        </View>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
