import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';

const SchoolYearContext = createContext();

export const SchoolYearProvider = ({ children }) => {
    const [schoolYear, setSchoolYear] = useState(null);

    useEffect(() => {
        const savedSchoolYear = Cookies.get('selectedSchoolYear');
        if (savedSchoolYear) {
            setSchoolYear(savedSchoolYear);
        }
    }, []);


    return (
        <SchoolYearContext.Provider value={{ schoolYear, setSchoolYear }}>
            {children}
        </SchoolYearContext.Provider>
    );
};

export const useSchoolYear = () => useContext(SchoolYearContext);