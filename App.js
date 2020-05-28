import React, { Component } from "react";
import { Platform } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
  Button,
  FlatList,
} from "react-native";
import * as firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
  /* YOUR FIRE BASE CONFIG GOES HERE */
};

if (!firebase.apps.length > 0) firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  state = {
    name: "alex",
    message: "Some text",
    messages: [],
  };

  onChangeText(field_) {
    return (val_) => {
      this.setState({
        [field_]: val_,
      });
    };
  }

  onSend = () => {
    firebase
      .database()
      .ref("messages")
      .push({
        date: Date.now(),
        message: this.state.message,
        name: this.state.name,
      })
      .then(() => {
        Alert.alert("message send");
      })
      .catch((err_) => {
        console.error(err_);
      });
  };

  componentDidMount() {
    firebase
      .database()
      .ref("messages")
      .on("child_added", (snapshot) => {
        let messagesNew = this.state.messages;
        messagesNew.push(snapshot.val());
        //Sort the array by datefrom most recent
        messagesNew.sort((a, b) => {
          return a > b;
        });
        this.setState({
          messages: messagesNew,
        });
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" && <View style={styles.statusBar}></View>}
        <FlatList
          style={styles.containerChat}
          data={this.state.messages}
          renderItem={({ item }) => {
            return (
              <View style={styles.chatItem}>
                <Text style={styles.chatName}>
                  {"@" +
                    item.name +
                    " at " +
                    new Date(item.date).toLocaleTimeString()}
                </Text>
                <Text style={styles.chatMessage}>{item.message}</Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.date}
        ></FlatList>
        {/*this.state.messages.map((item_) => (
            <Text key={item_.Date}>{item_.message}</Text>
          ))*/}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.name}
            onChangeText={this.onChangeText("name")}
          ></TextInput>
          <TextInput
            style={styles.input}
            value={this.state.message}
            onChangeText={this.onChangeText("message")}
          ></TextInput>
          <Button title="Send" onPress={this.onSend}></Button>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fee2b3",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBar: {
    backgroundColor: "#562349",
    width: "100%",
    height: 28,
  },
  image: {
    width: 200,
    height: 200,
    margin: 14,
  },

  inputContainer: {
    width: "100%",
  },

  input: {
    backgroundColor: "#fff",
    padding: 4,
    margin: 4,
    borderRadius: 4,
  },

  chatItem: {
    backgroundColor: "#562349",
    padding: 8,
    margin: 8,
    borderRadius: 4,
  },

  containerChat: {
    width: "100%",
  },

  chatName: {
    color: "#ad6989",
    fontSize: 20,
  },

  chatMessage: {
    color: "#ffa299",
    fontSize: 20,
  },
});
