import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  ScaleFade,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FormExport,
  FormFilter,
  FormSearch,
} from '@components/common/input/FormInput';
import { colors, routes } from '@theme';
import { downloadCSV } from '@utils/csv';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiSchoolFill } from 'react-icons/ri';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, role, user_token }) => {
  const {
    dashboard: {
      direction: {
        schools: { create, edit },
      },
    },
  } = routes.page_route;
  const {
    name = 'N/A',
    type = 'Unknown',
    region = 'Unknown',
    department = 'Unknown',
    address = 'Address unavailable',
    email = 'Email unavailable',
    phone = 'Phone unavailable',
    phoneFix = null,
    creationDate = 'Unknown',
    IA = null,
    IEF = null,
    isAlAzharLand = false,
    note = null,
    responsibleName = 'Unassigned',
  } = data;

  const router = useRouter();

  return (
    <ScaleFade px={5} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant="outline" w="100%" bg="white">
          <CardBody>
            <HStack spacing={5}>
              <Box
                w={50}
                h={50}
                borderRadius="full"
                bg="teal.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <RiSchoolFill color="teal" size={30} />
              </Box>
              <VStack align="start">
                <Text fontWeight="bold" fontSize="lg">
                  {name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {type} - {region}, {department}
                </Text>
              </VStack>
            </HStack>
            <SimpleGrid columns={[1, null, 2]} spacing={5} pt={5}>
              <VStack align="start" spacing={3}>
                <HStack>
                  <HiOutlineLocationMarker color="blue" size={20} />
                  <Text>{address || 'Adresse non disponible'}</Text>
                </HStack>
                <HStack>
                  <AiOutlineMail color="blue" size={20} />
                  <Text>{email || 'Email non disponible'}</Text>
                </HStack>
                <HStack>
                  <AiOutlinePhone color="blue" size={20} />
                  <Text>{phone || 'Téléphone non disponible'}</Text>
                </HStack>
                {phoneFix && (
                  <HStack>
                    <AiOutlinePhone color="blue" size={20} />
                    <Text>{phoneFix}</Text>
                  </HStack>
                )}
                <HStack>
                  <BsFillCalendarDateFill color="blue" size={20} />
                  <Text>Créée le : {creationDate || 'Date inconnue'}</Text>
                </HStack>
              </VStack>

              <VStack align="start" spacing={3}>
                {IA && (
                  <HStack>
                    <Text fontWeight="bold">IA :</Text>
                    <Text>{IA}</Text>
                  </HStack>
                )}
                {IEF && (
                  <HStack>
                    <Text fontWeight="bold">IEF :</Text>
                    <Text>{IEF}</Text>
                  </HStack>
                )}
                <HStack>
                  <Text fontWeight="bold">Directeur :</Text>
                  <Text>{responsibleName || 'Non assigné'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Appartenance :</Text>
                  <Text>{isAlAzharLand ? 'Al Azhar' : 'Non Al Azhar'}</Text>
                </HStack>
                {note && (
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Note :</Text>
                    <Text>{note}</Text>
                  </VStack>
                )}
              </VStack>
            </SimpleGrid>
            <HStack justifyContent="flex-end" mt={5}>
              <Button
                onClick={() =>
                  router.push(`dashboard/direction/schools/${data.id}/edit`)
                }
                colorScheme="orange"
                variant="outline"
              >
                {'Modifier'}
              </Button>
            </HStack>
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

export const SchoolDataSet = ({
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
    data.filter(
      (item) =>
        item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
    )
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
              placeholder={'Rechercher une école'}
              keyUp={(e) => setFilterText(e.target.value)}
            />
          </Box>
          {/* onExport={() => downloadCSV(filtered[selectedIndex])} */}
          <HStack pl={4}>
            <FormFilter onExpwort={() => {}} />
            <FormExport onExport={() => downloadCSV(filtered)} />
          </HStack>
        </HStack>

        {role?.name == 'Secretaire General' && (
          <Button
            onClick={() =>
              router.push(routes.page_route.dashboard.direction.schools.create)
            }
            colorScheme={'orange'}
            bgColor={colors.primary.regular}
            px={10}
          >
            {'Ajouter une école'}
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
      initialState={{ sortBy: [{ id: 'name', desc: true }] }}
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
