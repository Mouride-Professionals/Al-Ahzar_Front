import {
  Box,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { colors, messages } from '@theme';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { BsCheck, BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit, MdVisibility } from 'react-icons/md';
import { PrimaryButton, SecondaryButton } from '../button';

export const ClassCard = ({
  goTo,
  editTo,
  theme,
  section,
  students = Math.floor(Math.random() * 2 + 1),
  level,
  description,
  canEdit = false,
}) => {
  const router = useRouter();
  const t = useTranslations('components.cards.class');

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (goTo) router.push(goTo);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (editTo) router.push(editTo);
  };

  return (
    <Stack
      bgColor={colors.white}
      py={4}
      px={5}
      h={description ? 200 : 170}
      w={140}
      borderRadius={10}
      position="relative"
    >
      {/* Three-dot menu */}
      {(goTo || (canEdit && editTo)) && (
        <Box position="absolute" top={2} right={2} zIndex={10}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BsThreeDotsVertical />}
              variant="ghost"
              size="sm"
              aria-label="Options"
              onClick={handleMenuClick}
              _hover={{ bgColor: colors.gray.light }}
            />
            <MenuList>
              {goTo && (
                <MenuItem
                  icon={<MdVisibility size={18} />}
                  onClick={handleViewDetails}
                >
                  {t('viewDetails')}
                </MenuItem>
              )}
              {canEdit && editTo && (
                <MenuItem icon={<MdEdit size={18} />} onClick={handleEdit}>
                  {t('editClass')}
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
      )}

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

      {description && (
        <Text
          color={colors.gray.sport}
          fontSize={15}
          fontWeight={'600'}
          noOfLines={2}
          title={description}
        >
          {description}
        </Text>
      )}
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
export const SchoolCreationCard = ({ title, message, cta }) => {
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
    <Box bgColor={colors.white} borderRadius={10} h={95} p={5} minW={200}>
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
