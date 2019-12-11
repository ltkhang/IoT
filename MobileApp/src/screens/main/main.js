import React from 'react';
import {
  StatusBar,
} from 'react-native';

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Loading from '../loading/loading'
import Home from '../home/home';
import MeasureDetail from '../measureDetail/measuredetail';
import AddDevice from '../add_device/AddDevice';
import PumpDetail from '../pumpDetail/PumpDetail';
import ListMeasure from '../list_measure/ListMeasure';
import ListPump from '../list_pump/ListPump';

const AppNavigator = createStackNavigator(
    {
        Loading: {
            screen : Loading

        },
        Home : {
            screen : Home
        },
        AddDevice: {
            screen: AddDevice
        },
        MeasureDetail: {
            screen: MeasureDetail
        },
        PumpDetail : {
            screen: PumpDetail
        },
        ListMeasure: {
            screen: ListMeasure
        },
        ListPump: {
            screen: ListPump
        }
    }, {
        initialRouteName: 'Loading',
        headerMode: 'none'
    }
)

export default createAppContainer(AppNavigator);
