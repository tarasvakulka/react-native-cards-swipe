import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Dimensions, View, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  withDelay,
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
  renderYep?: () => React.ReactNode;
  renderNope?: () => React.ReactNode;
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
      renderYep = () => null,
      renderNope = () => null,
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
      if (index >= 0) {
        overrideNopeOpacity.value = withSpring(1);
        setTimeout(() => onCardSwiped(false), 300);
      }
    };

    const swipeRight = () => {
      if (index >= 0) {
        overrideLikeOpacity.value = withSpring(1);
        setTimeout(() => onCardSwiped(true), 300);
      }
    };

    const onStartSwipe = useCallback(() => {
      onSwipeStart(index);
    }, [index, onSwipeStart]);

    const onEndSwipe = useCallback(() => {
      onSwipeEnd(index);
    }, [index, onSwipeEnd]);

    const onCardSwiped = useCallback(
      (right) => {
        setLock(true);

        onSwiped(index);

        const onEndCardAnimation = () => {
          const resetPosition = (secondCardIndex: number) => {
            x.value = withDelay(
              100,
              withTiming(0, { duration: 0 }, () => {
                runOnJS(setSecondIndex)(secondCardIndex);
              })
            );
            y.value = withDelay(100, withTiming(0, { duration: 0 }));
          };
          if (loop || index + 2 < cards.length) {
            const incSafe = (i: number) => (i + 1) % cards.length;
            setIndex(incSafe(index));
            resetPosition(incSafe(secondIndex));
          } else if (index + 1 < cards.length) {
            setIndex(index + 1);
            resetPosition(-1);
          } else {
            setIndex(-1);
            setNoMoreCards(true);
          }
          overrideNopeOpacity.value = 0;
          overrideLikeOpacity.value = 0;

          setLock(false);
        };

        if (right) {
          onSwipedRight(index);
          x.value = withTiming(width * 1.5, { duration: animDuration }, () => {
            runOnJS(onEndCardAnimation)();
          });
          y.value = withSpring(0);
        } else {
          onSwipedLeft(index);
          x.value = withTiming(-width * 1.5, { duration: animDuration }, () => {
            runOnJS(onEndCardAnimation)();
          });
          y.value = withSpring(0);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [index, secondIndex, cards, onSwiped, onSwipedRight, onSwipedLeft]
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
      const opacity = interpolate(x.value, [0, -horizontalThreshold], [0, 1]);

      return {
        opacity: overrideNopeOpacity.value || opacity,
      };
    });

    const likeOpacityStyle = useAnimatedStyle(() => {
      const opacity = interpolate(x.value, [0, horizontalThreshold], [0, 1]);

      return {
        opacity: overrideLikeOpacity.value || opacity,
      };
    });

    const style = useAnimatedStyle(() => {
      const factor = 1;

      const rotateZ = interpolate(
        x.value,
        [0, factor * horizontalThreshold],
        [0, rotationAngle]
      );

      return {
        elevation: 2,
        width: '100%',
        height: '100%',
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
        height: '100%',
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
              cardContainerStyle,
            }}
          >
            {renderCard(cards[secondIndex])}
          </CardWrap>
        ) : null}
        {index >= 0 ? (
          <SwipePan
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
                cardContainerStyle,
              }}
            >
              {renderCard(cards[index])}
              <Animated.View style={styles.overlay} pointerEvents={'none'}>
                <View style={styles.row}>
                  <Animated.View style={likeOpacityStyle}>
                    {renderYep()}
                  </Animated.View>
                  <Animated.View style={nopeOpacityStyle}>
                    {renderNope()}
                  </Animated.View>
                </View>
              </Animated.View>
            </CardWrap>
          </SwipePan>
        ) : null}
        {renderNoMoreCardsContainer()}
      </View>
    );
  }
);

export default CardsSwipe;
