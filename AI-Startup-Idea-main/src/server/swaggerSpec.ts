export const OPENAPI_SPEC = {
  openapi: '3.0.0',
  info: {
    title: 'Future Engine AI Decision Simulation Platform API',
    version: '2.5.0',
    description: 'Enterprise REST API for Future Engine - AI Scenario-based Decision Framework (FDF). Disclaimer: This is a scenario-based decision support system. It does not predict the future.'
  },
  servers: [
    {
      url: '/api',
      description: 'Primary Application Server'
    }
  ],
  paths: {
    '/auth/signup': {
      post: {
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User successfully created with JWT token' },
          400: { description: 'Validation error or existing email' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate user and issue JWT bearer token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Authentication successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/profile': {
      get: {
        summary: 'Retrieve current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile returned' },
          401: { description: 'Unauthorized' }
        }
      },
      put: {
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Profile successfully updated' }
        }
      }
    },
    '/simulation': {
      post: {
        summary: 'Run FDF AI decision simulation for a user goal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userProfile', 'goalCategory', 'goalDetails'],
                properties: {
                  userProfile: { type: 'object' },
                  goalCategory: { type: 'string' },
                  goalDetails: { type: 'object' },
                  followUpAnswers: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Complete structured decision simulation with scores and explainability' }
        }
      }
    },
    '/simulation/{id}': {
      get: {
        summary: 'Retrieve saved decision simulation by UUID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Saved simulation retrieved' },
          404: { description: 'Simulation record not found' }
        }
      }
    },
    '/dashboard': {
      get: {
        summary: 'Fetch user dashboard analytics summary',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard metrics and historical simulation logs' }
        }
      }
    },
    '/fdf/architecture': {
      get: {
        summary: 'Inspect FDF Engine modular architecture, formulas, and weights',
        responses: {
          200: { description: 'Architecture specifications' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};
