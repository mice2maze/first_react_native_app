import React, {useState,useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Pressable, Button, Modal,Alert} from 'react-native';
import { Table, Row } from 'react-native-table-component';

// import { useRouter,Link } from 'expo-router';
// import * as SQLite from "expo-sqlite";
// import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getGameResult } from './mjrdbHandler';
//import { winFlagContext } from './newgame';

//return final score
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
  //console.log("debug:", __filename,'-','discard - RS:'+ fanN.byDiscard + 'Total:' + scoreHandler);
  let rs = [];
  if (fType == 'bySelfPick') {
    for (let i=0;i<4;i++) {
      (i==wn? playerResult[i] += fanN.bySelfPick * 3: playerResult[i]  -= fanN.bySelfPick )
    }
    console.log("debug:", __filename,'-','selfpick - RS:' + fanN.bySelfPick + 'Total:' + playerResult[0]);
    //scoreHandler(playerResult[0],playerResult[1] ,playerResult[2] ,playerResult[3]  );
    rs = [playerResult[wn],playerResult[1] ,playerResult[2] ,playerResult[3] ]
    return rs;
  }
  else if (fType == 'byDiscard') {
    for (let i=0;i<4;i++) {
      (i==wn? playerResult[i] += fanN.byDiscard: 0 );
    }

    console.log("debug:", __filename,'-','discard - RS:'+ fanN.byDiscard + 'Total:' + playerResult[0]);
    // scoreHandler(playerResult[0],playerResult[1] ,playerResult[2] ,playerResult[3]  );
    rs = [playerResult[wn],playerResult[1] ,playerResult[2] ,playerResult[3] ]
    return rs;
  }
}

const headerButton =(title, action, isSelected) =>{
  const buttonColor = isSelected ? 'aqua' : 'coral';
  const displayTitle = isSelected ? title + '[ ]': title + '[x]'
  console.log("debug:", __filename,'-','style:', buttonColor);

  return(
      <Button title={displayTitle} color={buttonColor} onPress={action}>
     </Button>
  )
}

const selfPickCheckBox =(action, winType) =>{
  const title = (winType==1) ? '自摸 ✅':'自摸';
  const checkboxColor = (winType==1) ? 'blueviolet' : 'coral';
  return(
      <Button title={title} color={checkboxColor} onPress={action}>
     </Button>
  )
}



const loserRow =(playerID,loser,fanList,winFan, winType,scoreHandler,setModalVisible,mv ) =>{
  return(
    <View>
      <Pressable
       style={styles.modalBox}
       onPress={() => {
          //  const r = returnFS(playerID, loser, fanList, winFan,winType)
           // Alert.alert(loser+'(fanmodel) lost '+ r+'loser ID');
          //  scoreHandler(r);
          //  setModalVisible(mv);

       }}>
       <Text style={styles.fanText}>{loser}</Text>
      </Pressable>
   </View>
  )
}

const fanRow = (fanlist) => {
  rs = fanlist.map((index) => (
    <View>
    <Pressable
     style={styles.fanBox}
     onPress={() => {
      Alert.alert("Fan"+index.FanNum);
     }}>
      <Text style={styles.fanText}>{index.FanNum}</Text>
     </Pressable>
    </View>
  ))
  return rs;
}

const fanSize = (fanlist,sz) => {
  rs = fanlist.map((index) => (
      sz
  ))
  return rs;
}

