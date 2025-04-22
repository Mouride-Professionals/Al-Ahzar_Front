import { Box, FormControl, FormErrorMessage, FormLabel, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import {
  teacherRecruitmentFormHandler,
  teacherUpdateFormHandler,
} from '@handlers';
import { colors, forms } from '@theme';
import { teacherRecruitmentSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Select from 'react-select';

export const CreateTeacherForm = ({
  schools,
  setHasSucceeded,
  token,
  initialData = {},
  isEdit = false,
}) => {
  const router = useRouter();

  const { id, attributes: teacherData } = initialData;
  const schoolOptions = schools.data.map((school) => ({
    name: school.attributes.name,
    value: school.id,
  }));
  const [selectedContractType, setSelectedContractType] = useState(
    teacherData?.contractType || '');
 
  const contractTypeOptions = [
    { name: 'Permanent', value: 'Disponible' },
    { name: 'Temporary', value: 'Temps Partiel' },
    { name: 'Foreign', value: 'Etranger' },
    { name: 'StateEmployee', value: 'Employé Etat' },
  ];
  const isPermanent = selectedContractType === contractTypeOptions[0].value;
  const isTemporary = selectedContractType === contractTypeOptions[1].value;
  const isForeign = selectedContractType === contractTypeOptions[2].value;
  const isStateEmployee = selectedContractType === contractTypeOptions[3].value;


  // Set default initial values based on the mode
  const initialValues = mapFormInitialValues(
    teacherRecruitmentSchema._nodes,
    teacherData
  );

  //initialize the school field with the school of the teacher
  if (isEdit) {
    initialValues.school = teacherData.school.data.id;
  }

  const {
    inputs: {
      teacher: {
        recruitment: {
          firstname,
          lastname,
          gender,
          phoneNumber,
          email,
          school,
          birthDate,
          birthPlace,
          address,
          maritalStatus,
          academicDegree,
          professionalDegrees,
          disciplines,
          language,
          subjects,
          contractType,
          level,
          salary,
          registrationNumber,
          generation,
          salaryPerHour,
          hoursNumber,
          additionalResponsibilities,
          countryFrom,
          arrivalDate,
          previousInstitutes,
        },
      },
    },
    messages: {
      teacher: {
        recruitment: {
          info: {
            personalInfoMessage,
            contactInfoMessage,
            additionalInfoMessage,
            contractInfoMessage,
          },
        },
      },
    },
  } = forms;
  const customStyles = {
    container: (base) => ({
      ...base,
      width: '100%',
    }),
    control: (base) => ({

      ...base,
      borderColor: colors.gray.regular,
      backgroundColor: colors.white,
      height: 50,
      with: '100%',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'blue.500',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'blue.100',
      color: 'blue.700',
    }),
  };
  return (
    <Formik
      validationSchema={teacherRecruitmentSchema}
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        isEdit
          ? teacherUpdateFormHandler({
            teacher: id,
            data: values,
            setSubmitting,
            setFieldError,
            token,
            hasSucceeded: setHasSucceeded,
          })
          : teacherRecruitmentFormHandler({
            token,
            data: values,
            setSubmitting,
            setFieldError,
            hasSucceeded: setHasSucceeded,
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
          {/* Personal Information Section */}
          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {personalInfoMessage}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...firstname}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.firstname}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...lastname}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.lastname}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...gender}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.gender}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...maritalStatus}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.maritalStatus}
                />
              </WrapItem>
            </HStack>
            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...language}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.language}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...birthDate}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.birthDate}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...birthPlace}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.birthPlace}
                />
              </WrapItem>
            </HStack>
            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...address}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.address}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  grow={2}
                  {...email}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.email}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...phoneNumber}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.phoneNumber}
                />
              </WrapItem>
            </HStack>
            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...academicDegree}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.academicDegree}
                />
              </WrapItem>


              <WrapItem w={'100%'} >
                <FormControl py={2} isInvalid={errors['professionalDegrees']}>
                  <FormLabel fontWeight={'bold'}>{professionalDegrees.label}</FormLabel>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}

                    isSearchable
                    options={professionalDegrees.options} // Options should be an array of { label, value } objects
                    onChange={(selectedOptions) => {
                      handleChange({
                        target: {
                          name: 'professionalDegrees', // Ensure this matches your Formik field name
                          value: selectedOptions ? selectedOptions.map((option) => option.value) : [], // Map selected options to their values
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={
                      Array.isArray(values.professionalDegrees)
                        ? values.professionalDegrees.map((degree) =>
                          professionalDegrees.options.find((option) => option.value === degree)
                        )
                        : [] // Fallback to empty array if not an array
                    } // Map current values to React-Select format
                    placeholder="Select professional degrees"
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
                        borderColor: errors[professionalDegrees.uid] && touched[professionalDegrees.uid] ? colors.red.regular : colors.gray.regular,
                        boxShadow: state.isFocused ? `0 0 0 1px ${colors.secondary.regular}` : 'none',
                        '&:hover': {
                          borderColor: errors[professionalDegrees.uid] && touched[professionalDegrees.uid] ? colors.red.regular : colors.gray.dark,
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

                  {errors[professionalDegrees.uid] && touched[professionalDegrees.uid] && (
                    <FormErrorMessage>{errors[professionalDegrees.uid]}</FormErrorMessage>
                  )}
                </FormControl>
              </WrapItem>

            </HStack>
          </Stack>

          {/* Contract Information Section */}
          <Stack py={5}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {contactInfoMessage}
            </Text>

            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  select={true}
                  options={schoolOptions}
                  {...school}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.school}
                />
              </WrapItem>

              <WrapItem w={'100%'} >
                <FormControl py={2} isInvalid={errors['disciplines']}>
                  <FormLabel fontWeight={'bold'}>{disciplines.label}</FormLabel>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    isSearchable
                    options={disciplines.options} // Options should be an array of { label, value } objects
                    onChange={(selectedOptions) => {
                      handleChange({
                        target: {
                          name: 'disciplines', // Ensure this matches your Formik field name
                          value: selectedOptions ? selectedOptions.map((option) => option.value) : [], // Map selected options to their values
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={
                      Array.isArray(values.disciplines)
                        ? values.disciplines.map((degree) =>
                          disciplines.options.find((option) => option.value === degree)
                        )
                        : [] // Fallback to empty array if not an array
                    } // Map current values to React-Select format
                    placeholder="Selectionner des disciplines"
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
                        borderColor: errors[disciplines.uid] && touched[disciplines.uid] ? colors.red.regular : colors.gray.regular,
                        boxShadow: state.isFocused ? `0 0 0 1px ${colors.secondary.regular}` : 'none',
                        '&:hover': {
                          borderColor: errors[disciplines.uid] && touched[disciplines.uid] ? colors.red.regular : colors.gray.dark,
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

                  {errors[disciplines.uid] && touched[disciplines.uid] && (
                    <FormErrorMessage>{errors[disciplines.uid]}</FormErrorMessage>
                  )}
                </FormControl>
              </WrapItem>
            </HStack>

            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...level}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.level}
                />
              </WrapItem>

              <WrapItem w={'100%'} >
                <FormControl py={2} isInvalid={errors['subjects']}>
                  <FormLabel fontWeight={'bold'}>{subjects.label}</FormLabel>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}

                    isSearchable
                    options={subjects.options} // Options should be an array of { label, value } objects
                    onChange={(selectedOptions) => {
                      handleChange({
                        target: {
                          name: 'subjects', // Ensure this matches your Formik field name
                          value: selectedOptions ? selectedOptions.map((option) => option.value) : [], // Map selected options to their values
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={
                      Array.isArray(values.subjects)
                        ? values.subjects.map((degree) =>
                          subjects.options.find((option) => option.value === degree)
                        )
                        : [] // Fallback to empty array if not an array
                    } // Map current values to React-Select format
                    placeholder="Sélectionner des matières enseignées"
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
                        borderColor: errors[subjects.uid] && touched[subjects.uid] ? colors.red.regular : colors.gray.regular,
                        boxShadow: state.isFocused ? `0 0 0 1px ${colors.secondary.regular}` : 'none',
                        '&:hover': {
                          borderColor: errors[subjects.uid] && touched[subjects.uid] ? colors.red.regular : colors.gray.dark,
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

                  {errors[subjects.uid] && touched[subjects.uid] && (
                    <FormErrorMessage>{errors[subjects.uid]}</FormErrorMessage>
                  )}
                </FormControl>
              </WrapItem>
            </HStack>
          </Stack>

          {/* additional information */}
          <Stack py={5}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {contractInfoMessage}
            </Text>

            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={'100%'}>
                <FormInput
                  {...contractType}
                  errors={errors}
                  handleChange={(e) => {
                    setSelectedContractType(e.target.value)
                    handleChange(e)
                  }}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.contractType}
                />
              </WrapItem>
              {isPermanent && <WrapItem w={370}>
                <FormInput
                  defaultValue={0}
                  {...salary}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.salary}
                />
              </WrapItem>}

              {isStateEmployee && <WrapItem w={370}>
                <FormInput
                  {...registrationNumber}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.registrationNumber}
                />
              </WrapItem>}
              {isStateEmployee && <WrapItem w={370}>
                <FormInput
                  {...generation}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.generation}
                />
              </WrapItem>}
            </HStack>
            {isTemporary && <HStack align={'center'} justifyContent={'space-between'} pt={5}>

              <WrapItem w={370}>
                <FormInput
                  defaultValue={0}
                  {...hoursNumber}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.hoursNumber}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  defaultValue={0}
                  {...salaryPerHour}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.salaryPerHour}
                />
              </WrapItem>
              <WrapItem w={'100%'}>
                <FormInput
                  {...additionalResponsibilities}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.additionalResponsibilities}
                />
              </WrapItem>
            </HStack>}

            {isForeign && <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...arrivalDate}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.arrivalDate}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...countryFrom}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.countryFrom}
                />
              </WrapItem>

              <WrapItem w={'100%'}>
                <FormInput
                  {...previousInstitutes}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.previousInstitutes}
                />
              </WrapItem>
            </HStack>}
          </Stack>

          {/* Actions */}
          <HStack alignItems={'flex-start'} justifyContent={'flex-end'} pt={10}>
            <Box w={'15%'} mr={5}>
              <SecondaryButton
                h={50}
                message={'Annuler'}
                onClick={() => router.back()}
              />
            </Box>
            <Box w={'20%'}>
              <FormSubmit
                uid={'recruitment'}
                submit_message={'Valider la demande'}
                {...{
                  touched,
                  errors,
                  handleSubmit,
                  isSubmitting,
                }}
              />
            </Box>
          </HStack>
        </Stack>
      )}
    </Formik>
  );
};
