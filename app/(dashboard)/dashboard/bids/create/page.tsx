// File: app/(dashboard)/dashboard/project/create/page.tsx

import BidForm from '../BidForm';

export default function CreateProjectPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <BidForm />
      </div>
    </div>
  );
}
