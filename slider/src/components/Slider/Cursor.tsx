import {ComponentProps} from 'react';
import {LayoutRectangle, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, {Rect} from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import {useSharedTuple} from '../../hooks/useSharedTuple';
import {spring} from '../../motion/spring';
import {accentColor} from '../../utils/colors';
import {rubberBanding, songLengthMs} from '../../utils/constants';
import {clamp} from '../../utils/helpers';

export const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface Props {
  initialHeight: number;
  positions: SharedValue<LayoutRectangle>[];
  bounds: [number, number];
  onDrag: (currentIndex: number, translateX: number) => void;
  soundProgress: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  absoluteTouchX: SharedValue<number>;
  absoluteTouchY: SharedValue<number>;
  cursorScale: SharedValue<number>;
  currentIndex: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  shouldCancelDrag: SharedValue<boolean>;
}

export function Cursor({
  positions,
  bounds,
  initialHeight,
  onDrag,
  soundProgress,
  currentIndex,
  translateX,
  translateY,
  isDragging,
  cursorScale,
  shouldCancelDrag,
  absoluteTouchX,
  absoluteTouchY,
}: Props) {
  const [fingerPositionX, fingerPositionY] = useSharedTuple(0);
  const [startPositionX, startPositionY] = useSharedTuple(0);

  const springTranslateX = useDerivedValue(() => spring(translateX.value));
  const springTranslateY = useDerivedValue(() => {
    const nextY = interpolate(
      translateY.value,
      [-bounds[1] * 3, -bounds[1], 0, bounds[1] * 3],
      [
        translateY.value / rubberBanding.y -
          bounds[1] +
          positions[currentIndex.value].value.height,
        -bounds[1] + positions[currentIndex.value].value.height,
        0,
        translateY.value / rubberBanding.y,
      ]
    );
    if (!isDragging.value) {
      return spring(nextY, {response: 0.55, dampingFraction: 0.825});
    }

    return spring(nextY, {
      response: 0.35,
      dampingFraction: 0.825,
    });
  }, [bounds[1]]);

  const isSnapping = useSharedValue(false);
  const opacity = useDerivedValue(() =>
    shouldCancelDrag.value ? spring(0) : spring(1)
  );

  const transition = useDerivedValue(() => {
    return isDragging.value
      ? spring(1)
      : spring(0, {response: 0.3, dampingFraction: 0.84});
  });

  const timeSinceLastFrame = useSharedValue(0);

  const findClosestIndicator = (caretPosition: number) => {
    'worklet';

    let closestIndex: number = 0;
    let minDiff = Infinity;

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i].value;

      if (!pos) {
        continue;
      }

      const diff = Math.abs(pos.x - caretPosition);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    return closestIndex;
  };

  const snapToClosest = (closestIndex: number) => {
    'worklet';

    isSnapping.value = true;

    currentIndex.value = closestIndex;
    const closest = positions[closestIndex].value;

    translateX.value = closest.x;
    cursorScale.value = spring(closest.height / initialHeight, {
      response: 0.35,
      dampingFraction: 0.825,
    });
  };

  const moveInBetween = (closestIndex: number) => {
    'worklet';

    const closest = positions[closestIndex].value;
    const offset = (fingerPositionX.value - closest.x) / rubberBanding.x;
    translateX.value = closest.x + offset;
  };

  const checkIfFingerCaughtUpWithCaret = () => {
    'worklet';

    // This essentially waits for the finger to catch up to the caret before
    // movement of the caret is allowed again (note: movement caused by finger, not caused by snapping)
    const {x} = positions[currentIndex.value].value;
    if (Math.abs(x - fingerPositionX.value) <= 1) {
      isSnapping.value = false;
    }
  };

  const pan = Gesture.Pan()
    .onTouchesDown((event) => {
      isDragging.value = true;
      absoluteTouchX.value = event.allTouches[0].absoluteX;
      absoluteTouchY.value = event.allTouches[0].absoluteY;
    })
    .onFinalize(() => {
      isDragging.value = false;
    })
    .onStart((event) => {
      isDragging.value = true;
      startPositionX.value = translateX.value;
      startPositionY.value = translateY.value;

      absoluteTouchX.value = event.absoluteX;
      absoluteTouchY.value = event.absoluteY;
    })
    .onUpdate((event) => {
      absoluteTouchX.value = event.absoluteX;
      absoluteTouchY.value = event.absoluteY;

      fingerPositionX.value = event.translationX + startPositionX.value;
      const closestIndex = findClosestIndicator(fingerPositionX.value);

      if (isSnapping.value) {
        checkIfFingerCaughtUpWithCaret();
      }

      if (!isSnapping.value) {
        moveInBetween(closestIndex);
      }

      if (closestIndex !== currentIndex.value) {
        snapToClosest(closestIndex);
        onDrag(closestIndex, fingerPositionX.value);
        if (!shouldCancelDrag.value) {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
      }

      fingerPositionY.value = event.translationY + startPositionY.value;

      const isOutside =
        (fingerPositionY.value < -bounds[1] * 3 ||
          fingerPositionY.value > bounds[1] * 3) &&
        !shouldCancelDrag.value;
      const isInside =
        fingerPositionY.value >= -bounds[1] * 3 &&
        fingerPositionY.value <= bounds[1] * 3 &&
        shouldCancelDrag.value;

      if (isOutside) {
        shouldCancelDrag.value = true;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
      }
      if (isInside) {
        shouldCancelDrag.value = false;
      }
      translateY.value = fingerPositionY.value;
    })
    .onEnd(() => {
      const closestIndex = findClosestIndicator(fingerPositionX.value);

      if (!shouldCancelDrag.value) {
        shouldCancelDrag.value = false;
        const newProgress = interpolate(
          closestIndex,
          [0, positions.length],
          [0, songLengthMs],
          Extrapolation.CLAMP
        );
        timeSinceLastFrame.value = newProgress;
      }
      snapToClosest(closestIndex);

      fingerPositionY.value = 0;

      shouldCancelDrag.value = false;
      isDragging.value = false;
      translateY.value = 0;
    })
    .minDistance(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(transition.value, [0, 1], [0.1, 0.6]),
      transform: [
        {
          translateX: springTranslateX.value,
        },
        {
          translateY: springTranslateY.value,
        },
      ],
    };
  });

  const animatedRectProps = useAnimatedProps<ComponentProps<typeof Rect>>(
    () => {
      const ry = 2 / Math.max(cursorScale.value, 0.001);

      return {
        opacity: interpolate(opacity.value, [0, 1], [0.7, 1]),
        ry,

        transform: [
          {
            scaleY: cursorScale.value,
          },
        ],
      };
    }
  );

  useFrameCallback((frameInfo) => {
    timeSinceLastFrame.value += frameInfo.timeSincePreviousFrame ?? 0;

    const positionSinceLastFrame = interpolate(
      timeSinceLastFrame.value,
      [0, songLengthMs],
      [0, bounds[0]]
    );
    if (!isDragging.value) {
      fingerPositionX.value = clamp(positionSinceLastFrame, 0, bounds[0] - 8);
      soundProgress.value = clamp(timeSinceLastFrame.value, 0, songLengthMs);

      const closestIndex = findClosestIndicator(fingerPositionX.value);
      moveInBetween(closestIndex);
      if (closestIndex !== currentIndex.value) {
        snapToClosest(closestIndex);
      }
    }
  });

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: bounds[1],
        width: bounds[0],
        overflow: 'visible',
      }}
    >
      <GestureDetector gesture={pan}>
        <Animated.View>
          <Animated.View
            style={[
              animatedStyle,
              {
                overflow: 'visible',
                shadowColor: '#F70000',
                shadowOffset: {width: 0, height: 0},
                shadowRadius: 8,
              },
            ]}
          >
            <Svg
              width={4}
              height={bounds[1]}
              style={{
                transform: [{scaleY: -1}],
              }}
            >
              <AnimatedRect
                width={4}
                height={initialHeight}
                rx={2}
                fill={accentColor}
                animatedProps={animatedRectProps}
              />
            </Svg>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
