import {Box} from '../Box';
import {Placeholder} from './Placeholder';

export function Title() {
  return (
    <Box alignItems="center" top={-12} justifyContent="center" gap={8}>
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        <Placeholder width={90} height={20} borderRadius={6} />
        <Placeholder width={90} height={20} borderRadius={6} />
      </Box>
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        <Placeholder width={40} height={18} borderRadius={6} />
        <Placeholder width={80} height={18} borderRadius={6} />
      </Box>
    </Box>
  );
}
