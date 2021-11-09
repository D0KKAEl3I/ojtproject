import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Pressable, BackHandler } from 'react-native';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';

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
        <Tab value="마이 페이지" />
        <Tab value="이용안내" />
        <Tab value="설정" />
        <Tab value="로그인" />
      </Animated.View>
    </View>
  );
}

function Tab({ value }) {
  return (
    <Pressable style={styles.tab}>
      <Text style={styles.tabText}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 48,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  menu: {
    width: sideMenuWidth,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderBottomRightRadius: 16,
    transform: [{ translateX: -sideMenuWidth }],
    zIndex: 2,
  },
  tab: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  tabText: {
    fontSize: 24,
    color: GS.text_color,
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