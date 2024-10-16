import { Box, Container, VStack } from '@chakra-ui/react';
import { colors, images } from '@theme';
import Image from 'next/image';

export const DesktopLayoutView = ({ children }) => {
  return (
    <VStack
      bgColor={colors.gray.highlight}
      alignItems={'flex-start'}
      h={'100vh'}
      w={'100vw'}
    >
      <VStack
        alignItems={'center'}
        justifyContent={'center'}
        h={'100%'}
        w={'100%'}
      >
        <VStack
          alignItems={'center'}
          justifyContent={'center'}
          bgColor={colors.white}
          pt={5}
          borderRadius={8}
          h={'60%'}
          w={'50%'}
        >
          <Image
            {...images.logo}
            height={60}
            width={60}
            alt={images.logo.alt}
          />
          <Container maxW={'container.xl'} maxH={'100%'} py={5} px={20}>
            {children}
          </Container>
        </VStack>
      </VStack>
    </VStack>
  );
};

export const MobileLayoutView = ({ children }) => {
  return (
    <VStack bgColor={colors.secondary.regular} p={10} h={'100vh'} w={'100vw'}>
      <Box pos={'relative'} mb={20.01} minH={80.01} w={80.01}>
        <Image {...images.logo} fill alt={images.logo.alt} />
      </Box>
      <Box
        alignItems={'center'}
        justifyContent={'center'}
        h={'100%'}
        w={'100%'}
      >
        {children}
      </Box>
    </VStack>
  );
};
