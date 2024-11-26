import axios, { AxiosInstance } from 'axios';
import { convertResponse, User, UserShape } from './types';

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api`,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Connection: 'keep-alive'
  }
});

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.error || 'An error occurred');
  }
  throw error;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    // const response = getTempValue()
    const response = await api.post('/auth/login', credentials);
    const user = convertResponse(response, User);

    return user;
  } catch (error) {
    throw error;
  }
};

export const createEmailVerificationToken = async (
  email: string,
  token: string
) => {
  try {
    const response = await api.post(
      '/auth/create-email-verification',
      { email },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createPhoneVerificationToken = async (
  phone: string,
  token: string
) => {
  try {
    const response = await api.post(
      '/auth/create-phone-verification',
      { phone },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyEmail = async (
  email: string,
  verificationToken: string,
  authToken: string
) => {
  try {
    const response = await api.post(
      '/auth/verify-email',
      { email, token: verificationToken },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyPhone = async (
  phone: string,
  verificationToken: string,
  authToken: string
) => {
  try {
    const response = await api.post(
      '/auth/verify-phone',
      { phone, token: verificationToken },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const handleOAuth = async (oauthData: {
  user: { name: string; email: string; image: string };
  account: {
    provider: string;
    type: string;
    providerAccountId: string;
    access_token: string;
    expires_at: number;
    scope: string;
    token_type: string;
    id_token: string;
  };
}) => {
  try {
    const response = await api.post('/auth/oauth', oauthData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const initiatePasswordReset = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyResetToken = async (token: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/verify-reset-token', {
      token: token,
      newPassword: newPassword
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const completeResetPassword = async (
  token: string,
  verifyToken: string
) => {
  try {
    const response = await api.post('/auth/complete-reset-password', {
      token,
      verifyToken
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const initiatePasswordChange = async (
  currentPassword: string,
  newPassword: string,
  token: string
) => {
  try {
    const response = await api.post(
      '/auth/initiate-password-change',
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const completePasswordChange = async (
  token: string,
  verificationCode: string,
  authToken: string
) => {
  try {
    const response = await api.post(
      '/auth/complete-password-change',
      { token, verificationCode },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteUser = async (token: string) => {
  try {
    const response = await api.delete('/auth/delete-user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

export const findUserByEmail = async (email: string) => {
  try {
    const response = await api.get(`/auth/findUserByEmail?email=${email}`);
    return convertResponse(response, User);
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export async function createUser(userData: any) {
  const response = await api.post(`/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.data;
}

export async function upsertAccount(accountData: any): Promise<any> {
  // Assuming your API has an endpoint for upserting accounts
  const response = await api.put(`/auth/account`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(accountData)
  });
  return response.data;
}

export async function updateUser(id: number, token: string, userData: any) {
  try {
    const updatedUserData = {
      data: {
        type: 'user',
        attributes: {
          ...userData
        }
      }
    };
    const response = await api.patch(`/zen/user/${id}`, updatedUserData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function getBusinessUserRoles(
  token: string,
  businessFilter: any
): Promise<any[]> {
  try {
    let url = `/zen/business_User_Roles`;

    console.log('url', url);

    if (businessFilter) {
      url += `?${new URLSearchParams(businessFilter).toString()}`;
    }

    console.log('url', url);

    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }

  return [];
}

export async function updateBusinessRoles(
  id: number,
  token: string,
  data: any
): Promise<any> {
  try {
    console.log('id', id, 'token', token, 'data', data);

    const response = await api.patch(`/zen/business_User_Roles/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}
