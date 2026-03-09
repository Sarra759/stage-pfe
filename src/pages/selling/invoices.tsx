import React from 'react';
import { InvoicePortal } from '@/components/selling/invoice/InvoicePortal';

export default function InvoicesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-8">
      <InvoicePortal />
    </div>
  );
}
