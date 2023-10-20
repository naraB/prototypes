import {PixelRatio} from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

import {spring} from '../../motion/spring';

interface Props {
  isDragging: SharedValue<boolean>;
  absoluteTouchX: SharedValue<number>;
  absoluteTouchY: SharedValue<number>;
}

export function Pointer({isDragging, absoluteTouchX, absoluteTouchY}: Props) {
  const transition = useDerivedValue(() => {
    return isDragging.value ? spring(1) : spring(0);
  });

  const pointerStyle = useAnimatedStyle(() => ({
    opacity: transition.value,

    shadowOpacity: interpolate(transition.value, [0, 1], [0, 0.15]),

    transform: [
      {
        translateX: absoluteTouchX.value,
      },
      {
        translateY: absoluteTouchY.value,
      },
      {
        scale: interpolate(transition.value, [0, 1], [0.5, 1]),
      },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        pointerStyle,
        {
          position: 'absolute',
          zIndex: 100,
          left: -20,
          top: -20,
          width: 40,
          height: 40,
          backgroundColor: 'rgba(220,220,220,0.8)',
          borderRadius: 20,
          borderWidth: PixelRatio.roundToNearestPixel(2),
          borderColor: 'rgba(255,255,255,1)',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowRadius: 2,
          overflow: 'visible',
        },
      ]}
    />
  );
}
