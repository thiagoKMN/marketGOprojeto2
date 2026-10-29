import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } else {
      Alert.alert(
        'Conta Criada!',
        'Enviamos um e-mail de confirmação. Por favor, valide o seu e-mail antes de fazer o login.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>KAMINOZdelivery</Text>
      <Text style={styles.subtitulo}>Crie a sua conta</Text>

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
        placeholder="Senha (mínimo 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => router.back()}
      >
        <Text style={styles.textoBotaoSecundario}>Já tem uma conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  titulo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#007AFF', marginBottom: 5 },
  subtitulo: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 30 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  botaoPrincipal: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoSecundario: { paddingVertical: 14, alignItems: 'center' },
  textoBotaoSecundario: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
});