import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import WorkBlock from '../../component/requester/WorkBlock';
import { FlatList } from 'react-native-gesture-handler';
import GlobalContext from '../../GlobalContext';
import WorkerBlock from '../../component/requester/WorkerBlock';
import GS from '../../GlobalStyles';
import BottomMenu from '../../component/BottomMenu';
import SearchInput from '../../component/SearchInput'
import TitleText from '../../component/TitleText';
let windowSize = Dimensions.get('window')

export default function WorkerAssign({ navigation, route, ...props }) {
    const context = useContext(GlobalContext)
    const [isWorkAlreadyRequested, setIsWorkAlreadyRequested] = useState()
    const [onLandScape, setOnLandScape] = useState(false); // 화면이 눕혀져있는가?
    const [onSearch, setOnSearch] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [selectedWorkerData, setSelectedWorkerData] = useState(null);

    useEffect(() => {
        setIsWorkAlreadyRequested(route.params.workData.workState === "배정완료")
        return navigation.addListener('focus', () => {
            windowSize.width > windowSize.height && setOnLandScape(true)
            Dimensions.addEventListener('change', ({ window: { width, height } }) => {
                windowSize = Dimensions.get('window');
                setOnLandScape(width > height);
            })
            context.setContext({ status: route.name });
        })
    }, [])

    return (
        <GlobalContext.Consumer>
            {state => (
                <View style={styles.container}>
                    <View style={[{ flex: 1 }, onLandScape && { flexDirection: 'row', justifyContent: 'center' }]}>
                        <View style={styles.list}>
                            <WorkBlock
                                {...route.params.workData}
                                navigation={navigation}
                                route={route}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <TitleText style={{ marginTop: 0 }}>
                                배정할 작업자 선택
                            </TitleText>
                            <FlatList
                                style={styles.list}
                                data={state.workerList}
                                renderItem={({ item }) => (
                                    <WorkerBlock
                                        selected={
                                            selectedWorkerData && item.userSn === selectedWorkerData.userSn
                                        }
                                        {...item}
                                        navigation={navigation}
                                        route={route}
                                        select={workerData => setSelectedWorkerData(workerData)}
                                    />
                                )}

                                keyExtractor={item => item.userSn}
                            />
                        </View>
                    </View>
                    {onSearch && (
                        <KeyboardAvoidingView
                            behavior={Platform.select({ ios: "padding", android: "height" })}
                            style={styles.backgroundFilter}>
                            <SearchInput
                                label="작업자 검색"
                                defaultValue={searchData}
                                onClose={() => {
                                    setOnSearch(false);
                                    setSearchData('');
                                    context.setContext({ status: route.name });
                                }}
                                onSubmit={data => {
                                    setOnSearch(false);
                                    setSearchData(data)
                                    context.setContext({ status: route.name });
                                }}
                            />
                        </KeyboardAvoidingView>
                    )}
                    <BottomMenu
                        data={[
                            {
                                value: '작업자 검색하기',
                                onPress: () => {
                                    context.setContext({ status: 'Search' });
                                    setOnSearch(true);
                                },
                                disable: false,
                                fontStyle: { fontSize: 15 }
                            },
                            {
                                value: isWorkAlreadyRequested ? "작업 취소" : "작업 배정",
                                onPress: () => navigation.navigate(isWorkAlreadyRequested ? "CancleWorkRequest" : "WorkRequest", { workData: route.params.workData, workerData: !isWorkAlreadyRequested && selectedWorkerData, }),
                                disable: !selectedWorkerData && !isWorkAlreadyRequested
                            },
                            {
                                value: '작업자 변경',
                                onPress: () => navigation.navigate('ChangeWorker', { workData: route.params.workData, workerData: selectedWorkerData }),
                                disable: !selectedWorkerData || route.params.workData.workState !== "배정완료",
                            },
                        ]}
                    />
                </View>
            )
            }
        </GlobalContext.Consumer >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        marginBottom: GS.margin,
        color: GS.text_color,
        fontSize: 22,
        fontWeight: GS.font_weight.bold,
        fontFamily: GS.font_family,
        textAlign: 'center',
        zIndex: 9
    },
    list: {
        maxWidth: 512,
    },
    backgroundFilter: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9,
        backgroundColor: '#000a',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
