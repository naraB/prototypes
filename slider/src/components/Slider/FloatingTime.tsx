import {LayoutChangeEvent, LayoutRectangle, PixelRatio} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import {spring} from '../../motion/spring';
import {accentColor, accentMuted} from '../../utils/colors';
import {rubberBanding} from '../../utils/constants';
import {clamp} from '../../utils/helpers';
import ReText from './ReText';

interface Props {
  text: SharedValue<string>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  shouldCancelDrag: SharedValue<boolean>;
  bounds: [number, number];
}

export function FloatingTime({
  text,
  translateX,
  translateY,
  isDragging,
  bounds,
  shouldCancelDrag,
}: Props) {
  const ref = useAnimatedRef<Animated.View>();
  const layout = useSharedValue<LayoutRectangle | null>(null);
  const opacity = useDerivedValue(() =>
    shouldCancelDrag.value ? spring(0) : spring(1)
  );
  const springTranslateX = useDerivedValue(() => {
    return spring(translateX.value, {
      response: 0.38,
      dampingFraction: 0.81,
    });
  });
  const springTranslateY = useDerivedValue(() => {
    const nextY = interpolate(
      translateY.value,
      [-bounds[1] * 3, -bounds[1], 0, bounds[1] * 3],
      [
        translateY.value / rubberBanding.y,
        0,
        0,
        translateY.value / rubberBanding.y,
      ]
    );

    return spring(nextY, {
      response: 0.35,
      dampingFraction: 0.825,
    });
  });

  const transition = useDerivedValue(() => {
    return isDragging.value
      ? spring(1)
      : spring(0, {response: 0.3, dampingFraction: 0.84});
  });

  const onLayout = (event: LayoutChangeEvent) => {
    layout.value = event.nativeEvent.layout;
  };

  const animatedStyle = useAnimatedStyle(() => {
    const transitionX = interpolate(
      transition.value,
      [0, 1],
      [0, springTranslateX.value - (layout.value?.width ?? 0) / 2]
    );

    return {
      transform: [
        {
          translateY: interpolate(
            transition.value,
            [0, 1],
            [0, -4 - bounds[1] - (layout.value?.height ?? 0) - 8]
          ),
        },
        {
          translateY: interpolate(
            transition.value,
            [0, 1],
            [0, springTranslateY.value]
          ),
        },
        {
          translateX:
            clamp(transitionX, -2, bounds[0] - (layout.value?.width ?? 0) + 2) +
            interpolate(
              springTranslateX.value,
              [-32, 0, bounds[0], bounds[0] + 32],
              [-32, 0, 0, 32]
            ),
        },
        {
          translateY: interpolate(transition.value, [0, 1], [0, 0]),
        },
        {
          translateX: interpolate(transition.value, [0, 1], [-6, 0]),
        },
      ],
      backgroundColor: interpolateColor(
        transition.value,
        [0, 1],
        ['rgba(255,255,255,0)', accentMuted]
      ),
      borderColor: interpolateColor(
        transition.value,
        [0, 1],
        ['rgba(255,255,255,0)', accentColor]
      ),
    };
  });

  const animatedTextStyles = useAnimatedStyle(() => ({
    color: interpolateColor(transition.value, [0, 1], ['#8F8F8F', accentColor]),
    fontSize: interpolate(transition.value, [0, 1], [13, 14]),
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0, 1], [0.7, 1]),
  }));

  return (
    <Animated.View style={opacityStyle}>
      <Animated.View
        ref={ref}
        style={[
          animatedStyle,
          {
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 10,
            borderCurve: 'continuous',
            borderWidth: PixelRatio.roundToNearestPixel(1.5),
          },
        ]}
        onLayout={onLayout}
      >
        <ReText
          text={text}
          style={[
            animatedTextStyles,
            {
              fontFamily: 'SF-Mono-Medium',
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
}
