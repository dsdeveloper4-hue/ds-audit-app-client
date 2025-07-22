


export interface ProductType {
  item_id: number;
  sales_date: string; // ISO date string, e.g., "2025-07-14T00:00:00.000Z"
  total_qty: number;
  total_amount: number;
  item: ItemDetails;
}

export interface ItemDetails {
  id: number;
  item_code: string;
  item_name: string;
  item_group: string;
  item_image: string;
  alert_qty: number;
  brand_id: number;
  category_id: number;
  child_bit: number;
  company_id: number | null;
  count_id: number;
  created_by: string;
  created_date: string; // e.g., "2025-06-28T00:00:00.000Z"
  created_time: string; // e.g., "07:40:23 pm"
  custom_barcode: string;
  description: string;
  discount: number;
  discount_type: string;
  expire_date: string | null;
  hsn: string;
  lot_number: string | null;
  mrp: number;
  parent_id: number | null;
  price: number;
  profit_margin: number;
  purchase_price: number;
  sac: string | null;
  sales_price: number;
  seller_points: number;
  service_bit: number;
  sku: string;
  status: number;
  stock: number;
  store_id: number;
  system_ip: string;
  system_name: string;
  tax_id: number;
  tax_type: string;
  unit_id: number;
  variant_id: number | null;
}
