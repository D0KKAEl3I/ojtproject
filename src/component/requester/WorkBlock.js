import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Block from '../Block';
import { BS } from '../../GlobalStyles';

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
            <Text style={[styles.info, { color: workStateColor }]}>
                작업상태: {props.workState || "없음"}
            </Text>
            <Text style={styles.info}>
                작업주소: {props.workLocation || "없음"}
            </Text>
            <Text style={styles.info}>
                작업자명: {props.userName || "없음"}
            </Text>
            <Text style={styles.info}>
                {props.workState === '작업완료'
                    ? `작업완료일: ${props.workCompleteDate || '없음'}`
                    : `작업예정일: ${props.workDueDate || '없음'}`}
            </Text>
        </Block>
    );
}

const styles = BS
