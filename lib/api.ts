/**
 * API Client untuk BagiBerkah
 * Centralized API calls ke backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        // Extract error message from response
        let errorMessage = data.error?.message || data.message || 'Something went wrong';
        
        // If validation errors exist, format them
        if (data.errors && Array.isArray(data.errors)) {
          const errorDetails = data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
          errorMessage = `${errorMessage} - ${errorDetails}`;
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Envelope APIs
  async createEnvelope(data: any) {
    return this.request('/envelopes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkEnvelope(accessCode: string) {
    return this.request('/envelopes/check', {
      method: 'POST',
      body: JSON.stringify({ accessCode }),
    });
  }

  async getEnvelope(id: string) {
    return this.request(`/envelopes/${id}`);
  }

  async getEnvelopeStatus(id: string) {
    return this.request(`/envelopes/${id}/status`);
  }

  // AI APIs
  async getAIAllocation(data: any) {
    return this.request('/ai/allocate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateGreeting(data: any) {
    return this.request('/ai/greeting', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Quiz APIs
  async generateQuiz(data: {
    topic: string;
    difficulty: string;
    count?: number;
  }) {
    return this.request('/ai/generate-quiz', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Claim APIs
  async getClaim(token: string) {
    return this.request(`/claims/${token}`);
  }

  async submitClaim(token: string, data: any) {
    return this.request(`/claims/${token}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async validateQR(qrToken: string) {
    console.log('🔐 API validateQR called with:', { qrToken, length: qrToken.length });
    return this.request(`/claims/validate-qr`, {
      method: 'POST',
      body: JSON.stringify({ qrToken }),
    });
  }

  async completeGame(token: string) {
    return this.request(`/claims/${token}/complete-game`, {
      method: 'POST',
    });
  }

  // Payment APIs
  async createPayment(envelopeId: string) {
    return this.request(`/payments/create`, {
      method: 'POST',
      body: JSON.stringify({ envelopeId }),
    });
  }

  async getPaymentStatus(paymentId: string) {
    return this.request(`/payments/${paymentId}/status`);
  }

  // Donation APIs
  async createDonation(data: {
    amount: number;
    donorName?: string;
    donorEmail?: string;
    donorPhone?: string;
    message?: string;
  }) {
    return this.request('/donations/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDonationStats() {
    return this.request('/donations/stats');
  }
}

export const api = new ApiClient(API_URL);
