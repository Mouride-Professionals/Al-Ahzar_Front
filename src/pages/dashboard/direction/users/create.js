import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { CreateUserForm } from '@components/forms/user/create';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { ROLES } from '@utils/roles';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';

export default function Create({ schools, role, token, roles }) {
    const [hasSucceeded, setHasSucceeded] = useState(false);
    const router = useRouter();
    const t = useTranslations();

    if (hasSucceeded) {
        router.push(routes.page_route.dashboard.direction.users.all);
    }

    return (
        <DashboardLayout
            title={t('pages.dashboard.users.title')}
            currentPage={t('components.menu.users')}
            role={role}
            token={token}
        >
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
                        {t('components.cards.user.creation')}
                    </Text>
                </HStack>
                <Stack
                    bgColor={colors.white}
                    borderBottomLeftRadius={10}
                    borderBottomRightRadius={10}
                    w={'100%'}
                    minH={'35rem'}
                >
                    <CreateUserForm
                        {...{
                            schools,
                            setHasSucceeded,
                            token,
                            role,
                            roles,
                        }}
                    />
                </Stack>
            </VStack>
        </DashboardLayout>
    );
}

export const getServerSideProps = async ({ req }) => {
    const secret = process.env.NEXTAUTH_SECRET;
    const session = await getToken({ req, secret });
    const token = session?.accessToken;

    // Get current user info to extract their role.
    const { role = null } = await serverFetch({
        uri: routes.api_route.alazhar.get.me,
        user_token: token,
    });

    // Fetch available schools with only name, id, and type.
    const schools = await serverFetch({
        uri:
            routes.api_route.alazhar.get.schools.all +
            '?fields[0]=name&fields[1]=id&fields[2]=type',
        user_token: token,
    });
    //Fetch all roles
    const { roles } = await serverFetch({
        uri: `${routes.api_route.alazhar.get.roles}?fields[0]=name&fields[1]=id&fields[2]=type`,
        user_token: token,
    });

    // Filter  the roles that are  in ROLES only
    const allowedRoles = Object.values(ROLES);

    const filteredRoles = roles.filter(
        (role) => allowedRoles.includes(role.name) && role.name !== ROLES.DIRECTEUR_GENERAL
    );
    // Map the filtered roles to a more usable format.
    const mappedRoles = filteredRoles.map((role) => ({
        name: role.name,
        value: role.id,
    }));

    return {
        props: {
            role,
            token,
            schools,
            roles: mappedRoles,
        },
    };
};