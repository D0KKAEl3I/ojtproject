import { createContext } from 'react';

const contextData = {
    userData: { userSn: 2, userType: null },
    workList: [],
    workReqList: [],
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
            // URL: "https://virtserver.swaggerhub.com/Hauly-014/DojeMockup/0.0.4"
            URL: "http://192.168.0.2:49160"
        }
    }
}

const GlobalContext = createContext(contextData);

export default GlobalContext;

