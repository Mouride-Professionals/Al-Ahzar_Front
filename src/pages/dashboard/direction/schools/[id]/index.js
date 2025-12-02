import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { ClassCard, StatCard } from '@components/common/cards';
import { BackButton } from '@components/common/navigation/BackButton';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, images, routes } from '@theme';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';
import { formatPhoneNumber } from '@utils/mappers/formatters';
import { mapClassesByLevel } from '@utils/mappers/student';
import { ClassTitle } from '@utils/tools/mappers';
import { hasPermission } from '@utils/roles';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMemo } from 'react';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { FaSuitcase } from 'react-icons/fa';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const normalizeMediaUrl = (url) => {
  if (!url) return null;
  const base = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || '';
  const cleanBase = base.endsWith('/api') ? base.replace('/api', '') : base;
  return url.startsWith('http') ? url : `${cleanBase}${url}`;
};

const mapSchoolDetailForPage = (detail) => {
  const attrs = detail?.data?.attributes || {};
  return {
    id: detail?.data?.id ?? null,
    name: attrs.name || '',
    type: attrs.type || '',
    region: attrs.region || '',
    department: attrs.department || '',
    commune: attrs.commune || '',
    city: attrs.city || '',
    address: attrs.address || '',
    email: attrs.email || '',
    phone: attrs.phone || '',
    phoneFix: attrs.phoneFix || '',
    creationDate: attrs.creationDate || '',
    ia: attrs.IA || '',
    ief: attrs.IEF || '',
    responsibleName: attrs.responsibleName || '',
    isAlAzharLand: Boolean(attrs.isAlAzharLand),
    note: attrs.note || '',
    parentSchoolName: attrs.parentSchool?.data?.attributes?.name || '',
    postBox: attrs.postBox || '',
    bannerUrl:
      normalizeMediaUrl(attrs.banner?.data?.attributes?.url) || images.logo.src,
  };
};

const InfoTile = ({ icon, label, value }) => (
  <Stack
    bgColor={colors.white}
    borderRadius={12}
    p={4}
    spacing={2}
    boxShadow="sm"
    border={`1px solid ${colors.gray.highlight}`}
  >
    <HStack spacing={3} color={colors.secondary.regular}>
      <Box
        bgColor={colors.secondary.soft}
        borderRadius="full"
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
      <Text fontWeight="600" fontSize="sm" color={colors.gray.super}>
        {label}
      </Text>
    </HStack>
    <Text fontWeight="700" fontSize="md" color={colors.gray.sport}>
      {value || '—'}
    </Text>
  </Stack>
);

