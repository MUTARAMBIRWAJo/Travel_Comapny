import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Default fallback data for when CMS tables don't exist
const DEFAULT_SETTINGS = {
  brand_name: {
    en: "We-Of-You Travel Company",
    rw: "We-Of-You Travel Company",
    fr: "We-Of-You Travel Company"
  },
  tagline: {
    en: "Your Trusted Travel Partner from Rwanda to the World",
    rw: "Umufatanyabikorwa Wizewe mu Rugendo",
    fr: "Votre partenaire de voyage de confiance"
  },
  phone: {
    en: "+250 XXX XXX XXX",
    rw: "+250 XXX XXX XXX",
    fr: "+250 XXX XXX XXX"
  },
  email: {
    en: "info@weofyou.com",
    rw: "info@weofyou.com",
    fr: "info@weofyou.com"
  },
  address: {
    en: "Kigali, Rwanda",
    rw: "Kigali, Rwanda",
    fr: "Kigali, Rwanda"
  }
};

// Helper to fetch global settings
export async function getGlobalSettings() {
  try {
    if (!supabase) {
      console.log('[v0] Supabase not configured (getGlobalSettings), using fallback defaults');
      return DEFAULT_SETTINGS;
    }

    const { data, error } = await supabase
      .from('cms_global_settings')
      .select('*')
      .single();

    if (error) {
      // Silently handle errors (missing tables or columns)
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table') || error?.message?.includes('does not exist')) {
        console.log('[v0] Settings data not available, using fallback defaults');
      } else if (error?.code === 'PGRST116') {
        // No rows returned - use defaults
        return DEFAULT_SETTINGS;
      } else {
        console.warn('[v0] Error fetching settings:', error);
      }
      return DEFAULT_SETTINGS;
    }

    return data || DEFAULT_SETTINGS;
  } catch (err) {
    // Silently handle fetch errors
    console.log('[v0] Using default settings (database not initialized)');
    return DEFAULT_SETTINGS;
  }
}

// Helper to fetch a page with sections
export async function getPageWithSections(pageKey: string) {
  try {
    if (!supabase) {
      console.log('[v0] Supabase not configured (getPageWithSections)');
      return null;
    }

    const { data: pageData, error: pageError } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('page_key', pageKey)
      .maybeSingle();

    if (pageError || !pageData) {
      console.warn(`[v0] Page ${pageKey} not found, returning null`);
      return null;
    }

    const { data: sections, error: sectionsError } = await supabase
      .from('cms_page_sections')
      .select('*')
      .eq('page_id', pageData.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (sectionsError) {
      console.warn('[v0] Error fetching sections:', sectionsError);
      return pageData;
    }

    return { ...pageData, sections: sections || [] };
  } catch (err) {
    console.warn('[v0] Error fetching page:', err);
    return null;
  }
}

// Default services for when CMS is not available
const DEFAULT_SERVICES = [
  {
    id: '1',
    title_en: 'Visa Assistance',
    short_description_en: 'Expert guidance for visa applications to any country',
    slug: 'visa-assistance'
  },
  {
    id: '2',
    title_en: 'Flight Booking',
    short_description_en: 'Find and book the best flight routes from Kigali',
    slug: 'flight-booking'
  },
  {
    id: '3',
    title_en: 'Corporate Travel',
    short_description_en: 'Complete business travel solutions for organizations',
    slug: 'corporate-travel'
  },
  {
    id: '4',
    title_en: 'Travel Packages',
    short_description_en: 'Customized travel packages for groups and families',
    slug: 'travel-packages'
  }
];

// Helper to fetch all services
export async function getServices() {
  try {
    if (!supabase) {
      console.log('[v0] Supabase not configured (getServices), using fallback defaults');
      return DEFAULT_SERVICES;
    }

    // Try cms_services first, fall back to services or defaults
    try {
      const { data: cmsData, error: cmsError } = await supabase
        .from('cms_services')
        .select('*')
        .eq('status', 'active')
        .order('order_index', { ascending: true });

      if (!cmsError && cmsData && cmsData.length > 0) {
        return cmsData;
      }
    } catch (e) {
      // ignore and fall through
    }

    try {
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'active')
        .order('order_index', { ascending: true });

      if (!servicesError && servicesData && servicesData.length > 0) {
        return servicesData;
      }
    } catch (e) {
      // ignore and fall through
    }

    return DEFAULT_SERVICES;
  } catch (err) {
    // Silently handle fetch errors
    console.log('[v0] Using default services (database not initialized)');
    return DEFAULT_SERVICES;
  }
}

// Default destinations
const DEFAULT_DESTINATIONS = [
  {
    id: '1',
    name_en: 'France',
    visa_info_en: 'Schengen visa required',
    flight_routes: 'Via Brussels or Paris',
    status: 'active'
  },
  {
    id: '2',
    name_en: 'Turkey',
    visa_info_en: 'E-visa available',
    flight_routes: 'Via Istanbul',
    status: 'active'
  }
];

