import React from 'react'
import { Button } from '../ui/button'
import { TAuditWithDetails } from '@/types';
import months from '@/constants/months';

interface DownloadPDFProps {
  children: React.ReactNode;
  className?: string;
  audit: TAuditWithDetails;
}

const DownloadPDF = ({ children, className, audit }: DownloadPDFProps) => {
  return (
    <Button className={className}>{children}</Button>
  )
}

export default DownloadPDF