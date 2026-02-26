import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 340;

type Props = {
  images: string[];
};

export default function ImageCarousel({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  const flatListRef = useRef<FlatList>(null);

  // Shared zoom state
  const scale = useSharedValue(1);

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }
    });

  // Double tap gesture
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
      } else {
        scale.value = withSpring(2);
      }
    });

  // Combine gestures
  const composedGesture = Gesture.Simultaneous(pinchGesture, doubleTap);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Normal carousel item
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setModalVisible(true)}
    >
      <View style={{ width, height: CAROUSEL_HEIGHT }}>
        {!loadingImages[item] && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}

        <Image
          source={{ uri: item }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          onLoadEnd={() =>
            setLoadingImages((prev) => ({ ...prev, [item]: true }))
          }
        />
      </View>
    </TouchableOpacity>
  );

  // Fullscreen image item
  const renderFullscreenItem = ({ item }: { item: string }) => (
    <GestureDetector gesture={composedGesture}>
      <Animated.Image
        source={{ uri: item }}
        style={[styles.fullscreenImage, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );

  return (
    <>
      {/* ---------- NORMAL CAROUSEL ---------- */}
      <View style={{ height: CAROUSEL_HEIGHT }}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setActiveIndex(index);
          }}
          renderItem={renderItem}
        />

        {/* Pagination Dots */}
        {images.length > 1 && (
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: index === activeIndex ? 10 : 6,
                    height: index === activeIndex ? 10 : 6,
                    backgroundColor:
                      index === activeIndex
                        ? '#fff'
                        : 'rgba(255,255,255,0.5)',
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* ---------- FULLSCREEN MODAL ---------- */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.fullscreenContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            initialScrollIndex={activeIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderFullscreenItem}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setActiveIndex(index);
              scale.value = 1; // reset zoom when swiping
            }}
          />

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              scale.value = 1;
              setModalVisible(false);
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Close</Text>
          </TouchableOpacity>

          {/* Image Counter */}
          <Text style={styles.counter}>
            {activeIndex + 1} / {images.length}
          </Text>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: {
    borderRadius: 5,
    marginHorizontal: 4,
  },
  loader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenImage: {
    width,
    height,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  counter: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
  },
});
