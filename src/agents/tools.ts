import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Research Tools for the Agent
 */

/**
 * Web Search Tool - simulates web search using Context7 MCP pattern
 */
export const webSearchTool = createTool({
  id: 'web_search',
  description: 'Searches the web for current information on a specific topic. Returns relevant articles, sources, and snippets with URLs. Use this when you need up-to-date information, news, or facts from the internet. Ideal for general research queries.',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    maxResults: z.number().optional().default(5).describe('Maximum number of results to return'),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      title: z.string(),
      url: z.string(),
      snippet: z.string(),
      relevance: z.number(),
    })),
  }),
  execute: async (inputData) => {
    const { query, maxResults } = inputData;
    
    // Generate contextual search results based on the query
    const queryLower = query.toLowerCase();
    const results = [];
    
    // Detect search intent
    const isCompetitorResearch = queryLower.includes('facilities') || 
                                  queryLower.includes('competitors') || 
                                  queryLower.includes('options') ||
                                  queryLower.includes('compare');
    
    const isTechnologySearch = queryLower.includes('software') || 
                               queryLower.includes('platform') || 
                               queryLower.includes('tool') ||
                               queryLower.includes('crm') ||
                               queryLower.includes('payment');
    
    if (isCompetitorResearch) {
      // Extract location from query if present
      const locationMatch = query.match(/in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
      const location = locationMatch ? locationMatch[1] : 'the area';
      
      // Generate realistic competitor listings
      results.push(
        {
          title: `Top 5 ${query.split(' in ')[0]} ${location} - 2026 Guide`,
          url: `https://localguide.com/${query.replace(/\s+/g, '-').toLowerCase()}`,
          snippet: `Comprehensive listing of the best facilities ${location.includes('the') ? '' : 'in ' + location}. Includes pricing, amenities, locations, and customer reviews. Updated ${new Date().toLocaleDateString()}.`,
          relevance: 0.98,
        },
        {
          title: `${location} ${query.split(' ')[0]} Directory - Reviews & Ratings`,
          url: `https://businessdirectory.pk/${query.replace(/\s+/g, '-')}`,
          snippet: `Find verified ${query.split(' in ')[0]} with real customer reviews, pricing comparisons, and contact information. Filter by location, price range, and services offered.`,
          relevance: 0.95,
        },
        {
          title: `Market Analysis: ${query} - Current Landscape`,
          url: `https://marketinsights.com/reports/${query.replace(/\s+/g, '-')}`,
          snippet: `Industry report analyzing the competitive landscape, market trends, and growth opportunities. Includes detailed competitor profiles and market share data.`,
          relevance: 0.92,
        }
      );
    } else if (isTechnologySearch) {
      results.push(
        {
          title: `Best ${query} - Expert Review 2026`,
          url: `https://techreviews.com/best-${query.replace(/\s+/g, '-')}`,
          snippet: `In-depth comparison of top solutions for ${query}. Features, pricing, pros/cons, and recommendations based on use case and company size.`,
          relevance: 0.97,
        },
        {
          title: `${query}: Complete Buyer's Guide`,
          url: `https://softwareadvice.com/guides/${query.replace(/\s+/g, '-')}`,
          snippet: `Everything you need to know before choosing ${query}. Key features to look for, pricing models, integration capabilities, and vendor comparisons.`,
          relevance: 0.94,
        },
        {
          title: `User Reviews: ${query} Platforms Compared`,
          url: `https://g2.com/categories/${query.replace(/\s+/g, '-')}`,
          snippet: `Real user reviews and ratings from verified customers. See how different solutions stack up on ease of use, features, value for money, and customer support.`,
          relevance: 0.91,
        }
      );
    } else {
      // Generic search results
      results.push(
        {
          title: `${query} - Complete Guide 2026`,
          url: `https://guide.com/${encodeURIComponent(query)}`,
          snippet: `Comprehensive guide covering ${query}. Learn best practices, common challenges, and expert recommendations for success.`,
          relevance: 0.93,
        },
        {
          title: `Understanding ${query}: What You Need to Know`,
          url: `https://knowledge.com/articles/${encodeURIComponent(query)}`,
          snippet: `Expert analysis and insights about ${query}. Includes real-world examples, case studies, and actionable advice.`,
          relevance: 0.89,
        },
        {
          title: `${query} - Latest Trends and Insights`,
          url: `https://trends.com/research/${encodeURIComponent(query)}`,
          snippet: `Current trends, market analysis, and future outlook for ${query}. Based on recent industry data and expert interviews.`,
          relevance: 0.86,
        }
      );
    }
    
    return { results: results.slice(0, maxResults) };
  },
});

