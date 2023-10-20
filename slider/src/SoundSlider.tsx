import {useMemo, useState} from 'react';
import {LayoutChangeEvent, LayoutRectangle} from 'react-native';
import {
  Extrapolation,
  interpolate,
  makeMutable,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Box, Controls, Cover, Pointer, Slider, Title} from './components';
import {useSharedTuple} from './hooks/useSharedTuple';
import {numIndicators, songLengthMs} from './utils/constants';
import {formatMilliseconds, getRandomInt} from './utils/helpers';

const indicators = [...Array(numIndicators).keys()].map(() => ({
  height: getRandomInt(8, 48),
}));

export function SoundSlider() {
  const [absoluteTouchX, absoluteTouchY] = useSharedTuple(0);
  const isDragging = useSharedValue(false);
  const soundProgress = useSharedValue(0);
  const leftText = useSharedValue('00:00');
  const rightText = useSharedValue(`-${formatMilliseconds(songLengthMs)}`);
  const [bounds, setBounds] = useState<[number, number]>([0, 0]);
  const [translateX, translateY] = useSharedTuple(0);
  const caretScale = useSharedValue(1);
  const currentIndex = useSharedValue(0);
  const shouldCancelDrag = useSharedValue(false);

  const indicatorPositions: SharedValue<LayoutRectangle>[] = useMemo(
    () => indicators.map(() => makeMutable({x: 0, y: 0, height: 0, width: 0})),
    []
  );

  useAnimatedReaction(
    () => soundProgress.value,
    (time) => {
      leftText.value = formatMilliseconds(time);
      rightText.value = `-${formatMilliseconds(songLengthMs - time)}`;
    }
  );

  const onDrag = (nextIndex: number) => {
    'worklet';

    const time = interpolate(
      nextIndex,
      [0, indicators.length],
      [0, songLengthMs],
      Extrapolation.CLAMP
    );

    leftText.value = formatMilliseconds(time);
    rightText.value = `-${formatMilliseconds(songLengthMs - time)}`;
  };

  const onIndicatorContainerLayout = (event: LayoutChangeEvent) => {
    setBounds([
      event.nativeEvent.layout.width,
      event.nativeEvent.layout.height,
    ]);
  };

  const onIndicatorLayout = (index: number) => (event: LayoutChangeEvent) => {
    indicatorPositions[index].value = {...event.nativeEvent.layout};
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}} mode="padding">
        <Box
          paddingVertical={20}
          flex={1}
          alignItems="center"
          paddingHorizontal={32}
          gap={40}
        >
          <Cover />
          <Box style={{gap: 52}}>
            <Title />
            <Slider
              rightText={rightText}
              leftText={leftText}
              indicators={indicators}
              onIndicatorContainerLayout={onIndicatorContainerLayout}
              onIndicatorLayout={onIndicatorLayout}
              absoluteTouchX={absoluteTouchX}
              absoluteTouchY={absoluteTouchY}
              shouldCancelDrag={shouldCancelDrag}
              currentIndex={currentIndex}
              cursorScale={caretScale}
              isDragging={isDragging}
              translateX={translateX}
              translateY={translateY}
              soundProgress={soundProgress}
              onDrag={onDrag}
              positions={indicatorPositions}
              bounds={bounds}
            />
          </Box>
          <Controls />
        </Box>
      </SafeAreaView>
      <Pointer
        absoluteTouchX={absoluteTouchX}
        absoluteTouchY={absoluteTouchY}
        isDragging={isDragging}
      />
    </>
  );
}
