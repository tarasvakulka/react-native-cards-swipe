import type { ViewStyle, StyleProp } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

const CardWrap = React.forwardRef(
  (
    {
      style,
      children,
      cardContainerStyle,
      ...rest
    }: {
      style: ViewStyle;
      children?: React.ReactNode;
      cardContainerStyle: StyleProp<ViewStyle>;
    },
    ref: React.LegacyRef<Animated.View> | undefined
  ) => {
    return (
      <Animated.View
        {...{ style: [style, cardContainerStyle] }}
        {...rest}
        ref={ref}
      >
        {children}
      </Animated.View>
    );
  }
);

export default CardWrap;
