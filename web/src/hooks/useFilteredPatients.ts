import { useState, useMemo } from "react";

import usePatients from "./usePatients";

const useFilteredPatients = () => {
    const { patients, isLoading, isError } = usePatients();
    const [filter, setFilter] = useState("");

    const pattern = useMemo(() => new RegExp(filter, "gi"), [filter]);
    const filteredPatients = useMemo(() => patients?.filter(p => p.name.match(pattern)), [patients, pattern])

    return {
        patients: filteredPatients,
        isLoading,
        isError,
        setFilter
    }
}

export default useFilteredPatients;
