import React, { useState,useEffect, } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as SQLite from "expo-sqlite";


function openDatabase() {
  const db = SQLite.openDatabase("mjr.db");
  return db;
}

var db = openDatabase();


function ShowAllPlayer(reloadList) {
  const [players, setPlayers] = useState(null);
 // const [heading, setHeading] = useState('');
  
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * from PlayerList;', [],
        (_, { rows: { _array } }) => setPlayers(_array)
      );      
    });
    
  }, [reloadList]);

  if (players === null || players.length === 0) {
    console.log("debug:", __filename,'-', Date().toLocaleString(),'- No player found');
    return null;
  } else  console.log("debug:", __filename,'-', Date().toLocaleString(), 'len', players.length, players);

  const removePlayer = (rID) => {
    setPlayers((current) =>
      current.filter((itm) => itm.PlayerID !== rID)
    );
  };

  return (
    <View style={styles.flexRow}>  
        <Text style={styles.boxPlayerID}>Player ID</Text>
        <Text style={styles.boxPlayerName}>Player Name</Text>
      {players.map(({ PlayerID, PlayerName}) => (
        <TouchableOpacity
          key={PlayerID}
              onPress={() => {
                console.log("Player", PlayerID);
                  db.transaction((tx) => { 
                    tx.executeSql('delete from PlayerList where PlayerID = ?;',[PlayerID],
                    (tx, results) => {
                      // console.log('Results', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                          removePlayer(PlayerID);
                          // Alert.alert('Success', 'Player deleted successfully',
                          //   [ {
                          //       text: 'Ok',
                          //     },
                          //   ],
                          // { cancelable: false }
                          // );
                        } else {
                          // alert('Please insert a valid User Id');
                        }
                    }
  //                forceUpdate
                )              
               
              })
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
            <Text style={[styles.boxPlayerID]}>{PlayerID}</Text>
            <Text style={[styles.boxPlayerName]}>{PlayerName}</Text>
          </View>

        </TouchableOpacity>
      ))}

    </View>
  );
}

// function getMaxPID() {
//   var rsID = -1;
//   console.log('debug getMaxID');
//   db.transaction((tx) => {
//     tx.executeSql(
//       'SELECT max(PlayerID) as mid FROM PlayerList;',
//       [],
//       (tx, results) => {
//         var len = results.rows.length;
//         mID = results.rows.item(0);
//         console.log('len, mID', len, mID);
//         if (mID != null) {
//           rsID = mID.mid;
//           console.log('after set len', len, rsID);
//         } else {

//           console.log('ID set to 1');
//           rsID =  1;
//         }
//       }
//       );
//   });
//   console.log('debug getMaxID  = %d, ', rsID);
//   return rsID;
// }


const RegisterPlayer = ({ navigation }) => {
  var [PlayerName,setPlayerName] = useState('');
  var PlayerID= 0;
  const [refreshList, setRefreshList] = useState(0);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists PlayerList (PlayerID integer primary key autoincrement, PlayerName varchar(50) );"
      );
    });
  }, []);  

  function BackHome() {
    navigation.navigate('HomeScreen');
  };
  
  function addPlayer(pName) {
    db.transaction( (tx) => {
      tx.executeSql(
        'INSERT INTO PlayerList ( PlayerName) VALUES (?);',
        [pName],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            // Alert.alert(
            //   'Success',
            //   'You are Registered Successfully',
            //   [
            //     {
            //       text: 'Ok',
            //       //onPress: () => navigation.navigate('RegisterPlayer'),
            //     },
            //   ],
            //   { cancelable: false }
            // );
          } else {
            //alert('Registration Failed');
          }
        }
      );
    });
    navigation.navigate('RegisterPlayer');
  }

  let register_player = ({ navigation }) => {

    if (PlayerName == '') {
      alert('Please fill name');
      return;
    }

    console.log('PlayerID :%d and Player Name:%s',PlayerID, PlayerName);

    addPlayer(PlayerName);
    setRefreshList(refreshList+1); 
    setPlayerName("");
  };

  //console.log('Navigation', navigation);

  return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1/16, justifyContent: 'center', marginTop:30 }}>
            <KeyboardAvoidingView
              behavior="padding"
              style={styles.flexRow} >
              <TextInput
                placeholder="Enter Player Name"
                onChangeText={
                  (PlayerName) => setPlayerName(PlayerName)
                }
                style={styles.input}
              />
              <Button title="Add" style={styles.button} onPress={register_player} />
              <Button title="Back" style={styles.button} onPress={BackHome}  />
            </KeyboardAvoidingView>
        </View>
        <ScrollView style={styles.listArea}>
            <ShowAllPlayer reloadList={refreshList}/>
          </ScrollView>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1, flexWrap: 'wrap', alignItems: 'flex-start',
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  boxPlayerID: {
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '30%',
    textAlign: 'center',
    padding: 8,    
    width: 50,
    height: 40,
    backgroundColor: 'powderblue',
  },
  boxPlayerName: {
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '30%',
    textAlign: 'center',
    padding: 8,    
    width: 100,
    height: 40,
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
    width: 180,
    height: 40,
    backgroundColor: 'powderblue',
  },
  button: {
    marginTop: 15,
    borderRadius: 10,
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },  
  listArea: {
    backgroundColor: "#f0f0f0",
    width: '100%',
    flex: 3,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  actionButtonBar: {
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
export default RegisterPlayer;