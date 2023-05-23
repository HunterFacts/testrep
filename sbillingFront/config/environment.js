'use strict';

module.exports = function (environment) {
  var backendUrl = 'http://terentiev-001-site1.ftempurl.com';
  if (environment === 'development') {
    backendUrl = 'https://localhost:44387';
  }
  let ENV = {
    modulePrefix: 'sbilling-front',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      host: backendUrl,
      namespace: 'api',
      backendUrls: {
        root: backendUrl,
        authToken: backendUrl + '/api/Auth/signin',
        authTokenRefresh: backendUrl + '/api/Auth/tokenrefresh',
        security: backendUrl + '/api/security',
        reportHost: 'http://localhost:9342',
      },
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  ENV['ember-simple-auth-token'] = {
    serverTokenEndpoint: backendUrl + '/api/token-auth/', // Server endpoint to send authenticate request
    tokenPropertyName: 'access_token', // Key in server response that contains the access token
    headers: {}, // Headers to add to the authenticate request
    refreshAccessTokens: false,
    serverTokenRefreshEndpoint: '/api/token-refresh/', // Server endpoint to send refresh request
    refreshLeeway: 10, // refresh 5 minutes (300 seconds) before expiration
    tokenExpirationInvalidateSession: true,
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.rootURL = '/da-paradise/';
    // here you can enable a production-specific feature
  }

  return ENV;
};
