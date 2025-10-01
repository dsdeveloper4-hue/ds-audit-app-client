import CustomerReportPage from '@/components/customerReport/CustomerReportPage';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Customer Report",
  description:
    "Analyze customer purchase history in Digital Seba with detailed reports. Track buyer activity, monitor sales patterns, and understand customer behavior effectively.",
};

const page = () => {
  return (
    <CustomerReportPage />
  )
}

export default page