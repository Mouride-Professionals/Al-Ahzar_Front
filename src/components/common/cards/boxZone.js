import { Stack, VStack } from '@chakra-ui/react';
import { colors } from '@theme';

export const BoxZone = ({ maxH, h, w, p, children }) => {
  return (
    <Stack
      border={1}
      borderStyle={'solid'}
      borderColor={colors.gray.regular}
      borderRadius={8}
      mt={5}
      minH={h || '100%'}
      {...(maxH && { maxH: maxH, overflow: 'scroll', pb: 3 })}
      w={w || '100%'}
    >
      <VStack
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
        p={p || 5}
      >
        {children}
      </VStack>
    </Stack>
  );
};
