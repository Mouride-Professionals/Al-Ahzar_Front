import {
  Box,
  Flex,
  Heading,
  HStack,
  Select,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  Wrap,
} from '@chakra-ui/react';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { mapPaymentType } from '@utils/tools/mappers';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaRegCalendarAlt,
} from 'react-icons/fa';
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
  YAxis,
} from 'recharts';
import { serverFetch } from 'src/lib/api';


const getMonthName = (num) => {
  const date = new Date();
  date.setMonth(num - 1);
  return date.toLocaleString('default', { month: 'short' });
};

const FinanceDashboard = ({
  role,
  token,
  initialPaymentKpis,
  initialExpenseKpis,
  schools,
  activeSchoolYear,
}) => {
  const t = useTranslations();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [paymentSummary, setPaymentSummary] = useState(initialPaymentKpis);
  const [expenseSummary, setExpenseSummary] = useState(initialExpenseKpis);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // School options for dropdown
  const schoolOptions = [
    { value: 'all', label: t('components.dataset.finance.all_schools') },
    ...schools.map((school) => ({ value: school.id, label: school.name })),
  ];

  // Payment statistics
  const paymentStats = [
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        paymentSummary?.yearPaymentTotal ?? 0
      ),
      icon: <SiCashapp color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.annual_payments'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        paymentSummary?.enrollmentPaymentTotal ?? 0
      ),
      icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.total_enrollments'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        paymentSummary?.monthlyPaymentTotal ?? 0
      ),
      icon: <FaCalendarPlus color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.total_monthly'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        paymentSummary?.previousMonthPaymentTotal ?? 0
      ),
      icon: <FaRegCalendarAlt color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.previous_month'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        paymentSummary?.currentMonthPaymentTotal ?? 0
      ),
      icon: <FaCalendarCheck color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.current_month'),
    },
  ];

  // Expense statistics
  const expenseStats = [
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        expenseSummary?.yearExpenseTotal ?? 0
      ),
      icon: <SiCashapp color={colors.red.regular} size={25} />,
      title: t('components.dataset.finance.annual_expenses'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        expenseSummary?.currentMonthExpenseTotal ?? 0
      ),
      icon: <FaCalendarCheck color={colors.red.regular} size={25} />,
      title: t('components.dataset.finance.current_month'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        expenseSummary?.previousMonthExpenseTotal ?? 0
      ),
      icon: <FaRegCalendarAlt color={colors.red.regular} size={25} />,
      title: t('components.dataset.finance.previous_month'),
    },
  ];

  const pieColors = [
    colors.primary.regular,
    colors.primary.light,
    colors.secondary.regular,
    colors.gray.regular,
    colors.green.regular,
    colors.black,
    colors.red.regular,
  ];

  const renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, outerRadius, index } = props;
    const RADIAN = Math.PI / 180;
    const rAmount = outerRadius + 20;
    const xAmount = cx + rAmount * Math.cos(-midAngle * RADIAN);
    const yAmount = cy + rAmount * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text
          x={xAmount}
          y={yAmount}
          fill="black"
          textAnchor={xAmount > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize={12}
        >
          {`${pieData[index].name}: ${Number(pieData[index].value).toLocaleString()} FCFA`}
        </text>
      </g>
    );
  };

  useEffect(() => {
    // debounceFetch();
    const fetchData = async () => {
      setLoading(true);
      const {
        alazhar: {
          get: {
            finance: { statsWithoutSchoolId: paymentStatsRoute },
            expenses: { statsWithoutSchoolId: expenseStatsRoute },
          },
        },
      } = routes.api_route;

      try {
        const paymentStatsUri =
          selectedSchool === 'all'
            ? paymentStatsRoute.replace('%activeSchoolYear', activeSchoolYear)
            : `${paymentStatsRoute.replace('%activeSchoolYear', activeSchoolYear)}&filters[school][id][$eq]=${selectedSchool}`;
        const expenseStatsUri =
          selectedSchool === 'all'
            ? expenseStatsRoute.replace('%activeSchoolYear', activeSchoolYear)
            : `${expenseStatsRoute.replace('%activeSchoolYear', activeSchoolYear)}&filters[school][id][$eq]=${selectedSchool}`;

        const paymentStatsData = await serverFetch({
          uri: paymentStatsUri,
          user_token: token,
        });
        const expenseStatsData = await serverFetch({
          uri: expenseStatsUri,
          user_token: token,
        });

        setPaymentSummary(paymentStatsData);
        setExpenseSummary(expenseStatsData);

        const expectedMonths = [11, 12, 1, 2, 3, 4, 5, 6, 7];
        const paymentMonthlyData = paymentStatsData?.monthlyBreakdown || [];
        const paymentTypeData = paymentStatsData?.paymentTypeBreakdown || [];
        const expenseMonthlyData = expenseStatsData?.monthlyBreakdown || [];
        const expenseCategoryData = expenseStatsData?.totalByCategory || {};

        const updateChartData = (data) => {
          const chart = expectedMonths.map((m) => {
            const found = data.find((item) => item.month === m);
            return { month: getMonthName(m), amount: found ? found.total : 0 };
          });
          setChartData(chart);
        };

        const updatePieData = (data, isExpense = false) => {
          if (isExpense) {
            const pie = Object.entries(data).map(([category, total]) => ({
              name: category,
              value: total,
            }));
            setPieData(pie);
          } else {
            const pie = data.map((item) => ({
              name: mapPaymentType[item.paymentType],
              value: item.total,
            }));
            setPieData(pie);
          }
        };

        if (activeTab === 'payments') {
          updateChartData(paymentMonthlyData);
          updatePieData(paymentTypeData);
        } else {
          updateChartData(expenseMonthlyData);
          updatePieData(expenseCategoryData, true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Erreur',
          description: 'Échec du chargement des données',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSchool, activeTab, token, activeSchoolYear, toast]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <DashboardLayout
      title={t('pages.dashboard.finance.title')}
      currentPage={t('components.menu.finance')}
      role={role}
      token={token}
    >
      <Stack spacing={5}>
        <HStack justify="flex-start" mt={5}>
          <Box w="300px">
            <Select
              bgColor={colors.secondary.light}
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              {schoolOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
        </HStack>
        <Tabs
          variant="soft-rounded"
          colorScheme="orange"
          onChange={(index) =>
            setActiveTab(index === 0 ? 'payments' : 'expenses')
          }
        >
          <TabList ml={4}>
            <Tab
              color={
                activeTab === 'payments' ? colors.white : colors.primary.regular
              }
            >
              {t('components.dataset.finance.payments_tab')}
            </Tab>
            <Tab
              color={
                activeTab === 'expenses' ? colors.white : colors.primary.regular
              }
            >
              {t('components.dataset.finance.expenses_tab')}
            </Tab>
          </TabList>

          <TabPanels>
            {/* Payments Tab */}
            <TabPanel>
              <Wrap spacing={20.01}>
                <HStack w="100%">
                  <Statistics cardStats={paymentStats} />
                </HStack>

                <HStack w="100%">
                  <Box
                    p={5}
                    borderWidth="1px"
                    borderRadius="md"
                    w="100%"
                    bgColor="white"
                  >
                    <Heading size="md" mb={4}>
                      {t('components.dataset.finance.monthly_payments_trend')}
                    </Heading>
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
                  <Box
                    p={5}
                    borderWidth="1px"
                    borderRadius="md"
                    w="100%"
                    bgColor="white"
                  >
                    <Heading size="md" mb={4}>
                      {t(
                        'components.dataset.finance.annual_payments_distribution'
                      )}
                    </Heading>
                    <ResponsiveContainer width="100%" height={350}>
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
                            <Cell
                              key={`cell-${index}`}
                              fill={pieColors[index]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </HStack>
              </Wrap>
            </TabPanel>

            {/* Expenses Tab */}
            <TabPanel>
              <Wrap spacing={20.01}>
                <HStack w="100%">
                  <Statistics cardStats={expenseStats} />
                </HStack>

                <HStack w="100%">
                  <Box
                    p={5}
                    borderWidth="1px"
                    borderRadius="md"
                    w="100%"
                    bgColor="white"
                  >
                    <Heading size="md" mb={4}>
                      {t('components.dataset.finance.monthly_expenses_trend')}
                    </Heading>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#E53E3E" barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </HStack>
                <HStack w="100%">
                  <Box
                    p={5}
                    borderWidth="1px"
                    borderRadius="md"
                    w="100%"
                    bgColor="white"
                  >
                    <Heading size="md" mb={4}>
                      {t('components.dataset.finance.expenses_by_category')}
                    </Heading>
                    <ResponsiveContainer width="100%" height={350}>
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
                            <Cell
                              key={`cell-${index}`}
                              fill={pieColors[index]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </HStack>
              </Wrap>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </DashboardLayout>
  );
};

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

  const {
    alazhar: {
      get: {
        me,
        schools: { all: schoolsRoute },
        finance: { statsWithoutSchoolId: financeStats },
        expenses: { statsWithoutSchoolId: expenseStats },
      },
    },
  } = routes.api_route;

  const response = await serverFetch({ uri: me, user_token: token });
  const role = response.role;

  // Fetch initial data (system-wide) and schools list
  const [schoolsData, initialPaymentKpis, initialExpenseKpis] =
    await Promise.all([
      serverFetch({ uri: schoolsRoute, user_token: token }),
      serverFetch({
        uri: financeStats.replace('%activeSchoolYear', activeSchoolYear),
        user_token: token,
      }),
      serverFetch({
        uri: expenseStats.replace('%activeSchoolYear', activeSchoolYear),
        user_token: token,
      }),
    ]);

  return {
    props: {
      role,
      token,
      initialPaymentKpis,
      initialExpenseKpis,
      schools: schoolsData.data.map((s) => ({
        id: s.id,
        name: s.attributes.name,
      })),
      activeSchoolYear,
    },
  };
};

export default FinanceDashboard;
