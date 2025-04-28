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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const CreateSchoolForm = ({
  schools,
  token,
  setHasSucceeded,
  isEdit = false,
  initialValues = null, // Initial values for editing
}) => {
  const router = useRouter();


  const { id: schoolId = null, attributes: schoolAttributes = {} } =
    initialValues || {};

  const [schoolData, setSchoolData] = useState(schoolAttributes || {});
  const [departments, setDepartments] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [IAs, setIAs] = useState([]);
  const [IEFs, setIEFs] = useState([]);
  const [bannerFile, setBannerFile] = useState(null); // Store the selected file


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

  //handle IA change
  const handleIAChange = (selectedIA) => {
    const IEFOptions = mapIEFByIA({ IA: selectedIA });
    setIEFs(IEFOptions);
  }


  // Update filtered options based on selected type
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
          banner,
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
    messages: {
      school: {
        creation: {
          info: {
            generalInfoMessage,
            addressInfoMessage,
            contactInfoMessage,
            additionalInfoMessage,
          },
        },
      },
    },
  } = forms;

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
        <Stack px={10} py={10}>
          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {generalInfoMessage}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...name}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.name}
                />
              </WrapItem>

              <WrapItem w={370}>
                <FormInput
                  // label={'Date de création'}
                  {...creationDate}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.creationDate}
                />
              </WrapItem>

              <WrapItem w={370}>
                <FormInput
                  {...responsibleName}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.responsibleName}
                />
              </WrapItem>
            </HStack>

            <HStack align={'center'} justifyContent={'space-between'}>
              {/* <WrapItem w={370}>
                <FormInput
                  {...banner}
                  type="file"
                  accept="image/*"
                  errors={errors}
                  handleChange={(e) => setBannerFile(e.target.files[0])} // Store file in state
                  handleBlur={handleBlur}
                  touched={touched}
                />
              </WrapItem> */}
              <WrapItem w={'50%'}>
                <FormInput
                  {...type}
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

              <WrapItem w={'50%'}>
                <FormInput
                  select
                  options={filteredParentSchools}
                  {...parentSchool}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  isDisabled={!values.type || values.type === 'Centre'}
                  touched={touched}
                  value={values.parentSchool}
                />
              </WrapItem>
            </HStack>
          </Stack>
          {/* address info */}
          <Stack pt={10}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {addressInfoMessage}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...region}
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

              <WrapItem w={370}>
                <FormInput
                  select
                  options={departments}
                  {...department}
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
              <WrapItem w={370}>
                <FormInput
                  select
                  options={communes}
                  {...commune}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  isDisabled={!values.department}
                  value={values.commune}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...city}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.city}
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
                  {...IA}
                  errors={errors}
                  handleChange={
                    (e) => {
                      handleChange(e);
                      handleIAChange(e.target.value);
                    }
                  }
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.IA}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  select
                  options={IEFs}
                  {...IEF}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  isDisabled={!values.IA}
                  touched={touched}
                  value={values.IEF}
                />
              </WrapItem>
            </HStack>
          </Stack>

          {/* contact info */}
          <Stack pt={10}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {contactInfoMessage}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...phoneFix}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.phoneFix}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...phone}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.phone}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
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
                  {...postBox}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.postBox}
                />
              </WrapItem>
            </HStack>
          </Stack>
          {/* additional info */}
          <Stack pt={10}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {additionalInfoMessage}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...isAlAzharLand}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.isAlAzharLand}
                />
              </WrapItem>
              <WrapItem w={'100%'}>
                <FormInput
                  {...note}
                  textarea
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.note}
                />
              </WrapItem>
            </HStack>
          </Stack>

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
                uid={'schoolCreation'}
                submit_message={'Créer une école'}
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
