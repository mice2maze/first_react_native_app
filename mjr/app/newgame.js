import React, {useState, useEffect, createContext, useContext} from 'react';
import {View, Text, StyleSheet, Pressable, Image, Button, Modal,Alert, FlatList} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import * as SQLite from "expo-sqlite";
import { ScoreListContext,useScoreList } from './scoreListContext';
import WinList from './WinList';

function openDatabase() {
  const db = SQLite.openDatabase("mjr.db");
  return db;
}

const db = openDatabase();

function insertGameResult(ps1,ps2,ps3,ps4,t1) {
  db.transaction((tx) => {
    tx.executeSql('insert into PlayingGame(P1Score, P2Score, P3Score, P4Score, TourID) values (?,?,?,?,?)', [ps1,ps2,ps3,ps4,t1]);
    console.log("debug:", __filename,"rs"+ps);
  });
}

function getRuleList(pid) {
  const [rList, setRList] = useState([]);
  //const rList = useRef([]);
  const sql = "SELECT * FROM gameRule order by FanNum;";
  const params = [];
  console.log("debug:", __filename,'-', Date().toLocaleString(), "getRuleList - start Get Rule list - ", pid);

  //useEffect(() => {
     db.transaction((tx) => {
         tx.executeSql(sql, params,
          (_, { rows: { _array } }) => {
            
            setRList(_array);
            //rList.current = _array;
            console.log("debug:", __filename,'-', Date().toLocaleString(), "inside db transaction - 1", _array, " = rList =", rList);

          },
          (error) => console.error(error)
        );
      });
      console.log("debug:", __filename,'-', "inside db transaction - 2", sql, rList);
  //}, [pid]);  
  console.log("debug:", __filename,'-', "outside useEffect rulelist", rList);

  if (rList === null || rList.length === 0) {
       console.log("debug - ruleList is null or length = 0 ");
       return null;
  }
  return (
    rList
  ) ;
}

let i = 10;

const PlayGame = ({navigation}) => {
  const [rowGap, setRowGap] = useState(10);
  const [columnGap, setColumnGap] = useState(10);
 // const {initWinResultSet,setWinnerFlag,setWinner, setLabel, winFlag, winResultSet, pList} = useScoreList() ;

  return (
    <ScoreListContext>  
    <PreviewLayout
      columnGap={columnGap}
      handleColumnGapChange={setColumnGap}
      rowGap={rowGap}
      handleRowGapChange={setRowGap}
      navi={navigation}
      >
      <WinTableLayout/>
    </PreviewLayout>
    </ScoreListContext>
  );
};

const WinTableLayout = () => {
  const {initWinResultSet,setWinnerFlag,setWinner, setLabel, winFlag, winResultSet, pList, winLabel, initAllVar} = useScoreList() ;
  return(
    <View style={[styles.container, 10, 10]}>
    <Text style={styles.sideBox}></Text>
    <Pressable
      onPress={() => {
          setWinnerFlag(1);
          //initWinResultSet();
          setLabel();
          console.log("debug:", __filename,'-', Date().toLocaleString(), "eastBox - winFlag", winFlag, "result", winResultSet);
      }}>
    <View style={styles.eastBox}>
      <Text >{'上家 - '+pList[1].playerName} </Text>
      <Text>{winLabel}</Text>
    </View>
    </Pressable>
    <Text style={styles.sideBox}></Text>
    <Pressable
      onPress={() => {
        setWinnerFlag(2);
        // initWinResultSet();
        // setWinner(2);
        setLabel();
        console.log("debug:", __filename,'-', Date().toLocaleString(), "northBox - winFlag", winFlag, "result", winResultSet);
      }}>
      <View style={styles.northBox}>
      <Text >{'對家 - '+pList[2].playerName} </Text>
      <Text>{winLabel}</Text>
    </View>
    </Pressable>
    <WinList/>
    <Pressable
      onPress={() => {
        setWinnerFlag(0);
        setLabel();
          console.log("debug:", __filename,'-', Date().toLocaleString(), "southBox - winFlag", winFlag, "result", winResultSet);
      }}>
      <View style={styles.southBox}>
      <Text >{'自己 - '+pList[0].playerName} </Text>
      <Text>{winLabel}</Text>
    </View>
    </Pressable>
    <Text style={styles.sideBox}></Text>
    <Pressable
      onPress={() => {
          setWinnerFlag(3);
          setLabel();
          console.log("debug:", __filename,'-', Date().toLocaleString(), "westBox - winFlag", winFlag, "result", winResultSet);
      }}>
      <View style={styles.westBox}>
      <Text >{'下家 - '+pList[3].playerName} </Text>
      <Text>{winLabel}</Text>
    </View>
    </Pressable>      
    <Text style={styles.sideBox}></Text>
    </View>
  )
}


const winFanRow = () => {
  const {winResultSet, fanList, fanSelected, setFan} = useScoreList() ;
  console.log("debug:", __filename,'-', Date().toLocaleString(), "winFanRow - rs", winResultSet);
  rs = fanList.map((index) => (
    <View>
    <Pressable
     style={(index.FanNum == fanSelected) ? styles.selectedFanBox: styles.fanBox}
     onPress={() => {
        setFan(index.FanNum, index.byDiscard,index.bySelfPick);
     }}>
      <Text style={styles.fanText}>{index.FanNum}</Text>
     </Pressable>
    </View>
  ))
  return rs;
}



