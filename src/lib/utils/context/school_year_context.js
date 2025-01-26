import { createContext, useContext, useState } from 'react';

const SchoolYearContext = createContext();

export const SchoolYearProvider = ({ children }) => {
    const [schoolYear, setSchoolYear] = useState(null);

    return (
        <SchoolYearContext.Provider value={{ schoolYear, setSchoolYear }}>
            {children}
        </SchoolYearContext.Provider>
    );
};

export const useSchoolYear = () => useContext(SchoolYearContext);