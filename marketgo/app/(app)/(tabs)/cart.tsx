import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../../../src/context/CartContext';
import { supabase } from '@/lib/supabase';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('orders').insert([
        {
          total_price: totalPrice,
          items: cart,
          status: 'Pendente',
        },
      ]);

      if (error) throw error;

      Alert.alert('Sucesso!', 'O seu pedido foi enviado com sucesso.');
      clearCart();
    } catch (err: any) {
      Alert.alert('Erro', 'Não foi possível finalizar o pedido: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Carrinho</Text>

      {cart.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>O seu carrinho está vazio.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const nome = item.name || item.nome || 'Produto';
              const preco = item.price || item.preco || 0;
              const quantidade = item.quantity || 1;

              return (
                <View style={styles.cartao}>
                  <View style={styles.info}>
                    <Text style={styles.nomeItem}>{nome}</Text>
                    <Text style={styles.detalhesItem}>
                      R$ {Number(preco).toFixed(2)} x {quantidade}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.botaoRemover}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.textoRemover}>Remover</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <View style={styles.rodape}>
            <View style={styles.linhaTotal}>
              <Text style={styles.textoTotalLabel}>Total:</Text>
              <Text style={styles.textoTotalValor}>R$ {totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.botaoFinalizar, loading && { opacity: 0.7 }]}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBotaoFinalizar}>Finalizar Pedido</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoVazio: { fontSize: 16, color: '#888' },
  cartao: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1
  },
  info: { flex: 1 },
  nomeItem: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  detalhesItem: { fontSize: 14, color: '#666', marginTop: 2 },
  botaoRemover: { backgroundColor: '#ffebee', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  textoRemover: { color: '#d32f2f', fontWeight: 'bold', fontSize: 12 },
  rodape: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
    marginTop: 10
  },
  linhaTotal: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  textoTotalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  textoTotalValor: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' },
  botaoFinalizar: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  textoBotaoFinalizar: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});