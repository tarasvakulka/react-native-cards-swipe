import React, { useRef } from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import CardsSwipe from 'react-native-cards-swipe';

const cardsData = [
  { src: require('./assets/images/1.jpg') },
  { src: require('./assets/images/2.jpg') },
  { src: require('./assets/images/3.jpg') },
  { src: require('./assets/images/4.jpg') },
];

export default function App() {
  const swiper = useRef<CardsSwipeRefObject>(null);

  return (
    <View style={styles.container}>
      <CardsSwipe
        ref={swiper}
        cards={cardsData}
        loop={false}
        renderNoMoreCard={() => <Text>{'No more Cards!'}</Text>}
        renderCard={(card) => (
          <View style={styles.imgContainer}>
            <Image
              style={styles.img}
              source={card.src}
              defaultSource={card.src}
            />
          </View>
        )}
      />
      <View style={styles.controlRow}>
        <TouchableOpacity
          onPress={() => {
            if (swiper.current) swiper.current.swipeLeft();
          }}
          style={[styles.button, styles.leftBtn]}
        >
          <Text>No</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (swiper.current) swiper.current.swipeRight();
          }}
          style={[styles.button, styles.rightBtn]}
        >
          <Text>Yes</Text>
        </TouchableOpacity>
      </View>
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
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    minHeight: 40,
    top: -30,
    marginVertical: 16,
  },
  button: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 55,
    padding: 14,
    borderRadius: 15,
  },
  rightBtn: {
    backgroundColor: 'lightgreen',
  },
  leftBtn: {
    backgroundColor: '#ff726f',
  },
});
