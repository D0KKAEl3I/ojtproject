import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Block from '../Block';
import GS, { BS } from '../../GlobalStyles';
import Icon from '../Icon';

export default function WorkBlock({ navigation, route, select = () => { }, ...props }) {
    const [workStateColor, setWorkStateColor] = useState('#404040');

    useEffect(() => {
        switch (props.workState) {
            case '미배정':
                setWorkStateColor('#f00000');
                break;
            case '배정완료':
                setWorkStateColor('#f0a000');
                break;
            case '준비':
                setWorkStateColor('#f0a000');
                break;
            case '진행중':
                setWorkStateColor('#00a000');
                break;
            case '작업완료':
                setWorkStateColor('#808080');
                break;
            default:
                setWorkStateColor('#404040');
                break;
        }
    }, []);

    return (
        <Block
            navigation={navigation}
            route={route}
            style={props.style}
            title={props.workName}
            workState={{ value: props.workState, color: workStateColor }}
            onTouchEnd={() => {
                if (props.workState === '미배정') {
                    !props.selected ? select(props) : select(null);
                } else if (props.workState === '배정완료') {
                    !props.selected ? select(props) : select(null);
                } else {
                    select(null);
                }
            }}
            toDetail={{ screenName: 'WorkDetail', params: { workData: props } }}
            selected={props.selected}>
            <View style={styles.info}>
                <Icon style={styles.infoIcon} name="location" color="black" />
                <Text style={styles.infoText}>
                    주소: {props.workLocation || "없음"}
                </Text>
            </View>
            <View style={styles.info}>
                <Icon style={styles.infoIcon} name="nametag" />
                <Text style={styles.infoText}>
                    작업자명: {props.userName || "없음"}
                </Text>
            </View>
            <View style={styles.info}>
                <Icon style={styles.infoIcon} name="watch" />
                <Text style={styles.infoText}>
                    {props.workState === '작업완료'
                        ? `작업완료일: ${props.workCompleteDate || '없음'}`
                        : `작업예정일: ${props.workDueDate || '없음'}`}
                </Text>
            </View>
        </Block>
    );
}

const styles = BS
