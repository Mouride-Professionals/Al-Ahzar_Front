import { Text, VStack } from '@chakra-ui/react';
import { colors, routes } from '@theme';
import { useSchoolYear } from '@utils/context/school_year_context';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetcher, serverFetch } from 'src/lib/api';

export const SchoolYearSelector = ({ token }) => {
    const router = useRouter();
    const { schoolYear, setSchoolYear } = useSchoolYear();

    const [schoolYears, setSchoolYears] = useState([]);
    const [currentSchoolYear, setCurrentSchoolYear] = useState(null);
    const [loading, setLoading] = useState(false);
    const {
        alazhar: {
            get: {
                school_years: { all: allSchoolYears },
            },
        },
    } = routes.api_route;
    // Fetch school years and current school year
    const fetchSchoolYears = async () => {
        try {
            const response = await serverFetch({
                uri: allSchoolYears,
                user_token: token,
            })
            setSchoolYears(response.data);
            const current = schoolYears?.find((year) => year.attributes?.isActive);
            setCurrentSchoolYear(current?.id);
            setSchoolYear(current?.id);// Update the school year in the context
        } catch (error) {
            console.error('Error fetching school years:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSchoolYears();
    }, [token]);

    const handleSchoolYearChange = async (selectedYear) => {
        setLoading(true);
        try {
            const response = await fetcher({
                uri: routes.api_route.alazhar.update.school_year.replace('%id', selectedYear),
                user_token: token,
                options: {
                    method: 'PUT',
                    body: {
                        data: {
                            isActive: true,
                        },
                    },
                },
            });

            setSchoolYear(response.data.id);// Update the school year in the context
            fetchSchoolYears();
            setCurrentSchoolYear(response.data.id);
        } catch (error) {
            console.error('Error updating school year:', error);
        } finally {
            router.reload();
            setLoading(false);
        }
    };

    return (
        <VStack w={'40%'} spacing={1} align="left">
            <Text fontWeight="hairline">Année scolaire</Text>
            <Select
                options={schoolYears.map((year) => ({
                    value: year.id,
                    label: `${year.attributes.name}`,
                }))}
                value={schoolYears
                    .filter((year) => year.attributes.isActive)
                    .map((year) => ({
                        value: year.id,
                        label: `${year.attributes.name}`,
                    }))}
                onChange={(e) => handleSchoolYearChange(e.value)}
                isDisabled={loading}
                // isLoading={loading}
                bgColor="white"
                classNamePrefix="react-select"
                styles={{
                    container: (base) => ({
                        ...base,
                        width: '100%',
                    }),
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: colors.white,
                        borderColor: state.isFocused ? colors.secondary.regular : colors.secondary.regular,
                        boxShadow: state.isFocused ? `0 0 0 1px ${colors.secondary.regular}` : 'none',
                        minHeight: '40px',
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

        </VStack>
    );
};

