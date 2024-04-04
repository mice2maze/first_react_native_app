import React, { useState, useContext, createContext, useEffect } from "react";
//import { getPlayerList } from "./mjrdbHandler";
import * as SQLite from "expo-sqlite";

const scoreListContext = createContext();

const db = SQLite.openDatabase("mjr.db");

export function useScoreList() {
  return useContext(scoreListContext);
}

export function ScoreListContext({ children }) {

    const [winFlag, setWinFlag] = useState(false);
    const [winLabel, setWinLabel] = useState('食胡');

    const [fanList, setFanList] = useState([{FanNum: 3, byDiscard: 8, bySelfPick: 4, ruleID: 1}, 
        {FanNum: 4, byDiscard: 16, bySelfPick: 8, ruleID: 2}, 
        {FanNum: 5, byDiscard: 24, bySelfPick: 12, ruleID: 3}, 
        {FanNum: 6, byDiscard: 32, bySelfPick: 16, ruleID: 4}, 
        {FanNum: 7, byDiscard: 48, bySelfPick: 24, ruleID: 5}, 
        {FanNum: 8, byDiscard: 64, bySelfPick: 32, ruleID: 6}, 
        {FanNum: 9, byDiscard: 96, bySelfPick: 48, ruleID: 7},
        {FanNum: 10, byDiscard: 96, bySelfPick: 48, ruleID: 8},
      ]);
    
    const [pList, setPList] = useState( [  { PlayerID: 0, PlayerName:'自己'}, 
      {PlayerID : 1, PlayerName: '上家'}, 
      {PlayerID : 2, PlayerName: '對家'},
      {PlayerID : 3, PlayerName: '下家'} ] );

  //  const [pList, setPlist] = useState([{ playerID: 0, playerName:''}]);

    const  [loserGroup, setLoserGroup] = useState(null);        

    const [winnerID, setWinnerID] = useState(-1);
    const [fanSelected, setFanSelected] = useState(-1);
    const [selectLoser, setSelectLoser] = useState(-1);
    const [winType, setWinType] = useState(-1);
    const [scoreList, setScoreList] = useState ([ {gameID:0, scores: [0,0,0,0]}]);
    const [totalScore, setTotalScore] = useState([0,0,0,0]);
    const [winResultSet, setWinResult] = useState({WinnerID:-1, WinType:-1, WinFan:-1, LoserID:-1, byDiscard:-1, bySelfPick:-1 }); 
    // -1 means initial, none 
    // WinnerID & LoserID = playerID
    // winType = -1, 1 = selfPick, 2 = byDiscard, 3=PayAllSelfPick  
    // WinFan = Fanlist index number 0 - n
    const clearAllVar = () => {
      setWinnerID(-1);
      setFanSelected(-1);
      setWinType(-1);
      clearWinResultSet(-1);
    }
     

    // function rsPlayName(pID) {
    //   const [isPlayerLoaded, setPlayerLoaded] = useState(false);
    //   console.log("debug:", __filename,'-', Date().toLocaleString(), "rsPlayName - in ", pID);

    //   useEffect(() => { 
    //     async function loadDataAsync() {
    //       try {
    //         getPlayerList(setPList);
    //       } catch (e) {
    //       console.log("debug:", __filename,'-', Date().toLocaleString(), "rsPlayName");
    //     }
    //     }  
    //   loadDataAsync();
    //   }, [] );
    // return isPlayerLoaded;
    // }

    const getPlayerList = () => {

      console.log("debug: ",__filename, "getPlayerList - Init Player list\n");
       db.transaction( tx => {
           tx.executeSql(
            "select * from PlayerList;", [],
            (_, { rows: { _array } }) => setPList(_array)
          );
        }, 
        (t, error) => { console.log("db error load players"); console.log(error) },
        (_t, _success) => { console.log("loaded players", _array)}
      );
      console.log("debug: ",__filename, "getPlayerList - Player list\n", pList);
    }    

    const getPlayerName = (plyID) => {

      console.log("debug: ",__filename, "getPlayerList - Get Player Name\n");
       db.transaction( tx => {
           tx.executeSql(
            "select * from PlayerList where PlayerID =?;", [plyID],
            (_, { rows: { _array } }) => setPList(_array)
          );
        }, 
        (t, error) => { console.log("db error load players"); console.log(error) },
        (_t, _success) => { console.log("loaded players", _array)}
      );
      console.log("debug: ",__filename, "getPlayerName - Player Name\n", pList);
    }    
    // const getPlist = (pID) => {
    //   console.log("debug:", __filename,'-', Date().toLocaleString(), "getPlist - in ", pID);

    //   /* useEffect(() => {
    //     prepPlayerList();
    //   },[]);
    //   */
    //    prepPlayerList();

    //   console.log("debug:", __filename,'-', Date().toLocaleString(), "getPlist - out ", pList);

    // }

    // function prepPlayerList() {
    //   console.log("debug:", __filename,'-', Date().toLocaleString(), "prepPlayerList - in ", pList);
    //   return getPlayerList(setPList);
    // }

    const clickedWinner = (wID) => {
        setWinnerID(winnerID == wID?-1:wID) ;
        setWinResult({...winResultSet, WinnerID:winnerID == wID?-1:wID});    
        console.log("debug:", __filename,'-', Date().toLocaleString(), "clickedWinner - winnerID", winnerID, wID);

    }
    
    const clickedFanSelect = (FanNum, byDiscardFan, selfPickFan) => {
        const bSameFanNum = (fanSelected==FanNum);
        setFanSelected(bSameFanNum?-1:FanNum);
        setWinResult({...winResultSet, WinFan:bSameFanNum?-1:FanNum,  byDiscard:bSameFanNum?-1:byDiscardFan, bySelfPick:bSameFanNum?-1:selfPickFan});    
    } 

    const clickedLoser = (plyID)=> {
        setSelectLoser(selectLoser==plyID?-1:plyID);
        setWinResult({...winResultSet, LoserID:selectLoser==plyID?-1:plyID});
    }

    const clickWinType = (wType) => {
        setWinType(winType==wType?-1:wType);
        setWinResult({...winResultSet, WinType:winType==wType?-1:wType});
    }

    const winResultSetHandler = ( fanNum, byDiscard, bySelfPick) => {    
        setWinResult({...winResultSet, fanNum, byDiscard, bySelfPick})
        //console.log("debug:", __filename,'-', Date().toLocaleString(), "winResultSetHandler", winResultSet);
        return rs;
      }
    
    const clearWinResultSet = () => {
        setWinResult({WinnerID:-1, WinType:-1, WinFan:-1, LoserID:-1, byDiscard:-1, bySelfPick:-1 });
    }

    const scoreListHandler = () => {
         
        let rowCnt = scoreList.length;
        let firstRow = ( scoreList[0].scores[0] == 0 && scoreList[0].scores[1] == 0 && scoreList[0].scores[2] == 0 && scoreList[0].scores[3] == 0 ) ? true : false;
        let p1Score = 0;
        let p2Score = 0;
        let p3Score = 0;
        let p0Score = 0;

        console.log("debug:", __filename,'-', Date().toLocaleString(), 'ScoreListContext - scoreListHandler Check', winResultSet);
        console.log("debug:", __filename,'-', Date().toLocaleString(), 'ScoreListContext - TotalScore', totalScore);
        console.log("debug:", __filename,'-', Date().toLocaleString(), 'ScoreListContext - firstRow', firstRow );

        if (winResultSet.WinnerID != -1  && winResultSet.WinFan > 0 && winResultSet.WinType != -1) {
            switch(winResultSet.WinType) {
              case 1: // self pick
                switch(winResultSet.WinnerID) {
                  case 1:
                    p0Score = winResultSet.bySelfPick * -1;
                    p1Score = winResultSet.bySelfPick * 3;
                    p2Score = winResultSet.bySelfPick * -1;
                    p3Score = winResultSet.bySelfPick * -1;
                    break;
                  case 2:
                    p0Score = winResultSet.bySelfPick * -1;
                    p1Score = winResultSet.bySelfPick * -1;
                    p2Score = winResultSet.bySelfPick * 3;
                    p3Score = winResultSet.bySelfPick * -1;                    
                    break;
                  case 3:
                    p0Score = winResultSet.bySelfPick * -1;
                    p1Score = winResultSet.bySelfPick * -1;
                    p2Score = winResultSet.bySelfPick * -1;
                    p3Score = winResultSet.bySelfPick * 3;                    
                    break;
                  case 0:
                    p0Score = winResultSet.bySelfPick * 3;
                    p1Score = winResultSet.bySelfPick * -1;
                    p2Score = winResultSet.bySelfPick * -1;
                    p3Score = winResultSet.bySelfPick * -1;                             
                    break;
                }
                clickWinFlag(-1);
                if (firstRow)  
                {
                    setScoreList([{gameID: rowCnt, scores:[p0Score, p1Score, p2Score, p3Score]}]);
                } else {
                    setScoreList([{gameID: rowCnt+1, scores:[p0Score, p1Score, p2Score, p3Score]},...scoreList]);
                }
                setTotalScore([totalScore[0]+p0Score,totalScore[1]+p1Score, totalScore[2]+p2Score, totalScore[3]+p3Score]);
                break;
              case 2: // discard
              if (winResultSet.LoserID != -1) {
                switch(winResultSet.WinnerID) {
                  case 1:
                    switch(winResultSet.LoserID) {
                        case 2:
                          p0Score = 0;
                          p1Score = winResultSet.byDiscard;
                          p2Score = winResultSet.byDiscard * -1;
                          p3Score = 0;
                          break;
                        case 3:
                          p0Score = 0;
                          p1Score = winResultSet.byDiscard;
                          p3Score = winResultSet.byDiscard * -1;
                          p2Score = 0;
                          break;
                        case 0:
                          p3Score = 0;
                          p1Score = winResultSet.byDiscard;
                          p0Score = winResultSet.byDiscard * -1;
                          p2Score = 0;
                          break;                                                  
                    }
                    break;
                  case 2:
                    switch(winResultSet.LoserID) {
                      case 1:
                        p0Score = 0;
                        p2Score = winResultSet.byDiscard;
                        p1Score = winResultSet.byDiscard * -1;
                        p3Score = 0;
                        break;
                      case 3:
                        p0Score = 0;
                        p2Score = winResultSet.byDiscard;
                        p3Score = winResultSet.byDiscard * -1;
                        p1Score = 0;
                        break;
                      case 0:
                        p3Score = 0;
                        p2Score = winResultSet.byDiscard;
                        p0Score = winResultSet.byDiscard * -1;
                        p1Score = 0;
                        break;   
                    }
                    break;                                                 
                  case 3:
                    switch(winResultSet.LoserID) {
                      case 1:
                        p0Score = 0;
                        p3Score = winResultSet.byDiscard;
                        p1Score = winResultSet.byDiscard * -1;
                        p2Score = 0;
                        break;
                      case 2:
                        p0Score = 0;
                        p3Score = winResultSet.byDiscard;
                        p2Score = winResultSet.byDiscard * -1;
                        p1Score = 0;
                        break;
                      case 0:
                        p1Score = 0;
                        p3Score = winResultSet.byDiscard;
                        p0Score = winResultSet.byDiscard * -1;
                        p2Score = 0;
                        break;                                                  
                    }
                    break;
                  case 0:
                    switch(winResultSet.LoserID) {
                      case 1:
                        p3Score = 0;
                        p0Score = winResultSet.byDiscard;
                        p1Score = winResultSet.byDiscard * -1;
                        p2Score = 0;
                        break;
                      case 2:
                        p1Score = 0;
                        p0Score = winResultSet.byDiscard;
                        p2Score = winResultSet.byDiscard * -1;
                        p3Score = 0;
                        break;
                      case 3:
                        p2Score = 0;
                        p0Score = winResultSet.byDiscard;
                        p3Score = winResultSet.byDiscard * -1;
                        p1Score = 0;
                        break;                                                  
                    }
                    break;
                  }
                  clickWinFlag(-1);
                  if (firstRow )  
                  {
                      setScoreList([{gameID: rowCnt, scores:[p0Score, p1Score, p2Score, p3Score]}]);
                  } else {
                      setScoreList([{gameID: rowCnt+1, scores:[p0Score, p1Score, p2Score, p3Score]},...scoreList]);
                  }
                  setTotalScore([totalScore[0]+p0Score,totalScore[1]+p1Score, totalScore[2]+p2Score, totalScore[3]+p3Score]);
  
              }
              break;
              case 3: // self pick bydiscard
              if (winResultSet.LoserID != -1) {
                switch(winResultSet.WinnerID) {
                  case 1:
                    switch(winResultSet.LoserID) {
                        case 2:
                          p0Score = 0;
                          p1Score = winResultSet.byDiscard * 3;
                          p2Score = winResultSet.byDiscard * -3;
                          p3Score = 0;
                          break;
                        case 3:
                          p0Score = 0;
                          p1Score = winResultSet.byDiscard * 3;
                          p3Score = winResultSet.byDiscard * -3;
                          p2Score = 0;
                          break;
                        case 0:
                          p3Score = 0;
                          p1Score = winResultSet.byDiscard * 3;
                          p0Score = winResultSet.byDiscard * -3;
                          p2Score = 0;
                          break;                                                  
                    }
                    break;
                  case 2:
                    switch(winResultSet.LoserID) {
                      case 1:
                        p0Score = 0;
                        p2Score = winResultSet.byDiscard * 3;
                        p1Score = winResultSet.byDiscard * -3;
                        p3Score = 0;
                        break;
                      case 3:
                        p0Score = 0;
                        p2Score = winResultSet.byDiscard * 3;
                        p3Score = winResultSet.byDiscard * -3;
                        p1Score = 0;
                        break;
                      case 0:
                        p3Score = 0;
                        p2Score = winResultSet.byDiscard * 3;
                        p0Score = winResultSet.byDiscard * -3;
                        p1Score = 0;
                        break;   
                    }
                    break;                                                 
                  case 3:
                    switch(winResultSet.LoserID) {
                      case 1:
                        p0Score = 0;
                        p3Score = winResultSet.byDiscard * 3;
                        p1Score = winResultSet.byDiscard * -3;
                        p2Score = 0;
                        break;
                      case 2:
                        p0Score = 0;
                        p3Score = winResultSet.byDiscard * 3;
                        p2Score = winResultSet.byDiscard * -3;
                        p1Score = 0;
                        break;
                      case 0:
                        p1Score = 0;
                        p3Score = winResultSet.byDiscard * 3;
                        p0Score = winResultSet.byDiscard * -3;
                        p2Score = 0;
                        break;                                                  
                    }
                    break;
                  case 0:
                    switch(winResultSet.LoserID) {
                      case 1:
                        p3Score = 0;
                        p0Score = winResultSet.byDiscard * 3;
                        p1Score = winResultSet.byDiscard * -3;
                        p2Score = 0;
                        break;
                      case 2:
                        p3Score = 0;
                        p0Score = winResultSet.byDiscard * 3;
                        p2Score = winResultSet.byDiscard * -3;
                        p1Score = 0;
                        break;
                      case 3:
                        p1Score = 0;
                        p0Score = winResultSet.byDiscard * 3;
                        p3Score = winResultSet.byDiscard * -3;
                        p2Score = 0;
                        break;                                                  
                    }
                    break;
                  }
                  clickWinFlag(-1);
                  if (firstRow )  
                  {
                      setScoreList([{gameID: rowCnt, scores:[p0Score, p1Score, p2Score, p3Score]}]);
                  } else {
                      setScoreList([{gameID: rowCnt+1, scores:[p0Score, p1Score, p2Score, p3Score]},...scoreList]);
                  }
                  setTotalScore([totalScore[0]+p0Score,totalScore[1]+p1Score, totalScore[2]+p2Score, totalScore[3]+p3Score]);

                }
                break;
            }
        }
    };
 
    const clickWinFlag = (wID) => {
        setWinFlag( !winFlag);
        //clearWinResultSet(-1);          
        clickedWinner(winFlag == false?wID:-1);
        setFanSelected(-1);
        setWinType(-1);
        setSelectLoser(-1);
        console.log("debug:", __filename,'-', Date().toLocaleString(), "clickWinFlag - winFlag", winFlag, "--WinerID", wID, "setWinnerID ", winnerID);

    }
    
    const clickWinLabel = () => {
        setWinLabel(winFlag? '食胡':'');
    }
    
  return (
    <scoreListContext.Provider 
    value={{ scoreList, setScore: scoreListHandler, 
        winnerID, setWinner: clickedWinner, 
        fanSelected, setFan: clickedFanSelect, 
        selectLoser, setLoser: clickedLoser, 
        winType, setType: clickWinType,
        winResultSet, setResult:winResultSetHandler,
        winFlag, setWinnerFlag:clickWinFlag,
        winLabel, setLabel:clickWinLabel,
        initWinResultSet: clearWinResultSet,
        pList, loserGroup, fanList, initAllVar : clearAllVar,
        getPlayerList, 
        totalScore
     }}>
      {children}
    </scoreListContext.Provider>
  );
}

