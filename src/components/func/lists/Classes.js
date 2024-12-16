import { Box, Grid, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { PrimaryButton } from '@components/common/button';
import { ClassCard } from '@components/common/cards';
import { colors, messages } from '@theme';
import { ACCESS_CREATION } from '@utils/mappers/classes';
import { ACCESS_ROUTES } from '@utils/mappers/menu';
import { ClassTitle } from '@utils/tools/mappers';

const { create } = messages.components.classList;

export const ClassesList = ({
  groupName,
  classes,
  listOf,
  withCreation,
  role,
  action,
}) => {
  return (
    <Stack w={'100%'}>
      <HStack justifyContent={'space-between'} my={10} w={'100%'}>
        <Heading size={'md'}>{groupName}</Heading>

        {Object.values(classes).length &&
          withCreation &&
          ACCESS_CREATION.includes(role.name) && (
            <Box w={'20%'}>
              <PrimaryButton onClick={action} message={create} />
            </Box>
          )}
      </HStack>

      <Stack w={'100%'}>
        <Grid gridTemplateColumns={'repeat(2, 1fr)'} gap={14}>
          {classes[listOf]?.map((_class, index) => (
            <Box key={`class-${_class.name}-${index}`}>
              <Text
                colors={colors.secondary.regular}
                fontSize={20}
                fontWeight={'bold'}
              >
                {ClassTitle(_class.name)}
              </Text>
              <Grid mt={5} gap={3} gridTemplateColumns={'repeat(4, 1fr)'}>
                {_class.sections.map((section, index) => (
                  <ClassCard
                    goTo={ACCESS_ROUTES[role.name].class.detail.replace(
                      '%id',
                      _class.classId[index]
                    )}
                    {...(listOf == 'intermediate' && { theme: colors.purple })}
                    {...(listOf == 'upperIntermediate' && {
                      theme: colors.pink,
                    })}
                    students={_class.students[index]}
                    section={section}
                    level={ClassTitle(_class.name)}
                    key={`class-${section}-${_class.classId[index]}`}
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