# react-native-cards-swipe

React Native Card Stack Swiper

## Installation

1. Install the react-native-cards-swipe package.

```sh
npm install react-native-cards-swipe
```
2.  Then you'll need to install [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/installation/) version >= 2.1.0 to your project.
3.  Finally, you'll need to install [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/) to your project.


## Usage

```js
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import CardsSwipe from 'react-native-cards-swipe';

const cardsData = [
  { src: require('./assets/images/1.jpg') },
  { src: require('./assets/images/2.jpg') },
  { src: require('./assets/images/3.jpg') },
  { src: require('./assets/images/4.jpg') },
];

export default function App() {
  return (
    <View style={styles.container}>
      <CardsSwipe
        cards={cardsData}
        renderCard={(card) => (
          <View style={styles.card}>
            <Image style={styles.cardImg} source={card.src} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '92%',
    height: 500,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 3.3,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
});
```

## CardsSwipe props
| Props               | type          | description                           | required     | default       |
| --------------------| ------------- | --------------------------------------| -------------| ------------- |
| cards               | array         | data for the cards                    | yes          |               |
| renderCard          | func          | renders the card with the current data| yes          |               |
| initialIndex        | number        | initial card index                    |              | 0             |
| containerStyle      | object        | container style                       |              | {}            |
| cardContainerStyle  | object        | cardContainerStyle style              |              | {}            |
| lowerCardZoom       | number        | lower card zoom                       |              | 0.95          |
| animDuration        | number        | card animation duration               |              | 150           |
| horizontalThreshold | number        | horizontal swipe threshold            |              | width * 0.65  |
| rotationAngle       | number        | rotation angle (deg) for the card     |              | 10            |
| onSwipeStart        | func          | function to be called when a card swipe starts                  |    | () => {} |
| onSwipeEnd          | func          | function to be called when a card swipe ends (card is released) |    | () => {} |
| onSwiped            | func          | function to be called when a card is swiped. it receives the swiped card index |    | () => {} |
| onSwipedLeft        | func          | function to be called when a card is swiped left. it receives the swiped card index |    | () => {} |
| onSwipedRight       | func          | function to be called when a card is swiped right. it receives the swiped card index |    | () => {} |

## CardsSwipe actions
| Props             | type          |
| ----------------- | ------------- |
| swipeLeft         | func          |
| swipeRight        | func          |

```javascript
  <CardsSwipe ref={swiper => { this.swiper = swiper }} />

  <TouchableOpacity onPress={ () => { this.swiper.swipeLeft() }}>
    <Text>Left</Text>
  </TouchableOpacity>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT