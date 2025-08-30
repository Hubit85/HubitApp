
import type { NextApiRequest, NextApiResponse } from 'next';
import CustomEmailService from '@/lib/customEmailService';

interface EmailRequest {
  userId: string;
  userEmail: string;
  roleType: string;
  verificationToken: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🌐 API route: send-custom email triggered');
  console.log('📋 Environment variables check:', {
    RESEND_API_KEY_EXISTS: !!process.env.RESEND_API_KEY,
    RESEND_API_KEY_LENGTH: process.env.RESEND_API_KEY?.length || 0,
    RESEND_API_KEY_PREFIX: process.env.RESEND_API_KEY?.substring(0, 10) || 'not found',
    NODE_ENV: process.env.NODE_ENV
  });

  // Force reload environment variables
  if (process.env.NODE_ENV === 'development') {
    try {
      const dotenv = await import('dotenv');
      dotenv.config({ path: '.env.local' });
      console.log('🔄 Environment variables reloaded from .env.local');
    } catch (e) {
      console.warn('Could not reload environment variables:', e);
    }
  }

  try {
    const { userId, userEmail, roleType, verificationToken }: EmailRequest = req.body;

    console.log('📧 Processing email send request:', {
      userId,
      userEmail,
      roleType,
      tokenLength: verificationToken?.length || 0
    });

    // Validate input
    if (!userId || !userEmail || !roleType || !verificationToken) {
      console.error('❌ Missing required parameters');
      return res.status(400).json({ 
        success: false,
        error: 'Missing required parameters: userId, userEmail, roleType, verificationToken' 
      });
    }

    // Check email service configuration
    const config = CustomEmailService.validateEmailConfig();
    if (!config.isValid) {
      console.error('❌ Email service not configured:', config.missingVars);
      return res.status(500).json({
        success: false,
        error: `Email service not configured. Missing: ${config.missingVars.join(', ')}`,
        missingVars: config.missingVars
      });
    }

    console.log('✅ Email configuration is valid, sending email...');

    // Send the email
    const result = await CustomEmailService.sendRoleVerificationEmail(
      userId,
      userEmail,
      roleType,
      verificationToken
    );

    console.log('📧 Email send result:', result);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || result.message,
        details: result
      });
    }

  } catch (error) {
    console.error('❌ API route error:', error);
    
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      console.log('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      });

      // Handle specific error types
      if (error.message.includes('RESEND_API_KEY')) {
        statusCode = 500;
        errorMessage = 'Email service configuration error: RESEND_API_KEY not available';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        statusCode = 503;
        errorMessage = 'Network error when connecting to email service';
      } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
        statusCode = 429;
        errorMessage = 'Email service rate limit exceeded';
      } else if (error.message.includes('authorization') || error.message.includes('401')) {
        statusCode = 401;
        errorMessage = 'Email service authorization failed - check API key';
      }
    }

    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }
}
