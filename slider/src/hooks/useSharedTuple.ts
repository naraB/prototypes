import {useSharedValue} from 'react-native-reanimated';

export const useSharedTuple = <T>(one: T, two?: T) => {
  const valueOne = useSharedValue(one);
  const valueTwo = useSharedValue(two ?? one);

  return [valueOne, valueTwo];
};
