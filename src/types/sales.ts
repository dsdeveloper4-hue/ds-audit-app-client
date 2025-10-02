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
}

export interface TSalesReport {
  data: TSales[];
  pagination: TPagination;
}


