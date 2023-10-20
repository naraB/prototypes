import React, {ForwardedRef, forwardRef, ReactNode} from 'react';
import {LayoutChangeEvent, View, ViewStyle} from 'react-native';

export type BoxAttrs = ViewStyle;

type Props = {
  testID?: string;
  style?: ViewStyle | ViewStyle[];
  children?: ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
} & BoxAttrs;

export const Box = forwardRef(
  (
    {children, testID, onLayout, style, ...styles}: Props,
    ref: ForwardedRef<View>
  ) => (
    <View testID={testID} ref={ref} style={[style, styles]} onLayout={onLayout}>
      {children}
    </View>
  )
);
