import {
  Box,
  Heading,
  HStack,
  Select,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  Wrap,
} from '@chakra-ui/react';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { generateExpectedMonths, getMonthName } from '@utils/date';
import { mapExpensesDataTable } from '@utils/mappers/expense';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapPaymentType } from '@utils/tools/mappers';
import { getToken } from 'next-auth/jwt';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaRegCalendarAlt,
} from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { SiCashapp } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';

const StatisticsFallback = () => (
  <HStack w="100%">
    <Stack direction={{ base: 'column', md: 'row' }} spacing={6} w="100%">
      {Array.from({ length: 2 }).map((_, index) => (
        <Stack
          key={index}
          bgColor={colors.white}
          borderRadius="lg"
          boxShadow="sm"
          p={6}
          flex={1}
        >
          <Skeleton height="24px" mb={2} />
          <Skeleton height="16px" />
        </Stack>
      ))}
    </Stack>
  </HStack>
);

const DataSetFallback = () => (
  <Stack bgColor={colors.white} w="100%" p={6} borderRadius="lg" boxShadow="sm" spacing={4}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} height="20px" />
    ))}
    <Skeleton height="200px" borderRadius="md" />
  </Stack>
);

const ChartFallback = () => <Skeleton height="320px" borderRadius="md" w="100%" />;

const Statistics = dynamic(
  () => import('@components/func/lists/Statistic').then((mod) => mod.Statistics),
  { ssr: false, loading: StatisticsFallback }
);

const ExpenseDataSet = dynamic(
  () => import('@components/common/reports/expense_data_set').then((mod) => mod.ExpenseDataSet),
  { ssr: false, loading: DataSetFallback }
);

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false, loading: ChartFallback }
);
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });

