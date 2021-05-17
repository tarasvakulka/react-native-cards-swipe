import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Dimensions, Text, View, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import SwipePan from '../SwipePan';
import CardWrap from '../CardWrap';

import styles from './styles';

const { width } = Dimensions.get('window');

interface CardsSwipeProps {
  cards: Array<any>;
  renderCard: (card: any) => React.ReactNode;
  loop?: boolean;
  renderNoMoreCard?: () => React.ReactNode;
  initialIndex?: number;
  containerStyle?: StyleProp<ViewStyle>;
  cardContainerStyle?: StyleProp<ViewStyle>;
  lowerCardZoom?: number;
  animDuration?: number;
  horizontalThreshold?: number;
  rotationAngle?: number;
  onSwipeStart?: (index: number) => void;
  onSwipeEnd?: (index: number) => void;
  onSwiped?: (index: number) => void;
  onSwipedLeft?: (index: number) => void;
  onSwipedRight?: (index: number) => void;
}

const CardsSwipe = forwardRef(
  (
    {
      cards,
      renderCard,
      loop = true,
      renderNoMoreCard = () => null,
      initialIndex = 0,
      containerStyle = {},
      cardContainerStyle = {},
      lowerCardZoom = 0.95,
      animDuration = 150,
      horizontalThreshold = width * 0.65,
      rotationAngle = 10,
      onSwipeStart = () => {},
      onSwipeEnd = () => {},
      onSwiped = () => {},
      onSwipedLeft = () => {},
      onSwipedRight = () => {},
    }: CardsSwipeProps,
    ref: Ref<CardsSwipeRefObject>
  ) => {
    const [index, setIndex] = useState(initialIndex);
    const [key, setKey] = useState(0);
    const [lock, setLock] = useState(false);
    const [noMoreCards, setNoMoreCards] = useState(false);
    const scale = useSharedValue(1);
    const overrideNopeOpacity = useSharedValue(0);
    const overrideLikeOpacity = useSharedValue(0);

    const [secondIndex, setSecondIndex] = useState(index + 1);

    useImperativeHandle(ref, () => ({ swipeLeft, swipeRight }));

    const prevCards = useRef(cards);
    useEffect(() => {
      if (prevCards.current !== cards) {
        prevCards.current = cards;
        if (noMoreCards) {
          setIndex(0);
          setSecondIndex(1);
          setNoMoreCards(false);
          x.value = 0;
          y.value = 0;
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards]);

    const swipeLeft = () => {
      overrideNopeOpacity.value = withSpring(1);
      setTimeout(() => onCardSwiped(false), 300);
    };

    const swipeRight = () => {
      overrideLikeOpacity.value = withSpring(1);
      setTimeout(() => onCardSwiped(true), 300);
    };

    const onStartSwipe = useCallback(() => {
      onSwipeStart(index);
    }, [index, onSwipeStart]);

    const onEndSwipe = useCallback(() => {
      onSwipeEnd(index);
    }, [index, onSwipeEnd]);

    const onCardSwiped = useCallback(
      (right) => {
        // disable touches while animating
        setLock(true);

        onSwiped(index);

        const onEndCardAnimation = () => {
          const resetPosition = () => {
            // reset positions
            x.value = 0;
            y.value = 0;
          };

          if (loop || index + 2 < cards.length) {
            const incSafe = (i: number) => (i + 1) % cards.length;
            const nextIndex = incSafe(index);

            // next image 'behind'
            setSecondIndex(incSafe(secondIndex));

            // next image 'on top'
            setIndex(nextIndex);
            resetPosition();
          } else if (index + 1 < cards.length) {
            setSecondIndex(-1);
            setIndex(index + 1);
            resetPosition();
          } else {
            setNoMoreCards(true);
          }
          // reset values
          overrideNopeOpacity.value = 0;
          overrideLikeOpacity.value = 0;

          // prevent memory issues
          setKey(key + 1);
          setLock(false);
        };

        if (right) {
          onSwipedRight(index);
          // spring 'over the screen' to the right
          x.value = withTiming(width * 1.5, { duration: animDuration }, () => {
            runOnJS(onEndCardAnimation)();
          });
          y.value = withSpring(0);
        } else {
          onSwipedLeft(index);
          // spring 'over the screen' to the left
          x.value = withTiming(-width * 1.5, { duration: animDuration }, () => {
            runOnJS(onEndCardAnimation)();
          });
          y.value = withSpring(0);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [key, index, secondIndex, cards, onSwiped, onSwipedRight, onSwipedLeft]
    );

    const renderNoMoreCardsContainer = () => {
      if (noMoreCards) {
        return <View>{renderNoMoreCard()}</View>;
      }
      return null;
    };

    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const originY = useSharedValue(0);

    const nopeOpacityStyle = useAnimatedStyle(() => {
      // swipe left - x is getting closer more negative - more opacity
      const opacity = interpolate(x.value, [0, -horizontalThreshold], [0, 1]);

      return {
        opacity: overrideNopeOpacity.value || opacity,
      };
    });

    const likeOpacityStyle = useAnimatedStyle(() => {
      // swipe right - x is getting closer more positive - more opacity
      const opacity = interpolate(x.value, [0, horizontalThreshold], [0, 1]);

      return {
        opacity: overrideLikeOpacity.value || opacity,
      };
    });

    const style = useAnimatedStyle(() => {
      const factor = 1;

      // the further we are to the left (-) or right (+), we rotate by up to rotationAngle
      const rotateZ = interpolate(
        x.value,
        [0, factor * horizontalThreshold],
        [0, rotationAngle]
      );

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
        [-horizontalThreshold, -0.01, 0, 0.01, horizontalThreshold],
        [1, lowerCardZoom, lowerCardZoom, lowerCardZoom, 1],
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
          { scale: secondIndex >= 0 ? lowerCardScale : 1 },
        ],
      };
    });

    return (
      <View
        pointerEvents={lock ? 'none' : 'auto'}
        style={[styles.container, containerStyle]}
      >
        {secondIndex >= 0 ? (
          <CardWrap
            {...{
              key: secondIndex,
              pointerEvents: 'none',
              style: lowerStyle,
              cardData: cards[secondIndex],
              index: secondIndex,
              backCard: true,
              cardContainerStyle,
            }}
          >
            {renderCard(cards[secondIndex])}
          </CardWrap>
        ) : null}
        <SwipePan
          key={key}
          {...{
            onSnap: onCardSwiped,
            onStart: onStartSwipe,
            onEnd: onEndSwipe,
            x,
            y,
            originY,
          }}
        >
          <CardWrap
            {...{
              style,
              cardData: cards[index],
              index,
              key: index,
              cardContainerStyle,
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
        {renderNoMoreCardsContainer()}
      </View>
    );
  }
);

export default CardsSwipe;
