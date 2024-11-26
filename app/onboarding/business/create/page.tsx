// File: app/(dashboard)/dashboard/business/create/page.tsx

import {
  BUSINESS_INITIAL_SPECIALIZATIONS,
  BUSINESS_INITIAL_TRADE_TYPES
} from '@/constants/values';
import BusinessForm from '../BusinessForm';

export default function CreateBusinessPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <BusinessForm
          specializations={BUSINESS_INITIAL_SPECIALIZATIONS}
          tradeTypes={BUSINESS_INITIAL_TRADE_TYPES}
        />
      </div>
    </div>
  );
}
