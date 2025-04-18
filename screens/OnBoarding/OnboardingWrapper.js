import React, {useRef, useState} from 'react';
import {View, FlatList, Dimensions, StyleSheet, Animated} from 'react-native';
import OnBoardingPage1 from './OnBoardingPage1';
import OnBoardingPage2 from './OnBoardingPage2';

const {width} = Dimensions.get('window');

const OnboardingWrapper = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const pages = [<OnBoardingPage1 />, <OnBoardingPage2 />];

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <View style={{width}}>{item}</View>}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
      />
      <ProgressDots scrollX={scrollX} />
    </View>
  );
};

const ProgressDots = ({scrollX}) => {
  const dotPosition = Animated.divide(scrollX, width);
  return (
    <View style={styles.dotContainer}>
      {[0, 1].map((_, i) => {
        const widthAnim = dotPosition.interpolate({
          inputRange: [i - 1, i, i + 1],
          outputRange: [8, 20, 8],
          extrapolate: 'clamp',
        });

        const opacityAnim = dotPosition.interpolate({
          inputRange: [i - 1, i, i + 1],
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                width: widthAnim,
                opacity: opacityAnim,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8473',
    marginHorizontal: 5,
  },
});

export default OnboardingWrapper;
