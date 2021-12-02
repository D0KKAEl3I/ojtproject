// Work/Alarm/Work 블록의 기본형
import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import GlobalContext from '../GlobalContext';
import GS, { BS } from '../GlobalStyles';
import ContentView from './ContentView';
import Icon from './Icon';

export default function Block({ navigation, route, title, children, onTouchEnd, toDetail = { screenName: '', params: {} }, workState = { value: "", color: "#000" }, ...props }) {

    return (
        <GlobalContext.Consumer>
            {state => (
                <ContentView
                    style={[props.selected && styles.selected, props.style]}
                    onTouchEnd={onTouchEnd}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>{title}</Text>
                        {workState.value !== "" && <Text style={[styles.stateText, {
                            paddingHorizontal: GS.padding,
                            color: '#fff',
                            backgroundColor: workState.color,
                            shadowColor: workState.color
                        }]}>{workState.value}</Text>}
                    </View>
                    <View style={styles.body}>
                        <View style={styles.infoContainer}>
                            {children}
                        </View>
                        <Pressable
                            style={{ width: 48, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                navigation.navigate(toDetail.screenName, {
                                    userData: state.userData,
                                    ...toDetail.params
                                })
                            }}
                        >
                            <Icon style={{ width: 40, height: 40, opacity: 0.7 }} name="forward" />
                        </Pressable>
                    </View>
                </ContentView>
            )
            }
        </GlobalContext.Consumer >
    );
}

const styles = BS
