import React from 'react';
import type {TextInputProps, TextProps as RNTextProps} from 'react-native';
import {StyleSheet, TextInput} from 'react-native';
import Animated, {useAnimatedProps} from 'react-native-reanimated';

const styles = StyleSheet.create({
  baseStyle: {
    padding: 0,
    paddingVertical: 0,
  },
});
Animated.addWhitelistedNativeProps({text: true});

interface TextProps extends Omit<TextInputProps, 'value' | 'style'> {
  text: Animated.SharedValue<string>;
  style?: Animated.AnimateProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ReText(props: TextProps) {
  const {style, text, ...rest} = props;
  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value,
      // Here we use any because the text prop is not available in the type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={text.value}
      style={[styles.baseStyle, style || undefined]}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      {...{animatedProps}}
    />
  );
}

export default ReText;
