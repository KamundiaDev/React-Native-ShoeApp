import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { loginWithGoogle } = useAuth();
  

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <TouchableOpacity
        onPress={loginWithGoogle}
        style={{
          backgroundColor: '#111',
          padding: 16,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#fff' }}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}