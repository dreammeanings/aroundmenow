import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripe: Stripe | null = null;

const initializeStripe = async () => {
  if (!stripe) {
    stripe = await loadStripe('pk_test_your_stripe_publishable_key_here');
  }
  return stripe;
};

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
}

export interface TicketPurchase {
  eventId: string;
  quantity: number;
  totalAmount: number;
  commission: number;
}

class PaymentService {
  private stripe: Stripe | null = null;
  private API_BASE_URL = 'http://localhost:3000/api';

  async initialize() {
    try {
      this.stripe = await initializeStripe();
      console.log('Stripe initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      return false;
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Get available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/payments/plans`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      
      const data = await response.json();
      return data.plans;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      // Return mock plans as fallback
      return [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          features: ['2 events/month', 'Basic listing'],
          description: 'Perfect for getting started'
        },
        {
          id: 'lite',
          name: 'Lite',
          price: 19,
          features: ['Unlimited events', 'Calendar sync', '3 images', 'Website links'],
          description: 'Great for growing venues'
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 49,
          features: ['Everything in Lite', 'Ticket links', 'Featured listings', 'Analytics'],
          description: 'Perfect for established venues'
        },
        {
          id: 'elite',
          name: 'Elite',
          price: 99,
          features: ['Everything in Pro', 'Push notifications', 'RSVPs', 'Front-page boosts'],
          description: 'For venues serious about growth'
        }
      ];
    }
  }

  // Create a subscription
  async createSubscription(tier: string, paymentMethodId: string): Promise<any> {
    try {
      if (!this.stripe) {
        await this.initialize();
      }

      const response = await fetch(`${this.API_BASE_URL}/payments/create-subscription`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          tier,
          paymentMethodId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Purchase a ticket
  async purchaseTicket(eventId: string, quantity: number, paymentMethodId: string): Promise<any> {
    try {
      if (!this.stripe) {
        await this.initialize();
      }

      const response = await fetch(`${this.API_BASE_URL}/payments/purchase-ticket`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          eventId,
          quantity,
          paymentMethodId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to purchase ticket');
      }

      return await response.json();
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      throw error;
    }
  }

  // Get current subscription
  async getCurrentSubscription(): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/payments/subscriptions`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      return data.subscription;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  // Cancel subscription
  async cancelSubscription(): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/payments/cancel-subscription`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Create payment method from card details
  async createPaymentMethod(cardElement: any): Promise<PaymentMethod> {
    try {
      if (!this.stripe) {
        await this.initialize();
      }

      const { paymentMethod, error } = await this.stripe!.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentMethod;
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  }

  // Confirm payment intent
  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<any> {
    try {
      if (!this.stripe) {
        await this.initialize();
      }

      const { paymentIntent, error } = await this.stripe!.confirmCardPayment(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Format price for display
  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  }

  // Get payment method display name
  getPaymentMethodDisplayName(paymentMethod: PaymentMethod): string {
    if (paymentMethod.card) {
      return `${paymentMethod.card.brand.toUpperCase()} •••• ${paymentMethod.card.last4}`;
    }
    return paymentMethod.type;
  }

  // Validate card details
  validateCard(cardNumber: string, expMonth: string, expYear: string, cvc: string): boolean {
    const cardNumberRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
    const expMonthRegex = /^(0[1-9]|1[0-2])$/;
    const expYearRegex = /^\d{4}$/;
    const cvcRegex = /^\d{3,4}$/;

    return (
      cardNumberRegex.test(cardNumber) &&
      expMonthRegex.test(expMonth) &&
      expYearRegex.test(expYear) &&
      cvcRegex.test(cvc)
    );
  }

  // Demo mode helpers
  async createDemoSubscription(tier: string): Promise<any> {
    console.log('Creating demo subscription for tier:', tier);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      subscription: {
        id: 'sub_demo_123',
        status: 'active',
        tier,
        created: new Date().toISOString()
      },
      message: `Demo subscription created for ${tier} tier`
    };
  }

  async purchaseDemoTicket(eventId: string, quantity: number): Promise<any> {
    console.log('Purchasing demo ticket:', { eventId, quantity });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      paymentIntent: {
        id: 'pi_demo_123',
        status: 'succeeded',
        amount: 2500, // $25.00
        currency: 'usd'
      },
      message: 'Demo ticket purchased successfully!'
    };
  }
}

export const paymentService = new PaymentService(); 