import React, {
    createContext,
    useContext,
    useState,
} from 'react';

type DataContext = {
    data: IncomingData | null;
    setIncomingData: (data: IncomingData) => void;
};

const Context = createContext({} as DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [data, setData] = useState<IncomingData | null>(null);

    const setIncomingData = (data: IncomingData) => {
        setData(data)
    }

    return (
        <Context.Provider
            value={{
                data,
                setIncomingData,
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