// Helper to fetch all destinations
export async function getDestinations() {
  try {
    if (!supabase) {
      console.log('[v0] Supabase not configured (getDestinations), using fallback defaults');
      return DEFAULT_DESTINATIONS;
    }

    const { data, error } = await supabase
      .from('cms_destinations')
      .select('*')
      .eq('status', 'active')
      .order('order_index', { ascending: true });

    if (error) {
      // Silently handle errors (missing tables or columns)
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table') || error?.message?.includes('does not exist')) {
        console.log('[v0] Destinations data not available, using fallback defaults');
      } else if (error) {
        console.warn('[v0] Error fetching destinations:', error);
      }
      return DEFAULT_DESTINATIONS;
    }

    return data && data.length > 0 ? data : DEFAULT_DESTINATIONS;
  } catch (err) {
    // Silently handle fetch errors
    console.log('[v0] Using default destinations (database not initialized)');
    return DEFAULT_DESTINATIONS;
  }
}

// Default testimonials
const DEFAULT_TESTIMONIALS = [
  {
    id: '1',
    customer_name: 'Jean Paul M.',
    customer_location: 'Kigali',
    message_en: 'The visa process was well explained and stress-free. I felt supported from start to finish.',
    is_featured: true
  },
  {
    id: '2',
    customer_name: 'Aline U.',
    customer_location: 'Kampala',
    message_en: 'They handled our company travel professionally and respected our budget.',
    is_featured: true
  }
];

// Helper to fetch featured testimonials
export async function getTestimonials(featured = false) {
  try {
    if (!supabase) {
      console.log('[v0] Supabase not configured (getTestimonials), using fallback defaults');
      return featured ? DEFAULT_TESTIMONIALS.filter(t => t.is_featured) : DEFAULT_TESTIMONIALS;
    }

    let query = supabase
      .from('cms_testimonials')
      .select('*')
      .eq('status', 'active');

    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    if (error) {
      // Silently handle errors (missing tables or columns)
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table') || error?.message?.includes('does not exist')) {
        console.log('[v0] Testimonials data not available, using fallback defaults');
      } else if (error) {
        console.warn('[v0] Error fetching testimonials:', error);
      }
      return featured ? DEFAULT_TESTIMONIALS.filter(t => t.is_featured) : DEFAULT_TESTIMONIALS;
    }

    return data && data.length > 0 ? data : (featured ? DEFAULT_TESTIMONIALS.filter(t => t.is_featured) : DEFAULT_TESTIMONIALS);
  } catch (err) {
    // Silently handle fetch errors
    console.log('[v0] Using default testimonials (database not initialized)');
    return featured ? DEFAULT_TESTIMONIALS.filter(t => t.is_featured) : DEFAULT_TESTIMONIALS;
  }
}

// Default packages
const DEFAULT_PACKAGES = [
  {
    id: '1',
    title_en: 'Dubai Holiday',
    duration: '5 Days',
    price_usd: 2500,
    price_rwf: 3250000,
    status: 'active'
  },
  {
    id: '2',
    title_en: 'European Cities',
    duration: '10 Days',
    price_usd: 5000,
    price_rwf: 6500000,
    status: 'active'
  }
];

// Helper to fetch all packages
export async function getPackages() {
  try {
    if (!supabase) {
      console.log('[v0] Supabase not configured (getPackages), using fallback defaults');
      return DEFAULT_PACKAGES;
    }

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('status', 'active')
      .order('order_index', { ascending: true });

    if (error) {
      // Silently handle errors (missing tables or columns)
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table') || error?.message?.includes('does not exist')) {
        console.log('[v0] Packages data not available, using fallback defaults');
      } else if (error) {
        console.warn('[v0] Error fetching packages:', error);
      }
      return DEFAULT_PACKAGES;
    }

    return data && data.length > 0 ? data : DEFAULT_PACKAGES;
  } catch (err) {
    // Silently handle fetch errors when tables or columns don't exist
    if (err instanceof Error && (err.message.includes('Could not find the table') || err.message.includes('does not exist'))) {
      console.log('[v0] Packages data not available, using fallback defaults');
    } else {
      console.log('[v0] Using default packages (database not initialized)');
    }
    return DEFAULT_PACKAGES;
  }
}

// Helper to fetch FAQs by category
export async function getFAQs(category?: string) {
  try {
    if (!supabase) {
      console.log('[v0] Supabase not configured (getFAQs), using fallback defaults');
      return [];
    }

    let query = supabase
      .from('cms_faqs')
      .select('*')
      .eq('status', 'active');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    if (error) {
      // Silently handle errors (missing tables or columns)
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table') || error?.message?.includes('does not exist')) {
        console.log('[v0] FAQs data not available, using fallback defaults');
      } else {
        console.warn('[v0] Error fetching FAQs:', error);
      }
      return [];
    }

    return data || [];
  } catch (err) {
    // Silently handle fetch errors
    console.log('[v0] Using default FAQs (database not initialized)');
    return [];
  }
}

// Currency conversion helper
export const EXCHANGE_RATES: Record<string, number> = {
  'USD': 1,
  'RWF': 1300,
  'EUR': 0.95,
  'GBP': 0.85,
  'KES': 135,
  'UGX': 4200,
  'ZAR': 18.5,
  'TZS': 2650
};

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;

  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'RWF': 'FRw',
    'EUR': '€',
    'GBP': '£',
    'KES': 'KSh',
    'UGX': 'USh',
    'ZAR': 'R',
    'TZS': 'TSh'
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
