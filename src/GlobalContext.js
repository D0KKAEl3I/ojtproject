import { createContext } from 'react';

const GlobalContext = createContext({
    userData: {},
    workList: [],
    workerList: [],
    alarmList: [],
    filter: {
        workState: null,
        workDueDate: null,
        workCompleteDate: null
    },
    status: 'WorkHome',
});

export default GlobalContext;
