import { Platform } from 'react-native';
import { WIDTH_RATIO } from './Dimens';
import { Color } from './Colors';

const textStyle = {
  color: Color.textColor,
  fontSize: 14 * WIDTH_RATIO,
  marginBottom: Platform.OS === 'ios' ? 0 : -3,
  paddingTop: 2,
};
export const Styles = {
  text: Platform.select({
    ios: {
      // fontFamily: 'SVN-Poppins',
      ...textStyle
    },
    android: {
      // fontFamily: 'SVN-Poppins Regular',
      ...textStyle
    }
  }),
  textBold: Platform.select({
    ios: {
      // fontFamily: 'SVN-Poppins',
      fontWeight: 'bold',
      ...textStyle
    },
    android: {
      // fontFamily: 'SVN-Poppins Bold',
      ...textStyle
    }
  }),
  textSemiBold: Platform.select({
    ios: {
      // fontFamily: 'SVN-Poppins',
      fontWeight: '600',
      ...textStyle
    },
    android: {
      // fontFamily: 'SVN-Poppins SemiBold',
      ...textStyle
    }
  }),
  textItalic: Platform.select({
    ios: {
      // fontFamily: 'SVN-Poppins',
      fontStyle: 'italic',
      ...textStyle
    },
    android: {
      // fontFamily: 'SVN-Poppins Italic',
      ...textStyle
    }
  }),
  shadowStyle:
    Platform.OS === 'ios'
      ? {
        shadowOpacity: 1,
        shadowOffset: {
          width: 1,
          height: 2
        },
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowRadius: 2,
        zIndex: 2,
        elevation: 2
      }
      : {
        shadowOpacity: 1,
        shadowOffset: {
          width: 1,
          height: 2
        },
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowRadius: 2,
        zIndex: 2,
        elevation: 2
      }
};