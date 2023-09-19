import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterPlayer from './RegisterPlayer';
import GameSetup from './GameSetup';
import PlayGame from './newgame';
import Button from '../components/Button';
import ImageViewer from '../components/ImageViewer';
//import * as SQLite from "expo-sqlite";


const bkImage = require('../assets/mj.jpg');

const HomeScreen = ({ navigation}) => {
    var gameLabel = 'New Game';

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer placeholderImageSource={bkImage} sizeX={300} sizeY ={450}/>
        </View>
        <View style={styles.footerContainer1}>
          <Button theme="primary" label={gameLabel} onclicklabel={gameLabel} gotoURL="PlayGame" icoName="play" />
        </View>
        <View style={styles.footerContainer2}>
          <Button theme="primary" label="Players" onclicklabel="Players" gotoURL="RegisterPlayer" icoName="bars" />
          <Button theme="primary" label="Set up game" onclicklabel="Set up game" gotoURL="GameSetup" icoName="bars" />
        </View>
      </View> 
    )
  } 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      alignItems: 'center',
    },
    imageContainer: {
      flex: 1,
      paddingTop: 30,
    },
    footerContainer1: {
      flex: 2 / 24,
      alignItems: 'center',
      flexDirection: 'row',
    },
    footerContainer2: {
      flex: 2 / 8,
      alignItems: 'center',
      flexDirection: 'row',
  
    },
  });

export default HomeScreen;