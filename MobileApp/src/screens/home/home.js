import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  ImageBackground
} from 'react-native';

export default class Home extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      height: Dimensions.get("window").height,
      animation   : new Animated.Value(Dimensions.get("window").height),
      device: 0
    }
  }
  render() {
    return (
    <View>
        <StatusBar barStyle="dark-content" />
        <View style={styles.mainView}>
        <View
        style={{
          backgroundColor: 'black',
          height: Dimensions.get('window').height
        }}
        >
          <ImageBackground
            source={require('../../assets/images/icon.png')}
            style={{flex: 1, resizeMode: 'contains', justifyContent: 'center', alignItems: 'center'}}
          > 
          <View style={{
                position: 'absolute', 
                zIndex: 1, 
                height: '100%', 
                width: '100%', 
                backgroundColor: '#ffffff01'
                }}/>
            <TouchableOpacity
              style={{
                padding: 10,
                height: 100,
                width: Dimensions.get('window').width - 40,
                backgroundColor: '#ffffff00',
                borderRadius: 5,
                shadowColor: '#bdbdbd',
                shadowOffset: {
                  width: 0,
                  height: 3
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                margin: 25,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2, 
              }}
              onPress={() => {
                this.setState({device: 1})
                this.props.navigation.navigate("ListMeasure")
              }}
            >
              <Text 
                style={{
                  fontSize: 30,
                  color: '#ffffff',
                  fontWeight: 'bold'
                }}
              >MEASURE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                height: 100,
                width: Dimensions.get('window').width - 40,
                backgroundColor: '#ffffff00',
                borderRadius: 5,
                shadowColor: '#bdbdbd',
                shadowOffset: {
                  width: 0,
                  height: 3
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                margin: 25,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2, 
              }}
              onPress={() => {
                this.setState({device: 0})
                this.props.navigation.navigate("ListPump")
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  color: '#ffffff',
                  fontWeight: 'bold'
                }}
              >PUMP</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        
        </View>
    </View>
    );
  }
};

const styles = StyleSheet.create({
  mainView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 20
  },
  detailText: {
    fontSize: 20,
    paddingTop: 10,
  }
});
