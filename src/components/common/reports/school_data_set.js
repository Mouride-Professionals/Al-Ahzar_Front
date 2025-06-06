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
import { colors, images, routes } from '@theme';
import { downloadCSV } from '@utils/csv';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, role, user_token }) => {
  const {
    dashboard: {
      direction: {
        schools: { edit, classes: { all } },
      },
    },
  } = routes.page_route;
  const {
    banner = null,
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
  const schoolBannerUrl = banner === null
    ? images.logo.src // Fallback to default logo
    : images.logo.src; // `${process.env.NEXT_PUBLIC_API_URL}${banner?.data?.attributes.url}`;

  const t = useTranslations('components.dataset.schools');

  return (
    <ScaleFade px={5} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant="outline" w="100%" bg="white">
          <CardBody>
            <HStack spacing={5}>
              {/* <Box
                w={50}
                h={50}
                borderRadius="full"
                bg="teal.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <RiSchoolFill color="orange" size={30} />
              </Box> */}
              <Box h={70.01} w={80.01} pos={'relative'}>
                <Image src={schoolBannerUrl}
                  alt={name}
                  fill
                  style={{ objectFit: "contain" }}
                />
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
                  <Text>{address || t('addressUnavailable')}</Text>
                </HStack>
                <HStack>
                  <AiOutlineMail color="blue" size={20} />
                  <Text>{email || t('emailUnavailable')}</Text>
                </HStack>
                <HStack>
                  <AiOutlinePhone color="blue" size={20} />
                  <Text>{phone || t('phoneUnavailable')}</Text>
                </HStack>
                {phoneFix && (
                  <HStack>
                    <AiOutlinePhone color="blue" size={20} />
                    <Text>{phoneFix}</Text>
                  </HStack>
                )}
                <HStack>
                  <BsFillCalendarDateFill color="blue" size={20} />
                  <Text>Créée le : {creationDate || t('dateUnknown')}</Text>
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
                  <Text fontWeight="bold">{t('director')} :</Text>
                  <Text>{responsibleName || 'Non assigné'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">{t('belonging')} :</Text>
                  <Text>{isAlAzharLand ? t('alAzhar') : t('notAlAzhar')}</Text>
                </HStack>
                {note && (
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{t('note')} :</Text>
                    <Text>{note}</Text>
                  </VStack>
                )}
              </VStack>
            </SimpleGrid>
            <HStack justifyContent="flex-end" mt={5}>
              {/* // go to the school s classes */}
              <Button
                onClick={() =>
                  router.push(
                    all.replace('%id', data.id)
                  )
                }
                colorScheme="orange"
                variant="outline"
              >
                {t('classes')}
              </Button>


              <Button
                onClick={() =>
                  router.push(edit.replace('%id', data.id))
                }
                colorScheme="orange"
                variant="outline"
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

export const SchoolDataSet = ({
  role,
  data = [],
  columns,
  selectedIndex = 0,
  token,
}) => {
  const t = useTranslations('components.dataset.schools');
  const [filterText, setFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState(null); // To track the currently expanded row


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
              router.push(routes.page_route.dashboard.direction.schools.create)
            }
            colorScheme={'orange'}
            bgColor={colors.primary.regular}
            px={10}
          >
            {t('addSchool')}
          </Button>
        )}
      </HStack>
    );
  }, [filterText, selectedIndex, t, role, router, filtered]);


  const handleRowExpandToggle = (row) => {
    // If the row is already expanded, collapse it. Otherwise, expand it.
    setExpandedRow((prev) => (prev?.id === row.id ? null : row));
  };
  return (
    <DataTable
      style={{ width: '100%', backgroundColor: colors.white, borderRadius: 10 }}
      columns={columns}
      data={filtered}
      defaultCanSort
      initialState={{ sortBy: [{ id: 'name', desc: true }] }}
      subHeader
      subHeaderAlign="center"
      expandOnRowClicked
      expandableRowsHideExpander

      highlightOnHover
      subHeaderComponent={subHeaderComponentMemo}
      expandableRows
      expandableRowExpanded={(row) => row.id === expandedRow?.id} // Expand only the selected row
      onRowClicked={handleRowExpandToggle} // Handle row click to expand/collapse


      expandableRowsComponent={(data) =>
        ExpandedComponent({ ...data, role, user_token: token })
      }

      pagination
    />
  );
};
