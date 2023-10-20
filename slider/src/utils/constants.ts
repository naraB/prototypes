import {Dimensions} from 'react-native';

const songLengthMin = 1.45;
export const songLengthMs = songLengthMin * 60 * 1000;

const screenWidth = Dimensions.get('screen').width;
export const numIndicators = parseInt((screenWidth / 9).toFixed(0), 10);

export const rubberBanding = {x: 3, y: 80};
