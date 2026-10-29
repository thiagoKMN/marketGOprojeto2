import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor preencha todos os campos.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Erro no Login', error.message);
    } else {
      router.replace('/(app)/(tabs)');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>KAMINOZdelivery</Text>
      <Text style={styles.subtitulo}>Acesse a sua conta</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => router.push('/(auth)/register')}
      >
        <Text style={styles.textoBotaoSecundario}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  titulo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#007AFF', marginBottom: 5 },
  subtitulo: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 30 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  botaoPrincipal: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoSecundario: { paddingVertical: 14, alignItems: 'center' },
  textoBotaoSecundario: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
});