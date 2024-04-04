import React, { Component, useContext, useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
// import { getGameResult } from './winCal';
import { useScoreList } from './scoreListContext';

export default function WinList() {
  const {pList} = useScoreList() ;
  //const tableHead = ['自己', '上家', '對家', '下家'];
  const widthArr = [44, 44, 44, 44];
  //const tableFooter = [50,100,-50,-100];
  const scrollViewRef = useRef(null);
  const {scoreList, totalScore} = useScoreList();
  //console.log("debug:", "WinList",'-', Date().toLocaleString(), 'WinList - TotalScore', totalScore);
  //console.log("debug:", "WinList.js",'-', Date().toLocaleString(), "pList", pList);

  
  const playerArray = () => {
    var tableHead=[];
    pList.forEach(element => {
      tableHead.push(element.PlayerName);
    });
    //console.log("debug:", "WinList.js",'-', Date().toLocaleString(), "playerArray", tableHead);
  
    return tableHead;
  } 
  

return (
  <View style={styles.container}>
  <ScrollView horizontal={true} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd()}>
    <View>
      <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
        <Row data={playerArray()} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
      </Table>
      <ScrollView style={styles.dataWrapper}>
        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
          {
            scoreList.map((index) => (
              <Row
                key={index.gameID}
                data={index.scores}
                widthArr={widthArr}
                style={styles.row}
                textStyle={styles.text}
              />
            ))
          }
        </Table>
      </ScrollView>
      <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
        <Row data={totalScore} widthArr={widthArr} style={styles.footer} textStyle={styles.text}/>
      </Table>
    </View>
  </ScrollView>
</View>
)
}

// export default class WinList2 extends Component {
//   constructor(props) {
//     super(props);     
//     this.state = {
//       tableHead: ['自己', '上家', '對家', '下家'],
//       widthArr: [44, 44, 44, 44],
//       tableFooter: [50,100,-50,-100],
//       playerScore: props.playerScore,
//       scoreList: props.scoreList,
//     }
//   }

//   render() {
//     const state = this.state;

//     //const [scoreList, setScoreList]  =  useContext(scoreListContext);
//     console.log("debug:", "__filename",'-', Date().toLocaleString(), 'WinList - ScoreListContext Check');

//     if (state.scoreList != null) {
//       console.log("debug:", "__filename",'-', Date().toLocaleString(), 'WinList - ScoreList', state.scoreList, state.scoreList.length);

//     } else {
//       console.log("debug:", "__filename",'-', Date().toLocaleString(), 'WinList - ScoreList is null');

//     }

//     // for (let i = 0; i < 10; i += 1) {
//     //   //const playerScore = [];
//     //   for (let j = 0; j < 5; j += 1) {
//     //     state.playerScore.push(i+'-'+j);
//     //   }
//     //   state.scoreList.push(state.playerScore);
//     // }
//     // console.log("debug:", "__filename",'-', Date().toLocaleString(),'PlayerScore', state.playerScore);
//     // console.log("debug:", "__filename",'-', Date().toLocaleString(),'PlayerScore',state.scoreList[0].scores);

//     return (
//       <View style={styles.container}>
//         <ScrollView horizontal={true}>
//           <View>
//             <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
//               <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
//             </Table>
//             <ScrollView style={styles.dataWrapper}>
//               <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
//                 {
//                   state.scoreList.map((index) => (
//                     <Row
//                       key={index.gameID}
//                       data={index.scores}
//                       widthArr={state.widthArr}
//                       style={styles.row}
//                       textStyle={styles.text}
//                     />
//                   ))
//                 }
//               </Table>
//             </ScrollView>
//             <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
//               <Row data={state.tableFooter} widthArr={state.widthArr} style={styles.footer} textStyle={styles.text}/>
//             </Table>
//           </View>
//         </ScrollView>
//       </View>
//     )
//   }
// }

const styles = StyleSheet.create({
  container: { width: 180, height: 180,    
    backgroundColor: 'aliceblue', marginLeft:5,
  },
  header: { height: 30, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: 'bold' },
  dataWrapper: { marginTop: -1 },
  row: { height: 20, backgroundColor: '#E7E6E1' },
  footer: {height: 30, backgroundColor: '#537791' },
});