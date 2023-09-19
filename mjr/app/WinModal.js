// no use - for backup only
import React, {useState,useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, Image, Button, Modal,Alert} from 'react-native';
import { useRouter,Link } from 'expo-router';
import * as SQLite from "expo-sqlite";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getRuleList, getPlayerList, getGameResult } from './winCal';
import PlayerModal from './Player';

function insertGameResult(ps1,ps2,ps3,ps4,t1) {
  db.transaction((tx) => {
    tx.executeSql('insert into PlayingGame(P1Score, P2Score, P3Score, P4Score, TourID) values (?,?,?,?,?)', [ps1,ps2,ps3,ps4,t1]);
    console.log("debug:", __filename,"rs"+ps);

  });
}


function returnFS(wn, los, rList, fN, fType) {
  const  fanN = rList.find(obj => {
    console.log("debug:", __filename,'Fan List found!')
    console.log("debug:", __filename,'-',rList);
    console.log("debug:", __filename,'-',fType);
    console.log("debug:", __filename,'-','Winner:'+wn);
    console.log("debug:", __filename,'-','Loser: '+los);
    console.log("debug:", __filename,'-',obj.FanNum + ':' + obj.bySelfPick + ':' + obj.byDiscard);
    return (obj.FanNum == fN)  ? obj.bySelfPick : 0;
  });

  const playerResult = getGameResult();
  if (fType == 'bySelfPick') {
    playerResult[0] += fanN.bySelfPick;
    console.log("debug:", __filename,'-','selfpick - RS:' + fanN.bySelfPick + 'Total:' + playerResult[0]);
    
    return fanN.bySelfPick;
  }
  else if (fType == 'byDiscard') {
    playerResult[0] += fanN.byDiscard;
    console.log("debug:", __filename,'-','discard - RS:'+ fanN.byDiscard + 'Total:' + playerResult[0]);
    return fanN.byDiscard;
  }
}

const PlayGame = ({navigation}) => {
  const [rowGap, setRowGap] = useState(10);
  const [columnGap, setColumnGap] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  var rsList = getRuleList(5);
  
  console.log("debug: ",__filename, "Get Rule list ready\n", rsList);

  return (
    <PreviewLayout
      columnGap={columnGap}
      handleColumnGapChange={setColumnGap}
      rowGap={rowGap}
      handleRowGapChange={setRowGap}
      navi={navigation}
      >
      
      <Text style={styles.sideBox}></Text>
      <PlayerModal visibleMode={modalVisible} playerStyle={styles.eastBox} playerName='上家' playerID='4' fanList={rsList}>
      </PlayerModal>            
      <Text style={styles.sideBox}></Text>
      <PlayerModal visibleMode={modalVisible} playerStyle={styles.northBox} playerName='對家' playerID='3' fanList={rsList}>
      </PlayerModal>        
      <WinnerModal visibleMode={modalVisible} winnerStyle={styles.centerBox} playerName='Win' playerID='1' fanList={rsList}>
      </WinnerModal>  
      <PlayerModal visibleMode={modalVisible} playerStyle={styles.southBox} playerName='自己' playerID='1' fanList={rsList}>
      </PlayerModal>  
      <Text style={styles.sideBox}></Text>
      <PlayerModal visibleMode={modalVisible} playerStyle={styles.westBox} playerName='下家' playerID='2' fanList={rsList}>
      </PlayerModal>        
      <Text style={styles.sideBox}></Text>
    </PreviewLayout>
  );
};


