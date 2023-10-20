import {AnimationCallback, withSpring} from 'react-native-reanimated';

/*
  response
    - The stiffness of the spring, defined as an approximate duration in seconds. 
    A value of zero requests an infinitely-stiff spring, suitable for driving interactive animations.

  dampingFraction
    - The amount of drag applied to the value being animated, 
    as a fraction of an estimate of amount needed to produce critical damping.
 */
export function spring(
  toValue: number,
  config?: {response: number; dampingFraction: number},
  callback?: AnimationCallback | undefined
) {
  'worklet';

  if (!config) {
    config = {
      response: 0.25,
      dampingFraction: 0.825,
    };
  }
  const {response, dampingFraction} = config;

  const stiffness = ((2 * Math.PI) / response) ** 2;
  const damping = (4 * Math.PI * dampingFraction) / response;

  return withSpring(
    toValue,
    {
      mass: 1,
      stiffness,
      damping,
      restSpeedThreshold: 0.0001,
      restDisplacementThreshold: 0.01,
    },
    callback
  );
}

export function calculateSpringConfig(config: {
  response: number;
  dampingFraction: number;
}) {
  const {response, dampingFraction} = config;

  const stiffness = ((2 * Math.PI) / response) ** 2;
  const damping = (4 * Math.PI * dampingFraction) / response;

  return {stiffness, damping};
}
