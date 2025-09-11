import { Box, FormControl, FormErrorMessage, FormLabel, HStack, Stack, Text, VStack, WrapItem } from "@chakra-ui/react";
import { SecondaryButton } from "@components/common/button";
import { FormInput, FormSubmit } from "@components/common/input/FormInput";
import { studentEnrollmentFormHandler } from "@handlers"; // updated handler for enrollment
import { colors, forms } from "@theme";
import { enrollmentSchema } from "@utils/schemas"; // updated schema for enrollment
import { mapFormInitialValues } from "@utils/tools/mappers";
import { Formik } from "formik";
import Cookies from "js-cookie";
import Select from 'react-select';


export const EnrollmentForm = ({
  action,
  token,
  student,
  setHasSucceeded,
  classroomOptions,
  selectedClassroom,
  setSelectedClassroom,

}) => {
  const activeSchoolYear = Cookies.get('selectedSchoolYear');


  const {
    inputs: {
      student: {
        enrollment: { classroom, enrollmentType, socialCategory },
      },
    },
    messages: {
      enrollment: {
        info: { generalInfoMessage },
      },
    },
  } = forms;

  return (
    <Formik
      validationSchema={enrollmentSchema}
      initialValues={mapFormInitialValues(enrollmentSchema._nodes)}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        studentEnrollmentFormHandler({
          token,
          data: {
            ...values,
            schoolYearId: activeSchoolYear,
            studentId: student,

          },
          setSubmitting,
          setFieldError,
          hasSucceeded: action(setHasSucceeded),

        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Stack px={10} py={10}>
          <Stack>
            <Text color={colors.secondary.regular} fontWeight="700">
              {generalInfoMessage}
            </Text>
            <VStack align="center" justifyContent="space-between">

              <WrapItem w={370} >
                <FormControl py={2} isInvalid={errors['classroom']}>
                  <FormLabel fontWeight={'bold'}>{classroom.label}</FormLabel>
                  <Select
                    isSearchable
                    options={classroomOptions} // Options should be an array of { label, value } objects
                    onChange={(selectedOption) => {
                      setSelectedClassroom(selectedOption.value);
                      handleChange({
                        target: {
                          name: 'classroom', // Ensure this matches your Formik field name
                          value: selectedOption.value
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={selectedClassroom.value}
                    placeholder="Selectionner une classe"
                    className="react-select"
                    classNamePrefix="react-select"

                    styles={{
                      container: (base) => ({
                        ...base,
                        width: '100%',
                      }),
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: colors.white,
                        borderColor: errors[classroom.uid] && touched[classroom.uid] ? colors.red.regular : colors.gray.regular,
                        boxShadow: state.isFocused ? `0 0 0 1px ${colors.secondary.regular}` : 'none',
                        '&:hover': {
                          borderColor: errors[classroom.uid] && touched[classroom.uid] ? colors.red.regular : colors.gray.dark,
                        },
                        minHeight: '50px',
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: '0 12px',
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: colors.gray.dark,
                      }),
                      input: (base) => ({
                        ...base,
                        fontSize: '14px',
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 5,
                      }),
                    }}
                  />

                  {errors[classroom.uid] && touched[classroom.uid] && (
                    <FormErrorMessage>{errors[classroom.uid]}</FormErrorMessage>
                  )}
                </FormControl>
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...socialCategory}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.socialCategory}
                  placeholder="Choisissez la catégorie sociale"
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...enrollmentType}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.enrollmentType}
                  placeholder="Choisissez le type d'inscription"
                />
              </WrapItem>
            </VStack>

          </Stack>
          <HStack alignItems="flex-end" justifyContent="flex-end" pt={10}>
            <Box mr={5}>
              <SecondaryButton h={50} message="Annuler" onClick={() => action(false)} />
            </Box>
            <Box>
              <FormSubmit
                uid="enrollmentCreation"
                submit_message="Créer l'inscription"
                {...{ touched, errors, handleSubmit, isSubmitting }}
              />
            </Box>
          </HStack>
        </Stack>
      )}
    </Formik>
  );
};