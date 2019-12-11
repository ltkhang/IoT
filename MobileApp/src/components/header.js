import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import {
  Color,
  Styles,
  WIDTH_RATIO,
  getComponent
} from '../utils';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const iconGoBack = require('../assets/images/icon_go_back.png');
export class Header extends Component {
  render() {
    const {
      containerStyle,
      backgroundColor,
      contentColor,
      title,
      onLeftPress = () => { },
      onRightPress = () => { },
      isHaveButtonRight = false
    } = this.props;

    return (
      <View style={containerStyle}>
        <StatusBar
          backgroundColor={backgroundColor}
          contentColor={contentColor}
        />
        <View
          style={[
            styles.headerContainer,
            { backgroundColor: backgroundColor || 'transparent' }
          ]}
        >
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onLeftPress}
          >
            <MaterialIcons name={"arrow-back"} size={25}/>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              selectable
              style={[
                Styles.textBold,
                styles.titleText,
                { color: contentColor || Color.textColor }
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          {isHaveButtonRight ? 
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onRightPress}
          >
            <MaterialIcons name={"add"} size={25}/>
          </TouchableOpacity> : 
          <View style={styles.buttonContainer}/> 
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row'
  },
  buttonContainer: {
    flex: 1.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14 * WIDTH_RATIO
  },
  titleContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 14 * WIDTH_RATIO
  }
});