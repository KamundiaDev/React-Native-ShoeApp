import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';

export default function CartScreen() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Your cart is empty.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.variantId.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>KES {item.price.toLocaleString()}</Text>

              <View style={styles.controls}>
                <TouchableOpacity onPress={() => decreaseQuantity(item.variantId)}>
                  <Text style={styles.controlBtn}>-</Text>
                </TouchableOpacity>

                <Text>{item.quantity}</Text>

                <TouchableOpacity onPress={() => increaseQuantity(item.variantId)}>
                  <Text style={styles.controlBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => removeFromCart(item.variantId)}>
              <Text style={{ color: 'red' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Subtotal */}
      <View style={styles.footer}>
        <Text style={styles.subtotal}>
          Subtotal: KES {subtotal.toLocaleString()}
        </Text>

        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontWeight: '700',
    marginBottom: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  controlBtn: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  subtotal: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  checkoutBtn: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
