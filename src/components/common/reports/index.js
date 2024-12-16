import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Highlight,
  ScaleFade,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FormExport,
  FormFilter,
  FormSearch,
} from '@components/common/input/FormInput';
import { monthValidationHandler } from '@handlers';
import { colors, routes } from '@theme';
import { downloadCSV } from '@utils/csv';
import { ACCESS_STUDENT_VALIDATION } from '@utils/mappers/classes';
import { reportingFilter } from '@utils/mappers/kpi';
import { dateFormatter } from '@utils/tools/mappers';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaCashRegister } from 'react-icons/fa';
import { PiUserDuotone, PiUsersDuotone } from 'react-icons/pi';
import { SlClose } from 'react-icons/sl';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, role, user_token }) => {
  const {
    dashboard: {
      cashier: {
        students: { confirm },
      },
    },
  } = routes.page_route;
  const {
    id,
    firstname,
    lastname,
    level,
    registered_at,
    parent_firstname,
    parent_lastname,
    parent_phone,
    type,
    socialStatus,
    registrationComment,
    payments: { data: payment_history },
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
                      <Text fontSize={15}>{level}</Text>
                    </Stack>
                  </HStack>

                  {type && ACCESS_STUDENT_VALIDATION.includes(role.type) && (
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
                  )}
                </HStack>
                <Stack divider={<StackDivider />} spacing={4} pt={2}>
                  <Text>
                    <Highlight
                      query={registered_at}
                      styles={{ fontWeight: 700 }}
                    >
                      {`Inscrit le: ${registered_at}`}
                    </Highlight>
                  </Text>

                  <Stack>
                    <Text fontWeight={700}>{'Prise en charge'}</Text>
                    <Text>{socialStatus || '...'}</Text>
                  </Stack>

                  <Stack>
                    <Text fontWeight={700}>{'BIO'}</Text>
                    <Text>{registrationComment || '...'}</Text>
                  </Stack>

                  <Stack>
                    <Text fontWeight={700} fontSize={15}>
                      {'État des paiements'}
                    </Text>
                    {!type && (
                      <Stack>
                        {ACCESS_STUDENT_VALIDATION.includes(role.type) ? (
                          <Button
                            onClick={() =>
                              router.push(confirm.replace('{student}', id))
                            }
                            colorScheme={'green'}
                            variant={'outline'}
                          >
                            {"Valider l'inscription"}
                          </Button>
                        ) : (
                          <Text fontSize={15}>
                            {'En attente du service financier'}
                          </Text>
                        )}
                      </Stack>
                    )}

                    <SimpleGrid columns={[1, null, 1]} spacing={5}>
                      {type &&
                        payment_history.map((item) => {
                          const {
                            attributes: { monthOf, isPaid, createdAt },
                          } = item;
                          const paymentDate = new Date(monthOf);

                          return (
                            <HStack
                              alignItem={'center'}
                              justifyContent={'space-between'}
                              bg={colors.white}
                              borderRadius={8}
                              py={2}
                              px={4}
                              key={`payment-${createdAt}`}
                            >
                              <Text>{dateFormatter(paymentDate)}</Text>
                              {isPaid ? (
                                <BsCheck2Circle
                                  color={colors.secondary.regular}
                                  size={20}
                                />
                              ) : (
                                <SlClose color={colors.error} size={20} />
                              )}
                            </HStack>
                          );
                        })}
                    </SimpleGrid>
                  </Stack>
                </Stack>
              </GridItem>
              <GridItem>
                <HStack borderStyle={'solid'}>
                  <VStack
                    justifyContent={'center'}
                    w={50}
                    h={50}
                    borderRadius={100}
                    bgColor={colors.secondary.light}
                    borderColor={colors.secondary.regular}
                    borderWidth={1}
                  >
                    <PiUsersDuotone
                      color={colors.secondary.regular}
                      size={25}
                    />
                  </VStack>

                  <Stack>
                    <Text fontWeight={'bold'}>
                      {parent_firstname} {parent_lastname}
                    </Text>
                    <Text fontSize={15}>{'Tuteur'}</Text>
                  </Stack>
                </HStack>
                <Stack divider={<StackDivider />} spacing={4} pt={2}>
                  <Text>
                    <Highlight
                      query={parent_phone}
                      styles={{ fontWeight: 700 }}
                    >
                      {`Téléphone: ${parent_phone}`}
                    </Highlight>
                  </Text>
                </Stack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

export const DataSet = ({
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
              placeholder={'Rechercher un élève'}
              keyUp={(e) => setFilterText(e.target.value)}
            />
          </Box>
          {/* onExport={() => downloadCSV(filtered[selectedIndex])} */}
          <HStack pl={4}>
            <FormFilter onExpwort={() => {}} />
            <FormExport onExport={() => downloadCSV(filtered)} />
          </HStack>
        </HStack>

        {role?.name != 'Caissier' && (
          <Button
            onClick={() =>
              router.push(routes.page_route.dashboard.students.create)
            }
            colorScheme={'orange'}
            bgColor={colors.primary.regular}
            px={10}
          >
            {'Inscrire un élève'}
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
      initialState={{ sortBy: [{ id: 'registered_at', desc: true }] }}
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
