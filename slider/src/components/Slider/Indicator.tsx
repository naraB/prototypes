import {LayoutChangeEvent, View} from 'react-native';

interface Props {
  onLayout: (event: LayoutChangeEvent) => void;
  height: number;
}

export function Indicator({onLayout, height}: Props) {
  return (
    <View
      onLayout={onLayout}
      style={{
        height,
        width: 4,
        borderRadius: 4,
        backgroundColor: '#DBDBDB',
      }}
    />
  );
}
