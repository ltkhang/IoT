import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  Button,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

import { Color, Styles } from '../../utils'

export default class Loading extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isConnecting: false,
      text: 'Connect to Server'
    }
  }

  componentDidMount(){

  }

  render() {
    return (
          <ImageBackground 
            source={require('../../assets/images/icon.png')}
            style={{
              height: '100%',
              width: '100%', 
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 1,
              backgroundColor: '#000000'

          }}
          >
             <View style={styles.body}>
               <Text
                  style={{
                    fontSize: 60,
                    fontWeight: '500',
                    marginVertical: 120,
                    textAlign: 'center',
                    color: 'white'
                  }}
                >SMART GARDEN</Text>
                {this.state.isConnecting ? 
                <View style={{
                  width: 200,
                  height: 200,
                  marginBottom: 200
                }}>
                <Image
                source={require('../../assets/images/loading.gif')}
                style={{
                  width: 200,
                  height: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                /> 
                </View>
                :
                <View style={{
                  width: 200,
                  height: 200,
                  marginBottom: 150,
                }}/>
                }
                 <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: '#ffffff',
                      borderRadius: 5,
                      shadowColor: '#bdbdbd',
                      shadowOffset: {
                        width: 0,
                        height: 3
                      },
                      shadowRadius: 5,
                      shadowOpacity: 1.0
                    }}
                    onPress={() => {
                      this.setState({
                        isConnecting : true,
                        text: 'Connecting ...'
                      })
                      setTimeout(()=>{
                        this.setState({isConnecting: false})
                        this.props.navigation.navigate("Home")
                      }, 2000)
                    }}
                >
                  <Text style={{fontSize: 20, color: '#202646'}}>{this.state.text}</Text>  
                </TouchableOpacity>
              </View>
            </ImageBackground>
      );
  }
};

const styles = StyleSheet.create({
  mainView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  body: {
    alignItems: "center",
    flex: 1,
    paddingBottom: 50,
    zIndex: 2
  }
});
