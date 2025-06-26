export const getHelmetConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        manifestSrc: ["'self'"],
      },
    },

    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' as const },

    dnsPrefetchControl: { allow: false },

    frameguard: { action: 'deny' as const },

    hidePoweredBy: true,

    hsts: isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,

    ieNoOpen: true,

    noSniff: true,

    originAgentCluster: true,

    permittedCrossDomainPolicies: false,

    referrerPolicy: { policy: 'no-referrer' as const },

    xssFilter: true,
  };
};

export const securityHeaders = {
  'X-API-Version': '0.0.1',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};
