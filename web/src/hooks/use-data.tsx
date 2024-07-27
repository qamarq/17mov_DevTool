import React, {
    createContext,
    useContext,
    useState,
} from 'react';

type DataContext = {
    data: IncomingData | null;
    setData: React.Dispatch<React.SetStateAction<IncomingData | null>>;
    interiorData: InteriorData | null;
    setInteriorData: React.Dispatch<React.SetStateAction<InteriorData | null>>;
    timecyclesData: TimecyclesData[] | null;
    setTimecyclesData: React.Dispatch<React.SetStateAction<TimecyclesData[] | null>>;
};

const Context = createContext({} as DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [data, setData] = useState<IncomingData | null>(null);
    const [interiorData, setInteriorData] = useState<InteriorData | null>(null);
    const [timecyclesData, setTimecyclesData] = useState<TimecyclesData[] | null>(null);

    return (
        <Context.Provider
            value={{
                data,
                setData,
                interiorData,
                setInteriorData,
                timecyclesData,
                setTimecyclesData,
            }}>
            {children}
        </Context.Provider>
    );
};

export type UseData = () => DataContext;

// eslint-disable-next-line react-refresh/only-export-components
export const useData: UseData = () => {
    if (!Context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return useContext(Context);
};
