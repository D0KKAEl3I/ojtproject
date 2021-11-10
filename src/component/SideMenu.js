import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, BackHandler, TouchableNativeFeedback, TouchableHighlight, Platform } from 'react-native';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';
import ContentView from './ContentView';
import TitleText from './TitleText';

const sideMenuWidth = 320;
const animDuration = 200; // 애니메이션 지속 시간

export default function SideMenu(props) {
  const context = useContext(GlobalContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-sideMenuWidth)).current;

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  });

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  });

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
    context.setStatus('Menu');
    fadeIn();
    slideIn();
  })
  const closeSideMenu = useCallback(() => {
    fadeOut();
    slideOut();
    context.setStatus('WorkHome');
    setTimeout(() => {
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
    openSideMenu();
  }, []);

  return (
    <View style={[styles.container]}>
      <Animated.View
        style={[styles.backgroundFilter, { opacity: fadeAnim }]}
        onTouchEnd={e => e.target === e.currentTarget && closeSideMenu()}
      />
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <TitleText>
          메인 메뉴
        </TitleText>
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
  return Platform.OS === "ios" ? (
    <TouchableHighlight
      style={styles.tab}
      underlayColor={GS.pressed_color}
      onPress={() => { }}>
      <Text style={styles.tabText}>{value}</Text>
    </TouchableHighlight>
  ) : (
    <TouchableNativeFeedback
      onPress={() => { }}
      background={TouchableNativeFeedback.Ripple(GS.pressed_color)}>
      <View style={styles.tab}>
        <Text style={styles.tabText}>{value}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9,
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
