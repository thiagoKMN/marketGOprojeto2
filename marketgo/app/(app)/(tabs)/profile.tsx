import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível sair: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Perfil</Text>

      <View style={styles.cartao}>
        <Text style={styles.label}>E-mail da Conta:</Text>
        <Text style={styles.email}>{user?.email || 'Usuário não identificado'}</Text>

        <TouchableOpacity style={styles.botaoSair} onPress={handleSignOut}>
          <Text style={styles.textoBotaoSair}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1a1a1a' },
  cartao: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  email: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20 },
  botaoSair: {
    backgroundColor: '#ffebee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoSair: { color: '#d32f2f', fontWeight: 'bold', fontSize: 15 },
});