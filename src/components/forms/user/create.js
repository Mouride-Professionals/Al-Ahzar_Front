import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { userCreationFormHandler } from '@handlers'; // create this handler similar to teacherRecruitmentFormHandler
import { colors, forms } from '@theme';
import { userCreationSchema } from '@utils/schemas'; // your user schema
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

export const CreateUserForm = ({ schools, roles, setHasSucceeded, token, initialData = {}, isEdit = false }) => {
    const router = useRouter();
    // const [roles, setRoles] = useState([]);

    // For edit mode, you might get initialData as a user object; otherwise, use an empty object.
    const initialValues = mapFormInitialValues(
        userCreationSchema._nodes,
        initialData
    );

    const {
        inputs: {
            user: {
                creation: {
                    username,
                    firstname,
                    lastname,
                    email,
                    password,
                    role,
                    school,
                },
            },
        },
        messages: {
            user: {
                creation: { info: { generalInfoMessage } },
            },
        },
    } = forms;
    const schoolOptions = schools.data.map((school) => ({
        name: school.attributes.name,
        value: school.id,
    }));


  
    return (
        <Formik
            validationSchema={userCreationSchema}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
                userCreationFormHandler({
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
                            {generalInfoMessage}
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
                                    {...username}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.username}
                                />
                            </WrapItem>
                        </HStack>
                        <HStack align={'center'} justifyContent={'space-between'} pt={5}>

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
                                    {...password}
                                    type="password"
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.password}
                                />
                            </WrapItem>
                            //role
                            <WrapItem w={370}>
                                <FormInput
                                    {...role}
                                    options={roles}

                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.role}
                                />
                            </WrapItem>




                        </HStack>
                        {/* Adding Role and School fields */}
                        <HStack align={'center'} justifyContent={'space-between'} pt={5}>
                            <WrapItem w={'100%'}>
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

                        </HStack>
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
                                uid={'userCreation'}
                                submit_message={'Valider la création'}
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