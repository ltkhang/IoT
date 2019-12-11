/**
 * @format
 */

import {AppRegistry} from 'react-native';
import AppNavigator from './src/screens/main/main';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppNavigator);
