// Work/Alarm/Work 블록의 기본형
import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, Image } from 'react-native';
import IconButton from './IconButton';
import GlobalContext from '../GlobalContext';
import { BS } from '../GlobalStyles';
import ContentView from './ContentView';

export default function Block({ navigation, route, title, children, onTouchEnd, toDetail = { screenName: '', params: {} }, ...props }) {

    return (
        <GlobalContext.Consumer>
            {state => (
                <ContentView
                    style={[props.selected && styles.selected, props.style]}
                    onTouchEnd={onTouchEnd}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>{title}</Text>
                        <IconButton
                            onPress={() => {
                                console.log(toDetail.params)
                                navigation.navigate(toDetail.screenName, {
                                    userData: state.userData,
                                    ...toDetail.params
                                })
                            }}
                        >
                            <View
                                style={styles.openButton}
                                onTouchEnd={e => e.stopPropagation()}>
                                <Image
                                    style={{ width: '100%', height: '100%', opacity: 0.7 }}
                                    source={require('../../public/forward_black.png')}
                                />
                            </View>
                        </IconButton>
                    </View>
                    <View style={styles.body}>
                        {children}
                    </View>
                </ContentView>
            )}
        </GlobalContext.Consumer>
    );
}

const styles = BS
