import * as React from 'react';
import { Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface Value {
  value: number;
}

interface Props {
  x: Value;
  y: Value;
  originY: Value;
  onSnap: (swipedRight: boolean) => void;
  children: React.ReactNode;
}

type AnimatedGHContext = {
  startX: number;
  startY: number;
};

const { width } = Dimensions.get('window');

const SwipePan = ({ x, y, onSnap, originY, children }: Props) => {
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: AnimatedGHContext) => {
      // with the context (ctx), we track the original start positions
      ctx.startX = x.value;
      ctx.startY = y.value;

      // keep the y value for figuring out the image rotation direction
      originY.value = event.y;
    },
    onActive: (event, ctx) => {
      // user is actively touching and moving the image
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (event, ctx) => {
      // dragged 40 percent of the screen's width
      const thresh = width * 0.4;

      // how much the user moved the image horizontally
      const diff = ctx.startX + event.translationX;

      if (diff > thresh) {
        // swiped right
        runOnJS(onSnap)(true);
      } else if (diff < -1 * thresh) {
        // swiped left
        runOnJS(onSnap)(false);
      } else {
        // no left or right swipe, so 'jump' back to the initial position
        x.value = withSpring(0);
        y.value = withSpring(0);
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      {children}
    </PanGestureHandler>
  );
};

export default SwipePan;
