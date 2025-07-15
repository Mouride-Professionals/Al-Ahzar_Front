import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Text,
} from '@chakra-ui/react';
import { colors, routes } from '@theme';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { forwardRef, useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

export const MenuPill = forwardRef(({ active, icon, message, link, isDisabled }, ref) => {
  const theming = {
    bgColor: active ? colors.primary.regular : colors.white,
    textColor: active ? colors.white : colors.gray.dark,
    borderColor: active ? colors.primary.regular : colors.primary.regular,
  };

  return (
    <Link href={isDisabled ? '#' : link} passHref>
      <HStack
        ref={ref}
        as="a"
        justifyContent="center"
        alignItems="center"
        bgColor={theming.bgColor}
        borderWidth={active ? 2 : 1}
        borderColor={theming.borderColor}
        borderRadius={25}
        py={{ base: 2, sm: 3 }}
        px={{ base: 2, sm: 3 }}
        h={{ base: 8, sm: 10 }}
        minW={{ base: 20, sm: 95 }}
        w="auto"
        opacity={isDisabled ? 0.5 : 1}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        _hover={
          !isDisabled && !active
            ? { bgColor: colors.primary.light, color: colors.primary.regular }
            : {}
        }
        transform={active ? 'scale(1.05)' : 'scale(1)'}
        transition="transform 0.2s ease-in-out"
        boxShadow={active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'}
      >
        {icon}
        <Box pl={1}>
          <Text
            color={theming.textColor}
            fontSize={{ base: '12px', sm: '14px' }}
            noOfLines={1}
            fontWeight={active ? '600' : '400'}
          >
            {message}
          </Text>
        </Box>
      </HStack>
    </Link>
  );
});


export const MenuBreadcrumb = ({ currentPage }) => {
  const t = useTranslations('components.layout.breadcrumb');
  // Get the authenticated user's school name from the cookie, fallback to translated default
  const [schoolName] = useState(
    Cookies.get('schoolName') || t('defaultSchool')
  );

  return (
    <Breadcrumb separator={<RiArrowRightSLine />}  fontWeight={{ base: '500', sm: '700' }} fontSize={{ base: '14px', sm: '16px' }}>
      <BreadcrumbItem>
        <BreadcrumbLink
          href={routes.page_route.dashboard.initial}
          color={colors.gray.light}
        >
          {t('siteName')}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink
          href={routes.page_route.dashboard.initial}
          color={colors.primary.regular}
          // fontWeight={'700'}
          _hover={{ textDecoration: 'none' }}
          _focus={{ boxShadow: 'none' }}
          _active={{ boxShadow: 'none' }}
        >
          {schoolName}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink
          href={'#'}
          color={colors.primary.regular}
          // fontWeight={'700'}
        >
          {currentPage}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
