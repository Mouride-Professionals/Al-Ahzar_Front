import { Box, Grid, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { PrimaryButton } from '@components/common/button';
import { ClassCard } from '@components/common/cards';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { mapClassesByLevel } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { serverFetch } from 'src/lib/api';

const {
  pages: {
    dashboard,
    class: { heading, create },
  },
  components: { menu },
} = messages;

export default function Classes({ classes, role }) {
  return (
    <DashboardLayout
      title={dashboard.classes.title}
      currentPage={menu.classes}
      role={role}
    >
      <Stack w={'100%'}>
        <HStack justifyContent={'space-between'} my={10} w={'100%'}>
          <Heading size={'md'}>{heading}</Heading>

          <Box w={'20%'}>
            <PrimaryButton message={create} />
          </Box>
        </HStack>

        <Stack w={'100%'}>
          <Grid gridTemplateColumns={'repeat(2, 1fr)'} gap={14}>
            {classes.map(({ _class, cycle, sections }) => (
              <Box>
                <Text
                  colors={colors.secondary.regular}
                  fontSize={20}
                  fontWeight={'bold'}
                >
                  {_class.replace(/a /, ' ')}
                </Text>
                <Grid mt={5} gap={3} gridTemplateColumns={'repeat(4, 1fr)'}>
                  {sections.map((section) => (
                    <ClassCard
                      {...{
                        cycle,
                        section,
                        level: _class.replace(/a /, ' '),
                      }}
                    />
                  ))}
                </Grid>
              </Box>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  const { role } =
    await serverFetch({
      uri: routes.api_route.alazhar.get.me,
      user_token: token,
    });

  const data = await serverFetch({
    uri: routes.api_route.alazhar.get.classes,
    user_token: token,
  });

  const classes = mapClassesByLevel({ classes: data });

  return {
    props: {
      classes,
      role,
    },
  };
};
