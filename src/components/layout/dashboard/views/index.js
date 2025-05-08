import {
  Box,
  Container,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { MenuBreadcrumb } from '@components/common/menu';
import { SchoolYearSelector } from '@components/common/school_year_selector';
import { MainMenus } from '@components/func/home/menu';
import { colors, images, routes } from '@theme';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BiPlusCircle } from 'react-icons/bi';
import { BsBell, BsHeart } from 'react-icons/bs';

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
  // const [banner, setBanner] = useState({
  //   src: banner != '' ? `${process.env.NEXT_PUBLIC_API_URL}${banner}` : images.logo.src,
  //   alt: 'Banner image',
  // });
  const logo = {
    src: images.logo.src,
    alt: 'Logo image',
  }

  return (
    <Stack
      direction={'column'}
      bgColor={colors.gray.highlight}
      m={0}
      h={'100%'}
      w={'100%'}
    >
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
                    <Box h={50} w={50} pos={'relative'}>
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
                      Paramètres
                    </Box>
                    {/* Logout Option */}
                    <Box _hover={{ cursor: 'pointer', color: colors.primary.regular }} onClick={signOut}>
                      Déconnexion
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
