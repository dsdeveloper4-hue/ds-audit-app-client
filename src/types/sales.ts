import { TPagination } from ".";

export interface TSales {
  id: number;
  sales_code: string;
  reference_no: string;
  customer_id: number;
  customer_name: string;
  payment_status: string;
  paid_amount: number;
  created_date: string;
  created_time: string;
  sales_date: string;
  subtotal: number;
  created_by: string;
  items: TItem[];
}


export interface TItem {
  sales_item_id: number;
  sales_qty: number;
  price_per_unit: number;
  discount_amt: number;
  unit_total_cost: number;
  total_cost: number;
  item_id: number;
  item_code: string;
  item_name: string;
  sku: string;
}
export interface TSalesReport {
  data: TSales[];
  pagination: TPagination;
}