const WinnerModal = ({
   visibleMode,
   winnerStyle,
   playerName,
   playerID,
   fanList,
}
) => {
  const [modalVisible, setModalVisible] = useState(visibleMode);
// '自己'=1, '上家'=2, '對家'=3, '下家'=4
  const loserGroup = [ 
    {id:'1', p0: '自己', p1: '上家', p2: '對家', p3: '下家'}, 
    {id:'2', p0: '上家', p1: '上家', p2: '對家', p3: '自己'}, 
    {id:'3', p0: '對家', p1: '上家', p2: '自己', p3: '下家'},
    {id:'4', p0: '下家', p1: '自己', p2: '對家', p3: '下家'},
  ];
  
  const showLoserList = loserGroup.filter(pa=>pa.id==playerID).map((loser) => 
  <Modal
  key={loser}
  animationType="fade"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    Alert.alert('Modal has been closed.');
    modalVisible= !modalVisible;
  }}>
  <View style={styles.centeredView}>
    <View style={styles.winnerModalView}>
      <Pressable
        style={styles.modalBox}
        onPress={() => {
            Alert.alert(loser.p1+'(fanmodel) lost '+ returnFS(playerID, loser.p1, fanList, 3,'bySelfPick'));
            setModalVisible(!modalVisible);
        }}>
        <Text style={styles.textStyle}>{loser.p1}</Text>
      </Pressable>
      <Pressable
        style={styles.modalBox}
        onPress={() => {
            Alert.alert(loser.p2+' lost '+ returnFS(playerID, loser.p2, fanList, 7,'byDiscard'));
            setModalVisible(!modalVisible);
        }}>
        <Text style={styles.textStyle}>{loser.p2}</Text>
      </Pressable>
      <Pressable
        style={styles.modalBox}
        onPress={() => {
            Alert.alert(loser.p3+' has been losed.');
            setModalVisible(!modalVisible);
        }}>
        <Text style={styles.textStyle}>{loser.p3}</Text>
      </Pressable>      
      <Pressable
            style={styles.button}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>        
  );
  return (
  <View >
    {showLoserList}
    <Pressable
        onPress={() => setModalVisible(true)}>
        <Text style={winnerStyle}>{playerName} </Text>
    </Pressable>
  </View>
);
};

const PreviewLayout = ({
  children,
  handleColumnGapChange,
  handleRowGapChange,
  rowGap,
  columnGap,
  // navigation = useRouter(),
  navi,
}) => (
  <View style={styles.previewContainer}>
    <View style={styles.headContainer}>
      <Text style={{textAlign:'center'}}>Heading</Text>
      <Image style={{alignSelf: 'center',width: 40, height: 40, }} source={require('../assets/o1.png')} />
    </View>
    <View style={[styles.container, {rowGap, columnGap}]}>{children}</View>
    <View style={styles.footerContainer}>
      <Button title="Back" style={styles.button}
              onPress={()=> { 
                // navigation.push({pathname: '/'}) 
                navi.navigate('HomeScreen');
                }}  />
    </View>
  </View>
);

const styles = StyleSheet.create({
  itemsCenter: {alignItems: 'center'},
  headContainer: {
    gap: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 5,

  },
  footerContainer: {
    gap: 4,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  previewContainer: {marginTop: 0,padding: 10, flex: 1},
  container: {
    flex: 1,
    marginTop: 70,
    backgroundColor: 'aliceblue',
    maxHeight: 400,
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  sideBox: {
    width: 80,
    height: 80,
  },
  northBox: {
    marginTop: 20,
    marginLeft:5,
    width: 180,
    height: 80,
    backgroundColor: 'orangered',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,    
  },
  southBox: {
    marginLeft:5,
    width: 180,
    height: 80,
    backgroundColor: 'orange',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,    
  },
  eastBox: {
    marginTop: 20,
    marginLeft:5,
    width: 80,
    height: 180,    
    backgroundColor: 'mediumseagreen',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,    
  },
  westBox: {
    marginTop: 20,
    width: 80,
    height: 180,    
    backgroundColor: 'deepskyblue',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centerBox: {
    width: 180,
    height: 180,    
    backgroundColor: 'aliceblue',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  winnerModalView: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 300,
    height: 400,    
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBox: {
    width: 80,
    height: 40,        
    padding: 10,
    elevation: 2,
    backgroundColor: '#00f0f0',
  },
  button: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#00fff0',
  },
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

export default PlayGame;