const FinanceDashboard = ({
  role,
  token,
  initialPaymentKpis,
  initialExpenseKpis,
  schools,
  activeSchoolYear,
  schoolYearData,
}) => {
  const t = useTranslations();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('payments');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [paymentSummary, setPaymentSummary] = useState(initialPaymentKpis);
  const [expenseSummary, setExpenseSummary] = useState(initialExpenseKpis);
  const [expenseData, setExpenseData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [, setHasSucceeded] = useState(false);

  const { EXPENSES_COLUMNS } = useTableColumns();

  const paymentMonthlyData = paymentSummary?.monthlyBreakdown ?? [];
  const paymentTypeData = paymentSummary?.paymentTypeBreakdown ?? [];
  const expenseMonthlyData = expenseSummary?.monthlyBreakdown ?? [];
  const expenseCategoryData = expenseSummary?.totalByCategory ?? {};
  const expectedMonths = useMemo(() => {
    if (!schoolYearData?.startDate || !schoolYearData?.endDate) return [];
    return generateExpectedMonths(schoolYearData.startDate, schoolYearData.endDate);
  }, [schoolYearData?.startDate, schoolYearData?.endDate]);

  const chartData = useMemo(() => {
    const dataset = activeTab === 'payments' ? paymentMonthlyData : expenseMonthlyData;
    const months = expectedMonths.length ? expectedMonths : dataset.map((item) => item.month);
    if (!months.length) return [];

    return months.map((month) => {
      const found = dataset.find((item) => item.month === month);
      return {
        month: getMonthName(month),
        amount: found ? Number(found.total) : 0,
      };
    });
  }, [activeTab, expectedMonths, paymentMonthlyData, expenseMonthlyData]);
console.log('chartdata',chartData);

  const pieData = useMemo(() => {
    if (activeTab === 'payments') {
      return (paymentTypeData || []).map((item) => ({
        name: mapPaymentType[item.paymentType] || item.paymentType,
        value: Number(item.total) || 0,
      }));
    }

    return Object.entries(expenseCategoryData || {}).map(([category, total]) => ({
      name: category,
      value: Number(total) || 0,
    }));
  }, [activeTab, paymentTypeData, expenseCategoryData]);

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
    if (!pieData[index]) return null;

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
    const fetchData = async () => {
      setIsFetching(true);
      const {
        alazhar: {
          get: {
            finance: { statsWithoutSchoolId: paymentStatsRoute },
            expenses: {
              statsWithoutSchoolId: expenseStatsRoute,
              all: expenseDataRoute,
            },
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

        // Fetch expense data only when a specific school is selected
        const expenseDataUri =
          selectedSchool !== 'all'
            ? expenseDataRoute
                .replace('%activeSchoolYear', activeSchoolYear)
                .replace('%schoolId', selectedSchool)
            : null;

        const paymentStatsData = await serverFetch({
          uri: paymentStatsUri,
          user_token: token,
        });
        const expenseStatsData = await serverFetch({
          uri: expenseStatsUri,
          user_token: token,
        });

        // Fetch expense data only for specific school
        let expenseDataResult = [];
        if (expenseDataUri) {
          try {
            const expenseDataResponse = await serverFetch({
              uri: expenseDataUri,
              user_token: token,
            });
            expenseDataResult = mapExpensesDataTable({
              expenses: expenseDataResponse,
            });
          } catch (error) {
            console.error('Error fetching expense data:', error);
            expenseDataResult = [];
          }
        } else {
          expenseDataResult = [];
        }

        setPaymentSummary(paymentStatsData);
        setExpenseSummary(expenseStatsData);
        setExpenseData(expenseDataResult);
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
        setIsFetching(false);
      }
    };

    fetchData();
  }, [selectedSchool, token, activeSchoolYear, toast]);

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
                activeTab === 'payments' ? colors.primary.regular : colors.primary.regular
              }
            >
              {t('components.dataset.finance.payments_tab')}
            </Tab>
            <Tab
              color={
                activeTab === 'expenses' ? colors.primary.regular : colors.primary.regular
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
                  {isFetching ? <StatisticsFallback /> : <Statistics cardStats={paymentStats} />}
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
                    {isFetching ? (
                      <ChartFallback />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="amount" fill="#3182CE" barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
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
                    {isFetching ? (
                      <ChartFallback />
                    ) : (
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
                    )}
                  </Box>
                </HStack>
              </Wrap>
            </TabPanel>

            {/* Expenses Tab */}
            <TabPanel>
              <Wrap spacing={20.01}>
                {/* Statistics */}
                <HStack w="100%">
                  {isFetching ? <StatisticsFallback /> : <Statistics cardStats={expenseStats} />}
                </HStack>

                {/* Expense Data Table - Only show when specific school is selected */}
                {selectedSchool !== 'all' && (
                  <>
                    <HStack w="100%">
                      <Text
                        color={colors.secondary.regular}
                        fontSize={20}
                        fontWeight="700"
                      >
                        {t('components.dataset.finance.expenses_history')}
                      </Text>
                    </HStack>
                    <Stack bgColor={colors.white} w="100%">
                      {isFetching ? (
                        <DataSetFallback />
                      ) : expenseData.length ? (
                        <ExpenseDataSet
                          role={role}
                          data={expenseData}
                          columns={EXPENSES_COLUMNS}
                          token={token}
                          schoolId={selectedSchool}
                          schoolYearId={activeSchoolYear}
                          setHasSucceeded={setHasSucceeded}
                        />
                      ) : (
                        <Box p={6}>
                          <Text color={colors.gray.regular}>
                            {t('components.dataset.finance.noExpenses', {
                              fallback: 'No expenses recorded yet.',
                            })}
                          </Text>
                        </Box>
                      )}
                    </Stack>
                  </>
                )}

                {/* Monthly Expenses Trend */}
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
                    {isFetching ? (
                      <ChartFallback />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="amount" fill="#E53E3E" barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </HStack>

                {/* Expenses by Category */}
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
                    {isFetching ? (
                      <ChartFallback />
                    ) : (
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
                    )}
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
  const activeSchoolYear =
    (await ensureActiveSchoolYear({ req, res, token })) || '';

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
        school_years: { detail: schoolYearRoute },
      },
    },
  } = routes.api_route;

  const currentUser = await serverFetch({ uri: me, user_token: token });
  const role = currentUser.role;

  // Fetch initial data (system-wide), schools list, and school year data
  const cacheTtlMs = 5 * 60 * 1000;
  const [schoolsData, initialPaymentKpis, initialExpenseKpis, schoolYearData] =
    await Promise.all([
      serverFetch({ uri: schoolsRoute, user_token: token, cacheTtl: cacheTtlMs }),
      serverFetch({
        uri: financeStats.replace('%activeSchoolYear', activeSchoolYear),
        user_token: token,
        cacheTtl: cacheTtlMs,
      }),
      serverFetch({
        uri: expenseStats.replace('%activeSchoolYear', activeSchoolYear),
        user_token: token,
        cacheTtl: cacheTtlMs,
      }),
      serverFetch({
        uri: schoolYearRoute.replace('%id', activeSchoolYear),
        user_token: token,
        cacheTtl: cacheTtlMs,
      }).catch(() => null), // Handle case where school year data might not be available
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
      schoolYearData: schoolYearData?.data?.attributes || null,
    },
  };
};

export default FinanceDashboard;
