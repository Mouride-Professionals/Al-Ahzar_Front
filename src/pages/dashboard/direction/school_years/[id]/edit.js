import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { CreateSchoolYearForm } from '@components/forms/school_year/creationForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';

export default function EditSchoolYear({ schoolYearData, role, token }) {
    const [hasSucceeded, setHasSucceeded] = useState(false);
    const router = useRouter();
    const t = useTranslations();

    return (
        <DashboardLayout
            title={t('pages.dashboard.school_years.title')}
            currentPage={t('components.menu.school_years')}
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
                        {t('components.cards.school_year.edit')}
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
                    {hasSucceeded ? (
                        router.push(routes.page_route.dashboard.direction.school_years.all)
                    ) : (
                        <CreateSchoolYearForm
                            {...{
                                initialValues: schoolYearData, // Pre-fill the form
                                setHasSucceeded,
                                token,
                                isEdit: true, // Indicates it's an edit form
                            }}
                        />
                    )}
                </Stack>
            </VStack>
        </DashboardLayout>
    );
}

export const getServerSideProps = async ({ req, query }) => {
    const secret = process.env.NEXTAUTH_SECRET;
    const session = await getToken({ req, secret });
    const token = session?.accessToken;

    const { id } = query;

    const { role = null } = await serverFetch({
        uri: routes.api_route.alazhar.get.me,
        user_token: token,
    });

    const schoolYearData = await serverFetch({
        uri: `${routes.api_route.alazhar.get.school_years.detail.replace('%id', id)}`,
        user_token: token,
    });

    return {
        props: {
            role,
            token,
            schoolYearData: schoolYearData?.data || null,
        },
    };
};
