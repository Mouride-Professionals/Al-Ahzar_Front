import {
    Box,
    Button,
    Card,
    CardBody,
    HStack,
    ScaleFade,
    SimpleGrid,
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react';
import {
    FormExport,
    FormFilter,
    FormSearch,
} from '@components/common/input/FormInput';
import { endSchoolYear, setCurrentSchoolYear } from '@services/school_year';
import { colors, routes } from '@theme';
import { downloadCSV } from '@utils/csv';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { RiCalendarEventFill } from 'react-icons/ri';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, token }) => {
    const t = useTranslations('components.dataset.schoolYears');
    const {
        dashboard: {
            direction: {
                school_years: { all, edit },
            },
        },

    } = routes.page_route;

    const {
        id,
        name = 'N/A',
        startDate = 'N/A',
        endDate = 'N/A',
        description,
        isActive,
        isCurrent,
        isEnded
    } = data;
    const toast = useToast(
        {
            position: 'top-right',
            duration: 3000,
            isClosable: true,
        }
    );
    const router = useRouter();
    // set School Year as current
    const handleSetCurrentSchoolYear = async () => {
        try {
            const response = await setCurrentSchoolYear(id, token);
            if (response) {

                data.isCurrent = true;
                toast({
                    title: 'Annee scolaire mise en cours',
                    description: `Annee scolaire ${name} mise en cours`,
                    status: 'success',
                });
            }
            router.refresh();

        } catch (error) {
            console.error('Error setting current school year:', error);
        }
        // show success message

    };
    // set School Year as ended
    const handleEndSchoolYear = async () => {
        try {
            const response = await endSchoolYear(id, token);
            // show success message
            if (response) {
                data.isEnded = true;
                data.isCurrent = false;

                toast({
                    title: 'Annee scolaire clôturée',
                    description: `Annee scolaire  ${name} cloturée avec success`,
                    status: 'success',
                });
                router.refresh();
            }

        } catch (error) {
            console.error('Error ending current school year:', error);
        }

    };


    return (
        <ScaleFade px={5} initialScale={0.9} in={true}>
            <BoxZone>
                <Card variant="outline" w="100%" bg="white">
                    <CardBody>
                        <HStack spacing={5} mb={5}>
                            <Box
                                w={50}
                                h={50}
                                borderRadius="full"
                                bg="teal.100"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <RiCalendarEventFill color="teal" size={30} />
                            </Box>
                            <VStack align="start">
                                <Text fontWeight="bold" fontSize="lg">
                                    {name}
                                </Text>
                                <HStack>
                                    <BsFillCalendarDateFill color="blue" size={20} />
                                    <Text>
                                        {new Date(startDate).toLocaleDateString()} →{' '}
                                        {new Date(endDate).toLocaleDateString()}
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>

                        <SimpleGrid columns={[1, null, 2]} spacing={5} pt={3}>
                            <VStack align="start" spacing={3}>
                                <HStack>
                                    <Text fontWeight="bold">{t('status')} :</Text>
                                    <Text color={isActive ? 'green.500' : 'red.500'}>
                                        {isActive ? t('active') : t('inactive')}
                                    </Text>
                                </HStack>


                                <HStack>
                                    <Text fontWeight="bold">{t('state')}:</Text>
                                    <Text color={isCurrent ? 'green.500' : (isEnded ? 'red.500' : 'gray.500')}>
                                        {isCurrent ? t('current') : (isEnded ? t('ended') : t('upcoming'))}
                                    </Text>
                                </HStack>
                            </VStack>

                            {description && (
                                <VStack align="start" spacing={3}>
                                    <HStack>
                                        <AiOutlineInfoCircle color="blue" size={20} />
                                        <Text>{description}</Text>
                                    </HStack>
                                </VStack>
                            )}
                        </SimpleGrid>

                        <HStack justifyContent="flex-end" mt={5}>
                            {isCurrent ? (
                                <Button
                                    onClick={handleEndSchoolYear}
                                    colorScheme="red"
                                    variant="outline"
                                    disabled={isEnded}
                                >
                                    {t('closeYear')}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSetCurrentSchoolYear}
                                    colorScheme="orange"
                                    variant="outline"
                                    disabled={isEnded}
                                >
                                    {isEnded ? t('yearEnded') : t('setAsCurrent')}
                                </Button>
                            )}
                            <Button
                                onClick={() => router.push(edit.replace('%id', data.id))}
                                colorScheme="orange"
                                variant="outline"
                                disabled={isEnded}
                            >
                                {t('edit')}
                            </Button>
                        </HStack>
                    </CardBody>
                </Card>
            </BoxZone>
        </ScaleFade>
    );
};

export const SchoolYearDataSet = ({
    role,
    data = [],
    columns,
    selectedIndex = 0,
    token,
}) => {
    const t = useTranslations('components.dataset.schoolYears');
    const [filterText, setFilterText] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    let filtered = [];
    filtered.length = data.length;

    filtered = useMemo(() =>
        data.filter(
            (item) =>
                item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
        ).sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
    );

    const router = useRouter();
    const subHeaderComponentMemo = useMemo(() => {
        return (
            <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                my={3}
                w={'100%'}
                borderRadius={10}
            >
                <HStack>
                    <Box w={'60%'}>
                        <FormSearch
                            placeholder={t('searchPlaceholder')}
                            keyUp={(e) => setFilterText(e.target.value)}
                        />
                    </Box>
                    <HStack pl={4}>
                        <FormFilter onExpwort={() => { }} />
                        <FormExport onExport={() => downloadCSV(filtered)} />
                    </HStack>
                </HStack>

                {role?.name == 'Secretaire General' && (
                    <Button
                        onClick={() =>
                            router.push(routes.page_route.dashboard.direction.school_years.create)
                        }
                        colorScheme={'orange'}
                        bgColor={colors.primary.regular}
                        px={10}
                    >
                        {t('addSchoolYear')}
                    </Button>
                )}
            </HStack>
        );
    }, [filterText, selectedIndex, t, filtered, role, router]);

    const handleRowExpandToggle = (row) => {
        setExpandedRow((prev) => (prev?.id === row.id ? null : row));
    };
    return (
        <DataTable
            style={{ width: '100%', backgroundColor: colors.white, borderRadius: 10 }}
            columns={columns}
            data={filtered}
            defaultSortFieldId="endDate"
            defaultSortAsc={false}
            subHeader
            subHeaderAlign="center"
            expandOnRowClicked
            expandableRowsHideExpander
            expandableRowExpanded={(row) => row.id === expandedRow?.id}
            onRowClicked={handleRowExpandToggle}
            highlightOnHover
            subHeaderComponent={subHeaderComponentMemo}
            expandableRows
            expandableRowsComponent={(data) =>
                ExpandedComponent({ ...data, role, token })
            }
            pagination
        />
    );
};
