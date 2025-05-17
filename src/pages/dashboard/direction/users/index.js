import { HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { UserDataSet } from '@components/common/reports/user_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { USER_COLUMNS } from '@utils/mappers/kpi';
import { mapUsersDataTable } from '@utils/mappers/user';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { FaSuitcase, FaUser } from 'react-icons/fa'; // icon for user
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const {
    pages: {
        dashboard,
        stats: { users: usersStat,
            classes,
            students: studentsStat,
            teachers: teachersStat,
            schools: schoolsStat, amount },
    },
    components: { menu, dataset: { users: usersDataset } },
} = messages;

export default function Dashboard({ kpis, role, token }) {
    // Generate a stat card for users – adjust as needed
    const cardStats = [
        {
            count: amount.users.replace(`%number`, kpis[0]?.length),
            icon: <FaUser color={colors.primary.regular} size={25} />,
            title: usersStat,
        },
        {
            count: amount.classes.replace(`%number`, kpis[1]?.data?.length),
            icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
            title: classes,
        },
        {
            count: amount.students.replace(`%number`, kpis[2]?.data?.length),
            icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
            title: studentsStat,
        },
        {
            count: amount.teachers.replace(`%number`, kpis[3]?.data?.length ?? 0),
            icon: <FaSuitcase color={colors.primary.regular} size={25} />,
            title: teachersStat,
        },
        {
            count: amount.schools.replace(`%number`, kpis[4]?.data?.length),
            icon: <LuSchool color={colors.primary.regular} size={25} />,
            title: schoolsStat,
        },

    ];

    // Map the fetched users data to the desired shape.
    const users = mapUsersDataTable({ users: kpis[0] });
    // take all schools with only their name, id, and type for 
    const schools = kpis[4]?.data?.map((school) => ({
        name: school.attributes.name,
        id: school.id,
    }))
        ;
    return (
        <DashboardLayout
            title={dashboard.initial.title}
            currentPage={menu.users}
            role={role}
            token={token}
        >
            <Wrap mt={10} spacing={20.01}>

                <HStack w={'100%'}>
                    <Statistics cardStats={cardStats} />
                </HStack>
                <Text
                    color={colors.secondary.regular}
                    fontSize={20}
                    fontWeight={'700'}
                    pt={10}
                >
                    {usersDataset.title}
                </Text>

                <Stack bgColor={colors.white} w={'100%'}>
                    <UserDataSet
                        {...{ role, token }}
                        data={users}
                        columns={USER_COLUMNS}
                        schools={schools}
                    />
                </Stack>
            </Wrap>
        </DashboardLayout>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    const secret = process.env.NEXTAUTH_SECRET;
    const session = await getToken({ req, secret });
    const token = session?.accessToken;
    const cookies = new Cookies(req, res);
    const activeSchoolYear = cookies.get('selectedSchoolYear');

    if (!token) {
        return {
            redirect: {
                destination: 'user/auth',
                permanent: false,
            },
        };
    }

    // Fetch the user data from your Strapi endpoint.
    const {
        alazhar: {
            get: {
                me,
                classes: { allWithoutSchoolId: classrooms },
                students: { allWithoutSchoolId: allStudents },
                teachers: { all: allTeachers },
                schools: { all: allSchools },
                users: { all: allUsers },
            },
        },
    } = routes.api_route;

    const response = await serverFetch({
        uri: me,
        user_token: token,
    });
    const role = response.role;
   

    const kpis = await Promise.all([
        serverFetch({
            uri: `${allUsers}?populate=*&sort=createdAt:desc`,
            user_token: token,
        }),
        serverFetch({
            uri: classrooms.replace('%activeSchoolYear', activeSchoolYear),
            user_token: token,
        }),
        serverFetch({
            uri: allStudents.replace('%activeSchoolYear', activeSchoolYear),
            user_token: token,
        }),
        serverFetch({
            uri: allTeachers + '?sort=createdAt:desc&populate=school',
            user_token: token,
        }).catch(() => ({ data: [] })),
        serverFetch({
            uri: allSchools,
            user_token: token,
        }).catch(() => ({ data: [] })),
    ]);




    return {
        props: {
            kpis,
            role,
            token,
        },
    };
};