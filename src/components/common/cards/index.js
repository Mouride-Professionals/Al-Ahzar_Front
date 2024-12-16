import { Box, Divider, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { colors, messages } from '@theme';
import { useRouter } from 'next/navigation';
import { BsCheck } from 'react-icons/bs';
import { PrimaryButton, SecondaryButton } from '../button';

export const ClassCard = ({
  goTo,
  theme,
  section,
  students = Math.floor(Math.random() * 2 + 1),
  level,
}) => {
  const router = useRouter();

  return (
    <Stack
      {...(goTo && {
        _hover: { cursor: 'pointer' },
        onClick: () => router.push(goTo),
      })}
      bgColor={colors.white}
      py={4}
      px={5}
      h={170}
      w={140}
      borderRadius={10}
    >
      <VStack
        h={46}
        w={46}
        justifyContent={'center'}
        bgColor={theme?.soft || colors.primary.light}
        borderRadius={'100%'}
      >
        <Text
          fontWeight={'700'}
          fontSize={20.01}
          color={theme?.hot || colors.primary.regular}
        >
          {section}
        </Text>
      </VStack>

      <Text color={colors.secondary.regular} fontSize={17} fontWeight={'700'}>
        {level}
      </Text>

      <Text color={colors.gray.regular} fontSize={16} fontWeight={'700'}>
        {messages.components.cards.class.students.replace('%number', students)}
      </Text>
    </Stack>
  );
};

export const RegistrationCard = ({ title, message, cta }) => {
  const router = useRouter();

  return (
    <VStack
      py={10}
      px={8}
      alignItems={'flex-start'}
      flex={1}
      flexGrow={1}
      h={'100%'}
    >
      <HStack pb={10}>
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          borderRadius={'50%'}
          bgColor={colors.secondary.soft}
          w={120}
          h={120}
        >
          <BsCheck size={60} />
        </Stack>

        <Stack pl={15} w={'50%'}>
          <Text
            color={colors.secondary.regular}
            fontSize={20}
            fontWeight={'700'}
          >
            {title}
          </Text>
          <Text color={colors.gray.sport} fontSize={14}>
            {message}
          </Text>
        </Stack>
      </HStack>

      <Divider />

      <Stack pt={10} direction={'row'} justifyContent={'flex-end'} w={'100%'}>
        <HStack justifyContent={'flex-end'} w={'40%'}>
          <SecondaryButton message={'Terminer'} onClick={() => router.back()} />
          <PrimaryButton
            message={cta.message}
            {...(cta.link && { onClick: () => router.push(cta.link) })}
            {...(cta.quickAction && { onClick: cta.quickAction })}
          />
        </HStack>
      </Stack>
    </VStack>
  );
};

export const StatCard = ({ icon, title, count }) => {
  return (
    <Box bgColor={colors.white} borderRadius={10} h={95} p={5} minW={297}>
      <HStack>
        <VStack
          mr={2}
          bgColor={colors.primary.light}
          borderRadius={50}
          justifyContent={'center'}
          alignItems={'center'}
          h={48.01}
          w={48.01}
        >
          {icon}
        </VStack>
        <Stack>
          <Text fontSize={12}>{title}</Text>
          <Text fontWeight={'700'}>{count}</Text>
        </Stack>
      </HStack>
    </Box>
  );
};
