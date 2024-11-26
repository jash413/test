import React from 'react';
import ProfileForm from './ProfileForm';
import { auth } from '@/auth';
import { modelConfigs } from '@/server/model-config';
import { UserProfileShape } from '@/server/types/user_business';
import { processDocumentsAndImages } from '@/server/utils/filehandler';

export default async function ProfilePage() {
  const session = await auth();
  let userProfile: UserProfileShape | null = null;

  if (session?.user?.apiUserToken) {
    try {
      let userProfiles = await modelConfigs.user_Profile.listFunction(
        { filter: { user_id: session.user.id } },
        session.user.apiUserToken
      );

      if (userProfiles && userProfiles.length > 0) {
        userProfile = userProfiles[0];
        // Process all document fields in the user profile object
        userProfile = await processDocumentsAndImages(
          userProfile,
          session.user.apiUserToken
        );
      }

      console.log('Transformed user profile:', userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        {userProfile !== null ? (
          <ProfileForm
            profileData={userProfile}
            profileId={userProfile.id?.toString() || ''}
          />
        ) : (
          <ProfileForm />
        )}
      </div>
    </div>
  );
}
