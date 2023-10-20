import * as React from 'react';
import {ColorValue, StyleProp, ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';

import {placeholderBorderColor} from '../../utils/colors';

interface Props {
  size: number;
  fill: ColorValue;
  style?: StyleProp<ViewStyle>;
}

export function Triangle({size, fill, style}: Props) {
  return (
    <Svg style={style} width={size} height={size} viewBox="0 0 11 13">
      <Path
        stroke={placeholderBorderColor}
        strokeWidth={0.2}
        fill={fill}
        d="M1.783 12.629c-.332 0-.63-.123-.896-.37-.262-.241-.393-.585-.393-1.03v-8.9c0-.446.131-.79.393-1.032.265-.246.564-.37.896-.37.153 0 .307.024.463.071.16.047.344.13.55.252l7.237 4.201c.293.168.526.358.697.569.176.207.264.459.264.755 0 .301-.088.555-.264.762a2.61 2.61 0 0 1-.697.568l-7.236 4.202c-.207.117-.39.199-.55.246-.157.05-.311.076-.464.076Z"
      />
    </Svg>
  );
}
