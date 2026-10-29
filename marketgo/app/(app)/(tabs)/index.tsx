import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useCart } from '../../../src/context/CartContext';

const buscarProdutos = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export default function TelaDeProdutos() {
  const { addToCart } = useCart();
  const { data: produtos, isLoading, isError, error } = useQuery({
    queryKey: ['lista_produtos'],
    queryFn: buscarProdutos,
  });

  const handleAddToCart = (item: any) => {
    addToCart(item);
    const nome = item.name || item.nome || 'Produto';
    Alert.alert('Carrinho', `${nome} foi adicionado ao carrinho!`);
  };

  if (isLoading) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>A carregar produtos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centralizado}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>Erro ao carregar:</Text>
        <Text>{error?.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cardápio / Produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const nomeItem = item.name || item.nome || 'Sem nome';
          const precoItem = item.price || item.preco || '0.00';

          return (
            <View style={styles.cartao}>
              <View style={styles.info}>
                <Text style={styles.nomeProduto}>{nomeItem}</Text>
                <Text style={styles.precoProduto}>R$ {precoItem}</Text>
              </View>

              <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.textoBotao}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
  cartao: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  info: { flex: 1 },
  nomeProduto: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  precoProduto: { fontSize: 15, color: '#2e7d32', marginTop: 4, fontWeight: '600' },
  botaoAdicionar: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});