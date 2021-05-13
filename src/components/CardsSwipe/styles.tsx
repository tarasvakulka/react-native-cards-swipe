import { StyleSheet } from 'react-native';

const likeNopeDeg = '22deg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 16,
  },
  nope: {
    borderWidth: 5,
    borderRadius: 6,
    padding: 8,
    margin: 8,
    borderColor: 'red',
    transform: [{ rotateZ: `${likeNopeDeg}` }],
  },
  nopeLabel: {
    fontSize: 32,
    color: 'red',
    fontWeight: 'bold',
  },
  like: {
    borderWidth: 5,
    borderRadius: 6,
    padding: 8,
    margin: 8,
    borderColor: 'lightgreen',
    transform: [{ rotateZ: `-${likeNopeDeg}` }],
  },
  likeLabel: {
    fontSize: 32,
    color: 'lightgreen',
    fontWeight: 'bold',
  },
});

export default styles;
