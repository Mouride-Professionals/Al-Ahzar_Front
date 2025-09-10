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
import { DataTableLayout } from '@components/layout/data_table';
import { endSchoolYear, setCurrentSchoolYear } from '@services/school_year';
import { colors, routes } from '@theme';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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
    };

    const handleEndSchoolYear = async () => {
        try {
            const response = await endSchoolYear(id, token);
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

    const filtered = useMemo(() =>
        data.filter(
            (item) =>
                item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
        ).sort((a, b) => new Date(b.endDate) - new Date(a.endDate)),
        [data, filterText]
    );

    const router = useRouter();

    const actionButton = role?.name === 'Secretaire General' && (
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
    );

    const filterFunction = ({ data, needle }) =>
        data.filter(
            (item) =>
                item.name && item.name.toLowerCase().includes(needle.toLowerCase())
        );

    return (
        <DataTableLayout
            columns={columns}
            data={filtered}
            role={role}
            token={token}
            translationNamespace="components.dataset.schoolYears"
            actionButton={actionButton}
            expandedComponent={(data) =>
                ExpandedComponent({ ...data, role, token })
            }
            filterFunction={filterFunction}
            filterText={filterText}
            setFilterText={setFilterText}
            paginationProps={{
                rowsPerPage: 10,
                rowsPerPageOptions: [5, 10, 20],
            }}
        />
    );
};
