import React from "react";
import { createDataStore } from "./DataStore";
import { useLocalStore } from "mobx-react";

const DataContext = React.createContext(null);

export const DataProvider = ({ children }) => {
    const dataStore = useLocalStore(createDataStore);
    return <DataContext.Provider value={dataStore}>{children}</DataContext.Provider>;
};

export const useDataStore = () => React.useContext(DataContext);