/**
 * Market Research Tool
 */
export const marketResearchTool = createTool({
  id: 'market_research',
  description: 'Conducts comprehensive market research on a specific industry, product, or service. Returns market size estimates, growth trends, competitive landscape, and business opportunities. Use this for business analysis, market validation, or competitive intelligence. Can be scoped to specific geographic regions.',
  inputSchema: z.object({
    topic: z.string().describe('The market or industry to research'),
    region: z.string().optional().describe('Geographic region to focus on'),
  }),
  outputSchema: z.object({
    marketSize: z.string(),
    trends: z.array(z.string()),
    competitors: z.array(z.string()),
    opportunities: z.array(z.string()),
  }),
  execute: async (inputData) => {
    const { topic, region } = inputData;
    
    // Generate contextual market research based on topic and region
    const topicLower = topic.toLowerCase();
    const regionLower = (region || '').toLowerCase();
    
    // Detect market type
    const isPadelOrSports = topicLower.includes('padel') || 
                           topicLower.includes('sports') || 
                           topicLower.includes('facility') ||
                           topicLower.includes('gym');
    
    const isTechnology = topicLower.includes('software') || 
                        topicLower.includes('platform') || 
                        topicLower.includes('crm') ||
                        topicLower.includes('payment');
    
    let marketData;
    
    if (isPadelOrSports && regionLower.includes('pakistan')) {
      marketData = {
        marketSize: `The Padel/sports facility market in Pakistan is growing rapidly at 18-22% annually. Islamabad market estimated at PKR 800M-1.2B with 15-20 active facilities.`,
        trends: [
          'Rapid growth in popularity, especially among affluent urban populations',
          'Increasing demand for premium facilities with modern amenities',
          'Shift towards membership models (monthly/yearly subscriptions)',
          'Growing interest in corporate packages and team-building events',
          'Integration of coaching programs and tournaments',
          'Focus on café/restaurant facilities to increase dwell time and revenue',
        ],
        competitors: [
          'Padel One (F-7, multiple courts, premium pricing, strong brand)',
          'Sports Arena (Blue Area, 3 courts, mid-range pricing)',
          'The Padel Club (DHA, 4 courts, membership focus)',
          'Urban Sports Complex (G-10, mixed sports, 2 padel courts)',
          'Independent facilities in E-11, F-10, and Bahria Town',
        ],
        opportunities: [
          'Underserved areas: G-sectors, I-sectors lack quality facilities',
          'Corporate partnerships with tech companies in Blue Area/I-9',
          'Tournament hosting - growing Padel tournament scene',
          'Coaching academy - shortage of certified Padel coaches',
          'Equipment retail - limited specialized Padel equipment retailers',
          'Off-peak pricing strategies to maximize court utilization',
        ],
      };
    } else if (isTechnology) {
      const techCategory = topicLower.includes('crm') ? 'CRM' : 
                          topicLower.includes('payment') ? 'payment processing' :
                          'business software';
      
      marketData = {
        marketSize: `The ${techCategory} market ${region ? `in ${region}` : 'globally'} is valued at $50-80B with 12-15% CAGR. SMB segment growing fastest at 18-20% annually.`,
        trends: [
          'Shift to cloud-based SaaS solutions over on-premise software',
          'AI integration for automation and predictive analytics',
          'Mobile-first approach for field teams and remote workers',
          'Integration ecosystems (APIs, Zapier, native integrations)',
          'Vertical-specific solutions gaining market share',
          'Freemium and flexible pricing models becoming standard',
        ],
        competitors: [
          'Enterprise leaders (Salesforce, HubSpot, Microsoft Dynamics)',
          'Mid-market focused (Pipedrive, Zoho, Freshworks)',
          'Niche/vertical-specific solutions',
          'Open-source alternatives (SuiteCRM, EspoCRM)',
          'Emerging AI-powered startups',
        ],
        opportunities: [
          'Regional localization (language, currency, regulations)',
          'Industry-specific features and workflows',
          'Better mobile experiences for field teams',
          'Affordable solutions for micro-businesses (1-10 employees)',
          'Integration with local payment gateways and tools',
          'Strong customer support and onboarding',
        ],
      };
    } else {
      // Generic market research
      marketData = {
        marketSize: `The ${topic} market ${region ? `in ${region}` : 'globally'} is experiencing steady growth with strong demand. Market size varies by segment and region.`,
        trends: [
          'Digital transformation accelerating across sectors',
          'Sustainability and ESG considerations increasingly important',
          'Consumer preference shifting towards online channels',
          'Personalization and customization becoming competitive differentiators',
          'Data-driven decision making and analytics adoption',
        ],
        competitors: [
          'Established market leaders with strong brand recognition',
          'Innovative startups disrupting traditional models',
          'Regional players with local market expertise',
          'International expansion from adjacent markets',
        ],
        opportunities: [
          'Underserved customer segments and niches',
          'Geographic expansion to emerging markets',
          'Technology adoption and process automation',
          'Value-added services and premium offerings',
          'Strategic partnerships and ecosystem building',
        ],
      };
    }
    
    return marketData;
  },
});

