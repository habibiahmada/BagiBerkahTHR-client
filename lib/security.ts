/**
 * Security utilities for BagiBerkah frontend
 */

/**
 * Validate payment gateway URL before redirect
 * Prevents open redirect vulnerability
 */
export const validatePaymentUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    
    // Whitelist allowed payment gateway domains
    const allowedDomains = [
      // Xendit (Primary for THR system)
      'xendit.co',
      'api.xendit.co',
      'checkout.xendit.co',
      'dashboard.xendit.co',
      // Mayar (Support developer feature)
      'mayar.id',
      'api.mayar.id',
      'myr.id', // Mayar payment links
      'mayar.club',
      'api.mayar.club',
      'sandbox.mayar.id',
      // Legacy support
      'midtrans.com',
      'sandbox.midtrans.com',
      'api.midtrans.com',
      'app.midtrans.com',
    ];
    
    // Check if hostname matches or is subdomain of allowed domains
    const isAllowed = allowedDomains.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
    
    // Allow localhost for development (mock payment)
    const isLocalhost = parsedUrl.hostname === 'localhost' || 
                       parsedUrl.hostname === '127.0.0.1' ||
                       parsedUrl.hostname.startsWith('192.168.') ||
                       parsedUrl.hostname === '::1';
    
    // Must use HTTPS in production, allow HTTP for localhost
    const isSecure = parsedUrl.protocol === 'https:' || 
                    (isLocalhost && parsedUrl.protocol === 'http:');
    
    return (isAllowed || isLocalhost) && isSecure;
  } catch {
    return false;
  }
};

/**
 * Sanitize text input to prevent XSS
 * Removes potentially dangerous characters
 */
export const sanitizeText = (text: string, maxLength: number = 1000): string => {
  if (!text) return '';
  
  // Trim and limit length
  let sanitized = text.trim().substring(0, maxLength);
  
  // Remove HTML tags and special characters that could cause issues
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
};

/**
 * Validate budget amount
 */
export const validateBudget = (budget: number): boolean => {
  return (
    !isNaN(budget) &&
    budget >= 10000 && // Minimum 10k
    budget <= 1000000000 && // Maximum 1B
    Number.isInteger(budget)
  );
};

/**
 * Validate recipient data structure
 */
export const validateRecipient = (recipient: any): boolean => {
  if (!recipient || typeof recipient !== 'object') return false;
  
  const validAgeLevels = ['child', 'teen', 'adult'];
  const validStatuses = ['school', 'college', 'working', 'not_working'];
  const validCloseness = ['very_close', 'close', 'distant'];
  
  return (
    recipient.name &&
    typeof recipient.name === 'string' &&
    recipient.name.length > 0 &&
    recipient.name.length <= 100 &&
    validAgeLevels.includes(recipient.ageLevel) &&
    validStatuses.includes(recipient.status) &&
    validCloseness.includes(recipient.closeness) &&
    (!recipient.greetingContext || recipient.greetingContext.length <= 500)
  );
};

/**
 * Validate access code format
 */
export const validateAccessCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;
  
  // Must be exactly 8 characters, alphanumeric
  const accessCodeRegex = /^[A-Z0-9]{8}$/;
  return accessCodeRegex.test(code);
};

/**
 * Logger utility - only logs in development
 */
export const logger = {
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, error);
    }
    // In production, could send to error tracking service
  },
  
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, data);
    }
  },
  
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, data);
    }
  }
};