export default function SchoolDetail({
  school,
  stats,
  classes,
  role,
  token,
  schoolId,
}) {
  const t = useTranslations();
  const schoolT = useTranslations('components.dataset.schools');
  const componentsT = useTranslations('components');
  const router = useRouter();

  const classList = useMemo(() => {
    if (!classes) return [];
    return Object.values(classes).flatMap((group) =>
      group.flatMap((cls) =>
        cls.sections.map((section, idx) => ({
          id: cls.classId[idx],
          students: cls.students[idx] ?? 0,
          description: cls.descriptions?.[idx] || '',
          section,
          level: cls.name,
        }))
      )
    );
  }, [classes]);

  const levelCoverage = useMemo(() => {
    const uniqueLevels = Array.from(
      new Set(classList.map((c) => ClassTitle(c.level)))
    );
    return uniqueLevels.slice(0, 5).join(' | ');
  }, [classList]);

  const heroLocation = [school.region, school.department, school.commune]
    .filter(Boolean)
    .join(' | ');

  const statsCards = [
    {
      icon: <SiGoogleclassroom color={colors.primary.regular} size={22} />,
      title: t('pages.stats.classes'),
      count: t('pages.stats.amount.classes').replace(
        '%number',
        stats?.classes ?? 0
      ),
    },
    {
      icon: <LuSchool color={colors.primary.regular} size={22} />,
      title: t('pages.stats.students'),
      count: t('pages.stats.amount.students').replace(
        '%number',
        stats?.students ?? 0
      ),
    },
    {
      icon: <FaSuitcase color={colors.primary.regular} size={22} />,
      title: t('pages.stats.teachers'),
      count: t('pages.stats.amount.teachers').replace(
        '%number',
        stats?.teachers ?? 0
      ),
    },
  ];

  return (
    <DashboardLayout
      title={school.name || t('pages.dashboard.schools.title')}
      currentPage={t('components.menu.schools')}
      role={role}
      token={token}
    >
      <Stack spacing={8} pt={4}>
        <BackButton />
        <Box
          bgGradient="linear(to-r, rgba(51,74,52,0.12), rgba(253,97,1,0.12))"
          borderRadius={16}
          p={{ base: 5, md: 8 }}
          border={`1px solid ${colors.gray.highlight}`}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            right={-24}
            top={-24}
            w={240}
            h={240}
            bgColor={colors.primary.light}
            borderRadius="50%"
            filter="blur(50px)"
          />
          <HStack
            alignItems="flex-start"
            spacing={{ base: 6, lg: 10 }}
            position="relative"
            zIndex={1}
            flexDirection={{ base: 'column', lg: 'row' }}
          >
            <VStack align="start" spacing={3} flex={1}>
              <HStack spacing={3} flexWrap="wrap">
                <Badge
                  colorScheme="green"
                  borderRadius="full"
                  px={3}
                  py={1}
                  bgColor={colors.secondary.soft}
                  color={colors.secondary.regular}
                >
                  {school.type || schoolT('title')}
                </Badge>
                <Badge
                  borderRadius="full"
                  px={3}
                  py={1}
                  bgColor={colors.primary.light}
                  color={colors.primary.regular}
                >
                  {school.isAlAzharLand
                    ? schoolT('alAzhar')
                    : schoolT('notAlAzhar')}
                </Badge>
                {school.creationDate && (
                  <Badge
                    borderRadius="full"
                    px={3}
                    py={1}
                    bgColor={colors.gray.highlight}
                    color={colors.gray.super}
                  >
                    <HStack spacing={2}>
                      <BsFillCalendarDateFill size={14} />
                      <Text fontSize="sm">{school.creationDate}</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>

              <Text
                fontSize={{ base: 22, md: 28 }}
                fontWeight="800"
                color={colors.secondary.regular}
              >
                {school.name}
              </Text>

              <Text color={colors.gray.super} fontWeight="600">
                {heroLocation || school.address || schoolT('addressUnavailable')}
              </Text>

              <Wrap spacing={3}>
                {school.responsibleName && (
                  <WrapItem>
                    <Tag
                      size="md"
                      borderRadius="full"
                      colorScheme="orange"
                      variant="subtle"
                    >
                      <TagLabel>
                        {schoolT('director')} {school.responsibleName}
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                )}
                {school.parentSchoolName && (
                  <WrapItem>
                    <Tag
                      size="md"
                      borderRadius="full"
                      bgColor={colors.gray.highlight}
                      color={colors.gray.super}
                    >
                      <TagLabel>
                        {schoolT('columns.parent_school')}: {school.parentSchoolName}
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                )}
                {levelCoverage && (
                  <WrapItem>
                    <Tag
                      size="md"
                      borderRadius="full"
                      bgColor={colors.secondary.soft}
                      color={colors.secondary.regular}
                    >
                      <TagLabel>{levelCoverage}</TagLabel>
                    </Tag>
                  </WrapItem>
                )}
              </Wrap>

              <HStack spacing={3} pt={2} flexWrap="wrap">
                <Button
                  bgColor={colors.primary.regular}
                  color={colors.white}
                  _hover={{ opacity: 0.9 }}
                  onClick={() =>
                    router.push(
                      routes.page_route.dashboard.direction.schools.classes.all.replace(
                        '%id',
                        schoolId
                      )
                    )
                  }
                >
                  {schoolT('classes')}
                </Button>
                <Button
                  variant="outline"
                  colorScheme="orange"
                  onClick={() =>
                    router.push(
                      `${routes.page_route.dashboard.direction.teachers.all}?schoolId=${schoolId}`
                    )
                  }
                >
                  {t('components.menu.teachers')}
                </Button>
                {hasPermission(role.name, 'manageSchool') && (
                  <Button
                    variant="outline"
                    colorScheme="orange"
                    onClick={() =>
                      router.push(
                        routes.page_route.dashboard.direction.schools.edit.replace(
                          '%id',
                          schoolId
                        )
                      )
                    }
                  >
                    {schoolT('edit')}
                  </Button>
                )}
              </HStack>
            </VStack>

            <Box
              w={{ base: '100%', lg: 320 }}
              h={{ base: 180, lg: 220 }}
              borderRadius={16}
              overflow="hidden"
              position="relative"
              bgColor={colors.white}
              boxShadow="md"
            >
              <Image
                src={school.bannerUrl}
                alt={school.name || 'School banner'}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 320px"
                priority
              />
            </Box>
          </HStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {statsCards.map((card, idx) => (
            <StatCard key={`stat-${idx}`} {...card} />
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Stack spacing={3} bgColor={colors.white} p={5} borderRadius={12} boxShadow="sm">
              <HStack spacing={2}>
                <HiOutlineLocationMarker color={colors.primary.regular} size={20} />
                <Text fontWeight="700" color={colors.secondary.regular}>
                  {componentsT('forms.messages.school.creation.info.addressInfoMessage')}
                </Text>
              </HStack>
              <Divider />
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                <InfoTile
                  icon={<HiOutlineLocationMarker size={16} />}
                  label={schoolT('columns.address')}
                  value={school.address || schoolT('addressUnavailable')}
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={componentsT('forms.inputs.school.creation.city.label')}
                  value={school.city || t('components.dataset.schoolYears.columns.na')}
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={componentsT('forms.inputs.school.creation.region.label')}
                  value={school.region || '—'}
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={componentsT('forms.inputs.school.creation.department.label')}
                  value={school.department || '—'}
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={componentsT('forms.inputs.school.creation.commune.label')}
                  value={school.commune || '—'}
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={componentsT('forms.inputs.school.creation.postBox.label')}
                  value={school.postBox || '—'}
                />
              </SimpleGrid>
            </Stack>

            <Stack spacing={3} bgColor={colors.white} p={5} borderRadius={12} boxShadow="sm">
              <HStack spacing={2}>
                <AiOutlinePhone color={colors.primary.regular} size={20} />
                <Text fontWeight="700" color={colors.secondary.regular}>
                  {componentsT('forms.messages.school.creation.info.contactInfoMessage')}
                </Text>
              </HStack>
              <Divider />
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                <InfoTile
                icon={<AiOutlineMail size={16} />}
                label={t('components.dataset.schools.columns.email')}
                value={school.email || schoolT('emailUnavailable')}
              />
              <InfoTile
                icon={<AiOutlinePhone size={16} />}
                label={t('components.dataset.schools.columns.phone')}
                value={
                  school.phone
                    ? formatPhoneNumber(school.phone)
                    : schoolT('phoneUnavailable')
                }
              />
              <InfoTile
                icon={<AiOutlinePhone size={16} />}
                label={componentsT('forms.inputs.school.creation.phoneFix.label')}
                value={
                  school.phoneFix
                    ? formatPhoneNumber(school.phoneFix)
                    : schoolT('phoneUnavailable')
                }
              />
              <InfoTile
                icon={<AiOutlineMail size={16} />}
                label={componentsT('forms.inputs.school.creation.responsibleName.label')}
                value={school.responsibleName || '—'}
              />
            </SimpleGrid>
          </Stack>
        </SimpleGrid>

        <Stack spacing={3} bgColor={colors.white} p={5} borderRadius={12} boxShadow="sm">
          <HStack spacing={2}>
            <LuSchool color={colors.primary.regular} size={20} />
            <Text fontWeight="700" color={colors.secondary.regular}>
              {componentsT('forms.messages.school.creation.info.generalInfoMessage')}
            </Text>
          </HStack>
              <Divider />
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={t('components.dataset.schools.columns.type')}
                  value={school.type || '—'}
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={componentsT('forms.inputs.school.creation.IA.label')}
                  value={school.ia || '—'}
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={t('components.dataset.schools.columns.ief')}
              value={school.ief || '—'}
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={schoolT('belonging')}
                  value={
                    school.isAlAzharLand ? schoolT('alAzhar') : schoolT('notAlAzhar')
                  }
                />
                <InfoTile
                  icon={<LuSchool size={16} />}
                  label={t('components.dataset.schools.columns.parent_school')}
                  value={school.parentSchoolName || '—'}
                />
                {school.note && (
                  <InfoTile
                    icon={<LuSchool size={16} />}
                    label={schoolT('note')}
                    value={school.note}
                  />
                )}
          </SimpleGrid>
        </Stack>

        {!!classList.length && (
          <Stack
            spacing={3}
            bgColor={colors.white}
            p={5}
            borderRadius={12}
            boxShadow="sm"
          >
            <HStack justifyContent="space-between" alignItems="flex-end">
              <Stack spacing={1}>
                <HStack spacing={2}>
                  <SiGoogleclassroom color={colors.primary.regular} size={20} />
                  <Text fontWeight="700" color={colors.secondary.regular}>
                    {schoolT('classes')}
                  </Text>
                </HStack>
                <Text color={colors.gray.super} fontSize="sm">
                  {t('pages.stats.amount.classes').replace(
                    '%number',
                    stats?.classes ?? 0
                  )}
                  {levelCoverage ? ` | ${levelCoverage}` : ''}
                </Text>
              </Stack>
              <Button
                variant="outline"
                colorScheme="orange"
                onClick={() =>
                  router.push(
                    routes.page_route.dashboard.direction.schools.classes.all.replace(
                      '%id',
                      schoolId
                    )
                  )
                }
              >
                {schoolT('classes')}
              </Button>
            </HStack>
            <Divider />
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
              {classList.slice(0, 9).map((cls) => (
                <ClassCard
                  key={cls.id}
                  goTo={routes.page_route.dashboard.direction.schools.classes.detail
                    .replace('%id', schoolId)
                    .replace('%classId', cls.id)}
                  students={cls.students}
                  section={cls.section}
                  level={ClassTitle(cls.level)}
                  description={cls.description}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, res, query }) => {
  const { id } = query;

  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  if (!token) {
    return {
      redirect: {
        destination: 'user/auth',
        permanent: false,
      },
    };
  }

  const activeSchoolYear =
    (await ensureActiveSchoolYear({ req, res, token })) || '';

  const { role } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  const detail = await serverFetch({
    uri: `${routes.api_route.alazhar.get.schools.detail.replace('%id', id)}?populate=parentSchool,banner`,
    user_token: token,
  });

  if (!detail?.data) {
    return { notFound: true };
  }

  const classesRoute = activeSchoolYear
    ? `${routes.api_route.alazhar.get.classes.all
        .replace('%schoolId', id)
        .replace('%activeSchoolYear', activeSchoolYear)}&pagination[page]=1&pagination[pageSize]=100`
    : null;

  const classesResponse = classesRoute
    ? await serverFetch({
        uri: classesRoute,
        user_token: token,
      }).catch(() => ({ data: [] }))
    : { data: [] };

  const hasClasses = Array.isArray(classesResponse?.data);
  const classesMeta = classesResponse?.meta?.pagination;
  const classes = hasClasses ? classesResponse : { data: [] };
  const studentsTotal = hasClasses
    ? classesResponse.data.reduce(
        (acc, cls) => acc + (cls?.attributes?.enrollments?.data?.length || 0),
        0
      )
    : 0;

  const teachersResponse = await serverFetch({
    uri: `${routes.api_route.alazhar.get.teachers.all}?filters[school][id][$eq]=${id}&pagination[page]=1&pagination[pageSize]=1`,
    user_token: token,
  }).catch(() => null);

  const stats = {
    classes: classesMeta?.total ?? (hasClasses ? classesResponse.data.length : 0),
    students: studentsTotal,
    teachers:
      teachersResponse?.meta?.pagination?.total ??
      teachersResponse?.data?.length ??
      0,
  };

  return {
    props: {
      school: mapSchoolDetailForPage(detail),
      stats,
      classes: mapClassesByLevel({ classes }),
      role,
      token,
      schoolId: id,
    },
  };
};