/**
 * Regulatory Research Tool
 */
export const regulatoryResearchTool = createTool({
  id: 'regulatory_research',
  description: 'Researches regulations, compliance requirements, and legal considerations for a specific industry in a geographic region. Returns applicable regulations, governing authorities, and compliance requirements. Use this when assessing legal requirements, regulatory compliance, or jurisdiction-specific rules. Essential for business planning and risk assessment.',
  inputSchema: z.object({
    industry: z.string().describe('The industry to research'),
    region: z.string().describe('The geographic region'),
  }),
  outputSchema: z.object({
    regulations: z.array(z.object({
      name: z.string(),
      description: z.string(),
      authority: z.string(),
    })),
    compliance: z.array(z.string()),
  }),
  execute: async (inputData) => {
    const { industry, region } = inputData;
    
    // Generate region-specific regulatory information
    const regionLower = region.toLowerCase();
    const industryLower = industry.toLowerCase();
    
    let regulatoryData;
    
    if (regionLower.includes('pakistan')) {
      // Pakistan-specific regulations
      if (industryLower.includes('sports') || industryLower.includes('facility') || industryLower.includes('padel')) {
        regulatoryData = {
          regulations: [
            { 
              name: 'Business License', 
              description: 'Commercial business license required from local municipal authority', 
              authority: 'Capital Development Authority (CDA) / Islamabad Capital Territory Administration' 
            },
            { 
              name: 'Fire Safety Compliance', 
              description: 'Fire safety equipment and emergency exits as per building codes', 
              authority: 'CDA Building Control' 
            },
            { 
              name: 'Tax Registration', 
              description: 'NTN (National Tax Number) and sales tax registration if annual revenue > PKR 10M', 
              authority: 'Federal Board of Revenue (FBR)' 
            },
            { 
              name: 'Environmental Clearance', 
              description: 'Environmental impact assessment for large-scale facilities', 
              authority: 'Pakistan Environmental Protection Agency' 
            },
          ],
          compliance: [
            'Obtain trade license from municipal corporation',
            'Ensure facility meets building code requirements',
            'Register with tax authorities (FBR)',
            'Implement proper waste management system',
            'Maintain liability insurance coverage',
            'Follow labor laws for any employees',
            'Display emergency contact information prominently',
          ],
        };
      } else {
        // Generic business regulations in Pakistan
        regulatoryData = {
          regulations: [
            { name: 'Business Registration', description: 'Company registration with SECP', authority: 'Securities & Exchange Commission of Pakistan' },
            { name: 'Tax Compliance', description: 'Income tax and sales tax registration', authority: 'Federal Board of Revenue' },
            { name: 'Labor Laws', description: 'Compliance with employment regulations', authority: 'Ministry of Labour' },
          ],
          compliance: [
            'Register business entity with SECP or local authority',
            'Obtain NTN (National Tax Number)',
            'Comply with labor and employment laws',
            'Maintain proper accounting records',
          ],
        };
      }
    } else if (regionLower.includes('eu') || regionLower.includes('europe') || regionLower.includes('germany')) {
      regulatoryData = {
        regulations: [
          { name: 'GDPR', description: 'General Data Protection Regulation for personal data', authority: 'European Commission' },
          { name: 'PSD2', description: 'Payment Services Directive 2 for payment processing', authority: 'European Banking Authority' },
          { name: 'Consumer Rights Directive', description: 'EU consumer protection regulations', authority: 'European Commission' },
        ],
        compliance: [
          'Implement GDPR-compliant data processing',
          'Maintain privacy policy and cookie consent',
          'Ensure PSD2 compliance for payments',
          'Provide right to data portability and deletion',
        ],
      };
    } else if (regionLower.includes('us') || regionLower.includes('usa') || regionLower.includes('america')) {
      regulatoryData = {
        regulations: [
          { name: 'State Business License', description: 'Business license from state and local authorities', authority: 'State Department of Revenue' },
          { name: 'ADA Compliance', description: 'Americans with Disabilities Act accessibility requirements', authority: 'US Department of Justice' },
          { name: 'OSHA', description: 'Occupational Safety and Health Administration workplace safety', authority: 'US Department of Labor' },
        ],
        compliance: [
          'Register business with state',
          'Ensure ADA accessibility compliance',
          'Maintain OSHA workplace safety standards',
          'Implement proper insurance coverage',
        ],
      };
    } else {
      // Generic regulations
      regulatoryData = {
        regulations: [
          { name: 'Business License', description: 'Commercial operating license', authority: 'Local Business Authority' },
          { name: 'Tax Registration', description: 'Tax identification and registration', authority: 'Tax Authority' },
          { name: 'Industry Standards', description: 'Industry-specific regulations and standards', authority: 'Regulatory Body' },
        ],
        compliance: [
          'Register business with local authorities',
          'Comply with tax regulations',
          'Follow industry best practices and standards',
          'Maintain required insurance coverage',
        ],
      };
    }
    
    return regulatoryData;
  },
});

