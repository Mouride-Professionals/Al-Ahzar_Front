import { Box, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { colors } from '@theme';
import { Media } from '@utils/media';
import Link from 'next/link';
import { Fragment } from 'react';
import { DesktopLayoutView, MobileLayoutView } from './views';

export const AuthenticationLayout = ({ children, title }) => {
  return (
    <Fragment>
      <Media greaterThanOrEqual="lg">
        <DesktopLayoutView title={title}>{children}</DesktopLayoutView>
      </Media>
      <Media lessThan="lg">
        <MobileLayoutView title={title}>{children}</MobileLayoutView>
      </Media>
    </Fragment>
  );
};

export const AuthenticationLayoutForm = ({
  redirection_route = '/',
  title,
  subtitle,
  specifics,
  children,
}) => {
  return (
    <VStack
      alignItems={{ base: 'center', md: 'flex-start' }}
      justifyContent={{ base: 'center', md: 'initial' }}
    >
      <Stack w={'100%'}>
        <Heading color={colors.secondary.regular} textAlign={'center'}
          isTruncated // Ensures the title is truncated with ellipsis if it overflows
          noOfLines={1} // Restricts to one line
        >
          {title}
        </Heading>
        <VStack alignItems={'center'} justifyContent={'center'} w={'100%'}>
          <Box maxW={'60%'}>
            <Text
              color={colors.gray.bold}
              fontSize={16}
              noOfLines={1}
              isTruncated // Ensures the subtitle is truncated with ellipsis if it overflows

              mt={3}
              textAlign={'center'}
            >
              {subtitle}
            </Text>
          </Box>
        </VStack>
      </Stack>

      <VStack alignSelf={'center'} w={'70%'}>
        {children}
      </VStack>
      <Stack alignItems={'center'} pt={{ base: 0, md: 0 }} w={'100%'}>
        <Link href={redirection_route}>
          <Text color={colors.gray.regular}>
            {specifics.forgotten_password}{'  '}
            <Text as="span" color={colors.primary.regular} fontWeight="bold">
              {specifics.highlight}
            </Text>
          </Text>
        </Link>
      </Stack>
    </VStack>
  );
};
