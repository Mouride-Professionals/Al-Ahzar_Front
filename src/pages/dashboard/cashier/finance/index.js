import {
    Box,
    Flex,
    Heading,
    HStack,
    Spinner,
    Stack,
    Text,
    useToast,
    Wrap
} from '@chakra-ui/react';
import { PaymentDataSet } from '@components/common/reports/payment_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { PAYMENTS_COLUMNS } from '@utils/mappers/kpi';
import { mapPaymentsDataTable } from '@utils/mappers/payment';
import { mapPaymentType } from '@utils/tools/mappers';
import { getToken } from 'next-auth/jwt';
import { useEffect, useState } from 'react';
import { FaCalendarCheck, FaCalendarPlus, FaRegCalendarAlt } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { SiCashapp } from 'react-icons/si';
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { serverFetch } from 'src/lib/api';

const { pages: { dashboard, stats: { classes, amount } }, components: { menu } } = messages;

const getMonthName = (num) => {
    const date = new Date();
    date.setMonth(num - 1);
    return date.toLocaleString('default', { month: 'short' });
};



const FinanceDashboard = ({ role, token, kpis }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState();
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const payments = mapPaymentsDataTable({ payments: kpis[0] });

    // If kpis is available from getServerSideProps, initialize the state
    useEffect(() => {
        if (kpis) {
            setSummary(kpis[1]);
            setTransactions(payments);

            // Expected months (November (11) to July (7)) – adjust as needed
            const expectedMonths = [11, 12, 1, 2, 3, 4, 5, 6, 7];
            const monthlyData = kpis[1]?.monthlyBreakdown || [];
            const paymentTypeData = kpis[1]?.paymentTypeBreakdown || [];
            console.log('paymentTypeData', paymentTypeData);
            
          const  pieData = paymentTypeData.map((item) => ({
                name: mapPaymentType[item.paymentType],
                value: item.total
            }));
            setPieData(pieData);
            const expectedChartData = expectedMonths.map((m) => {
                const found = monthlyData.find(item => item.month === m);
                return {
                    month: getMonthName(m),
                    amount: found ? found.total : 0,
                };
            });
            setChartData(expectedChartData);
            setLoading(false);
        }
    }, [kpis]);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="80vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    // Finance card statistics
    const financeCardStats = [
        {
            count: amount.finance.replace(`%number`, summary?.yearPaymentTotal ?? 0),
            icon: <SiCashapp color={colors.primary.regular} size={25} />,
            title: "Encaissements Annuel",
        },
        {
            count: amount.finance.replace(`%number`, summary?.enrollmentPaymentTotal ?? 0),
            icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
            title: "Total Inscriptions",
        },
        {
            count: amount.finance.replace(`%number`, summary?.monthlyPaymentTotal ?? 0),
            icon: <FaCalendarPlus color={colors.primary.regular} size={25} />,
            title: "Total Mensualités",
        },
        {
            count: amount.finance.replace(`%number`, summary?.previousMonthPaymentTotal ?? 0),
            icon: <FaRegCalendarAlt color={colors.primary.regular} size={25} />,
            title: "Mois Précédent",
        },
        {
            count: amount.finance.replace(`%number`, summary?.currentMonthPaymentTotal ?? 0),
            icon: <FaCalendarCheck color={colors.primary.regular} size={25} />,
            title: "Mois En Cours",
        },
    ];

   
    const pieColors = [colors.primary.regular, colors.primary.light, colors.secondary.regular, colors.gray.regular, colors.green.regular, colors.black, colors.red.regular];
    const renderCustomizedLabel = (props) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
        const RADIAN = Math.PI / 180;
        // Position for slice name: halfway between inner and outer radius
        const rName = innerRadius + (outerRadius - innerRadius) * 0.5;
        const xName = cx + rName * Math.cos(-midAngle * RADIAN);
        const yName = cy + rName * Math.sin(-midAngle * RADIAN);

        // Position for amount: outside the slice by adding an offset to the outer radius
        const offset = 20;
        const rAmount = outerRadius + offset;
        const xAmount = cx + rAmount * Math.cos(-midAngle * RADIAN);
        const yAmount = cy + rAmount * Math.sin(-midAngle * RADIAN);

        return (
            <g>
               
                <text
                    x={xAmount}
                    y={yAmount}
                    fill="black"
                    textAnchor={xAmount > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={12}
                >
                    {`${pieData[index].name}: ${Number(pieData[index].value).toLocaleString() + " FCFA"}`}
                </text>
            </g>
        );
    };
    return (
        <DashboardLayout
            title={dashboard.finance.title}
            currentPage={menu.finance}
            role={role}
            token={token}
        >
            <Wrap mt={10} spacing={20.01}>
                <HStack w="100%">
                    <Statistics cardStats={financeCardStats} />
                </HStack>
                <Text
                    color={colors.secondary.regular}
                    fontSize={20}
                    fontWeight="700"
                >
                    Historique des Transactions
                </Text>
                <Stack bgColor={colors.white} w="100%">
                    <PaymentDataSet
                        role={role}
                        data={transactions}
                        columns={PAYMENTS_COLUMNS}
                        token={token}
                    />
                </Stack>
                <HStack w="100%">
                    {/* Bar Chart Section */}
                    <Box mb={8} p={5} borderWidth="1px" borderRadius="md" w="100%" bgColor="white">
                        <Heading size="md" mb={4}>Tendance des paiements mensuels</Heading>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#3182CE" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </HStack>
                <HStack w="100%">
                    {/* Pie Chart Section */}
                    <Box mb={8} p={5} borderWidth="1px" borderRadius="md" w="100%" bgColor="white">
                        <Heading size="md" mb={4}>Répartition des Encaissements Annuels</Heading>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    dataKey="value"
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={140}
                                    label={renderCustomizedLabel}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </HStack>
            </Wrap>
        </DashboardLayout>
    );
};

export default FinanceDashboard;

export const getServerSideProps = async ({ req, res }) => {
    const secret = process.env.NEXTAUTH_SECRET;
    const session = await getToken({ req, secret });
    const token = session?.accessToken;
    const Cookies = require('cookies');
    const cookies = new Cookies(req, res);
    const activeSchoolYear = cookies.get('selectedSchoolYear');

    if (!token) {
        return {
            redirect: {
                destination: '/user/auth',
                permanent: false,
            },
        };
    }

    const { alazhar: { get: { me, finance: { all: payments, stats: financeStats } } } } = routes.api_route;

    const response = await serverFetch({
        uri: me,
        user_token: token,
    });
    const role = response.role;
    const schoolId = response.school.id;

    // Fetch KPIs for payments and finance stats
    const kpis = await Promise.all([
        serverFetch({
            uri: payments.replace('%activeSchoolYear', activeSchoolYear).replace('%schoolId', schoolId),
            user_token: token,
        }),
        serverFetch({
            uri: financeStats.replace('%activeSchoolYear', activeSchoolYear).replace('%schoolId', schoolId),
            user_token: token,
        }),
    ]);

    return {
        props: {
            role,
            token,
            kpis,
        },
    };
};

