import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { colors } from '@theme';
import { useRouter } from 'next/navigation';

export const RegistrationFormLayout = ({ children, message }) => {
  const router = useRouter();
  return (
    <VStack
      borderStyle={'solid'}
      border={1}
      borderColor={colors.gray.regular}
      mt={10}
      w={'100%'}
    >
      <HStack
        _hover={{ cursor: 'pointer' }}
        onClick={() => router.back()}
        alignItems={'center'}
        px={5}
        bgColor={colors.secondary.light}
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
        h={90}
        w={'100%'}
      >
        <BsArrowLeftShort size={40} />
        <Text fontSize={20} fontWeight={'700'}>
          {message}
        </Text>
      </HStack>
      <Stack
        bgColor={colors.white}
        style={{ marginTop: 0 }}
        borderBottomLeftRadius={10}
        borderBottomRightRadius={10}
        w={'100%'}
        minH={'35rem'}
      >
        {children}
      </Stack>
    </VStack>
  );
};
