const API_BASE_URL = '/api'; // Adjust this to your actual API base URL

export async function submitBusinessRegistration(data: any) {
  const response = await fetch(`${API_BASE_URL}/business-registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit business registration');
  }

  return response.json();
}

export async function submitBusinessDetails(data: any) {
  const response = await fetch(`${API_BASE_URL}/business-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit business details');
  }

  return response.json();
}
