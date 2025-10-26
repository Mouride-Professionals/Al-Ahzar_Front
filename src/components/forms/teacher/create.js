import { Box, FormControl, FormErrorMessage, FormLabel, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { teacherRecruitmentFormHandler, teacherUpdateFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { teacherRecruitmentSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('components');
  const direction = router.locale === 'ar' ? 'rtl' : 'ltr';

  const { id, attributes: teacherData } = initialData;
  const schoolOptions = (schools?.data || []).map((school) => ({
    name: school.attributes.name,
    value: school.id,
  }));
  const [selectedContractType, setSelectedContractType] = useState(teacherData?.contractType || '');

  const initialValues = mapFormInitialValues(teacherRecruitmentSchema._nodes, teacherData);
  if (isEdit && teacherData?.school?.data?.id) {
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

  // Map options with translated labels
  const translatedProfessionalDegreesOptions = professionalDegrees.options.map((opt) => ({
    label: t(opt.label),
    value: opt.value,
  }));
  const translatedDisciplinesOptions = disciplines.options.map((opt) => ({
    label: t(opt.label),
    value: opt.value,
  }));
  const translatedSubjectsOptions = subjects.options.map((opt) => ({
    label: t(opt.label),
    value: opt.value,
  }));

  // Responsive contract type logic
  const contractTypeOptions = contractType.options.map((opt) => ({
    name: t(opt.name),
    value: opt.value,
  }));

  const isPermanent = selectedContractType === contractTypeOptions[0].value;
  const isTemporary = selectedContractType === contractTypeOptions[1].value;
  const isForeign = selectedContractType === contractTypeOptions[2].value;
  const isStateEmployee = selectedContractType === contractTypeOptions[3].value;

  const customStyles = {
    container: (base) => ({
      ...base,
      width: '100%',
      direction,
    }),
    control: (base, state) => ({
      ...base,
      borderColor: colors.gray.regular,
      backgroundColor: colors.white,
      height: 50,
      width: '100%',
      boxShadow: state.isFocused ? `0 0 0 1px ${colors.secondary.regular} ` : 'none',
      '&:hover': {
        borderColor: colors.gray.dark,
      },
      direction,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'blue.100',
      color: 'blue.700',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: direction === 'rtl' ? '0 12px 0 8px' : '0 8px 0 12px',
    }),
    placeholder: (base) => ({
      ...base,
      color: colors.gray.dark,
    }),
    input: (base) => ({
      ...base,
      fontSize: '14px',
      textAlign: direction === 'rtl' ? 'right' : 'left',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      textAlign: direction === 'rtl' ? 'right' : 'left',
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
        <Stack px={{ base: 2, md: 10 }} py={{ base: 2, md: 10 }} spacing={{ base: 6, md: 10 }} dir={direction}>
          {/* Personal Information Section */}
          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t(personalInfoMessage)}
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <WrapItem w="100%">
                <FormInput
                  {...firstname}
                  label={t(firstname.label)}
                  placeholder={t(firstname.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.firstname}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...lastname}
                  label={t(lastname.label)}
                  placeholder={t(lastname.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.lastname}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...gender}
                  label={t(gender.label)}
                  placeholder={t(gender.placeholder)}
                  options={gender.options.map((opt) => ({
                    name: t(opt.name),
                    value: opt.value,
                  }))}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.gender}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...maritalStatus}
                  label={t(maritalStatus.label)}
                  placeholder={t(maritalStatus.placeholder)}
                  options={maritalStatus.options.map((opt) => ({
                    name: t(opt.name),
                    value: opt.value,
                  }))}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.maritalStatus}
                />
              </WrapItem>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={5}>
              <WrapItem w="100%">
                <FormInput
                  {...language}
                  label={t(language.label)}
                  placeholder={t(language.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.language}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...birthDate}
                  label={t(birthDate.label)}
                  placeholder={t(birthDate.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.birthDate}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...birthPlace}
                  label={t(birthPlace.label)}
                  placeholder={t(birthPlace.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.birthPlace}
                />
              </WrapItem>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={5}>
              <WrapItem w="100%">
                <FormInput
                  {...address}
                  label={t(address.label)}
                  placeholder={t(address.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.address}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  grow={2}
                  {...email}
                  label={t(email.label)}
                  placeholder={t(email.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.email}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...phoneNumber}
                  label={t(phoneNumber.label)}
                  placeholder={t(phoneNumber.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.phoneNumber}
                />
              </WrapItem>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={5}>
              <WrapItem w="100%">
                <FormInput
                  {...academicDegree}
                  label={t(academicDegree.label)}
                  placeholder={t(academicDegree.placeholder)}
                  options={academicDegree.options.map((opt) => ({
                    name: t(opt.label),
                    value: opt.value,
                  }))}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.academicDegree}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormControl py={2} isInvalid={errors[professionalDegrees.uid] && touched[professionalDegrees.uid]}>
                  <FormLabel fontWeight={'bold'}>{t(professionalDegrees.label)}</FormLabel>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    isSearchable
                    options={translatedProfessionalDegreesOptions}
                    onChange={(selectedOptions) => {
                      handleChange({
                        target: {
                          name: professionalDegrees.uid,
                          value: selectedOptions ? selectedOptions.map((option) => option.value) : [],
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={values.professionalDegrees
                      ?.map((degree) =>
                        translatedProfessionalDegreesOptions.find((option) => option.value === degree)
                      )
                      ?.filter(Boolean) || []}
                    placeholder={t(professionalDegrees.placeholder)}
                    styles={customStyles}
                  />
                  {errors[professionalDegrees.uid] && touched[professionalDegrees.uid] && (
                    <FormErrorMessage>{t(`messages.teacher.recruitment.errors.${errors[professionalDegrees.uid]}`) || errors[professionalDegrees.uid]}</FormErrorMessage>
                  )}
                </FormControl>
              </WrapItem>
            </Stack>
          </Stack>

          {/* Contact Information Section */}
          <Stack py={5}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t(contactInfoMessage)}
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <WrapItem w="100%">
                <FormInput
                  select={true}
                  options={schoolOptions}
                  {...school}
                  label={t(school.label)}
                  placeholder={t(school.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.school}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormControl py={2} isInvalid={errors[disciplines.uid] && touched[disciplines.uid]}>
                  <FormLabel fontWeight={'bold'}>{t(disciplines.label)}</FormLabel>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    isSearchable
                    options={translatedDisciplinesOptions}
                    onChange={(selectedOptions) => {
                      handleChange({
                        target: {
                          name: disciplines.uid,
                          value: selectedOptions ? selectedOptions.map((option) => option.value) : [],
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={values.disciplines
                      ?.map((degree) => translatedDisciplinesOptions.find((option) => option.value === degree))
                      ?.filter(Boolean) || []}
                    placeholder={t(disciplines.placeholder)}
                    styles={customStyles}
                  />
                  {errors[disciplines.uid] && touched[disciplines.uid] && (
                    <FormErrorMessage>{t(`messages.teacher.recruitment.errors.${errors[disciplines.uid]}`) || errors[disciplines.uid]}</FormErrorMessage>
                  )}
                </FormControl>
              </WrapItem>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={5}>
              <WrapItem w="100%">
                <FormInput
                  {...level}
                  label={t(level.label)}
                  placeholder={t(level.placeholder)}
                  options={level.options.map((opt) => ({
                    name: t(opt.name),
                    value: opt.value,
                  }))}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.level}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormControl py={2} isInvalid={errors[subjects.uid] && touched[subjects.uid]}>
                  <FormLabel fontWeight={'bold'}>{t(subjects.label)}</FormLabel>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    isSearchable
                    options={translatedSubjectsOptions}
                    onChange={(selectedOptions) => {
                      handleChange({
                        target: {
                          name: subjects.uid,
                          value: selectedOptions ? selectedOptions.map((option) => option.value) : [],
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    value={values.subjects
                      ?.map((degree) => translatedSubjectsOptions.find((option) => option.value === degree))
                      ?.filter(Boolean) || []}
                    placeholder={t(subjects.placeholder)}
                    styles={customStyles}
                  />
                  {errors[subjects.uid] && touched[subjects.uid] && (
                    <FormErrorMessage>{t(`messages.teacher.recruitment.errors.${errors[subjects.uid]}`) || errors[subjects.uid]}</FormErrorMessage>
                  )}
                </FormControl>
              </WrapItem>
            </Stack>
          </Stack>

          {/* Contract Information Section */}
          <Stack py={5}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t(contractInfoMessage)}
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <WrapItem w="100%">
                <FormInput
                  {...contractType}
                  label={t(contractType.label)}
                  placeholder={t(contractType.placeholder)}
                  options={contractTypeOptions}
                  errors={errors}
                  handleChange={(e) => {
                    setSelectedContractType(e.target.value);
                    handleChange(e);
                  }}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.contractType}
                />
              </WrapItem>
              {isPermanent && (
                <WrapItem w="100%">
                  <FormInput
                    defaultValue={0}
                    {...salary}
                    label={t(salary.label)}
                    placeholder={t(salary.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.salary}
                  />
                </WrapItem>
              )}
              {isStateEmployee && (
                <>
                  <WrapItem w="100%">
                    <FormInput
                      {...registrationNumber}
                      label={t(registrationNumber.label)}
                      placeholder={t(registrationNumber.placeholder)}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      touched={touched}
                      value={values.registrationNumber}
                    />
                  </WrapItem>
                  <WrapItem w="100%">
                    <FormInput
                      {...generation}
                      label={t(generation.label)}
                      placeholder={t(generation.placeholder)}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      touched={touched}
                      value={values.generation}
                    />
                  </WrapItem>
                </>
              )}
            </Stack>
            {isTemporary && (
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={5}>
                <WrapItem w="100%">
                  <FormInput
                    defaultValue={0}
                    {...hoursNumber}
                    label={t(hoursNumber.label)}
                    placeholder={t(hoursNumber.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.hoursNumber}
                  />
                </WrapItem>
                <WrapItem w="100%">
                  <FormInput
                    defaultValue={0}
                    {...salaryPerHour}
                    label={t(salaryPerHour.label)}
                    placeholder={t(salaryPerHour.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.salaryPerHour}
                  />
                </WrapItem>
                <WrapItem w="100%">
                  <FormInput
                    {...additionalResponsibilities}
                    label={t(additionalResponsibilities.label)}
                    placeholder={t(additionalResponsibilities.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.additionalResponsibilities}
                  />
                </WrapItem>
              </Stack>
            )}
            {isForeign && (
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={5}>
                <WrapItem w="100%">
                  <FormInput
                    {...arrivalDate}
                    label={t(arrivalDate.label)}
                    placeholder={t(arrivalDate.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.arrivalDate}
                  />
                </WrapItem>
                <WrapItem w="100%">
                  <FormInput
                    {...countryFrom}
                    label={t(countryFrom.label)}
                    placeholder={t(countryFrom.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.countryFrom}
                  />
                </WrapItem>
                <WrapItem w="100%">
                  <FormInput
                    {...previousInstitutes}
                    label={t(previousInstitutes.label)}
                    placeholder={t(previousInstitutes.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.previousInstitutes}
                  />
                </WrapItem>
              </Stack>
            )}
          </Stack>

          {/* Actions */}
          <Stack
            alignItems={{ base: 'stretch', md: 'flex-end' }}
            justifyContent="flex-end"
            pt={10}
            spacing={4}
            direction={{ base: 'column', md: 'row' }}
          >
            <Box w={{ base: '100%', md: '15%' }} mr={{ md: 5 }}>
              <SecondaryButton
                h={50}
                message={t('forms.actions.teacher.cancel')}
                onClick={() => router.back()}
                w="100%"
              />
            </Box>
            <Box w={{ base: '100%', md: '20%' }}>
              <FormSubmit
                uid={'recruitment'}
                submit_message={t('forms.actions.teacher.create')}
                {...{ touched, errors, handleSubmit, isSubmitting }}
                w="100%"
              />
            </Box>
          </Stack>
        </Stack>
      )}
    </Formik>
  );
};
