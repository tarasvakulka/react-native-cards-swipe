import type { ViewStyle } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

const CardWrap = React.forwardRef(
  (
    {
      style,
      children,
      ...rest
    }: {
      style: ViewStyle;
      index: number;
      cardData: object;
      backCard?: boolean;
      children?: React.ReactNode;
    },
    ref: React.LegacyRef<Animated.View> | undefined
  ) => {
    return (
      <Animated.View {...{ style }} {...rest} ref={ref}>
        {children}
      </Animated.View>
    );
  }
);

export default CardWrap;
