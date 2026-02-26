import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

//   const { token } = useAuth();

// if (!token) {
//   return <Redirect href="/login" />;
// }

  return (
   <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
   </GestureHandlerRootView>
  );
}