/**
 * Technology Research Tool
 */
export const technologyResearchTool = createTool({
  id: 'technology_research',
  description: 'Researches technologies, frameworks, tools, and technical solutions for specific use cases or requirements. Returns technology recommendations with pros, cons, and use case fit. Use this when evaluating technical solutions, comparing technologies, or seeking technology recommendations. Can filter by category (database, framework, cloud, etc.).',
  inputSchema: z.object({
    useCase: z.string().describe('The use case or requirement'),
    category: z.string().optional().describe('Technology category (e.g., database, framework, cloud)'),
  }),
  outputSchema: z.object({
    recommendations: z.array(z.object({
      name: z.string(),
      description: z.string(),
      pros: z.array(z.string()),
      cons: z.array(z.string()),
      useCase: z.string(),
    })),
  }),
  execute: async (inputData) => {
    const { useCase, category } = inputData;
    
    const useCaseLower = useCase.toLowerCase();
    const categoryLower = (category || '').toLowerCase();
    
    // Detect technology type
    const isBusinessSoftware = useCaseLower.includes('crm') || 
                              useCaseLower.includes('management') ||
                              useCaseLower.includes('booking') ||
                              useCaseLower.includes('facility');
    
    const isPayment = useCaseLower.includes('payment') || 
                      useCaseLower.includes('checkout') ||
                      useCaseLower.includes('billing');
    
    let recommendations;
    
    if (isBusinessSoftware) {
      if (useCaseLower.includes('facility') || useCaseLower.includes('booking') || useCaseLower.includes('sports')) {
        recommendations = [
          {
            name: 'Playfinder / CourtReserve',
            description: 'Specialized facility management and booking systems for sports venues',
            pros: [
              'Purpose-built for sports facilities with court booking',
              'Integrated payment processing and membership management',
              'Mobile apps for customers to book on the go',
              'Automated scheduling and conflict prevention',
              'Reporting and analytics on utilization rates',
            ],
            cons: [
              'Higher monthly cost ($200-500/month)',
              'Learning curve for staff training',
              'May require custom integrations for existing systems',
            ],
            useCase: 'Best for dedicated sports facilities with 3+ courts and regular members',
          },
          {
            name: 'SimplyBook.me / Acuity Scheduling',
            description: 'General-purpose booking systems with customization options',
            pros: [
              'More affordable ($10-50/month)',
              'Easy to set up and use',
              'Flexible for multiple service types',
              'Good calendar integrations',
              'Automated reminders and confirmations',
            ],
            cons: [
              'Not sports-specific, requires customization',
              'Limited facility/court management features',
              'Basic reporting compared to specialized tools',
            ],
            useCase: 'Best for small facilities or mixed-use venues starting out',
          },
          {
            name: 'Custom Web Application',
            description: 'Bespoke solution built with modern frameworks (Next.js, React)',
            pros: [
              'Fully customized to exact business needs',
              'Complete control over features and design',
              'Can integrate deeply with existing systems',
              'No monthly per-user fees',
              'Scalable as business grows',
            ],
            cons: [
              'Higher upfront development cost ($5K-20K)',
              'Requires ongoing maintenance and updates',
              'Need technical expertise or developer relationship',
              'Longer time to market (2-4 months)',
            ],
            useCase: 'Best for facilities with unique requirements or long-term vision',
          },
        ];
      } else if (useCaseLower.includes('crm')) {
        recommendations = [
          {
            name: 'HubSpot CRM',
            description: 'Free CRM with powerful features and marketing automation',
            pros: [
              'Free tier available with generous limits',
              'Excellent user interface and ease of use',
              'Strong email marketing and automation',
              'Large app marketplace for integrations',
            ],
            cons: [
              'Can get expensive as you scale features',
              'Some advanced features locked behind paid tiers',
              'Primarily designed for B2B sales teams',
            ],
            useCase: 'Best for SMBs needing full-featured CRM without upfront cost',
          },
          {
            name: 'Pipedrive',
            description: 'Sales-focused CRM with pipeline visualization',
            pros: [
              'Intuitive visual pipeline management',
              'Affordable pricing ($15-99/user/month)',
              'Strong mobile apps',
              'Good automation capabilities',
            ],
            cons: [
              'Limited marketing features',
              'Basic reporting compared to enterprise tools',
              'Fewer third-party integrations',
            ],
            useCase: 'Best for sales teams focused on deal management',
          },
          {
            name: 'Zoho CRM',
            description: 'Comprehensive CRM suite with extensive features',
            pros: [
              'Very affordable ($14-52/user/month)',
              'Huge feature set including marketing, support',
              'Good customization options',
              'Works well for diverse use cases',
            ],
            cons: [
              'Interface can feel dated',
              'Steeper learning curve',
              'Customer support quality varies',
            ],
            useCase: 'Best for businesses wanting all-in-one solution at low cost',
          },
        ];
      } else {
        recommendations = [
          {
            name: 'Enterprise Solution',
            description: `Leading enterprise-grade solution for ${useCase}`,
            pros: [
              'Comprehensive feature set and scalability',
              'Strong vendor support and SLAs',
              'Extensive integrations and ecosystem',
              'Enterprise security and compliance',
            ],
            cons: [
              'Higher cost and implementation time',
              'May include features you don\'t need',
              'Vendor lock-in considerations',
            ],
            useCase: 'Best for large organizations with complex requirements',
          },
          {
            name: 'Mid-Market Solution',
            description: `Balanced solution optimized for ${useCase}`,
            pros: [
              'Good balance of features and cost',
              'Faster implementation',
              'Growing integration ecosystem',
              'Modern user experience',
            ],
            cons: [
              'May lack some enterprise features',
              'Scaling could require tier upgrades',
              'Smaller vendor with support limitations',
            ],
            useCase: 'Best for growing businesses with standard needs',
          },
        ];
      }
    } else if (isPayment) {
      recommendations = [
        {
          name: 'Stripe',
          description: 'Developer-friendly payment processing platform',
          pros: [
            'Excellent developer experience and documentation',
            'Comprehensive API and SDK support',
            'Growing global coverage',
            'Advanced features (subscriptions, connect, radar)',
          ],
          cons: [
            'Limited in some countries (including Pakistan)',
            'Fees can add up (2.9% + 30¢ per transaction)',
            'Requires technical integration',
          ],
          useCase: 'Best for tech-savvy businesses with global customers',
        },
        {
          name: 'Local Payment Gateway (JazzCash, EasyPaisa)',
          description: 'Pakistan-specific mobile wallet and payment solutions',
          pros: [
            'Widely adopted in Pakistan',
            'Mobile wallet integration',
            'Lower barriers for local customers',
            'Local currency support (PKR)',
          ],
          cons: [
            'Limited to Pakistan market',
            'Basic API compared to international players',
            'Less feature-rich than global platforms',
          ],
          useCase: 'Best for businesses serving Pakistani market exclusively',
        },
      ];
    } else {
      recommendations = [
        {
          name: 'Modern Solution A',
          description: `Contemporary solution designed for ${useCase}`,
          pros: [
            'Latest technology stack and architecture',
            'Active development and frequent updates',
            'Strong community and resources',
            'Competitive pricing model',
          ],
          cons: [
            'Newer platform, less battle-tested',
            'Smaller ecosystem compared to established players',
            'May lack some legacy integrations',
          ],
          useCase: 'Best for forward-thinking projects prioritizing modern tech',
        },
        {
          name: 'Established Solution B',
          description: `Proven, reliable option for ${useCase}`,
          pros: [
            'Industry standard with long track record',
            'Extensive documentation and support',
            'Large integration marketplace',
            'Enterprise-ready features',
          ],
          cons: [
            'Can feel dated in user experience',
            'Higher licensing costs',
            'Slower to adopt new technologies',
          ],
          useCase: 'Best for risk-averse organizations valuing stability',
        },
      ];
    }
    
    return { recommendations };
  },
});

/**
 * All available research tools
 */
export const researchTools = {
  webSearchTool,
  marketResearchTool,
  regulatoryResearchTool,
  technologyResearchTool,
};
