import { useLocalSearchParams } from 'expo-router';
import { useProduct } from '../../hooks/useProducts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ImageCarousel from '../../components/ImageCarousel';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { data: product, isLoading, error } = useProduct(id);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const { width } = Dimensions.get('window');
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading product…</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const images = product.images?.length
    ? product.images.map(img => `http://192.168.100.101:8000/storage/${img.path}`)
    : [];

  const variants = product.variants ?? [];
  const minPrice = variants.length ? Math.min(...variants.map(v => v.price)) : 0;
  const maxPrice = variants.length ? Math.max(...variants.map(v => v.price)) : 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* IMAGE CAROUSEL */}
        {images.length > 0 && <ImageCarousel images={images} />}

        {/* PRODUCT INFO */}
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.brand}>{product.brand}</Text>

          {/* PRICE */}
          <Text style={styles.price}>
            KES {minPrice.toLocaleString()} 
            {minPrice !== maxPrice && ` - KES ${maxPrice.toLocaleString()}`}
          </Text>

          {/* DESCRIPTION */}
          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}

          {/* VARIANTS */}
          {variants.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: '600', marginBottom: 8 }}>Select Variant</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {variants.map((v, idx) => (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => setSelectedVariant(v.id)}
                    style={[
                      styles.variantBox,
                      selectedVariant === v.id && { borderColor: '#1f2937', borderWidth: 2 },
                    ]}
                  >
                    <Text>{v.size} / {v.color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ADD TO CART BUTTON */}
          <TouchableOpacity
            style={styles.addToCart}
            onPress={() => {
              if (!selectedVariant) return alert('Select a variant first!');

              const variant = product.variants.find(v => v.id === selectedVariant);

              addToCart({
                productId: product.id,
                variantId: variant.id,
                name: product.name,
                price: variant.price,
                quantity: 1,
                image: images[0],
              });
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
  },
  brand: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    color: '#1f2937',
  },
  description: {
    marginTop: 12,
    lineHeight: 22,
    color: '#444',
  },
  variantBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  addToCart: {
    marginTop: 24,
    backgroundColor: '#1f2937',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
