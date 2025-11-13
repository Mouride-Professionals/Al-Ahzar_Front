import {
  Box,
  Heading,
  HStack,
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
import { ExpenseDataSet } from '@components/common/reports/expense_data_set';
import { PaymentDataSet } from '@components/common/reports/payment_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { PaymentCancellationModal } from '@components/modals/paymentCancellationModal';
import { colors, routes } from '@theme';
import { generateExpectedMonths, getMonthName } from '@utils/date';
import { mapExpensesDataTable } from '@utils/mappers/expense';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapPaymentsDataTable } from '@utils/mappers/payment';
import { mapPaymentType } from '@utils/tools/mappers';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
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
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';
import { DEFAULT_ROWS_PER_PAGE } from '@constants/pagination';

const FinanceDashboard = ({
  role,
  token,
  schoolId,
  schoolYearId,
  paymentKpis,
  expenseKpis,
  schoolYearData,
}) => {
  const t = useTranslations();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');
  const [paymentSummary, setPaymentSummary] = useState();
  const [expenseSummary, setExpenseSummary] = useState();
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [expenseTransactions, setExpenseTransactions] = useState([]);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  // Payment cancellation modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { PAYMENTS_COLUMNS, EXPENSES_COLUMNS } = useTableColumns();
  const skeletonBlock = (height) => (
    <Skeleton h={height} borderRadius="md" w="100%" startColor={colors.gray.light} endColor={colors.gray.highlight} />
  );

  const chartSkeleton = () => (
    <Box w="100%" minW="0" minH="300px" position="relative" borderRadius="md" overflow="hidden">
      <Skeleton position="absolute" inset={0} startColor={colors.gray.light} endColor={colors.gray.highlight} />
      <Box position="absolute" bottom={4} left={4} right={4} display="flex" alignItems="flex-end" justifyContent="space-between" height="220px">
        {[45, 60, 35, 70, 50].map((h, idx) => (
          <Skeleton key={idx} w="12%" h={`${h}%`} borderRadius="sm" startColor={colors.gray.highlight} endColor={colors.gray.light} />
        ))}
      </Box>
    </Box>
  );

  const pieSkeleton = () => (
    <Box w="100%" minW="0" minH="350px" position="relative" borderRadius="md">
      <Skeleton circle h="240px" w="240px" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" startColor={colors.gray.light} endColor={colors.gray.highlight} />
      {[15, 90, 160].map((deg, idx) => (
        <Skeleton
          key={idx}
          position="absolute"
          top="50%"
          left="50%"
          transform={`translate(-50%, -50%) rotate(${deg}deg)`}
          h="2px"
          w="200px"
          startColor={colors.gray.highlight}
          endColor={colors.gray.light}
        />
      ))}
    </Box>
  );
  const paymentPagination = paymentKpis?.[0]?.meta?.pagination || null;
  const paymentBaseRoute = useMemo(() => {
    if (!schoolYearId || !schoolId) return '';
    return routes.api_route.alazhar.get.finance.all
      .replace('%activeSchoolYear', schoolYearId)
      .replace('%schoolId', schoolId);
  }, [schoolYearId, schoolId]);

  const expensePagination = expenseKpis?.[0]?.meta?.pagination || null;
  const expenseBaseRoute = useMemo(() => {
    if (!schoolYearId || !schoolId) return '';
    return routes.api_route.alazhar.get.expenses.all
      .replace('%activeSchoolYear', schoolYearId)
      .replace('%schoolId', schoolId);
  }, [schoolYearId, schoolId]);

  useEffect(() => {
    if (paymentKpis && expenseKpis) {
      setPaymentSummary(paymentKpis[1]);

      // Map payments data inside useEffect to avoid dependency issues
      const payments = mapPaymentsDataTable({ payments: paymentKpis[0] });
      setTransactions(payments);

      // Map expenses data inside useEffect to avoid dependency issues
      const expenses = mapExpensesDataTable({ expenses: expenseKpis[0] });
      setExpenseTransactions(expenses);

      // Generate expected months from school year dates
      const expectedMonths = generateExpectedMonths(
        schoolYearData?.startDate,
        schoolYearData?.endDate
      );
      const paymentMonthlyData = paymentKpis[1]?.monthlyBreakdown || [];
      const paymentTypeData = paymentKpis[1]?.paymentTypeBreakdown || [];

      setExpenseSummary(expenseKpis[1]);
      const expenseMonthlyData = expenseKpis[1]?.monthlyBreakdown || [];
      const expenseCategoryData = expenseKpis[1]?.totalByCategory || {};

      const updateChartData = (data) => {
        const chart = expectedMonths.map((m) => {
          const found = data.find((item) => item.month === m);
          return {
            month: getMonthName(m),
            amount: found ? found.total : 0,
          };
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
        updateChartData(expenseMonthlyData, true);
        updatePieData(expenseCategoryData, true);
      }

      setLoading(false);
    }
  }, [
    paymentKpis,
    expenseKpis,
    activeTab,
    schoolYearData?.startDate,
    schoolYearData?.endDate,
  ]);

  // Payment cancellation handler
  const handleCancelPayment = (payment) => {

    setSelectedPayment(payment);
    setIsCancelModalOpen(true);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setSelectedPayment(null);
  };

  const handleCancelSuccess = () => {
    // Refresh the transactions data
    const payments = mapPaymentsDataTable({ payments: paymentKpis[0] });
    setTransactions(payments);
    handleCancelModalClose();

    toast({
      title: t('components.forms.messages.payment.cancellation.success'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Finance card statistics (all UI text is internationalized)
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

  const expenseStats = [
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        expenseSummary?.yearExpenseTotal ?? 0
      ),
      icon: <SiCashapp color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.annual_expenses'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        expenseSummary?.currentMonthExpenseTotal ?? 0
      ),
      icon: <FaCalendarCheck color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.current_month'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        expenseSummary?.previousMonthExpenseTotal ?? 0
      ),
      icon: <FaRegCalendarAlt color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.previous_month'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        expenseSummary?.salaryExpenseTotal ?? 0
      ),
      icon: <SiCashapp color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.salaries'),
    },
    {
      count: t('pages.stats.amount.finance').replace(
        '%number',
        expenseSummary?.totalByCategory?.Maintenance ?? 0
      ),
      icon: <SiCashapp color={colors.primary.regular} size={25} />,
      title: t('components.dataset.finance.maintenance'),
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
    const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
    const RADIAN = Math.PI / 180;
    const rName = innerRadius + (outerRadius - innerRadius) * 0.5;
    const xName = cx + rName * Math.cos(-midAngle * RADIAN);
    const yName = cy + rName * Math.sin(-midAngle * RADIAN);
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
          textAnchor={xAmount > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize={12}
        >
          {`${pieData[index].name}: ${Number(pieData[index].value).toLocaleString()} FCFA`}
        </text>
      </g>
    );
  };

  return (
    <DashboardLayout
      title={t('pages.dashboard.finance.title')}
      currentPage={t('components.menu.finance')}
      role={role}
      token={token}
    >
      <Tabs
        mt={5}
        variant="soft-rounded"
        colorScheme={'orange'}
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
                {loading ? skeletonBlock('140px') : (
                  <Statistics cardStats={paymentStats} />
                )}
              </HStack>
              <Text
                color={colors.secondary.regular}
                fontSize={20}
                fontWeight="700"
              >
                {t('components.dataset.finance.payments_history')}
              </Text>
              <Stack bgColor={colors.white} w="100%">
                <PaymentDataSet
                  role={role}
                  data={transactions}
                  columns={PAYMENTS_COLUMNS}
                  token={token}
                  onCancelPayment={handleCancelPayment}
                  initialPagination={paymentPagination}
                  baseRoute={paymentBaseRoute}
                />
              </Stack>
              <HStack w="100%">
                <Box
                  mb={8}
                  p={5}
                  borderWidth="1px"
                  borderRadius="md"
                  w="100%"
                  bgColor="white"
                >
                  <Heading size="md" mb={4}>
                    {t('components.dataset.finance.monthly_payments_trend')}
                  </Heading>
                  {loading ? (
                    skeletonBlock('300px')
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
                  mb={8}
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
                  {loading ? (
                    skeletonBlock('350px')
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
                            <Cell key={`cell-${index}`} fill={pieColors[index]} />
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
              <HStack w="100%">
                {loading ? skeletonBlock('140px') : (
                  <Statistics cardStats={expenseStats} />
                )}
              </HStack>
              <Text
                color={colors.secondary.regular}
                fontSize={20}
                fontWeight="700"
              >
                {t('components.dataset.finance.expenses_history')}
              </Text>
              <Stack bgColor={colors.white} w="100%">
                <ExpenseDataSet
                  role={role}
                  data={expenseTransactions}
                  columns={EXPENSES_COLUMNS}
                  token={token}
                  schoolId={schoolId}
                  schoolYearId={schoolYearId}
                  setHasSucceeded={setHasSucceeded}
                  initialPagination={expensePagination}
                  baseRoute={expenseBaseRoute}
                />
              </Stack>
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
                  {loading ? (
                    skeletonBlock('300px')
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
                  {loading ? (
                    skeletonBlock('350px')
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
                            <Cell key={`cell-${index}`} fill={pieColors[index]} />
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

      {/* Payment Cancellation Modal */}
      {selectedPayment && (
        <PaymentCancellationModal
          isOpen={isCancelModalOpen}
          onClose={handleCancelModalClose}
          paymentId={selectedPayment}
          token={token}
          setHasSucceeded={handleCancelSuccess}
          // setHasSucceeded={setHasSucceeded}
        />
      )}
    </DashboardLayout>
  );
};

export default FinanceDashboard;

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
        finance: { all: payments, stats: financeStats },
        expenses: { all: expenses, stats: expenseStats },
        school_years: { detail: schoolYearRoute },
      },
    },
  } = routes.api_route;

  const response = await serverFetch({
    uri: me,
    user_token: token,
  });
  const role = response.role;
  const schoolId = response.school.id;

  // Fetch KPIs for payments and expenses, and school year data
  const pageSize = DEFAULT_ROWS_PER_PAGE;

  const [paymentKpis, expenseKpis, schoolYearData] = await Promise.all([
    Promise.all([
      serverFetch({
        uri: payments
          .replace('%activeSchoolYear', activeSchoolYear)
          .replace('%schoolId', schoolId) +
          `&pagination[page]=1&pagination[pageSize]=${pageSize}`,
        user_token: token,
      }),
      serverFetch({
        uri: financeStats
          .replace('%activeSchoolYear', activeSchoolYear)
          .replace('%schoolId', schoolId),
        user_token: token,
      }),
    ]),
    Promise.all([
      serverFetch({
        uri: expenses
          .replace('%activeSchoolYear', activeSchoolYear)
          .replace('%schoolId', schoolId) +
          `&pagination[page]=1&pagination[pageSize]=${pageSize}`,
        user_token: token,
      }),
      serverFetch({
        uri: expenseStats
          .replace('%activeSchoolYear', activeSchoolYear)
          .replace('%schoolId', schoolId),
        user_token: token,
      }),
    ]),
    serverFetch({
      uri: schoolYearRoute.replace('%id', activeSchoolYear),
      user_token: token,
    }).catch(() => null), // Handle case where school year data might not be available
  ]);

  return {
    props: {
      role,
      token,
      schoolId,
      schoolYearId: activeSchoolYear,
      paymentKpis,
      expenseKpis,
      schoolYearData: schoolYearData?.data?.attributes || null,
    },
  };
};
