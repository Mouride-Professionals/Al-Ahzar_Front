import { Box, Container, HStack, VStack } from '@chakra-ui/react';
import LanguageSwitcher from '@components/language_switcher';
import { colors, images } from '@theme';
import Image from 'next/image';

export const DesktopLayoutView = ({ children }) => {
  return (
    <VStack
      bgColor={colors.gray.highlight}
      alignItems={'flex-start'}
      h={'100vh'}
      w={'100vw'}
      position="relative"
    >
      {/* Language Switcher - Top Right */}
      <Box
        position="absolute"
        top={{ base: 4, md: 6 }}
        right={{ base: 4, md: 6 }}
        zIndex={10}
        bg="white"
        borderRadius="md"
        p={{ base: 2, md: 3 }}
        boxShadow="sm"
      >
        <LanguageSwitcher />
      </Box>

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
          h={'auto'}
          w={{ base: '90%', md: '70%', lg: '50%' }}
          position="relative"
        >
          <Image
            {...images.logo}
            height={60}
            width={60}
            alt={images.logo.alt}
          />
          <Container
            maxW={'container.xl'}
            maxH={'100%'}
            py={5}
            px={{ base: 6, md: 12, lg: 20 }}
          >
            {children}
          </Container>
        </VStack>
      </VStack>
    </VStack>
  );
};

export const MobileLayoutView = ({ children }) => {
  return (
    <VStack
      bgColor={colors.secondary.regular}
      p={{ base: 4, md: 10 }}
      h={'100vh'}
      w={'100vw'}
      position="relative"
    >
      {/* Language Switcher - Top Right for Mobile */}
      <HStack
        position="absolute"
        top={4}
        right={4}
        zIndex={10}
      >
        <Box
          bg="white"
          borderRadius="md"
          p={2}
          boxShadow="sm"
        >
          <LanguageSwitcher />
        </Box>
      </HStack>

      <Box
        pos={'relative'}
        mb={{ base: 8, md: 20.01 }}
        minH={{ base: 60, md: 80.01 }}
        w={{ base: 60, md: 80.01 }}
        mt={{ base: 12, md: 0 }}
      >
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
