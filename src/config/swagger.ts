import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';
import { config } from './env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Entertab Backend REST API',
      version: '1.0.0',
      description: 'Interactive API documentation for Entertab Backend. Use this interface to test API endpoints, inspect database structures, and authenticate requests.',
      contact: {
        name: 'Entertab Technical Team',
        email: 'dev@entertab.com',
      },
    },
    servers: [
      {
        url: config.nodeEnv === 'production' ? '/' : `http://localhost:${config.port}`,
        description: config.nodeEnv === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT administrator token to authorize requests. Get the token from /api/users/login.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab98fd' },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@entertab.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
            role: { type: 'string', enum: ['admin'], example: 'admin' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
          },
        },
        ContactUs: {
          type: 'object',
          required: ['name', 'email', 'phoneNumber', 'message'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab98fe' },
            name: { type: 'string', example: 'John Smith' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phoneNumber: { type: 'string', example: '+201012345678' },
            message: { type: 'string', example: 'Hello, I would like to get in touch with your team.' },
            status: { type: 'string', enum: ['pending', 'reviewed', 'resolved'], example: 'pending' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
          },
        },
        Service: {
          type: 'object',
          required: ['email', 'name', 'phoneNumber', 'message', 'serviceType'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab98ff' },
            email: { type: 'string', format: 'email', example: 'client@example.com' },
            name: { type: 'string', example: 'Sarah Johnson' },
            phoneNumber: { type: 'string', example: '+201123456789' },
            message: { type: 'string', example: 'I need a mobile app to manage my sales pipeline.' },
            serviceType: {
              type: 'string',
              enum: [
                'AI Edge – AI-Powered Automation & Intelligence',
                'Digital Transformation Hub',
                'Mobile App Development',
                'Website Development',
                'Brand Building',
                'UI/UX Design',
                'Digital Marketing',
                'Marketing Content Writing',
                'Social Media Management',
              ],
              example: 'Mobile App Development',
            },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
          },
        },
        Project: {
          type: 'object',
          required: ['email', 'name', 'requiredService', 'message'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab9900' },
            email: { type: 'string', format: 'email', example: 'business@example.com' },
            name: { type: 'string', example: 'Robert Downey' },
            requiredService: {
              type: 'string',
              enum: [
                'AI Edge – AI-Powered Automation & Intelligence',
                'Digital Transformation Hub',
                'Website Development',
                'Mobile App Development',
                'Brand Building',
                'Contact Center Solutions',
                'UI/UX Design',
                'Digital Marketing',
                'Marketing Content Writing',
                'Social Media Management',
              ],
              example: 'AI Edge – AI-Powered Automation & Intelligence',
            },
            message: { type: 'string', example: 'I would like to automate our internal customer service with AI.' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
          },
        },
        Journey: {
          type: 'object',
          required: ['email', 'name', 'positionOrSpecialisation', 'yearsOfExperience', 'typeOfEmployment', 'cvUpload', 'message'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab9901' },
            email: { type: 'string', format: 'email', example: 'applicant@example.com' },
            name: { type: 'string', example: 'Alex Mercer' },
            positionOrSpecialisation: { type: 'string', example: 'Senior Full Stack Developer' },
            yearsOfExperience: { type: 'number', example: 5 },
            typeOfEmployment: { type: 'string', example: 'Full-time' },
            cvUpload: { type: 'string', example: '/uploads/cvUpload-1715957385920-948293819.pdf' },
            message: { type: 'string', example: 'I am highly interested in joining Entertab as a developer.' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
          },
        },
      },
    },
    paths: {
      '/api/users/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Admin Login',
          description: 'Authenticate an administrator and retrieve a JWT token.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'admin@entertab.com' },
                    password: { type: 'string', format: 'password', example: 'admin123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: { description: 'Invalid email or password' },
          },
        },
      },
      '/api/users': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Users'],
          summary: 'Get All Users',
          description: 'Retrieve a list of all user accounts. Requires admin JWT.',
          responses: {
            200: {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'number', example: 1 },
                      data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized / Missing token' },
          },
        },
        post: {
          security: [{ bearerAuth: [] }],
          tags: ['Users'],
          summary: 'Create A New User',
          description: 'Register a new administrator account. Requires admin JWT.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid input data or duplicate email' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/users/{id}': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Users'],
          summary: 'Get User By ID',
          description: 'Retrieve a single user by their database ID. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User Database ID' },
          ],
          responses: {
            200: {
              description: 'User details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            404: { description: 'User not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          tags: ['Users'],
          summary: 'Update User By ID',
          description: 'Modify user details by their database ID. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User Database ID' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Jane Doe Updated' },
                    email: { type: 'string', format: 'email', example: 'jane.updated@entertab.com' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            404: { description: 'User not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          tags: ['Users'],
          summary: 'Delete User By ID',
          description: 'Permanently remove a user account. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User Database ID' },
          ],
          responses: {
            200: {
              description: 'User deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { type: 'object', example: {} },
                    },
                  },
                },
              },
            },
            404: { description: 'User not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/contact-us': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Contact Us'],
          summary: 'Get All Contact Messages',
          description: 'Retrieve a list of all contact inquiries submitted. Requires admin JWT.',
          responses: {
            200: {
              description: 'List of messages',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'number', example: 1 },
                      data: { type: 'array', items: { $ref: '#/components/schemas/ContactUs' } },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Contact Us'],
          summary: 'Submit Contact Message',
          description: 'Submit a new contact or inquiry message from the public website.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'phoneNumber', 'message'],
                  properties: {
                    name: { type: 'string', example: 'John Smith' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    phoneNumber: { type: 'string', example: '+201012345678' },
                    message: { type: 'string', example: 'Hello, I would like to get in touch with your team.' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Message submitted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/ContactUs' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid input data' },
          },
        },
      },
      '/api/contact-us/{id}': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Contact Us'],
          summary: 'Get Contact Message By ID',
          description: 'Retrieve detailed content of a single contact message. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Message Database ID' },
          ],
          responses: {
            200: {
              description: 'Message details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/ContactUs' },
                    },
                  },
                },
              },
            },
            404: { description: 'Message not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          tags: ['Contact Us'],
          summary: 'Update Contact Message Status',
          description: 'Update the review or resolution status of a contact message. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Message Database ID' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['pending', 'reviewed', 'resolved'], example: 'reviewed' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Message updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/ContactUs' },
                    },
                  },
                },
              },
            },
            404: { description: 'Message not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          tags: ['Contact Us'],
          summary: 'Delete Contact Message',
          description: 'Delete a contact message. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Message Database ID' },
          ],
          responses: {
            200: {
              description: 'Message deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { type: 'object', example: {} },
                    },
                  },
                },
              },
            },
            404: { description: 'Message not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/services': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Services'],
          summary: 'Get All Service Requests',
          description: 'Retrieve all professional service submissions. Requires admin JWT.',
          responses: {
            200: {
              description: 'List of service requests',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'number', example: 1 },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Service' } },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Services'],
          summary: 'Submit Service Request',
          description: 'Submit an inquiry or request for one of the agency services.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'name', 'phoneNumber', 'message', 'serviceType'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'client@example.com' },
                    name: { type: 'string', example: 'Sarah Johnson' },
                    phoneNumber: { type: 'string', example: '+201123456789' },
                    message: { type: 'string', example: 'I need a premium UI/UX design for a real estate portal.' },
                    serviceType: {
                      type: 'string',
                      enum: [
                        'AI Edge – AI-Powered Automation & Intelligence',
                        'Digital Transformation Hub',
                        'Mobile App Development',
                        'Website Development',
                        'Brand Building',
                        'UI/UX Design',
                        'Digital Marketing',
                        'Marketing Content Writing',
                        'Social Media Management',
                      ],
                      example: 'UI/UX Design',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Service request submitted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Service' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid input data' },
          },
        },
      },
      '/api/services/{id}': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Services'],
          summary: 'Get Service Request By ID',
          description: 'Retrieve details of a single service request. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Service Database ID' },
          ],
          responses: {
            200: {
              description: 'Service request details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Service' },
                    },
                  },
                },
              },
            },
            404: { description: 'Service request not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          tags: ['Services'],
          summary: 'Update Service Request By ID',
          description: 'Modify information of an existing service request. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Service Database ID' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Sarah Johnson Updated' },
                    message: { type: 'string', example: 'Updated details for the real estate project.' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Service request updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Service' },
                    },
                  },
                },
              },
            },
            404: { description: 'Service request not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          tags: ['Services'],
          summary: 'Delete Service Request By ID',
          description: 'Permanently remove a service request. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Service Database ID' },
          ],
          responses: {
            200: {
              description: 'Service request deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { type: 'object', example: {} },
                    },
                  },
                },
              },
            },
            404: { description: 'Service request not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/projects': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Projects'],
          summary: 'Get All Project Inquiries',
          description: 'Retrieve all project inquiry submissions. Requires admin JWT.',
          responses: {
            200: {
              description: 'List of project inquiries',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'number', example: 1 },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Project' } },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Projects'],
          summary: 'Submit Project Inquiry',
          description: 'Submit a new project automation or development inquiry.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'name', 'requiredService', 'message'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'business@example.com' },
                    name: { type: 'string', example: 'Robert Downey' },
                    requiredService: {
                      type: 'string',
                      enum: [
                        'AI Edge – AI-Powered Automation & Intelligence',
                        'Digital Transformation Hub',
                        'Website Development',
                        'Mobile App Development',
                        'Brand Building',
                        'Contact Center Solutions',
                        'UI/UX Design',
                        'Digital Marketing',
                        'Marketing Content Writing',
                        'Social Media Management',
                      ],
                      example: 'AI Edge – AI-Powered Automation & Intelligence',
                    },
                    message: { type: 'string', example: 'We need AI content writing and AI marketing solutions.' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Project inquiry submitted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Project' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid input data' },
          },
        },
      },
      '/api/projects/{id}': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Projects'],
          summary: 'Get Project Inquiry By ID',
          description: 'Retrieve full details of a specific project inquiry. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Project Database ID' },
          ],
          responses: {
            200: {
              description: 'Project inquiry details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Project' },
                    },
                  },
                },
              },
            },
            404: { description: 'Project inquiry not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          tags: ['Projects'],
          summary: 'Update Project Inquiry By ID',
          description: 'Modify information of an existing project inquiry. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Project Database ID' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Robert Downey Jr.' },
                    requiredService: { type: 'string', example: 'Website Development' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Project inquiry updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Project' },
                    },
                  },
                },
              },
            },
            404: { description: 'Project inquiry not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          tags: ['Projects'],
          summary: 'Delete Project Inquiry By ID',
          description: 'Permanently remove a project inquiry. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Project Database ID' },
          ],
          responses: {
            200: {
              description: 'Project inquiry deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { type: 'object', example: {} },
                    },
                  },
                },
              },
            },
            404: { description: 'Project inquiry not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/journeys': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Journeys / Careers'],
          summary: 'Get All Career Applications',
          description: 'Retrieve all career/job applications. Requires admin JWT.',
          responses: {
            200: {
              description: 'List of career applications',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'number', example: 1 },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Journey' } },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Journeys / Careers'],
          summary: 'Submit Career Application (with CV upload)',
          description: 'Apply for a role at Entertab. Expects a `multipart/form-data` request with CV file upload.',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['email', 'name', 'positionOrSpecialisation', 'yearsOfExperience', 'typeOfEmployment', 'cvUpload', 'message'],
                  properties: {
                    name: { type: 'string', example: 'Alex Mercer' },
                    email: { type: 'string', format: 'email', example: 'applicant@example.com' },
                    positionOrSpecialisation: { type: 'string', example: 'Senior Full Stack Developer' },
                    yearsOfExperience: { type: 'integer', example: 5 },
                    typeOfEmployment: { type: 'string', example: 'Full-time' },
                    cvUpload: { type: 'string', format: 'binary', description: 'Upload CV file (.pdf, .doc, .docx)' },
                    message: { type: 'string', example: 'I am highly interested in joining Entertab.' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Career application submitted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Journey' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid input data or missing CV file' },
          },
        },
      },
      '/api/journeys/{id}': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Journeys / Careers'],
          summary: 'Get Career Application By ID',
          description: 'Retrieve detailed information on a specific career application. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Application Database ID' },
          ],
          responses: {
            200: {
              description: 'Career application details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Journey' },
                    },
                  },
                },
              },
            },
            404: { description: 'Application not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          tags: ['Journeys / Careers'],
          summary: 'Update Career Application By ID',
          description: 'Modify details of an existing career application. Optionally accepts a new CV file.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Application Database ID' },
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Alex Mercer Updated' },
                    email: { type: 'string', format: 'email', example: 'applicant.updated@example.com' },
                    positionOrSpecialisation: { type: 'string', example: 'Lead Developer' },
                    yearsOfExperience: { type: 'integer', example: 6 },
                    typeOfEmployment: { type: 'string', example: 'Remote' },
                    cvUpload: { type: 'string', format: 'binary', description: 'Optionally upload new CV file' },
                    message: { type: 'string', example: 'Updated details for my application.' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Application updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Journey' },
                    },
                  },
                },
              },
            },
            404: { description: 'Application not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          tags: ['Journeys / Careers'],
          summary: 'Delete Career Application By ID',
          description: 'Permanently remove a career application. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Application Database ID' },
          ],
          responses: {
            200: {
              description: 'Application deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { type: 'object', example: {} },
                    },
                  },
                },
              },
            },
            404: { description: 'Application not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './dist/modules/**/*.js', './src/app.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  // Serve raw OpenAPI JSON explicitly to avoid large inline init script issues in some runtimes.
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve Swagger UI and load schema from /api-docs.json
  const swaggerHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: '/api-docs.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout'
    });
  </script>
</body>
</html>`;

  const serveSwaggerHtml = (_req: any, res: any): void => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(swaggerHtml);
  };

  app.get('/api-docs', serveSwaggerHtml);
  app.get('/api-docs/', serveSwaggerHtml);

  // Redirect the root path `/` to `/api-docs` directly
  app.get('/', (_req, res) => {
    res.redirect('/api-docs');
  });
};
