// 모듈
import React, { useContext, useState } from 'react';
import { View, Button } from 'react-native'

// 데이터
import GlobalContext from './src/GlobalContext';

// 앱
import RequesterApp from './src/RequesterApp';
import WorkerApp from './src/WorkerApp'

export default function App() {
	const [context, setContext] = useState(useContext(GlobalContext))
	// return context.userData.userType === "의뢰자" ? <RequesterApp />
	// 	: context.userData.userType === "작업자" ? <WorkerApp />
	// 		: <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
	// 			<Button title="의뢰자" onPress={() => setContext(context => ({ ...context, userData: { userSn: 1, userType: "의뢰자" } }))} />
	// 			<Button title="작업자" onPress={() => setContext(context => ({ ...context, userData: { userSn: 1, userType: "작업자" } }))} />
	// 		</View>
	return <RequesterApp />
}
