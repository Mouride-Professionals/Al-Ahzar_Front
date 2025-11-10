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
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { generateExpectedMonths, getMonthName } from '@utils/date';
import { mapExpensesDataTable } from '@utils/mappers/expense';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapPaymentsDataTable } from '@utils/mappers/payment';
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
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={6}
      w="100%"
    >
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

const ModalFallback = () => null;

const Statistics = dynamic(
  () => import('@components/func/lists/Statistic').then((mod) => mod.Statistics),
  { ssr: false, loading: StatisticsFallback }
);

const PaymentDataSet = dynamic(
  () => import('@components/common/reports/payment_data_set').then((mod) => mod.PaymentDataSet),
  { ssr: false, loading: DataSetFallback }
);

const ExpenseDataSet = dynamic(
  () => import('@components/common/reports/expense_data_set').then((mod) => mod.ExpenseDataSet),
  { ssr: false, loading: DataSetFallback }
);

const PaymentCancellationModal = dynamic(
  () =>
    import('@components/modals/paymentCancellationModal').then(
      (mod) => mod.PaymentCancellationModal
    ),
  { ssr: false, loading: ModalFallback }
);

const ChartFallback = () => <Skeleton height="300px" borderRadius="md" w="100%" />;

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
  schoolId,
  schoolYearId,
  paymentKpis,
  expenseKpis,
  schoolYearData,
}) => {
  const t = useTranslations();
  const toast = useToast();

  // Payment cancellation modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { PAYMENTS_COLUMNS, EXPENSES_COLUMNS } = useTableColumns();

  const paymentSummary = paymentKpis?.[1];
  const expenseSummary = expenseKpis?.[1];

  const paymentMonthlyData = paymentSummary?.monthlyBreakdown ?? [];
  const paymentTypeData = paymentSummary?.paymentTypeBreakdown ?? [];

  const expenseMonthlyData = expenseSummary?.monthlyBreakdown ?? [];
  const expenseCategoryData = expenseSummary?.totalByCategory ?? {};

  const basePaymentTransactions = useMemo(
    () => mapPaymentsDataTable({ payments: paymentKpis?.[0] || { data: [] } }),
    [paymentKpis]
  );

  const baseExpenseTransactions = useMemo(
    () => mapExpensesDataTable({ expenses: expenseKpis?.[0] || { data: [] } }),
    [expenseKpis]
  );

  const [activeTab, setActiveTab] = useState('payments');
  const [, setHasSucceeded] = useState(false);
  const [transactions, setTransactions] = useState(basePaymentTransactions);
  const [expenseTransactions, setExpenseTransactions] = useState(baseExpenseTransactions);

  useEffect(() => {
    setTransactions(basePaymentTransactions);
  }, [basePaymentTransactions]);

  useEffect(() => {
    setExpenseTransactions(baseExpenseTransactions);
  }, [baseExpenseTransactions]);

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

  // Payment cancellation handler
  const handleCancelPayment = (payment) => {
    console.log('handleCancelPayment in FinanceDashboard', payment);

    setSelectedPayment(payment);
    setIsCancelModalOpen(true);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setSelectedPayment(null);
  };

  const handleCancelSuccess = () => {
    // Refresh the transactions data
    const payments = mapPaymentsDataTable({ payments: paymentKpis?.[0] || { data: [] } });
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
                <Statistics cardStats={paymentStats} />
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
                          <Cell key={`cell-${index}`} fill={pieColors[index]} />
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
  const cacheTtlMs = 5 * 60 * 1000;

  const [paymentKpis, expenseKpis, schoolYearData] = await Promise.all([
    Promise.all([
      serverFetch({
        uri: payments
          .replace('%activeSchoolYear', activeSchoolYear)
          .replace('%schoolId', schoolId),
        user_token: token,
        cacheTtl: cacheTtlMs,
      }),
      serverFetch({
        uri: financeStats
          .replace('%activeSchoolYear', activeSchoolYear)
          .replace('%schoolId', schoolId),
        user_token: token,
        cacheTtl: cacheTtlMs,
      }),
    ]),
    Promise.all([
      serverFetch({
        uri: expenses
          .replace('%activeSchoolYear', activeSchoolYear)
          .replace('%schoolId', schoolId),
        user_token: token,
        cacheTtl: cacheTtlMs,
      }),
      serverFetch({
        uri: expenseStats
          .replace('%activeSchoolYear', activeSchoolYear)
          .replace('%schoolId', schoolId),
        user_token: token,
        cacheTtl: cacheTtlMs,
      }),
    ]),
    serverFetch({
      uri: schoolYearRoute.replace('%id', activeSchoolYear),
      user_token: token,
      cacheTtl: cacheTtlMs,
    }).catch(() => null), // Handle case where school year data might not be available
  ]);
  console.log('paymentKpis, expenseKpis', paymentKpis, expenseKpis);

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
