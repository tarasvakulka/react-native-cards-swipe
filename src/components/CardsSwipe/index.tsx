import React, { useCallback, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import SwipePan from '../SwipePan';
import CardWrap from '../CardWrap';

import styles from './styles';

const { width } = Dimensions.get('window');
const rangeThreshold = width * 0.65;

interface CardsSwipeProps {
  cards: Array<any>;
  renderCard: (card: any) => React.ReactNode;
  initialIndex?: number;
}

const CardsSwipe = ({
  cards,
  renderCard,
  initialIndex = 0,
}: CardsSwipeProps) => {
  const [index, setIndex] = useState(initialIndex);
  const [key, setKey] = useState(0);
  const [lock, setLock] = useState(false);
  const scale = useSharedValue(1);
  const overrideNopeOpacity = useSharedValue(0);
  const overrideLikeOpacity = useSharedValue(0);

  const [secondIndex, setSecondIndex] = useState(index + 1);
  const onSwiped = useCallback(
    async (right) => {
      // disable touches while animating
      setLock(true);

      if (right) {
        // spring 'over the screen' to the right
        x.value = withSpring(width * 1.5);
        y.value = withSpring(0);
      } else {
        // spring 'over the screen' to the left
        x.value = withSpring(-width * 1.5);
        y.value = withSpring(0);
      }
      // while the spring/swipe animation is running, we do not want to switch
      // to the next image already, but just when the image is out of screen
      setTimeout(() => {
        const incSafe = (i: number) => (i + 1) % cards.length;
        const nextIndex = incSafe(index);

        // next image 'behind'
        setSecondIndex(incSafe(secondIndex));

        // next image 'on top'
        setIndex(nextIndex);

        // reset values/positions
        x.value = 0;
        y.value = 0;
        overrideNopeOpacity.value = 0;
        overrideLikeOpacity.value = 0;

        // prevent memory issues

        setKey(key + 1);
        setLock(false);
      }, 300);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, index, secondIndex, cards]
  );

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const originY = useSharedValue(0);

  const nopeOpacityStyle = useAnimatedStyle(() => {
    // swipe left - x is getting closer more negative - more opacity
    const opacity = interpolate(x.value, [0, -rangeThreshold], [0, 1]);

    return {
      opacity: overrideNopeOpacity.value || opacity,
    };
  });

  const likeOpacityStyle = useAnimatedStyle(() => {
    // swipe right - x is getting closer more positive - more opacity
    const opacity = interpolate(x.value, [0, rangeThreshold], [0, 1]);

    return {
      opacity: overrideLikeOpacity.value || opacity,
    };
  });

  const style = useAnimatedStyle(() => {
    const factor = 1;

    // the further we are to the left (-) or right (+), we rotate by up to 10deg
    const rotateZ = interpolate(x.value, [0, factor * rangeThreshold], [0, 10]);

    // the image rotation with border radius is not working well on android, thus disabled
    return {
      elevation: 2,
      width: '100%',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      transform: [
        { scale: scale.value },
        { translateX: x.value },
        { translateY: y.value },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  const lowerStyle = useAnimatedStyle(() => {
    const lowerCardScale = interpolate(
      x.value,
      [-rangeThreshold, -0.01, 0, 0.01, rangeThreshold],
      [1, 0.95, 0.95, 0.95, 1],
      Animated.Extrapolate.CLAMP
    );

    return {
      zIndex: -1,
      width: '100%',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { scale: lowerCardScale },
      ],
    };
  });

  return (
    <View pointerEvents={lock ? 'none' : 'auto'} style={styles.container}>
      <CardWrap
        {...{
          key: secondIndex,
          pointerEvents: 'none',
          style: lowerStyle,
          cardData: cards[secondIndex],
          index: secondIndex,
          backCard: true,
        }}
      >
        {renderCard(cards[secondIndex])}
      </CardWrap>
      <SwipePan key={key} {...{ onSnap: onSwiped, x, y, originY }}>
        <CardWrap
          {...{
            style,
            cardData: cards[index],
            index,
            key: index,
          }}
        >
          {renderCard(cards[index])}
          <Animated.View style={styles.overlay}>
            <View style={styles.row}>
              <Animated.View style={[styles.like, likeOpacityStyle]}>
                <Text style={styles.likeLabel}>YEP</Text>
              </Animated.View>
              <Animated.View style={[styles.nope, nopeOpacityStyle]}>
                <Text style={styles.nopeLabel}>NOPE</Text>
              </Animated.View>
            </View>
          </Animated.View>
        </CardWrap>
      </SwipePan>
    </View>
  );
};

export default CardsSwipe;
