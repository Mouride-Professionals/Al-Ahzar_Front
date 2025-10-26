import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { MenuBreadcrumb } from '@components/common/menu';
import { SchoolYearSelector } from '@components/common/school_year_selector';
import { MainMenus } from '@components/func/home/menu';
import LanguageSwitcher from '@components/language_switcher';
import { colors, images, routes } from '@theme';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BiPlusCircle } from 'react-icons/bi';
import { BsBell, BsHeart } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi'; // Use FiMenu for hamburger

export const DesktopDashboardLayoutView = ({
  title,
  banner = '',
  children,
  currentPage,
  role,
  token,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('components.layout.header.settings');

  const logo = {
    src: images.logo.src,
    alt: 'Logo image',
  };

  return (
    <Stack direction={'column'} bgColor={colors.gray.highlight} m={0} h={'100%'} w={'100%'}>
      <Stack bgColor={colors.white} w={'100%'} py={3} px={10}>
        <Container maxW={'container.xl'}>
          <HStack
            alignItems={'center'}
            justifyContent={'space-between'}
            h={80.01}
            w={'100%'}
          >
            <HStack alignItems={'center'} w={'70%'}>
              <Box h={70.01} w={80.01} pos={'relative'}>
                <Image {...logo} alt={'logo'} fill />
              </Box>

              {/* Menu Bar */}
              <MainMenus role={role} />
              {/* End Menu Bar */}
            </HStack>

            <HStack
              alignItems={'center'}
              justifyContent={'space-between'}
              w={'auto'}
            >
              <SchoolYearSelector token={token} />

              <BiPlusCircle size={25} />
              <BsBell size={25} />
              <Popover
                returnFocusOnClose
                isOpen={isOpen}
                onClose={onClose}
                placement={'bottom'}
                closeOnBlur={false}
              >
                <PopoverTrigger>
                  <HStack _hover={{ cursor: 'pointer' }} onClick={onToggle}>
                    <Box
                      h={50}
                      w={50}
                      pos={'relative'}
                      borderRadius={'full'}
                      overflow={'hidden'}
                    >
                      <Image {...images.dashboard.avatar} alt={'logo'} fill />
                    </Box>
                    <Stack>
                      <Text fontSize={14} fontWeight={'700'}>
                        {session?.user?.firstName} {session?.user?.lastName}
                      </Text>
                      <Text fontSize={13}>{role?.name}</Text>
                    </Stack>
                  </HStack>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontWeight={'semibold'}>
                    {session?.user?.firstName} {session?.user?.lastName}
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverBody>
                    {/* Settings Option */}
                    <Box
                      _hover={{ cursor: 'pointer', color: colors.primary.regular }}
                      onClick={() => router.push(routes.page_route.dashboard.settings)}
                      mb={2} // Add spacing between options
                    >
                      {t('title')}
                    </Box>
                    {/* Language Switcher */}
                    <LanguageSwitcher onSwitch={onClose} />
                    {/* Add more options here if needed */}
                    {/* Divider */}
                    {/* Logout Option */}
                    <Box
                      _hover={{ cursor: 'pointer', color: colors.primary.regular }}
                      onClick={signOut}
                    >
                      {t('logout')}
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </HStack>
        </Container>
      </Stack>

      <Stack py={40.01} minH={'83.1vh'} w={'100%'}>
        <Container maxW={'container.xl'}>
          <MenuBreadcrumb currentPage={currentPage} />
          <Heading mt={3} size={'lg'}>
            {title}
          </Heading>
          {children}
        </Container>
      </Stack>

      <HStack alignItems={'center'} bgColor={colors.secondary.regular} py={5}>
        <Container maxW={'container.xl'}>
          <HStack alignItems={'center'}>
            <Text color={colors.white}>Made with</Text>{' '}
            <BsHeart color={colors.white} />{' '}
            <Text color={colors.white}>for Al Azhar</Text>
          </HStack>
        </Container>
      </HStack>
    </Stack>
  );
};


export const MobileDashboardLayoutView = ({
  title,
  banner = '',
  children,
  currentPage,
  role,
  token,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('components.layout.header.settings');

  const logo = {
    src: images.logo.src,
    alt: 'Logo image',
  };

  return (
    <VStack bgColor={colors.gray.highlight} minH="100vh" w="100%" spacing={0}>
      {/* Header */}
      <HStack
        bgColor={colors.white}
        w="100%"
        py={2}
        px={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack spacing={2}>
          <IconButton
            aria-label="Toggle menu"
            icon={<FiMenu size={18} />}
            onClick={onOpen}
            size="sm"
            variant="ghost"
          />
          <Box h={40} w={50} pos="relative">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="50px"
              loading="lazy"
            />
          </Box>
        </HStack>
        <HStack spacing={2}>
          <SchoolYearSelector token={token} />
          <LanguageSwitcher onSwitch={onClose} />
        </HStack>
      </HStack>
      <HStack bgColor={colors.white}
        w="100%"
        pb={2}
        justifyContent="space-between"
        alignItems="center">
        <MainMenus role={role} />
      </HStack>



      {/* Drawer for Menu */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack>
              <Box h={40} w={50} pos="relative">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="50px"
                />
              </Box>
              <Text fontSize="md" fontWeight="bold">
                {session?.user?.firstName} {session?.user?.lastName}
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              {/* <MainMenus role={role} /> */}
              <Box
                _hover={{ cursor: 'pointer', color: colors.primary.regular }}
                onClick={() => {
                  router.push(routes.page_route.dashboard.settings);
                  onClose();
                }}
                py={2}
              >
                {t('title')}
              </Box>
              <Box
                _hover={{ cursor: 'pointer', color: colors.primary.regular }}
                onClick={() => {
                  signOut();
                  onClose();
                }}
                py={2}
              >
                {t('logout')}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <VStack py={6} w="100%" flex={1}>
        <Container maxW="container.sm">
          <MenuBreadcrumb currentPage={currentPage} />
          <Heading mt={3} size="md">
            {title}
          </Heading>
          {children}
        </Container>
      </VStack>

      {/* Footer */}
      <HStack bgColor={colors.secondary.regular} py={4} w="100%">
        <Container maxW="container.sm">
          <HStack justifyContent="center">
            <Text color={colors.white} fontSize="sm">
              Made with
            </Text>
            <BsHeart color={colors.white} size={14} />
            <Text color={colors.white} fontSize="sm">
              for Al Azhar
            </Text>
          </HStack>
        </Container>
      </HStack>
    </VStack>
  );
};
