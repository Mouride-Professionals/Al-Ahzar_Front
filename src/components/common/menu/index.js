import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Text,
} from '@chakra-ui/react';
import { colors, routes } from '@theme';
import { useRouter } from 'next/navigation';
import { RiArrowRightSLine } from 'react-icons/ri';

export const MenuPill = ({ active, icon, message, link, isDisabled }) => {
  const theming = {
    bgColor: active ? colors.secondary.regular : colors.secondary.light,
    textColor: active ? colors.white : colors.secondary.regular,
  };

  const router = useRouter();

  return (
    <HStack
      {...(!active && {
        _hover: { cursor: isDisabled ? 'not-allowed' : 'pointer' },
      })}
      {...(!isDisabled && { onClick: () => router.push(link) })}
      justifyContent={'center'}
      alignItems={'center'}
      bgColor={theming.bgColor}
      borderRadius={25}
      py={3}
      px={5}
      minW={95}
    >
      {icon}
      <Box pl={1}>
        <Text color={theming.textColor} fontSize={14}>
          {message}
        </Text>
      </Box>
    </HStack>
  );
};

export const MenuBreadcrumb = ({ currentPage }) => {
  return (
    <Breadcrumb separator={<RiArrowRightSLine />}>
      <BreadcrumbItem>
        <BreadcrumbLink
          href={routes.page_route.dashboard.initial}
          color={colors.gray.light}
        >
          {process.env.NEXT_PUBLIC_SITENAME}
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink
          href={'#'}
          color={colors.primary.regular}
          fontWeight={'700'}
        >
          {currentPage}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
