import {
    Box,
    Button,
    Card,
    CardBody,
    Grid,
    GridItem,
    HStack,
    ScaleFade,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import {
    FormExport,
    FormFilter,
    FormSearch,
} from '@components/common/input/FormInput';
import { colors, routes } from '@theme';
import { downloadCSV } from '@utils/csv';
import { reportingFilter } from '@utils/mappers/kpi';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { PiUserDuotone } from 'react-icons/pi';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, role, user_token }) => {
    const {
        dashboard: {
            direction: {
                teachers: { create, detail },
            },
        },
    } = routes.page_route;
    const {
        id,
        firstname,
        lastname,
        phoneNumber,
        email,
        gender,
    } = data;

    const router = useRouter();

    return (
        <ScaleFade px={5} initialScale={0.9} in={true}>
            <BoxZone>
                <Card variant={'filled'} w={'100%'}>
                    <CardBody>
                        <Grid templateColumns={'repeat(2, 1fr)'} columnGap={5}>
                            <GridItem
                                pr={2}
                                borderRight={1}
                                borderRightStyle={'solid'}
                                borderRightColor={colors.gray.thin}
                            >
                                <HStack
                                    justifyContent={'space-between'}
                                    borderStyle={'solid'}
                                    w={'100%'}
                                >
                                    <HStack>
                                        <VStack
                                            justifyContent={'center'}
                                            w={50}
                                            h={50}
                                            borderRadius={100}
                                            borderColor={colors.secondary.regular}
                                            borderWidth={1}
                                        >
                                            <PiUserDuotone
                                                color={colors.secondary.regular}
                                                size={25}
                                            />
                                        </VStack>

                                        <Stack>
                                            <Text fontWeight={'bold'}>
                                                {firstname} {lastname}
                                            </Text>
                                        </Stack>
                                    </HStack>

                                    {/* {type && ACCESS_STUDENT_VALIDATION.includes(role.type) && (
                                        <Box justifySelf={'flex-end'}>
                                            <Button
                                                onClick={() =>
                                                    monthValidationHandler({ id, user_token })
                                                }
                                                colorScheme={'orange'}
                                                variant={'outline'}
                                                leftIcon={
                                                    <FaCashRegister
                                                        color={colors.primary.regular}
                                                        size={25}
                                                    />
                                                }
                                            >
                                                Valider une mensualité
                                            </Button>
                                        </Box>
                                    )} */}
                                </HStack>

                            </GridItem>

                        </Grid>
                    </CardBody>
                </Card>
            </BoxZone>
        </ScaleFade>
    );
};

export const TeacherDataSet = ({
    role,
    data = [],
    columns,
    selectedIndex = 0,
    token,
}) => {
    const [filterText, setFilterText] = useState('');

    let filtered = [];
    filtered.length = data.length;

    filtered = useMemo(() =>


        reportingFilter({
            data,
            position: selectedIndex,
            needle: filterText,
        })
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
                            placeholder={'Rechercher un enseignant'}
                            keyUp={(e) => setFilterText(e.target.value)}
                        />
                    </Box>
                    {/* onExport={() => downloadCSV(filtered[selectedIndex])} */}
                    <HStack pl={4}>
                        <FormFilter onExport={() => { }} />
                        <FormExport onExport={() => downloadCSV(filtered)} />
                    </HStack>
                </HStack>

                {role?.name != '' && (
                    <Button
                        onClick={() =>
                            router.push(routes.page_route.dashboard.direction.teachers.create)
                        }
                        colorScheme={'orange'}
                        bgColor={colors.primary.regular}
                        px={10}
                    >
                        {'Ajouter un enseignant'}
                    </Button>
                )}
            </HStack>
        );
    }, [filterText, selectedIndex]);


    return (
        <DataTable
            style={{ width: '100%', backgroundColor: colors.white, borderRadius: 10 }}
            columns={columns}
            data={filtered}
            defaultCanSort
            initialState={{ sortBy: [{ id: 'createdAt', desc: true }] }}
            subHeader
            // selectableRows
            subHeaderComponent={subHeaderComponentMemo}
            expandableRows
            expandableRowsComponent={(data) =>
                ExpandedComponent({ ...data, role, user_token: token })
            }
            pagination
        />
    );
};
