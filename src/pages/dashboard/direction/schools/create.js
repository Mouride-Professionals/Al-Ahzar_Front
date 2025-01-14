import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { CreateSchoolForm } from '@components/forms/school/creationForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';

const {
    components: {
        cards: {
            school: { publishing, creation, another_school, info },
        },
    },
} = messages;

export default function Create({ role, token }) {
    const [hasSucceeded, setHasSucceeded] = useState(false);

    const router = useRouter();

    return (
        <DashboardLayout
            title={messages.pages.dashboard.schools.title}
            currentPage={messages.components.menu.schools.create}
            role={role}
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
                        {hasSucceeded ? publishing : creation}
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
                    {hasSucceeded ?
                        (
                            router.push(routes.page_route.dashboard.direction.schools.all)

                        )

                        : (
                            <CreateSchoolForm
                                {...{
                                    setHasSucceeded,
                                    token,
                                }}
                            />
                        )}
                </Stack>
            </VStack>
        </DashboardLayout>
    );
}

export const getServerSideProps = async ({ req }) => {
    const secret = process.env.NEXTAUTH_SECRET;
    const session = await getToken({ req, secret });
    const token = session?.accessToken;

    const { role = null } = await serverFetch({
        uri: routes.api_route.alazhar.get.me,
        user_token: token,
    });

    const classes = await serverFetch({
        uri: routes.api_route.alazhar.get.classes,
        user_token: token,
    });

    return {
        props: {
            role,
            token: token,
            classes,
        },
    };
};
