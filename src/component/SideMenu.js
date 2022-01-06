import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, BackHandler, TouchableNativeFeedback, TouchableHighlight, Platform } from 'react-native';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';
import ContentView from './ContentView';
import TitleText from './TitleText';
import Button from './Button';
import Icon from './Icon';

const sideMenuWidth = 320;
const animDuration = 200; // 애니메이션 지속 시간

export default function SideMenu(props) {
  const context = useContext(GlobalContext);
  const slideAnim = useRef(new Animated.Value(-sideMenuWidth)).current;

  const slideIn = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  });

  const slideOut = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -sideMenuWidth,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  });

  const openSideMenu = useCallback(() => {
    console.log('open');
    context.setContext({ status: 'Menu' });
    slideIn();
  })
  const closeSideMenu = useCallback(() => {
    console.log('close');
    context.setContext({ status: 'WorkHome' });
    slideOut();
    setTimeout(() => {
      context.setOnBackgroundFilter(false);
      props.setOnMenu(false);
    }, animDuration);
  })

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      closeSideMenu();
      return true
    })
  }, [context.status])


  useEffect(() => {
    if (props.show) {
      context.setOnBackgroundFilter(true)
      openSideMenu();
    }
  }, [props.show]);

  return (
    <View style={[styles.container, { display: props.show ? 'flex' : 'none' }]}>
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <TitleText>
            메인 메뉴
          </TitleText>
          <Button style={{ marginRight: GS.margin }} onPress={closeSideMenu}>
            <Icon name="close" style={{ width: 36, height: 36, opacity: 0.7 }} />
          </Button>
        </View>
        <ContentView style={{ paddingHorizontal: 0 }}>
          <Tab value="마이 페이지" />
          <Tab value="이용안내" />
          <Tab value="설정" />
          <Tab value="로그인" />
        </ContentView>
      </Animated.View>
    </View>
  );
}

function Tab({ value }) {
  return Platform.select({
    ios: (
      <TouchableHighlight
        style={styles.tab}
        underlayColor={GS.pressed_color}
        onPress={() => { }}>
        <Text style={styles.tabText}>{value}</Text>
      </TouchableHighlight>
    ),
    android: (
      <TouchableNativeFeedback
        onPress={() => { }}
        background={TouchableNativeFeedback.Ripple(GS.pressed_color)}>
        <View style={styles.tab}>
          <Text style={styles.tabText}>{value}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  });
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  menu: {
    width: sideMenuWidth,
    backgroundColor: GS.background_color,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderBottomRightRadius: 16,
    transform: [{ translateX: -sideMenuWidth }],
    zIndex: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: GS.padding,
    paddingHorizontal: GS.padding_horizontal,
  },
  tabText: {
    fontSize: 24,
    color: GS.text_color,
    fontWeight: GS.font_weight.regular
  },
  backgroundFilter: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000a',
  },
});
