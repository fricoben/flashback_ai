/**
 * TikTok Pixel Tracking Service
 * 
 * Provides typed methods for tracking events with the TikTok Ads pixel.
 * Handles cases where ttq might not be available (SSR, ad blockers, etc.)
 */

// Extend Window interface for TikTok Pixel
declare global {
  interface Window {
    ttq?: {
      identify: (data: TikTokIdentifyData) => void;
      track: (event: string, data?: TikTokEventData) => void;
      page: () => void;
    };
  }
}

// Types for TikTok events
interface TikTokIdentifyData {
  email?: string; // SHA-256 hashed
  phone_number?: string; // SHA-256 hashed
  external_id?: string; // SHA-256 hashed
}

interface TikTokContent {
  content_id: string;
  content_type: "product" | "product_group";
  content_name: string;
}

interface TikTokEventData {
  contents?: TikTokContent[];
  value?: number;
  currency?: string;
}

// Product definitions for our app
export const PRODUCTS = {
  single: {
    content_id: "flashback_single",
    content_type: "product" as const,
    content_name: "Flashback Single Film",
    value: 19.99,
    currency: "USD",
  },
  pack: {
    content_id: "flashback_pack_3",
    content_type: "product" as const,
    content_name: "Flashback 3 Films Pack",
    value: 29.99,
    currency: "USD",
  },
};

export type ProductPlan = keyof typeof PRODUCTS;

/**
 * TikTok Pixel Tracking Service
 */
class TikTokTracker {
  private get ttq() {
    if (typeof window !== "undefined" && window.ttq) {
      return window.ttq;
    }
    return null;
  }

  /**
   * Hash a string using SHA-256 (required for PII data)
   */
  async hashSHA256(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(value.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Identify user with PII data (must be hashed)
   */
  async identify(data: {
    email?: string;
    phone?: string;
    externalId?: string;
  }) {
    const ttq = this.ttq;
    if (!ttq) return;

    const identifyData: TikTokIdentifyData = {};

    if (data.email) {
      identifyData.email = await this.hashSHA256(data.email);
    }
    if (data.phone) {
      identifyData.phone_number = await this.hashSHA256(data.phone);
    }
    if (data.externalId) {
      identifyData.external_id = await this.hashSHA256(data.externalId);
    }

    ttq.identify(identifyData);
  }

  /**
   * Track ViewContent event - when user views a product page
   */
  trackViewContent(plan: ProductPlan) {
    const ttq = this.ttq;
    if (!ttq) return;

    const product = PRODUCTS[plan];

    ttq.track("ViewContent", {
      contents: [
        {
          content_id: product.content_id,
          content_type: product.content_type,
          content_name: product.content_name,
        },
      ],
      value: product.value,
      currency: product.currency,
    });
  }

  /**
   * Track InitiateCheckout event - when user clicks checkout button
   */
  trackInitiateCheckout(plan: ProductPlan) {
    const ttq = this.ttq;
    if (!ttq) return;

    const product = PRODUCTS[plan];

    ttq.track("InitiateCheckout", {
      contents: [
        {
          content_id: product.content_id,
          content_type: product.content_type,
          content_name: product.content_name,
        },
      ],
      value: product.value,
      currency: product.currency,
    });
  }

  /**
   * Track Purchase event - when payment is confirmed
   */
  trackPurchase(plan: ProductPlan, value?: number) {
    const ttq = this.ttq;
    if (!ttq) return;

    const product = PRODUCTS[plan];

    ttq.track("Purchase", {
      contents: [
        {
          content_id: product.content_id,
          content_type: product.content_type,
          content_name: product.content_name,
        },
      ],
      value: value ?? product.value,
      currency: product.currency,
    });
  }
}

// Export singleton instance
export const tiktok = new TikTokTracker();
