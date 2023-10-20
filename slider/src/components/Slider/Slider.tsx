import {ComponentProps} from 'react';
import {LayoutChangeEvent} from 'react-native';
import {SharedValue} from 'react-native-reanimated';

import {Box} from '../Box';
import {Cursor} from './Cursor';
import {FloatingTime} from './FloatingTime';
import {Indicator} from './Indicator';
import ReText from './ReText';

type Props = {
  onIndicatorLayout: (index: number) => (event: LayoutChangeEvent) => void;
  onIndicatorContainerLayout: (event: LayoutChangeEvent) => void;
  indicators: {
    height: number;
  }[];
  leftText: SharedValue<string>;
  rightText: SharedValue<string>;
} & Omit<ComponentProps<typeof Cursor>, 'initialHeight'>;

export function Slider({
  onIndicatorLayout,
  onIndicatorContainerLayout,
  positions,
  bounds,
  indicators,
  absoluteTouchX,
  absoluteTouchY,
  shouldCancelDrag,
  currentIndex,
  isDragging,
  cursorScale,
  translateX,
  translateY,
  soundProgress,
  onDrag,
  leftText,
  rightText,
}: Props) {
  return (
    <Box width="100%" flexDirection="column" justifyContent="center" gap={4}>
      <Box width="100%" flexDirection="column" justifyContent="center" gap={4}>
        <Box
          onLayout={onIndicatorContainerLayout}
          flexDirection="row"
          alignItems="flex-end"
          width="100%"
          justifyContent="space-between"
        >
          {indicators.map(({height}, i) => (
            <Indicator
              height={height}
              onLayout={onIndicatorLayout(i)}
              // eslint-disable-next-line react/no-array-index-key
              key={i}
            />
          ))}

          <Cursor
            absoluteTouchX={absoluteTouchX}
            absoluteTouchY={absoluteTouchY}
            shouldCancelDrag={shouldCancelDrag}
            currentIndex={currentIndex}
            cursorScale={cursorScale}
            isDragging={isDragging}
            translateX={translateX}
            translateY={translateY}
            soundProgress={soundProgress}
            onDrag={onDrag}
            initialHeight={indicators[0].height}
            positions={positions}
            bounds={bounds}
          />
        </Box>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <FloatingTime
            shouldCancelDrag={shouldCancelDrag}
            bounds={bounds}
            isDragging={isDragging}
            translateX={translateX}
            translateY={translateY}
            text={leftText}
          />
          <ReText
            text={rightText}
            style={[
              {
                marginVertical: 0,
                paddingVertical: 0,
                fontFamily: 'SF-Mono-Medium',
                color: '#8F8F8F',
                fontSize: 13,
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
}
