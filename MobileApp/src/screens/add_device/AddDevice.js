import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';

import { Color, Styles } from '../../utils'

export default class AddDevice extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    }
  }

  componentDidMount(){

  }

  render() {
    return (
        <View>
          <StatusBar barStyle="dark-content" />
          <View 
            style={{
              height: '100%',
              width: '100%', 
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 1,backgroundColor: '#e5eff1'

          }}
          >
             <View style={styles.body}>
               <Text
                  style={{
                    fontSize: 40,
                    fontWeight: '500',
                    marginBottom: 200
                }}>Add Device</Text>
              </View>
            </View>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  mainView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  body: {
    backgroundColor: "#ffffff00",
    justifyContent: 'flex-end',
    alignItems: "center",
    flex: 1,
    paddingBottom: 50
  }
});
