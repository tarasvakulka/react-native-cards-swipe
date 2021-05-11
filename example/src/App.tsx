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
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={card.src} />
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
  imgContainer: {
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
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
});
