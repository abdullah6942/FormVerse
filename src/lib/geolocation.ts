import type { UserLocation } from '@/types';

/**
 * IP Geolocation Service
 * Detects user location via IP address using ipgeolocation.io
 */

interface IPGeolocationResponse {
  country_name: string;
  country_code2: string;
  city: string;
  state_prov: string;
  latitude: string;
  longitude: string;
  time_zone: {
    name: string;
  };
  currency: {
    code: string;
  };
  languages: string;
}

/**
 * Get user location from IP address
 */
export async function getUserLocation(ip?: string): Promise<UserLocation> {
  try {
    const apiKey = process.env.IPGEOLOCATION_API_KEY;
    
    if (!apiKey) {
      console.warn('IPGEOLOCATION_API_KEY not found, using fallback location');
      throw new Error('No API key');
    }
    
    // Use ipgeolocation.io API
    const url = ip 
      ? `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`
      : `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;
    
    console.log('[Geolocation] Calling API:', url.replace(apiKey, 'REDACTED'));
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Geolocation] API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data: IPGeolocationResponse = await response.json();
    console.log('[Geolocation] Success:', data.country_name, data.city);
    
    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code2 || 'XX',
      city: data.city || 'Unknown',
      region: data.state_prov || 'Unknown',
      latitude: parseFloat(data.latitude) || 0,
      longitude: parseFloat(data.longitude) || 0,
      timezone: data.time_zone?.name || 'UTC',
      currency: data.currency?.code,
      languages: data.languages ? data.languages.split(',').map(l => l.trim()) : undefined,
      isOverridden: false,
    };
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    
    // Return default location
    return {
      country: 'United States',
      countryCode: 'US',
      city: 'San Francisco',
      region: 'California',
      latitude: 37.7749,
      longitude: -122.4194,
      timezone: 'America/Los_Angeles',
      isOverridden: false,
    };
  }
}

/**
 * Get location context string for agent
 */
export function getLocationContext(location: UserLocation): string {
  const parts = [
    `Country: ${location.country} (${location.countryCode})`,
    `City: ${location.city}, ${location.region}`,
    `Timezone: ${location.timezone}`,
  ];
  
  if (location.currency) {
    parts.push(`Currency: ${location.currency}`);
  }
  
  if (location.languages && location.languages.length > 0) {
    parts.push(`Languages: ${location.languages.join(', ')}`);
  }
  
  if (location.isOverridden) {
    parts.push('(User-specified location)');
  }
  
  return parts.join('\n');
}

/**
 * Get regional context for research
 */
export function getRegionalContext(location: UserLocation): string {
  const contexts: Record<string, string> = {
    US: 'Consider US market dynamics, federal/state regulations, and North American business practices.',
    GB: 'Consider UK/European market context, GDPR, FCA regulations, and British business practices.',
    DE: 'Consider German/EU market context, GDPR, strict data protection laws, and European business practices.',
    FR: 'Consider French/EU market context, French labor laws, GDPR, and European business standards.',
    IN: 'Consider Indian market dynamics, RBI regulations, GST, and South Asian business context.',
    CN: 'Consider Chinese market regulations, payment ecosystems (Alipay, WeChat Pay), and Asian business practices.',
    JP: 'Consider Japanese market context, strict quality standards, and East Asian business practices.',
    AU: 'Consider Australian market regulations, ACCC guidelines, and Asia-Pacific business context.',
    CA: 'Consider Canadian market dynamics, bilingual considerations, and North American business practices.',
    SG: 'Consider Singapore as a financial hub, ASEAN market access, and Southeast Asian business context.',
  };
  
  return contexts[location.countryCode] || 
    `Consider local market dynamics, regulations, and business practices in ${location.country}.`;
}
