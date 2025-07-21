type ItemInfo = {
  item_name: string;
  sales_price: number;
};

export interface ProductType {
  id: number;
  sales_qty: number;
  total_cost: number;
  created_date: string;
  item_info: ItemInfo;
}
