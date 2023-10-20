import {PixelRatio} from 'react-native';

import {placeholderBorderColor, placeholderColor} from '../../utils/colors';
import {Box} from '../Box';

interface Props {
  width: number;
  height: number;
  borderRadius: number;
  borderWidth?: number;
}

export function Placeholder({width, height, borderRadius, borderWidth}: Props) {
  return (
    <Box
      borderWidth={borderWidth ?? 1}
      borderColor={placeholderBorderColor}
      width={width}
      height={height}
      backgroundColor={placeholderColor}
      borderRadius={borderRadius ?? PixelRatio.roundToNearestPixel(width / 3)}
      borderCurve="continuous"
    />
  );
}
