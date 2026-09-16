export type UserRole = 'super_admin' | 'admin' | 'agent' | 'customer';
export type ShipmentStatus = 'order_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';

export interface Profile {
  id: string;
  role: UserRole;
  full_name?: string;
  email: string;
  station?: string;
  region?: string;
  active: boolean;
  created_at: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  sender_name: string;
  sender_phone?: string;
  sender_email?: string;
  receiver_name: string;
  receiver_phone?: string;
  receiver_email?: string;
  item_name: string;
  category?: string;
  quantity?: number;
  weight?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location?: string;
  note?: string;
  agent_id?: string;
  created_at: string;
}

export interface ProofOfDelivery {
  id: string;
  shipment_id: string;
  receiver_name: string;
  signature_url?: string;
  agent_id: string;
  device_info?: string;
  created_at: string;
}
