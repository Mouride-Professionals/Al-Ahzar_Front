// src/components/common/reports/school_data_set/index.js
'use client';

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
import { colors, images, routes } from '@theme';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BoxZone } from '../cards/boxZone';
import { DataTableLayout } from '@components/layout/data_table';

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
    ? images.logo.src
    : images.logo.src; // Replace with actual banner URL logic if available

  const t = useTranslations('components.dataset.schools');

  return (
    <ScaleFade px={{ base: 3, md: 5 }} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant="outline" w="100%" bg="white">
          <CardBody>
            <VStack spacing={4} align="start">
              <HStack spacing={3}>
                <Box h={50} w={60} pos="relative">
                  <Image
                    src={schoolBannerUrl}
                    alt={name}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 60px, 80px"
                  />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
                    {name}
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">
                    {type} - {region}, {department}
                  </Text>
                </VStack>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <HiOutlineLocationMarker color="blue" size={16} />
                    <Text fontSize={{ base: 'xs', md: 'sm' }}>
                      {address || t('addressUnavailable')}
                    </Text>
                  </HStack>
                  <HStack>
                    <AiOutlineMail color="blue" size={16} />
                    <Text fontSize={{ base: 'xs', md: 'sm' }}>
                      {email || t('emailUnavailable')}
                    </Text>
                  </HStack>
                  <HStack>
                    <AiOutlinePhone color="blue" size={16} />
                    <Text fontSize={{ base: 'xs', md: 'sm' }}>
                      {phone || t('phoneUnavailable')}
                    </Text>
                  </HStack>
                  {phoneFix && (
                    <HStack>
                      <AiOutlinePhone color="blue" size={16} />
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>{phoneFix}</Text>
                    </HStack>
                  )}
                  <HStack>
                    <BsFillCalendarDateFill color="blue" size={16} />
                    <Text fontSize={{ base: 'xs', md: 'sm' }}>
                      Créée le : {creationDate || t('dateUnknown')}
                    </Text>
                  </HStack>
                </VStack>
                <VStack align="start" spacing={2}>
                  {IA && (
                    <HStack>
                      <Text fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>IA :</Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>{IA}</Text>
                    </HStack>
                  )}
                  {IEF && (
                    <HStack>
                      <Text fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>IEF :</Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>{IEF}</Text>
                    </HStack>
                  )}
                  <HStack>
                    <Text fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>{t('director')} :</Text>
                    <Text fontSize={{ base: 'xs', md: 'sm' }}>{responsibleName || 'Non assigné'}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>{t('belonging')} :</Text>
                    <Text fontSize={{ base: 'xs', md: 'sm' }}>
                      {isAlAzharLand ? t('alAzhar') : t('notAlAzhar')}
                    </Text>
                  </HStack>
                  {note && (
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>{t('note')} :</Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>{note}</Text>
                    </VStack>
                  )}
                </VStack>
              </SimpleGrid>
              <HStack justifyContent="flex-end" spacing={2}>
                <Button
                  onClick={() => router.push(all.replace('%id', data.id))}
                  colorScheme="orange"
                  variant="outline"
                  size={{ base: 'sm', md: 'md' }}
                >
                  {t('classes')}
                </Button>
                <Button
                  onClick={() => router.push(edit.replace('%id', data.id))}
                  colorScheme="orange"
                  variant="outline"
                  size={{ base: 'sm', md: 'md' }}
                >
                  {t('edit')}
                </Button>
              </HStack>
            </VStack>
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
  const router = useRouter();

  const filterFunction = ({ data, needle }) =>
    data.filter(
      (item) =>
        item.name && item.name.toLowerCase().includes(needle.toLowerCase())
    );

  const actionButton = role?.name === 'Secretaire General' && (
    <Button
      onClick={() =>
        router.push(routes.page_route.dashboard.direction.schools.create)
      }
      colorScheme="orange"
      bgColor={colors.primary.regular}
     
    >
      {t('addSchool')}
    </Button>
  );

  return (
    <DataTableLayout
      columns={columns}
      data={data}
      role={role}
      token={token}
      translationNamespace="components.dataset.schools"
      actionButton={actionButton}
      expandedComponent={(data) =>
        ExpandedComponent({ ...data, role, user_token: token })
      }
      filterFunction={filterFunction}
      defaultSortFieldId="name"
      selectedIndex={selectedIndex}
    />
  );
};