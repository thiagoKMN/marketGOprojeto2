import { supabase } from '../lib/supabase';
import type { CreateOrderInput, Order, Product, Store } from '../types';

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getStoreById(id: string): Promise<Store | null> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getProductsByStore(storeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { data, error } = await supabase.rpc('create_order', {
    p_store_id: input.storeId,
    p_items: input.items,
    p_payment_method: input.payment,
    p_change_for: input.changeFor,
    p_address_street: input.street,
    p_address_number: input.number,
    p_address_neighborhood: input.neighborhood,
    p_address_complement: input.complement,
  });

  if (error) throw error;
  return data;
}

export async function getUserOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}