const winTypeRow = () => {
  const {winType,setType} = useScoreList() ;
  r = [
     (
      <Pressable style={(winType == 1) ? styles.selectedFanBox: styles.fanBox}
      onPress={() => {
          setType(1);
       }}>
     <Text style={styles.fanText}>自摸</Text> 
     </Pressable>),
     (<Text style={styles.bgWhite}>  </Text>), 
     (
      <Pressable style={(winType ==3) ? styles.selectedFanBox: styles.fanBox}
      onPress={() => {
          setType(3);
       }}>
     <Text style={styles.fanText}>包自摸</Text> 
     </Pressable>),   (<Text style={styles.bgWhite}>  </Text>), 
     (
      <Pressable style={(winType ==2) ? styles.selectedFanBox: styles.fanBox}
      onPress={() => {
          setType(2);
       }}>
     <Text style={styles.fanText}>食出</Text> 
     </Pressable>),          
];

//console.log("debug:", __filename,'-', Date().toLocaleString(), "winTypeRow - ", r);
  return r;
}

const loserRow = () => {
  const {loserGroup,winnerID,selectLoser,setLoser,winType} = useScoreList() ;
  const [loserList] = useState(loserGroup);
  const winLabel = ['', '自摸','出冲','包自摸'];
  console.log("debug:", __filename,'-', Date().toLocaleString(), "loserRow - loserGroup", loserGroup);
  console.log("debug:", __filename,'-', Date().toLocaleString(), "loserRow - loserList", loserList);
  console.log("debug:", __filename,'-', Date().toLocaleString(), "loserRow - winnerID", winnerID);
 // console.log("debug:", __filename,'-', Date().toLocaleString(), "loserRow - WinType", WinType);


  const rs = (loserList.filter(loserList=>loserList.playerID != winnerID).map(rs => (
    (<Pressable style={(selectLoser == rs.playerID) ? styles.selectedFanBox: styles.fanBox}
     onPress={() => { setLoser(rs.playerID); }}>
     <Text style={styles.fanText}>{rs.playerName}</Text>
     </Pressable>
     )
    )));
    rs.unshift( (<Text style={styles.bgWhite}>  </Text>));
    rs.unshift((<Text> {winLabel[winType]} </Text>));

  return  rs;
}

const WinnerView = (showList) => {
  const {winFlag, winType,winResultSet,winnerID,showPlayerName,getWinFanSize} = useScoreList();
  const showLoser = (winType == 1 || winType == -1) ? false:true;
  console.log("debug:", __filename,'-', Date().toLocaleString(), "WinnerView-sc", winResultSet);
  console.log("debug:", __filename,'-', Date().toLocaleString(), "WinnerView-WinType", winType);
  console.log("debug:", __filename,'-', Date().toLocaleString(), "WinnerView-showLoser", showLoser);
  console.log("debug:", __filename,'-', Date().toLocaleString(), "WinnerView-winFlag", winFlag);
  console.log("debug:", __filename,'-', Date().toLocaleString(), "WinnerView-showPlayerName", showPlayerName);
  
  return (
    <View>
      {(winFlag) &&  <Table borderStyle={{ borderWidth: 0, borderColor: '#FFF', }}>
      <Row data={[showPlayerName(winnerID)+ ' 食胡  ']} widthArr={[80]} style={styles.header} textStyle={styles.text} />
      <Row data={winTypeRow()} widthArr={[80, 20, 80, 20,80]} style={styles.fanBox} textStyle={styles.selectedFan}/>
      { showLoser ? <Row data={loserRow()} widthArr={[80, 20, 60,60,60]} style={styles.fanBox} textStyle={styles.selectedFan}/> :
      <Row data={[' ']} widthArr={[80]} style={styles.header} textStyle={styles.text} /> }
      <Row data={['番數']} widthArr={[80]} style={styles.header} textStyle={styles.text} />
      <Row data={winFanRow()} widthArr={getWinFanSize(40)} style={styles.fanBox} textStyle={styles.selectedFan}/>
      </Table>}

    </View>
  )
}


const PreviewLayout = ({
  children,
  handleColumnGapChange,
  handleRowGapChange,
  rowGap,
  columnGap,
  navi,
}) => {
  const {winFlag,setScore} = useScoreList();

  console.log("debug:", __filename,'-', Date().toLocaleString(), "PreviewLayout - winFlag", winFlag);
  
  
  return (
  <View style={styles.previewContainer}>
    <View style={[styles.container, {rowGap, columnGap}]}>
      {children}
    </View>
    <View style={styles.footerContainer}>
      <Button title="Back" style={styles.button}
              onPress={()=> { 
                // navigation.push({pathname: '/'}) 
                navi.navigate('HomeScreen');
                }}  />
    </View>
    <WinnerView showList={winFlag}/>
    <View style={styles.footerContainer}><Text></Text>
      <Button title="Submit" style={styles.button}
              onPress={setScore}  />
    </View>    
  </View>
  )
};

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
    flexDirection: 'column',
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
    alignItems: 'center',
    verticalAlign: 'center',
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
  fanBox:{ height: 40, backgroundColor: '#0ff',borderWidth: 1, borderColor: '#C1C0B9', justifyContent: 'center',
  padding: 10,  elevation: 2,},
  selectedFanBox:{ height: 40, backgroundColor: '#00f',borderWidth: 1, borderColor: '#C1C0B9', justifyContent: 'center',
  padding: 10,  elevation: 2,},
  textStyle: {backgroundColor: '#00f0f0', justifyContent: 'center', alignItems:'center',},
  fanText: {textAlign: 'center'},
  bgWhite: { height: 40, backgroundColor: '#fff',borderWidth: 1, borderColor: '#C1C0B9', justifyContent: 'center',
  padding: 10,  elevation: 2,},
  huStyle: {backgroundColor: '#00f0f0', justifyContent: 'center', alignItems:'center',},
  selectedFan:{ height: 40,  backgroundColor: '#f00',borderWidth: 1, borderColor: '#C1C0B9', justifyContent: 'center',
  padding: 10,  elevation: 2,},
});

export default PlayGame;

