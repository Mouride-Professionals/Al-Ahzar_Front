import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';
import { setAxiosSchoolYear } from 'src/lib/api';

const SchoolYearContext = createContext();

export const SchoolYearProvider = ({ children }) => {
    const [schoolYear, setSchoolYear] = useState(null);

    useEffect(() => {
        setAxiosSchoolYear(schoolYear);
        Cookies.set('active_school_year', JSON.stringify(schoolYear)); // Store in cookies.
        sessionStorage.setItem('active_school_year', JSON.stringify(schoolYear));
        
    }, [schoolYear]);



    return (
        <SchoolYearContext.Provider value={{ schoolYear, setSchoolYear }}>
            {children}
        </SchoolYearContext.Provider>
    );
};

export const useSchoolYear = () => useContext(SchoolYearContext);