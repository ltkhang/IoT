import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WIDTH_RATIO, Color } from './';

const iconGoBack = require('../assets/images/icon_go_back.png');

export const getComponent = (type, name, style = {}) => {
    if (type === 'isHaveBackButton') {
        return (
            <Image
                source={iconGoBack}
                style={[styles.goBackImage, style]}
            />
        );
    }
    if (type === 'Image') {
        return (
            <Image
                source={name}
                style={[styles.textInputIcon, style]}
                resizeMode='contain'
            />
        );
    }
    if (type === 'FontAwesome') {
        return (
            <FontAwesome
                name={name}
                color={style.color ? style.color : Color.textColor}
                size={style.size ? style.size : 20 * WIDTH_RATIO}
            />
        );
    }
    if (type === 'Entypo') {
        return (
            <Entypo
                name={name}
                color={style.color ? style.color : Color.textColor}
                size={style.size ? style.size : 20 * WIDTH_RATIO}
            />
        );
    }
    if (type === 'MaterialCommunityIcons') {
        return (
            <MaterialCommunityIcons
                name={name}
                color={style.color ? style.color : Color.textColor}
                size={style.size ? style.size : 20 * WIDTH_RATIO}
            />
        );
    }
    if (type === 'Octicons') {
        return (
            <Octicons
                name={name}
                color={style.color ? style.color : Color.textColor}
                size={style.size ? style.size : 20 * WIDTH_RATIO}
            />
        );
    }
    if (type === 'MaterialIcons') {
        return (
            <MaterialIcons
                name={name}
                color={style.color ? style.color : Color.textColor}
                size={style.size ? style.size : 20 * WIDTH_RATIO}
            />
        );
    }
    if (type === 'Ionicons') {
        return (
            <Ionicons
                name={name}
                color={style.color ? style.color : Color.textColor}
                size={style.size ? style.size : 20 * WIDTH_RATIO}
            />
        );
    }
    return (
        <View style={{ height: 20 * WIDTH_RATIO, width: 20 * WIDTH_RATIO }} />
    );
};

const styles = StyleSheet.create({
    textInputIcon: {
        width: 20 * WIDTH_RATIO,
        height: 20 * WIDTH_RATIO,
    },
    goBackImage: {
        width: 12 * WIDTH_RATIO,
        height: 24 * WIDTH_RATIO,
        tintColor: 'white'
    }
});