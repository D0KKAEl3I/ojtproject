import { createContext } from 'react';

const contextData = {
    userData: { userSn: null, userType: null },
    workList: [],
    workerList: [],
    alarmList: [],
    filter: {
        workState: null,
        workDueDate: null,
        workCompleteDate: null
    },
    status: 'WorkHome',
    config: {
        APISERVER: {
            URL: "https://virtserver.swaggerhub.com/Hauly-014/DojeMockup/0.0.3"
        }
    }
}

const GlobalContext = createContext(contextData);

export default GlobalContext;
