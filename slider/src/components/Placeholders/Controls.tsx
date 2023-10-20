import {placeholderColor} from '../../utils/colors';
import {Box} from '../Box';
import {Triangle} from '../Slider/Triangle';
import {Placeholder} from './Placeholder';

export function Controls() {
  return (
    <Box width="100%" flex={1} justifyContent="space-between">
      <Box
        justifyContent="space-evenly"
        alignItems="center"
        flexDirection="row"
      >
        <Triangle
          style={{transform: [{scaleX: -1}]}}
          fill={placeholderColor}
          size={40}
        />
        <Placeholder height={72} width={72} borderRadius={40} />
        <Triangle fill={placeholderColor} size={40} />
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Placeholder height={20} width={180} borderRadius={6} />
        <Box flexDirection="row" gap={8}>
          <Placeholder height={28} width={28} borderRadius={8} />
          <Placeholder height={28} width={28} borderRadius={8} />
        </Box>
      </Box>
    </Box>
  );
}
