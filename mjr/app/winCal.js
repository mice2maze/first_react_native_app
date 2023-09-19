import React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as SQLite from "expo-sqlite";

function openDatabase() {
  const db = SQLite.openDatabase("mjr.db");
  return db;
}

const db = openDatabase();

export function getRuleList(pid) {
  //const [rList, setRList] = useState([]);
  const rList = useRef([]);
  const sql = "SELECT * FROM gameRule order by FanNum;";
  const params = [];
  console.log("debug:", __filename,'-', Date().toLocaleString(), "getRuleList - start Get Rule list - ", pid);

  //useEffect(() => {
     db.transaction((tx) => {
         tx.executeSql(sql, params,
          (_, { rows: { _array } }) => {
            
            // setRList(_array);
            rList.current = _array;
            console.log("debug:", __filename,'-', Date().toLocaleString(), "inside db transaction - 1", _array, " = rList =", rList);

          },
          (error) => console.error(error)
        );
      });
      console.log("debug:", __filename,'-', "inside db transaction - 2", sql, rList);
  // }, [pid]);  
  console.log("debug:", __filename,'-', "outside useEffect rulelist", rList);

  if (rList === null || rList.length === 0) {
       console.log("debug - ruleList is null or length = 0 ");
       return null;
  }
  return (
    rList
  ) ;
}

export function getPlayerList() {
    const [player, setPlayer] = useState(null);

    console.log("debug: ",__filename, "Init Player list\n", player);

    useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql(
          "select * from PlayerList;", [],
          (_, { rows: { _array } }) => setPlayer(_array)
        );
      });
    }, []);  
    console.log("debug: ",__filename, "Get Player list\n", player);
    return player;
}    

export function initPlayingGame() {
  db.transaction(
    function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS PlayingGame (TourID INTEGER, GameID Integer, P1Name varchar(50), P1Score Integer,P2Name varchar(50), P2Score Integer,P3Name varchar(50), P3Score Integer,P4Name varchar(50), P4Score Integer,WinID integer, LostID integer, WinType integer, WinFan integer, playDateTime DEFAULT CURRENT_TIMESTAMP)");
    },
    function (error) {
        reject(error.message);
    },
    function () {
        resolve(true);
        console.log('initPlayingGame is created in database - OK');
    }
);
}

export function getGameResult() {
  const presult = [0,0,0,0,0];
  db.transaction((txn) => {
    // txn.executeSql(
    //   'CREATE TABLE IF NOT EXISTS PlayingGame(GameID INTEGER PRIMARY KEY AUTOINCREMENT, , P1Score int, P2Score int, P3Score int, P4Score int, TourID integer)'
    // );
    // console.log('created table playingGame:');
    txn.executeSql(
      "select max(GameID) gid, sum(P1Score) p1, sum(P2Score) p2, sum(P3Score) p3, sum(P4Score) p4 from PlayingGame;",[],
       (tx, res) => {
        alert('Game Result item:', res.rows.length);
        if (res.rows.length != 0) {
          let rs = res.rows;
          presult[0] = rs.gid;
          presult[1] = rs.p1;
          presult[2] = rs.p2;
          presult[3] = rs.p3;
          presult[4] = rs.p4;
        }
      }

     // (_, { rows: { _array } }) => setPResult(_array)
    );
  });
console.log("debug:", __filename,'-', 'Get Game Result\n', 'List:'+ presult);
return presult;
}
