import { Text, VStack } from '@chakra-ui/react';
import { colors, routes } from '@theme';
import { useSchoolYear } from '@utils/context/school_year_context';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { serverFetch } from 'src/lib/api';

export const SchoolYearSelector = ({ token }) => {
    const router = useRouter();
    const { schoolYear, setSchoolYear } = useSchoolYear();
    const [triggerRedirect, setTriggerRedirect] = useState(false);

    const [schoolYears, setSchoolYears] = useState([]);
    const [currentSchoolYear, setCurrentSchoolYear] = useState(Cookies.get('selectedSchoolYear') || null);
    const [loading, setLoading] = useState(false);
    const {
        alazhar: {
            get: {
                school_years: { all: allSchoolYears },
                me: meEndpoint,
            },
        },
    } = routes.api_route;
    // Fetch school years and current school year
    const fetchSchoolYears = async () => {
        setLoading(true);
        try {
            const response = await serverFetch({
                uri: allSchoolYears,
                user_token: token,
            })
            
            if (!response || response.data.length === 0) {
                setCurrentSchoolYear(null);
                setSchoolYear(null); // Update the school year in the context
                Cookies.remove('selectedSchoolYear'); // Remove the selected school year from cookies

                console.error('No school years found');
                return;
            }

            setSchoolYears(response.data);
            const current = schoolYears?.find((year) => year.attributes?.isCurrent);
            if (current) {
                setCurrentSchoolYear(current.id);
                setSchoolYear(current.id); // Update the school year in the context
                Cookies.set('selectedSchoolYear', current?.id); // Save the selected school year to cookies
            }
        } catch (error) {
            console.error('Error fetching school years:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const savedSchoolYear = Cookies.get('selectedSchoolYear');

        if (savedSchoolYear) {
            setCurrentSchoolYear(savedSchoolYear);
            setSchoolYear(savedSchoolYear);
        }
        if (schoolYears.length === 0 || !savedSchoolYear) {
            fetchSchoolYears();
        }
    }, [token]);
    const fetchUserRole = async () => {
        try {
            const response = await serverFetch({
                uri: meEndpoint,
                user_token: token,
            });

            const role = response.role;
            if (!role) {
                signOut({ redirect: false });
                router.push('/user/auth');
                return;
            }
            const {
                dashboard: {
                    direction: { initial: direction },
                    surveillant: { initial: surveillant },
                    cashier: { initial: cashier },
                },
            } = routes.page_route;


            let redirectPath = '/user/auth';
            switch (role.name) {
                case 'Caissier':
                    redirectPath = cashier;
                    break;
                case 'Secretaire General':
                case 'Directeur General':
                    redirectPath = direction;
                    break;
                case 'Surveillant general':
                    redirectPath = surveillant;
                    break;
                case 'Directeur etablissment':
                    redirectPath = cashier;
                    break;
                default:
                    redirectPath = '/user/auth';
            }

            router.push(redirectPath);
        } catch (error) {
            console.error('Error fetching user role:', error);
            signOut({ redirect: false });
            router.push('/user/auth');
        }
    }
    useEffect(() => {
        if (!triggerRedirect) return;

        if (!token) {
            signOut({ redirect: false });
            router.push('/user/auth');
            return;
        }



        fetchUserRole();
        setTriggerRedirect(false);
    }, [triggerRedirect, router, token]);

    const handleSchoolYearChange = (selectedYear) => {
        setSchoolYear(selectedYear);// Update the school year in the context
        setCurrentSchoolYear(selectedYear);
        Cookies.set('selectedSchoolYear', selectedYear); // Save the selected school year to cookies
        setTriggerRedirect(true);

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
                    .filter((year) => year.id == currentSchoolYear)
                    .map((year) => ({
                        value: year.id,

                        label: `${year.attributes.name}`,
                    }))}
                onChange={(e) => handleSchoolYearChange(e.value)}
                // isDisabled={loading}
                isLoading={loading}
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

