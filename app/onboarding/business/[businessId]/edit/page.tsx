//file : app/onboarding/business/[businessId]/edit/page.tsx

import { auth } from '@/auth';
import { modelConfigs } from '@/server/model-config';
import { BusinessShape } from '@/server/types/user_business';
import { processDocumentsAndImages } from '@/server/utils/filehandler';
import BusinessForm from '../../BusinessForm';
import {
  BUSINESS_INITIAL_SPECIALIZATIONS,
  BUSINESS_INITIAL_TRADE_TYPES
} from '@/constants/values';

export default async function EditBusinessPage({
  params
}: {
  params: { businessId: string };
}) {
  const session = await auth();
  let business: BusinessShape | null = null;

  if (session?.user?.apiUserToken) {
    try {
      business = (await modelConfigs.business.getFunction(
        params.businessId,
        session.user.apiUserToken
      )) as BusinessShape;

      if (business) {
        // Process all document fields in the business object
        business = await processDocumentsAndImages(
          business,
          session.user.apiUserToken
        );
      }

      // console.log('Transformed business:', business);
    } catch (error) {
      console.error('Error fetching business:', error);
    }
  }

  if (!business) {
    return <div>Business not found or invalid</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <BusinessForm
          businessData={business as BusinessShape & { id: string }}
          businessId={params.businessId}
          specializations={BUSINESS_INITIAL_SPECIALIZATIONS}
          tradeTypes={BUSINESS_INITIAL_TRADE_TYPES}
        />
      </div>
    </div>
  );
}
