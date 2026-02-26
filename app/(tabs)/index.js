import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProducts } from '../../hooks/useProducts';
import { useRouter } from 'expo-router';



const { height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.28; // ~¼ screen



export default function ProductsScreen() {
  const { data, isLoading, error } = useProducts();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderItem = ({ item }) => {
    // Get image
    const imageUrl = item.images?.length
  ? `http://192.168.100.101:8000/storage/${
      item.images.find(img => img.is_primary)?.path 
      ?? item.images[0].path
    }`
  : null;

    // Get minimum price from variants
    const price = item.variants?.length
      ? Math.min(...item.variants.map(v => v.price))
      : 0;

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          margin: 8,
          backgroundColor: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 3,
        }}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={{ height: 180, backgroundColor: '#f0f0f0' }}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={{ padding: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
          {/* <Text style={{ fontSize: 14, color: '#555', marginVertical: 2 }}>{item.brand}</Text> */}

          <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#000' }}>
            KES {price.toLocaleString()}
          </Text>

          {/* New badge */}
          {/* <View
            style={{
              marginTop: 6,
              alignSelf: 'flex-start',
              backgroundColor: '#000',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>NEW</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    
    <View style={{ paddingTop: insets.top  }}>
        <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8, }}

        ListHeaderComponent={
          <>
            {/* HERO SECTION */}
            <ImageBackground
              source={{ uri: 'https://images.pexels.com/photos/17235987/pexels-photo-17235987.jpeg' }}
              style={styles.hero}
              resizeMode="cover"
            >
              <View style={styles.overlay} />
              <View style={styles.heroContent}>
                <Text style={styles.welcome}>Welcome to</Text>
                <Text style={styles.brand}>Juelz Shoes</Text>
                <Text style={styles.subtitle}>
                  Premium footwear for every step
                </Text>
              </View>
            </ImageBackground>

            {/* STATUS MESSAGES */}
            {isLoading && <Text style={{ padding: 16 }}>Loading products…</Text>}
            {error && <Text style={{ padding: 16 }}>Failed to load products</Text>}
          </>
        }
      />
      {/* HERO SECTION
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/17235987/pexels-photo-17235987.jpeg' }}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.heroContent}>
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.brand}>Juelz Shoes</Text>
          <Text style={styles.subtitle}>
            Premium footwear for every step
          </Text>
        </View>
      </ImageBackground> */}

      {/* CONTENT */}
      {/* <View style={{  paddingHorizontal: 8 }}>
        {isLoading && <Text>Loading products…</Text>}
        {error && <Text>Failed to load products</Text>}

  

        {data && (
          <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 2 }}
        numColumns={2} // 2-column grid
        showsVerticalScrollIndicator={false}
      />
        )}
      </View> */}
    </View>
  
  );
}

