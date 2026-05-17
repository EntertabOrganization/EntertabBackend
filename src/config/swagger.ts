import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
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
        url: `http://localhost:${config.port}`,
        description: 'Development Server',
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
          required: ['name', 'email', 'subject', 'message'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab98fe' },
            name: { type: 'string', example: 'John Smith' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            subject: { type: 'string', example: 'Partnership Inquiry' },
            message: { type: 'string', example: 'Hello, I would like to learn more about your services.' },
            status: { type: 'string', enum: ['pending', 'reviewed', 'resolved'], example: 'pending' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
          },
        },
        Service: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab98ff' },
            title: { type: 'string', example: 'Web Development' },
            description: { type: 'string', example: 'Custom web application design and development services.' },
            icon: { type: 'string', example: 'code' },
            price: { type: 'number', example: 1500 },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
          },
        },
        Project: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab9900' },
            title: { type: 'string', example: 'Entertab Web Platform' },
            description: { type: 'string', example: 'Enterprise web solution built with React and Express.' },
            client: { type: 'string', example: 'Entertab Corp' },
            completionDate: { type: 'string', format: 'date-time', example: '2026-06-01T00:00:00.000Z' },
            technologies: { type: 'array', items: { type: 'string' }, example: ['React', 'Node.js', 'MongoDB'] },
            imageUrl: { type: 'string', example: 'https://example.com/project.png' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-17T15:49:56.000Z' },
          },
        },
        Journey: {
          type: 'object',
          required: ['title', 'description', 'year'],
          properties: {
            _id: { type: 'string', example: '66472ab643a6d91244ab9901' },
            title: { type: 'string', example: 'Company Founded' },
            description: { type: 'string', example: 'Entertab was launched to revolutionize software solutions.' },
            year: { type: 'string', example: '2020' },
            milestoneType: { type: 'string', example: 'milestone' },
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
                  required: ['name', 'email', 'subject', 'message'],
                  properties: {
                    name: { type: 'string', example: 'John Smith' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    subject: { type: 'string', example: 'Partnership Inquiry' },
                    message: { type: 'string', example: 'I would like to build a web application with you.' },
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
          summary: 'Get All Services',
          description: 'Retrieve all professional services offered. Requires admin JWT.',
          responses: {
            200: {
              description: 'List of services',
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
          summary: 'Create Service Request',
          description: 'Request or submit a service inquiry. (Allows public submission).',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description'],
                  properties: {
                    title: { type: 'string', example: 'UI/UX Design' },
                    description: { type: 'string', example: 'Premium wireframing and prototyping services.' },
                    icon: { type: 'string', example: 'palette' },
                    price: { type: 'number', example: 800 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Service request created successfully',
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
            400: { description: 'Invalid input data or duplicate title' },
          },
        },
      },
      '/api/services/{id}': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Services'],
          summary: 'Get Service By ID',
          description: 'Retrieve details of a single service. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Service Database ID' },
          ],
          responses: {
            200: {
              description: 'Service details',
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
            404: { description: 'Service not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          tags: ['Services'],
          summary: 'Update Service By ID',
          description: 'Modify information of an existing service. Requires admin JWT.',
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
                    title: { type: 'string', example: 'UI/UX Design Master' },
                    price: { type: 'number', example: 950 },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Service updated successfully',
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
            404: { description: 'Service not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          tags: ['Services'],
          summary: 'Delete Service By ID',
          description: 'Permanently remove a service from the listings. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Service Database ID' },
          ],
          responses: {
            200: {
              description: 'Service deleted successfully',
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
            404: { description: 'Service not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/projects': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Projects'],
          summary: 'Get All Projects',
          description: 'Retrieve all portfolio projects. Requires admin JWT.',
          responses: {
            200: {
              description: 'List of projects',
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
          summary: 'Create Project Inquiry',
          description: 'Add a new project record or inquiry. (Allows public submission).',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description'],
                  properties: {
                    title: { type: 'string', example: 'E-Commerce Platform' },
                    description: { type: 'string', example: 'A scalable marketplace platform.' },
                    client: { type: 'string', example: 'Mega Retail' },
                    technologies: { type: 'array', items: { type: 'string' }, example: ['Node.js', 'React', 'MongoDB'] },
                    imageUrl: { type: 'string', example: 'https://example.com/project1.png' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Project created successfully',
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
            400: { description: 'Invalid input data or duplicate title' },
          },
        },
      },
      '/api/projects/{id}': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Projects'],
          summary: 'Get Project By ID',
          description: 'Retrieve full details of a specific project. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Project Database ID' },
          ],
          responses: {
            200: {
              description: 'Project details',
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
            404: { description: 'Project not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          tags: ['Projects'],
          summary: 'Update Project By ID',
          description: 'Modify information of an existing project. Requires admin JWT.',
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
                    client: { type: 'string', example: 'Mega Retail International' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Project updated successfully',
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
            404: { description: 'Project not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          tags: ['Projects'],
          summary: 'Delete Project By ID',
          description: 'Permanently remove a project from the portfolio. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Project Database ID' },
          ],
          responses: {
            200: {
              description: 'Project deleted successfully',
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
            404: { description: 'Project not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/journeys': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Journeys'],
          summary: 'Get All Journeys',
          description: 'Retrieve all historical journey/milestone records. Requires admin JWT.',
          responses: {
            200: {
              description: 'List of journeys',
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
          tags: ['Journeys'],
          summary: 'Create Journey Milestone',
          description: 'Add a new journey/milestone record. (Allows public submission).',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'year'],
                  properties: {
                    title: { type: 'string', example: 'Reached 100 Clients' },
                    description: { type: 'string', example: 'Celebrated serving over 100 enterprise customers.' },
                    year: { type: 'string', example: '2024' },
                    milestoneType: { type: 'string', example: 'achievement' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Journey created successfully',
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
            400: { description: 'Invalid input data' },
          },
        },
      },
      '/api/journeys/{id}': {
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Journeys'],
          summary: 'Get Journey By ID',
          description: 'Retrieve detailed information on a specific journey item. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Journey Database ID' },
          ],
          responses: {
            200: {
              description: 'Journey details',
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
            404: { description: 'Journey not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          tags: ['Journeys'],
          summary: 'Update Journey By ID',
          description: 'Modify information of an existing journey item. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Journey Database ID' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    description: { type: 'string', example: 'Serviced 100+ global brands and startup portfolios.' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Journey updated successfully',
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
            404: { description: 'Journey not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          tags: ['Journeys'],
          summary: 'Delete Journey By ID',
          description: 'Permanently remove a journey milestone. Requires admin JWT.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Journey Database ID' },
          ],
          responses: {
            200: {
              description: 'Journey deleted successfully',
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
            404: { description: 'Journey not found' },
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
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Redirect the root path `/` to `/api-docs` directly
  app.get('/', (_req, res) => {
    res.redirect('/api-docs');
  });
};
