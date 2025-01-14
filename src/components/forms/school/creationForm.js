import {
  Box,
  HStack,
  Stack,
  Text,
  WrapItem,
} from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { schoolCreationFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { mapCommuneByDepartment, mapDepartmentByRegion } from '@utils/mappers/school';
import { schoolCreationSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const CreateSchoolForm = ({ token, setHasSucceeded }) => {
  const router = useRouter();

  // const [region, setRegion] = useState('');
  // const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [communes, setCommunes] = useState([]);

  const handleRegionChange = (selectedRegion) => {
    // setRegion(selectedRegion);
    const departmentOptions = mapDepartmentByRegion({ region: selectedRegion });
    setDepartments(departmentOptions);
    // setDepartment('');
    setCommunes([]);
  };

  const handleDepartmentChange = (selectedDepartment) => {
    // setDepartment(selectedDepartment);
    const communeOptions = mapCommuneByDepartment({
      department: selectedDepartment,
    });
    setCommunes(communeOptions);
  };
  const {
    inputs: {
      school: {
        creation: {
          name,
          creationDate,
          type,
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
          info: { generalInfoMessage, addressInfoMessage, contactInfoMessage, additionalInfoMessage },
        },
      }
    },
  } = forms;

  return (
    <Formik
      validationSchema={schoolCreationSchema}
      initialValues={mapFormInitialValues(schoolCreationSchema._nodes)}
      onSubmit={(values, { setSubmitting, setFieldError }) => {

        schoolCreationFormHandler({
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

              <WrapItem w={370}>
                <FormInput
                  {...type}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.type}
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
                  handleChange={
                    (e) => {
                      handleRegionChange(e.target.value);
                      handleChange(e);
                    }
                  }
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
                  handleChange={
                    (e) => {
                      handleDepartmentChange(e.target.value);
                      handleChange(e);
                    }
                  }
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
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.IA}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...IEF}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
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
              <WrapItem w={'100%'} >
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
