import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({ placeholderImageSource, sizeX, sizeY }) {

  return (
    <Image source={placeholderImageSource} style={styles(sizeX,sizeY).image} />
  );
}

const styles = (sx,sy) => StyleSheet.create({
  image: {
    width: sx,
    height: sy,
    borderRadius: 18,
  },
});
