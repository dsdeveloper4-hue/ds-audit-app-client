export interface TProductSalesRecord {
  item_id: number;
  sales_date: string;
  total_qty: number;
  total_amount: number;
  item: TProduct;
}

export interface TProduct {
  id: number;
  store_id: number;
  count_id: number;
  item_code: string;
  item_name: string;
  category_id: number;
  sku: string;
  hsn: string;
  sac: any;
  unit_id: number;
  alert_qty: number;
  brand_id: number;
  lot_number: any;
  expire_date: any;
  price: number;
  tax_id: number;
  purchase_price: number;
  tax_type: string;
  profit_margin: number;
  sales_price: number;
  stock: number;
  item_image: string;
  system_ip: string;
  system_name: string;
  created_date: string;
  created_time: string;
  created_by: string;
  company_id: any;
  status: number;
  discount_type: string;
  discount: number;
  service_bit: number;
  seller_points: number;
  custom_barcode: string;
  description: string;
  item_group: string;
  parent_id: any;
  variant_id: any;
  child_bit: number;
  mrp: number;
}