const styles = StyleSheet.create({
  hero: {
    height: HERO_HEIGHT,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroContent: {
    padding: 20,
  },
  welcome: {
    color: '#ddd',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brand: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: '#eee',
    fontSize: 14,
    marginTop: 6,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    elevation: 3,
  },
  productName: {
    fontWeight: '600',
    fontSize: 14,
  },
  price: {
    marginTop: 6,
    fontWeight: '700',
  },
});


// // app/screens/ProductsScreen.js
// import React from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useProducts } from '../../hooks/useProducts';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function ProductsScreen({ navigation }) {
//   const { data, isLoading, error } = useProducts();

//   if (isLoading) {
//     return (
//       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#000" />
//         <Text style={{ marginTop: 12 }}>Loading products...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
//         <Text style={{ color: 'red', textAlign: 'center' }}>Error loading products. Please try again.</Text>
//       </SafeAreaView>
//     );
//   }

//   const renderItem = ({ item }) => {
//     // Get image
//     const imageUrl = item.primary_image
//       ? `http://192.168.100.101:8000/storage/${item.primary_image.path}`
//       : null;

//     // Get minimum price from variants
//     const price = item.variants?.length
//       ? Math.min(...item.variants.map(v => v.price))
//       : 0;

//     return (
//       <TouchableOpacity
//         style={{
//           flex: 1,
//           margin: 8,
//           backgroundColor: '#fff',
//           borderRadius: 16,
//           overflow: 'hidden',
//           shadowColor: '#000',
//           shadowOpacity: 0.1,
//           shadowRadius: 10,
//           elevation: 3,
//         }}
//         onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
//       >
//         <View style={{ height: 180, backgroundColor: '#f0f0f0' }}>
//           {imageUrl && (
//             <Image
//               source={{ uri: imageUrl }}
//               style={{ width: '100%', height: '100%' }}
//               resizeMode="cover"
//             />
//           )}
//         </View>

//         <View style={{ padding: 12 }}>
//           <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
//           <Text style={{ fontSize: 14, color: '#555', marginVertical: 2 }}>{item.brand}</Text>

//           <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>
//             KES {price.toLocaleString()}
//           </Text>

//           {/* New badge */}
//           <View
//             style={{
//               marginTop: 6,
//               alignSelf: 'flex-start',
//               backgroundColor: '#000',
//               paddingHorizontal: 8,
//               paddingVertical: 2,
//               borderRadius: 12,
//             }}
//           >
//             <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>NEW</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <FlatList
//         data={data}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ padding: 8 }}
//         numColumns={2} // 2-column grid
//         showsVerticalScrollIndicator={false}
//       />
//     </SafeAreaView>
//   );
// }

// import {
//   View,
//   Text,
//   ImageBackground,
//   FlatList,
//   StyleSheet,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useProducts } from '@/hooks/useProducts';

// export default function HomeScreen() {
//   const { data, isLoading, error } = useProducts();

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <FlatList
//         data={data ?? []}
//         keyExtractor={(item) => item.id.toString()}
//         ListHeaderComponent={<HeroHeader />}
//         contentContainerStyle={{ paddingBottom: 120 }}
//         renderItem={({ item }) => (
//           <ProductCard product={item} />
//         )}
//         ListEmptyComponent={
//           isLoading ? (
//             <Text style={styles.center}>Loading products…</Text>
//           ) : error ? (
//             <Text style={styles.center}>Failed to load products</Text>
//           ) : null
//         }
//       />
//     </SafeAreaView>
//   );
// }


// function HeroHeader() {
//   return (
//     <ImageBackground
//       source={{ uri: 'https://images.pexels.com/photos/17235987/pexels-photo-17235987.jpeg'}}
//       style={styles.hero}
//       imageStyle={{ opacity: 0.85 }}
//     >
//       <View style={styles.heroOverlay}>
//         <Text style={styles.heroTitle}>Welcome to Juelz Shoes</Text>
//         <Text style={styles.heroSubtitle}>
//           Step into comfort. Walk with style.
//         </Text>
//       </View>
//     </ImageBackground>
//   );
// }

// function ProductCard({ product }) {
//   const price = product.variants?.[0]?.price ?? 0;
//   const image = product.primary_image?.path
//     ? { uri: `http://YOUR-IP/storage/${product.primary_image.path}` }
//     : null;

//   return (
//     <View style={styles.card}>
//       {image && <ImageBackground source={image} style={styles.image} />}
//       <View style={styles.cardBody}>
//         <Text style={styles.name}>{product.name}</Text>
//         <Text style={styles.brand}>{product.brand}</Text>
//         <Text style={styles.price}>KES {price}</Text>
//       </View>
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   hero: {
//     height: 220, // ~1/4 screen
//     justifyContent: 'flex-end',
//   },
//   heroOverlay: {
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//   },
//   heroTitle: {
//     color: '#fff',
//     fontSize: 26,
//     fontWeight: 'bold',
//   },
//   heroSubtitle: {
//     color: '#eee',
//     marginTop: 6,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginHorizontal: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     elevation: 3,
//   },
//   image: {
//     height: 180,
//   },
//   cardBody: {
//     padding: 12,
//   },
//   name: {
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   brand: {
//     color: '#666',
//     marginVertical: 4,
//   },
//   price: {
//     fontWeight: 'bold',
//     marginTop: 4,
//   },
//   center: {
//     textAlign: 'center',
//     marginTop: 40,
//   },
// });
