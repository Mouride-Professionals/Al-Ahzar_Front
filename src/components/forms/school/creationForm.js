import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { schoolCreationFormHandler, schoolUpdateFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import {
  mapCommuneByDepartment,
  mapDepartmentByRegion,
  mapIEFByIA,
} from '@utils/mappers/school';
import { schoolCreationSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const CreateSchoolForm = ({
  schools,
  token,
  setHasSucceeded,
  isEdit = false,
  initialValues = null,
}) => {
  const t = useTranslations('components');
  const router = useRouter();

  const { id: schoolId = null, attributes: schoolAttributes = {} } =
    initialValues || {};

  const [schoolData, setSchoolData] = useState(schoolAttributes || {});
  const [departments, setDepartments] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [IAs, setIAs] = useState([]);
  const [IEFs, setIEFs] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);

  const [parentSchoolOptions, setParentSchoolOptions] = useState(schools.data);
  const [filteredParentSchools, setFilteredParentSchools] = useState([]);
  const [selectedType, setSelectedType] = useState(schoolData?.type || '');

  // Handle region and department changes
  const handleRegionChange = (selectedRegion) => {
    const departmentOptions = mapDepartmentByRegion({ region: selectedRegion });
    setDepartments(departmentOptions);
    setCommunes([]);
  };

  const handleDepartmentChange = (selectedDepartment) => {
    const communeOptions = mapCommuneByDepartment({
      department: selectedDepartment,
    });
    setCommunes(communeOptions);
  };

  const handleIAChange = (selectedIA) => {
    const IEFOptions = mapIEFByIA({ IA: selectedIA });
    setIEFs(IEFOptions);
  };

  useEffect(() => {
    if (selectedType === 'Annexe') {
      setFilteredParentSchools(
        parentSchoolOptions
          .filter(
            (school) =>
              school.attributes.type === 'Centre' ||
              school.attributes.type === 'Centre Secondaire'
          )
          .map((school) => ({
            value: school.id,
            name: school.attributes.name,
          }))
      );
    } else if (selectedType === 'Centre Secondaire') {
      setFilteredParentSchools(
        parentSchoolOptions
          .filter((school) => school.attributes.type === 'Centre')
          .map((school) => ({
            value: school.id,
            name: school.attributes.name,
          }))
      );
    } else {
      setFilteredParentSchools([]);
    }
  }, [selectedType, parentSchoolOptions]);

  // Extract inputs and messages from theme configuration
  const {
    inputs: {
      school: {
        creation: {
          name,
          creationDate,
          type,
          parentSchool,
          region,
          department,
          commune,
          address,
          city,
          email,
          postBox,
          phone,
          phoneFix,
          IA,
          IEF,
          isAlAzharLand,
          responsibleName,
          note,
        },
      },
    },
  } = forms;

  // Responsive direction for HStack/Stack

  return (
    <Formik
      validationSchema={schoolCreationSchema}
      initialValues={
        isEdit ? schoolData : mapFormInitialValues(schoolCreationSchema._nodes)
      }
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        isEdit
          ? schoolUpdateFormHandler({
              school: schoolId,
              token,
              bannerFile,
              data: values,
              setSubmitting,
              setFieldError,
              hasSucceeded: setHasSucceeded,
            })
          : schoolCreationFormHandler({
              token,
              data: values,
              bannerFile,
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
        <Stack
          px={{ base: 2, md: 10 }}
          py={{ base: 2, md: 10 }}
          spacing={{ base: 6, md: 10 }}
        >
          {/* General Info */}
          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t('forms.messages.school.creation.info.generalInfoMessage')}
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <WrapItem w="100%">
                <FormInput
                  {...name}
                  label={t(name.label)}
                  placeholder={t(name.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.name}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...creationDate}
                  label={t(creationDate.label)}
                  placeholder={t(creationDate.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.creationDate}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...responsibleName}
                  label={t(responsibleName.label)}
                  placeholder={t(responsibleName.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.responsibleName}
                />
              </WrapItem>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <WrapItem w="100%">
                <FormInput
                  {...type}
                  label={t(type.label)}
                  placeholder={t(type.placeholder)}
                  errors={errors}
                  handleChange={(e) => {
                    setSelectedType(e.target.value);
                    handleChange(e);
                  }}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.type}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  select
                  options={filteredParentSchools}
                  {...parentSchool}
                  label={t(parentSchool.label)}
                  placeholder={t(parentSchool.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  isDisabled={!values.type || values.type === 'Centre'}
                  touched={touched}
                  value={values.parentSchool}
                />
              </WrapItem>
            </Stack>
          </Stack>
          {/* Address Info */}
          <Stack pt={6}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t('forms.messages.school.creation.info.addressInfoMessage')}
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <WrapItem w="100%">
                <FormInput
                  {...region}
                  label={t(region.label)}
                  placeholder={t(region.placeholder)}
                  errors={errors}
                  handleChange={(e) => {
                    handleRegionChange(e.target.value);
                    handleChange(e);
                  }}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.region}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  select
                  options={departments}
                  {...department}
                  label={t(department.label)}
                  placeholder={t(department.placeholder)}
                  errors={errors}
                  handleChange={(e) => {
                    handleDepartmentChange(e.target.value);
                    handleChange(e);
                  }}
                  handleBlur={handleBlur}
                  touched={touched}
                  isDisabled={!values.region}
                  value={values.department}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  select
                  options={communes}
                  {...commune}
                  label={t(commune.label)}
                  placeholder={t(commune.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  isDisabled={!values.department}
                  value={values.commune}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...city}
                  label={t(city.label)}
                  placeholder={t(city.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.city}
                />
              </WrapItem>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={4}>
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
                  {...IA}
                  label={t(IA.label)}
                  placeholder={t(IA.placeholder)}
                  errors={errors}
                  handleChange={(e) => {
                    handleChange(e);
                    handleIAChange(e.target.value);
                  }}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.IA}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  select
                  options={IEFs}
                  {...IEF}
                  label={t(IEF.label)}
                  placeholder={t(IEF.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  isDisabled={!values.IA}
                  touched={touched}
                  value={values.IEF}
                />
              </WrapItem>
            </Stack>
          </Stack>
          {/* Contact Info */}
          <Stack pt={6}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t('forms.messages.school.creation.info.contactInfoMessage')}
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <WrapItem w="100%">
                <FormInput
                  {...phoneFix}
                  label={t(phoneFix.label)}
                  placeholder={t(phoneFix.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.phoneFix}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...phone}
                  label={t(phone.label)}
                  placeholder={t(phone.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.phone}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
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
                  {...postBox}
                  label={t(postBox.label)}
                  placeholder={t(postBox.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.postBox}
                />
              </WrapItem>
            </Stack>
          </Stack>
          {/* Additional Info */}
          <Stack pt={6}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t('forms.messages.school.creation.info.additionalInfoMessage')}
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <WrapItem w="100%">
                <FormInput
                  {...isAlAzharLand}
                  label={t(isAlAzharLand.label)}
                  placeholder={t(isAlAzharLand.placeholder)}
                  options={isAlAzharLand.options.map((option) => ({
                    value: option.value,
                    name: t(option.name),
                  }))}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.isAlAzharLand}
                />
              </WrapItem>
              <WrapItem w="100%">
                <FormInput
                  {...note}
                  label={t(note.label)}
                  placeholder={t(note.placeholder)}
                  textarea
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.note}
                />
              </WrapItem>
            </Stack>
          </Stack>
          {/* Actions */}
          <HStack
            alignItems={'flex-start'}
            justifyContent={'flex-end'}
            pt={10}
            spacing={4}
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box w={{ base: '100%', md: '15%' }} mr={{ md: 5 }}>
              <SecondaryButton
                h={50}
                message={t('forms.actions.school.cancel')}
                onClick={() => router.back()}
                w="100%"
              />
            </Box>
            <Box w={{ base: '100%', md: '20%' }}>
              <FormSubmit
                uid={'schoolCreation'}
                submit_message={t('forms.actions.school.create')}
                {...{
                  touched,
                  errors,
                  handleSubmit,
                  isSubmitting,
                }}
                w="100%"
              />
            </Box>
          </HStack>
        </Stack>
      )}
    </Formik>
  );
};
