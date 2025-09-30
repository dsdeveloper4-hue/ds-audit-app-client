export const PRODUCTS = [
  { id: "1", name: "Product A" },
  { id: "2", name: "Product B" },
  { id: "3", name: "Product C" },
];

export const SALES = [
  {
    productId: "1",
    monthlySales: [
      { month: "Jan", value: 10 },
      { month: "Feb", value: 2000 },
      { month: "Mar", value: 50 },
      { month: "Apr", value: 3020 },
      { month: "May", value: 22 },
    ],
  },
  {
    productId: "2",
    monthlySales: [
      { month: "Jan", value: 80 },
      { month: "Feb", value: 140 },
      { month: "Mar", value: 300 },
      { month: "Apr", value: 220 },
      { month: "May", value: 180 },
    ],
  },
  {
    productId: "3",
    monthlySales: [
      { month: "Jan", value: 60 },
      { month: "Feb", value: 90 },
      { month: "Mar", value: 110 },
      { month: "Apr", value: 160 },
      { month: "May", value: 130 },
    ],
  },
];
export const fromDate = new Date("2025-08-15");
