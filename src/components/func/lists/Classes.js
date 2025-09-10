import { Box, Grid, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { PrimaryButton } from '@components/common/button';
import { ClassCard } from '@components/common/cards';
import { colors, messages } from '@theme';
import { ACCESS_CREATION } from '@utils/mappers/classes';
import { ACCESS_ROUTES } from '@utils/mappers/menu';
import { ClassTitle } from '@utils/tools/mappers';
import { useTranslations } from 'next-intl';

const { create } = messages.components.classList;

export const ClassesList = ({
  groupName,
  schoolId = null,
  classes,
  listOf,
  withCreation,
  role,
  action,
}) => {
  const t = useTranslations();

  return (
    <Stack w="100%">
      <HStack
        justifyContent="space-between"
        my={{ base: 4, md: 10 }}
        w="100%"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'flex-start', md: 'center' }}
        spacing={{ base: 4, md: 0 }}
      >
        {/* Button first on mobile, second on desktop */}
        {Object.values(classes).length &&
          withCreation &&
          ACCESS_CREATION.includes(role.name) && (
            <Box
              w={{ base: '100%', md: '20%' }}
              order={{ base: 0, md: 1 }}
            >
              <PrimaryButton
                onClick={action}
                message={t('components.classList.create')}
                w="100%"
              />
            </Box>
          )}
        {/* Group name second on mobile, first on desktop */}
        <Heading
          size="md"
          order={{ base: 1, md: 0 }}
          w={{ base: '100%', md: 'auto' }}
          textAlign={{ base: 'left', md: 'inherit' }}
        >
          {groupName}
        </Heading>
      </HStack>

      <Stack w="100%">
        <Grid
          gridTemplateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
          gap={{ base: 6, md: 14 }}
        >
          {classes[listOf]?.map((_class, index) => (
            <Box key={`class-${_class.name}-${index}`}>
              <Text
                color={colors.secondary.regular}
                fontSize={{ base: 16, md: 20 }}
                fontWeight="bold"
                mb={2}
              >
                {ClassTitle(_class.name)}
              </Text>
              <Grid
                mt={5}
                gap={3}
                gridTemplateColumns={{
                  base: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                }}
              >
                {_class.sections.map((section, idx) => (
                  <ClassCard
                    goTo={
                      ACCESS_ROUTES.isAdmin(role.name)
                        ? ACCESS_ROUTES[role.name].schools.classes.detail
                          .replace('%id', schoolId)
                          .replace('%classId', _class.classId[idx])
                        : ACCESS_ROUTES[role.name].classes.detail.replace(
                          '%id',
                          _class.classId[idx]
                        )
                    }
                    {...(listOf === 'intermediate' && { theme: colors.purple })}
                    {...(listOf === 'upperIntermediate' && {
                      theme: colors.pink,
                    })}
                    students={_class.students[idx]}
                    section={section}
                    level={ClassTitle(_class.name)}
                    key={`class-${section}-${_class.classId[idx]}`}
                  />
                ))}
              </Grid>
            </Box>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};
