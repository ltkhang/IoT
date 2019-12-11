import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const DEVICES_WIDTH = width;
export const DEVICES_HEIGHT = height;
export const WIDTH_RATIO = width / 375;
export const HEIGHT_RATIO = DEVICES_HEIGHT / 812;