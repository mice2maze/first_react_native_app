import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from '@react-navigation/native';


function openDatabase() {
  const db = SQLite.openDatabase("mjr.db");
  return db;
}

const db = openDatabase();

function ShowAllRules(reloadList) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * from gameRule order by FanNum;', [],
        (_, { rows: { _array } }) => setItems(_array)
      );

    });
  }, [reloadList]);

  //const [heading, setHeading] = useState('');
  if (items === null || items.length === 0) {
   // console.log("debug - item is null or length = 0 ");
    return null;
  }
   //console.log('RuleList:',items);
  const removeItem = (rID) => {
    setItems((current) =>
      current.filter((itm) => itm.ruleID !== rID)
    );
  };

  return (
    <View style={styles.flexRow}>
        <ScrollView style={styles.listArea}>
      {items.map(({  ruleID, FanNum, bySelfPick, byDiscard }) => (
        <TouchableOpacity
          key={ruleID}
          onPress={() => {
            db.transaction((tx)=> {
              tx.executeSql(
              'delete from gameRule where ruleID=?', [ruleID],
              (tx, results) => {
                //console.log('Results',results.rowsAffected);
                if(results.rowsAffected>0){
                    // delete success 
                    removeItem(ruleID);
                }else{
                    //  cannot delete
                }
              }
              );
            });
          }
          }
          style={{
            backgroundColor: "#1c9963" ,
            borderColor: "#000",
            borderWidth: 1,
            padding: 8,
          }}
        >
          <View style={styles.flexRow} >
            <Text style={[styles.box]}>{FanNum}</Text>
            <Text style={[styles.box]}>{bySelfPick}</Text>
            <Text style={[styles.box]}>{byDiscard}</Text>
          </View>

        </TouchableOpacity>
      ))}
      </ScrollView>
    </View>

  );
}

const GameSetup = () => {
  const [FanNum, setFanNum] = useState(null);
  const [bySelfPick, setBySelfPick] = useState(null);
  const [byDiscard, setByDiscard] = useState(null);
  const [refreshList, setRefreshList] = useState(0);

  //const [forceUpdate, forceUpdateId] = useForceUpdate();
 // const navi = useRouter();
 //const navi = useNavigation();



  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists gameRule (ruleID integer primary key, FanNum int, bySelfPick int, byDiscard int);"
      );
    });
  }, []);

  function addFan  (FanNum,bySelfPick,byDiscard) {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into gameRule (FanNum, bySelfPick, byDiscard) values (?,?,?)", [FanNum,bySelfPick,byDiscard]);
        // tx.executeSql("select * from gameRule", [], (_, { rows }) =>
        //   console.log(JSON.stringify(rows))
        // );
      },
      null,
      //useForceUpdate
    );
  
  };

  function BackHome() {
    const navigation = useNavigation();
    //navigation.goBack();
    //navigation.navigate('HomeScreen')
    //console.log('Navigation - after', navigation);

    return (
      <Button title="Back" style={styles.button} 
        onPress={()=>navigation.goBack()} 
      />
    );
   }
   
   let register_fanrec = () => {
    if (FanNum == '' || bySelfPick == '' || byDiscard == '') {
      alert('Please Fan/By Discard/by Selfpick');
      return;
    }
    addFan(FanNum,bySelfPick,byDiscard);
    setRefreshList(refreshList+1); 
    setFanNum(null);
    setByDiscard(null);
    setBySelfPick(null);
   };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' , marginTop:150}}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.flexRow} >
          <TextInput
            keyboardType='numeric'
              onChangeText={(FanNum) => setFanNum(FanNum)}
              style={styles.input}
              value={FanNum}
          />
            <TextInput
              keyboardType='numeric'
              onChangeText={(bySelfPick) => {setBySelfPick(bySelfPick);}}
              style={styles.input}
              value={bySelfPick}
            />
            <TextInput
              keyboardType='numeric'
              onChangeText={(byDiscard) => setByDiscard(byDiscard)}
              style={styles.input}
              value={byDiscard}
            />          
          <Button title="Add" style={styles.button} onPress={register_fanrec} />
          <BackHome />
    </KeyboardAvoidingView>
    <View style={styles.flexRow}>
        <Text style={styles.box}>番數</Text>
        <Text style={styles.box}>自摸</Text>
        <Text style={styles.box}>出冲</Text>
    </View>
      <ShowAllRules reloadList={refreshList}/>
  </View>
  );
}

// function useForceUpdate() {
//   const [ruleID, setRuleID] = useState(0);
//   return [() => setRuleID(ruleID + 1), ruleID];
// }

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1, flexWrap: 'wrap', alignItems: 'flex-start',
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '30%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,    
    width: 80,
    height: 30,
    backgroundColor: 'powderblue',
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '25%',
    textAlign: 'center',
    padding: 8,    
    width: 80,
    height: 30,
    backgroundColor: 'powderblue',
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },  
  listArea: {
    backgroundColor: "#f0f0f0",
    width: '100%',
    flex: 2,
    paddingTop: 16,
  },
  sectionContainer: {
    flex:1/16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  actionButtonBar: {
    flex:1/16,
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    textAlign: 'center',    
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default GameSetup;