import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useRouter,Link } from 'expo-router';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Button({ label, onclicklabel, theme, gotoURL, params, icoName }) {
  const [buttonText, setButtonText] = useState(label);
  //const navigation = useRouter();
  const navigation = useNavigation();
  
  function changeLabel() {
    if (buttonText == label) {
      setButtonText(onclicklabel);
    } else {
      setButtonText(label);
    }
    //alert('You pressed the button.')
    //setButtonText(label);    
    // navigation.push(gotoURL);
    return (
      //<Link href="/details">Go to Details</Link>
      navigation.navigate(gotoURL, params)
    );
  }

  if (theme === "primary") {
    return (
      <View
      style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          // onPress={() => alert('You pressed a button.')}
          onPress={changeLabel} >
          <FontAwesome name={icoName} />
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}> {buttonText}</Text>
        </Pressable>
    </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  // Styles from previous step remain unchanged.
  buttonContainer: {
    flexDirection: 'row',
    width: 150,
    height: 68,
    marginHorizontal: 20,
//    alignItems: 'center',
//    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
