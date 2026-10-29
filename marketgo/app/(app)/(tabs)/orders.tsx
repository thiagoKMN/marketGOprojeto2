import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const buscarPedidos = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export default function OrdersScreen() {
  const { data: pedidos, isLoading, refetch } = useQuery({
    queryKey: ['lista_pedidos'],
    queryFn: buscarPedidos,
  });

  const handleCancelarPedido = (id: number) => {
    Alert.alert(
      'Cancelar Pedido',
      'Tem certeza que deseja cancelar e excluir este pedido?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

              if (error) throw error;

              Alert.alert('Sucesso', 'Pedido cancelado com sucesso!');
              refetch();
            } catch (err: any) {
              Alert.alert('Erro', 'Não foi possível cancelar o pedido: ' + err.message);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>A carregar pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Pedidos</Text>

      {!pedidos || pedidos.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>Ainda não realizou nenhum pedido.</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={refetch}
          refreshing={isLoading}
          renderItem={({ item }) => {
            const dataCriacao = new Date(item.created_at).toLocaleDateString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const isPendente = item.status === 'Pendente';

            return (
              <View style={styles.cartao}>
                <View style={styles.cabecalhoCartao}>
                  <Text style={styles.numeroPedido}>Pedido #{item.id}</Text>
                  <Text style={styles.status}>{item.status}</Text>
                </View>

                <Text style={styles.data}>Realizado em: {dataCriacao}</Text>

                <View style={styles.itensContainer}>
                  {Array.isArray(item.items) &&
                    item.items.map((prod: any, idx: number) => {
                      const nome = prod.name || prod.nome || 'Produto';
                      const qtd = prod.quantity || 1;
                      return (
                        <Text key={idx} style={styles.textoItem}>
                          • {qtd}x {nome}
                        </Text>
                      );
                    })}
                </View>

                <View style={styles.divisor} />

                <View style={styles.rodapeCartao}>
                  <View>
                    <Text style={styles.labelTotal}>Total:</Text>
                    <Text style={styles.valorTotal}>R$ {Number(item.total_price).toFixed(2)}</Text>
                  </View>

                  {isPendente && (
                    <TouchableOpacity
                      style={styles.botaoCancelar}
                      onPress={() => handleCancelarPedido(item.id)}
                    >
                      <Text style={styles.textoBotaoCancelar}>Cancelar Pedido</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoVazio: { fontSize: 16, color: '#888' },
  cartao: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cabecalhoCartao: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  numeroPedido: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  status: { fontSize: 13, fontWeight: 'bold', color: '#e67e22', backgroundColor: '#fef5e7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  data: { fontSize: 12, color: '#888', marginBottom: 10 },
  itensContainer: { marginVertical: 6 },
  textoItem: { fontSize: 14, color: '#444', marginBottom: 2 },
  divisor: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  rodapeCartao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelTotal: { fontSize: 13, color: '#666' },
  valorTotal: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  botaoCancelar: {
    backgroundColor: '#ffebee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoBotaoCancelar: { color: '#d32f2f', fontWeight: 'bold', fontSize: 13 },
});