function PlayerModal({
  visibleMode, playerStyle, playerName, playerID, loserGroup, fanList, scoreHandler,
}) {
  const [modalVisible, setModalVisible] = useState(visibleMode);
  const [winType, setWinType] = useState(0); // 0=none, 1 = selfPick, 2 = byDiscard, 3=PayAllSelfPick
  const [loserID, setLoserID] = useState(0); // -1=Don't care, 1 = P1, 2=P2, 3=P3
  const [winFan, setWinFan] = useState(0);
  const [byDiscardLabel, setByDiscardLabel] = useState('出冲')
  const [winLabel, setWinLabel] = useState('食胡');

  //console.log("debug:", __filename,'-', Date().toLocaleString(), "rsList=", fanList);
  const [isSelected, setIsSelected] = useState(false);
  const [isSelfPick, setSelfPick] = useState(false);
  const [isByDiscard, setByDiscard] = useState(false);
  //const [winFlag, setWinFlag] = useContext(winFlagContext);

  const loserCheckBox =(loser, winType, action, pid) =>{
    //const title = (winType==2) ? '出冲 ✅':'出冲';
    const checkboxColor = (winType==2) ? 'blueviolet' : 'coral';
    console.log("debug:", __filename,'-','loserCheckBox - Player ID : ', pid, winType, action, loser);
    return(
        <Button title={loser} color={checkboxColor} onPress={action} loID={pid}>
       </Button>
    )
  }
  
  const tongleLoserID = ({loID}) => {
    setLoserID(loID);
    console.log("debug:", __filename,'-','tongleLoserID - Player ID : ', loID);

  }

  const tongleSelfPick = () => {
    if (winType != 1) {
      setWinType(1);
      setByDiscardLabel('包自摸');
    }  else {
      setWinType(0);
      setByDiscardLabel('出冲');

    }
    console.log("debug:", __filename,'-','tongleSelfPick - WinType : ', winType);

  }

  const tongleByDiscard = () => {
    if (winType != 2) {
      setWinType(2);
    }  else {
      setWinType(0);
    }
    console.log("debug:", __filename,'-','tongleByDiscard - WinType :', winType);
  }

  const toggleButton = () => {
    setIsSelected(!isSelected);
  };

  const showLoserList = loserGroup.filter(pa => pa.id == playerID).map((loser) => <Modal
    key={loser}
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
      modalVisible = !modalVisible;
    } }>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Table borderStyle={{ borderWidth: 0, borderColor: '#C1C0B9', }}>
          <Row data={['', byDiscardLabel ]}
            widthArr={[100, 240]} style={styles.header} textStyle={styles.fanText} />
          <Row data={[selfPickCheckBox(tongleSelfPick, winType), '', 
          loserCheckBox(loser.p1, winType, tongleLoserID, playerID),
          loserRow(playerID, loser.p2, fanList, 3, 'bySelfPick', scoreHandler, setModalVisible, !modalVisible),
          loserRow(playerID, loser.p3, fanList, 3, 'bySelfPick', scoreHandler, setModalVisible, !modalVisible),
          ]}
            widthArr={[80, 20, 80,80,80]} style={styles.header} textStyle={styles.text} />
          <Row data={['']} widthArr={[80]} style={styles.header} textStyle={styles.text} />
          <Row data={fanRow(fanList)} widthArr={fanSize(fanList,40)} style={styles.fanBox} textStyle={styles.selectedFan}/>
        </Table>
        <View>
        <Pressable
          style={styles.button}
          onPress={() => {
            const r = returnFS(playerID, loserID, fanList, winFan,winType)
            Alert.alert(loser+'(fanmodel) lost '+ r+'loser ID');
            scoreHandler(r);
            setModalVisible(!modalVisible);}
          }>
          <Text style={styles.textStyle}>確定</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.textStyle}>取消</Text>
        </Pressable>
        </View>
      </View>
    </View>
  </Modal>
  );
  return (
    <View style={playerStyle}>
      {showLoserList}
      <Pressable
        onPress={() => {
            setModalVisible(true);
            
        }}>
        <Text >{playerName} </Text>
        <Text style={styles.huStyleStyle}>{winLabel} </Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    backgroundColor: 'aliceblue',
    maxHeight: 400,
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  modalView: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 350,
    height: 280,    
    backgroundColor: 'aqua',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.5,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#00fff0',
  },
  selectButton: {
    color: '#ff000f',
  },
  unselectButton: {
    color: '#00fff0',
  },
  header:{ height: 40, justifyContent: 'center',alignItems: 'center',},
  fanBox:{ height: 40, backgroundColor: '#0ff',borderWidth: 1, borderColor: '#C1C0B9', justifyContent: 'center',
  padding: 10,  elevation: 2,},
  textStyle: {backgroundColor: '#00f0f0', justifyContent: 'center', alignItems:'center',},
  fanText: {textAlign: 'center'},
  huStyle: {backgroundColor: '#00f0f0', justifyContent: 'center', alignItems:'center',},
  selectedFan:{ height: 40,  backgroundColor: '#f00',borderWidth: 1, borderColor: '#C1C0B9', justifyContent: 'center',
  padding: 10,  elevation: 2,},
});

export default PlayerModal;