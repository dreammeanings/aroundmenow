import { Event, Venue, User, FilterOptions } from '../types';

const API_BASE_URL = 'https://around-me-now-backend.ondigitalocean.app/api';

class ApiService {
  private token: string = '';

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    console.log('🌐 HTTP Request:', {
      method: config.method || 'GET',
      url,
      headers,
      body: config.body,
    });

    try {
      const response = await fetch(url, config);
      console.log('🌐 HTTP Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🌐 HTTP Error Response:', errorText);
        console.error('🌐 HTTP Error Response Length:', errorText.length);
        console.error('🌐 HTTP Error Response Details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('🌐 HTTP Response Data:', data);
      return data;
    } catch (error) {
      console.error('🌐 HTTP Request Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async googleLogin(idToken: string) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async verifyEmail(token: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail() {
    return this.request('/auth/resend-verification', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateUserProfile(userData: Partial<User>) {
    console.log('🔧 API Service - updateUserProfile called with:', userData);
    console.log('🔧 API Service - request body:', JSON.stringify(userData, null, 2));
    
    try {
      const response = await this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      
      console.log('🔧 API Service - response received:', response);
      return response;
    } catch (error) {
      console.error('🔧 API Service - updateUserProfile error:', error);
      console.error('🔧 API Service - error details:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Events methods
  async getEvents(filters?: FilterOptions, page: number = 1, limit: number = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.priceRange.length > 0) {
        filters.priceRange.forEach(price => params.append('priceRange', price));
      }
      if (filters.distance) params.append('distance', filters.distance.toString());
      if (filters.eventTypes.length > 0) {
        filters.eventTypes.forEach(type => params.append('eventTypes', type));
      }
      if (filters.vibe && filters.vibe.length > 0) {
        filters.vibe.forEach(vibe => params.append('vibe', vibe));
      }
    }

    return this.request(`/events?${params.toString()}`);
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`);
  }

  async saveEvent(eventId: string) {
    console.log('🔍 ApiService: Saving event:', eventId);
    console.log('🔍 ApiService: Current token:', this.token ? 'Present' : 'Missing');
    
    const response = await this.request(`/events/${eventId}/save`, {
      method: 'POST',
    });
    
    console.log('🔍 ApiService: Save response:', response);
    return response;
  }

  async unsaveEvent(eventId: string) {
    console.log('🔍 ApiService: Unsaving event:', eventId);
    console.log('🔍 ApiService: Current token:', this.token ? 'Present' : 'Missing');
    
    const response = await this.request(`/events/${eventId}/save`, {
      method: 'POST',
    });
    
    console.log('🔍 ApiService: Unsave response:', response);
    return response;
  }

  async getSavedEvents() {
    return this.request('/users/saved-events');
  }

  // Venues methods
  async getVenues() {
    return this.request('/venues');
  }

  async getVenue(id: string) {
    return this.request(`/venues/${id}`);
  }

  async getVenueEvents(venueId: string) {
    return this.request(`/venues/${venueId}/events`);
  }

  // Analytics methods
  async trackEventView(eventId: string, eventTitle: string) {
    return this.request('/analytics/event-view', {
      method: 'POST',
      body: JSON.stringify({ eventId, eventTitle }),
    });
  }

  async trackEventSave(eventId: string, eventTitle: string, isSaving: boolean) {
    return this.request('/analytics/event-save', {
      method: 'POST',
      body: JSON.stringify({ eventId, eventTitle, isSaving }),
    });
  }

  // Payment methods
  async createSubscription(tier: string, paymentMethodId: string) {
    return this.request('/payments/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ tier, paymentMethodId }),
    });
  }

  // Notification methods
  async updateNotificationSettings(settings: any) {
    return this.request('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // User preferences methods
  async updatePreferences(preferences: any) {
    console.log('🔧 API Service - updatePreferences called with:', preferences);
    console.log('🔧 API Service - request body:', JSON.stringify(preferences, null, 2));
    
    try {
      const response = await this.request('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      
      console.log('🔧 API Service - updatePreferences response received:', response);
      return response;
    } catch (error) {
      console.error('🔧 API Service - updatePreferences error:', error);
      console.error('🔧 API Service - error details:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Friends activity
  async getFriendsActivity() {
    return this.request('/users/friends-activity');
  }

  // Ticket purchase methods
  async purchaseTickets(eventId: string, quantity: number, purchaseMethod: 'venue' | 'platform', paymentMethodId?: string) {
    return this.request(`/events/${eventId}/purchase-tickets`, {
      method: 'POST',
      body: JSON.stringify({ 
        quantity, 
        purchaseMethod, 
        ...(paymentMethodId && { paymentMethodId })
      }),
    });
  }

  async getTicketPurchaseStatus(eventId: string) {
    return this.request(`/events/${eventId}/ticket-status`);
  }

  async getTicketAvailability(eventId: string) {
    return this.request(`/events/${eventId}/availability`);
  }

  // Calendar sync methods
  async syncEventToCalendar(eventId: string) {
    return this.request(`/events/${eventId}/calendar-sync`, {
      method: 'POST',
    });
  }

  async removeEventFromCalendar(eventId: string) {
    return this.request(`/events/${eventId}/calendar-sync`, {
      method: 'DELETE',
    });
  }

  async getCalendarSyncStatus(eventId: string) {
    return this.request(`/events/${eventId}/calendar-sync`);
  }

  async getSyncedEvents() {
    return this.request('/events/calendar-synced');
  }
}

export const apiService = new ApiService(); 