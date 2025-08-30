import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {} as Record<string, any>,
    recommendations: [] as string[],
  };

  // Test 1: Check environment variables
  results.tests.environmentVariables = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? {
      configured: true,
      length: process.env.RESEND_API_KEY.length,
      startsWithRe: process.env.RESEND_API_KEY.startsWith('re_'),
      preview: process.env.RESEND_API_KEY.substring(0, 10) + '...'
    } : { configured: false },
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || null,
    EMAIL_FROM_DOMAIN: process.env.EMAIL_FROM_DOMAIN || null,
    NODE_ENV: process.env.NODE_ENV || null
  };

  // Test 2: Verify Resend API connectivity
  if (process.env.RESEND_API_KEY) {
    try {
      console.log('🔍 Testing Resend API connectivity...');
      
      const testResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Test <noreply@resend.dev>',
          to: 'test@example.com',
          subject: 'HuBiT - Resend API Test',
          text: 'This is a test email to verify Resend API connectivity.'
        })
      });

      const responseData = await testResponse.json();

      results.tests.resendApiTest = {
        success: testResponse.ok,
        status: testResponse.status,
        statusText: testResponse.statusText,
        headers: Object.fromEntries(testResponse.headers.entries()),
        response: responseData
      };

      console.log('📊 Resend API test result:', results.tests.resendApiTest);

    } catch (error) {
      results.tests.resendApiTest = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        type: 'fetch_error'
      };
      console.error('❌ Resend API test error:', error);
    }
  } else {
    results.tests.resendApiTest = {
      success: false,
      error: 'RESEND_API_KEY not configured'
    };
  }

  // Test 3: Check domain configuration options
  results.tests.domainOptions = {
    resendDefault: 'noreply@resend.dev',
    softgenDomain: 'noreply@hubit-84-supabase-email-templates.softgen.ai',
    customDomain: process.env.EMAIL_FROM_DOMAIN ? `noreply@${process.env.EMAIL_FROM_DOMAIN}` : null,
    recommendation: 'Use resend.dev for testing, configure custom domain for production'
  };

  // Test 4: Fetch information from Resend API about domains
  if (process.env.RESEND_API_KEY) {
    try {
      const domainsResponse = await fetch('https://api.resend.com/domains', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (domainsResponse.ok) {
        const domainsData = await domainsResponse.json();
        results.tests.resendDomains = {
          success: true,
          domains: domainsData.data || domainsData
        };
      } else {
        const errorData = await domainsResponse.json();
        results.tests.resendDomains = {
          success: false,
          status: domainsResponse.status,
          error: errorData
        };
      }
    } catch (error) {
      results.tests.resendDomains = {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // Final recommendations
  results.recommendations = [];

  if (!results.tests.environmentVariables.RESEND_API_KEY.configured) {
    results.recommendations.push('Configure RESEND_API_KEY in environment variables');
  }

  if (results.tests.resendApiTest && !results.tests.resendApiTest.success) {
    if (results.tests.resendApiTest.status === 401) {
      results.recommendations.push('RESEND_API_KEY is invalid or expired - verify in Resend dashboard');
    } else if (results.tests.resendApiTest.status === 422) {
      results.recommendations.push('Email format or domain not allowed - check domain configuration');
    } else {
      results.recommendations.push(`Resend API error: ${results.tests.resendApiTest.error || 'Unknown error'}`);
    }
  }

  if (results.tests.resendDomains && !results.tests.resendDomains.success) {
    results.recommendations.push('Unable to fetch domain information - check API key permissions');
  }

  if (!results.tests.resendDomains?.domains?.length) {
    results.recommendations.push('No custom domains configured in Resend - emails will be sent from resend.dev');
  }

  console.log('🧪 Resend diagnostic complete:', results);

  return res.status(200).json(results);
}