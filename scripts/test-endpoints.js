const { spawn } = require('child_process');
const path = require('path');

// Helper to delay execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('==================================================');
  console.log('STARTING E2E BACKEND SECURITY & CRUD TESTS');
  console.log('==================================================');

  // 1. Spawn backend dev server as a background process using npx
  const serverProcess = spawn('npx', ['ts-node-dev', '--respawn', '--transpile-only', 'src/server.ts'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: '5055' },
    shell: true,
  });

  let output = '';
  serverProcess.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`[Server Log]: ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Err]: ${data.toString().trim()}`);
  });

  // Wait 22 seconds for MongoDB connection and default Admin seeding
  console.log('\nStarting local server on port 5055. Waiting for server to bind & seed DB...');
  await sleep(22000);

  const BASE_URL = 'http://localhost:5055/api';
  let adminToken = '';
  let serviceId = '';
  let projectId = '';
  let contactId = '';
  let journeyId = '';
  let testFailed = false;

  const assert = (condition, message) => {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      testFailed = true;
    } else {
      console.log(`✅ PASS: ${message}`);
    }
  };

  try {
    // --- 1. HEALTH CHECK ---
    console.log('\n--- Test 1: Public Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert(healthRes.status === 200, 'Health check returned HTTP 200');
    const healthData = await healthRes.json();
    assert(healthData.success === true, 'Health check response has success: true');

    // --- 2. ANONYMOUS CREATE: CONTACT US ---
    console.log('\n--- Test 2: Anonymous Contact Us Submission ---');
    const contactPayload = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Partnership Inquiry',
      message: 'Hello, I would like to discuss business collaboration.',
    };
    const contactRes = await fetch(`${BASE_URL}/contact-us`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload),
    });
    assert(contactRes.status === 201, 'Anonymous Contact Us submission returned HTTP 201');
    const contactData = await contactRes.json();
    assert(contactData.success === true, 'Contact Us response has success: true');
    assert(contactData.data.name === 'John Doe', 'Submitted name matches input');
    contactId = contactData.data._id;

    // --- 3. ANONYMOUS CREATE: SERVICES ---
    console.log('\n--- Test 3: Anonymous Service Creation ---');
    const servicePayload = {
      title: 'Cloud Consulting',
      description: 'Architecting high-scale backend services in the cloud.',
      icon: 'cloud-icon',
      price: 150,
    };
    const serviceRes = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicePayload),
    });
    assert(serviceRes.status === 201, 'Anonymous Service creation returned HTTP 201');
    const serviceData = await serviceRes.json();
    assert(serviceData.success === true, 'Service response has success: true');
    serviceId = serviceData.data._id;

    // --- 4. ANONYMOUS CREATE: PROJECTS ---
    console.log('\n--- Test 4: Anonymous Project Creation ---');
    const projectPayload = {
      title: 'Entertab Portal',
      description: 'Sleek enterprise organizational web platform.',
      client: 'Entertab Org',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    };
    const projectRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectPayload),
    });
    assert(projectRes.status === 201, 'Anonymous Project creation returned HTTP 201');
    const projectData = await projectRes.json();
    assert(projectData.success === true, 'Project response has success: true');
    projectId = projectData.data._id;

    // --- 5. ANONYMOUS CREATE: JOURNEYS ---
    console.log('\n--- Test 5: Anonymous Journey Creation ---');
    const journeyPayload = {
      title: 'Company Foundation',
      description: 'Entertab was registered and legally established.',
      year: '2024',
      milestoneType: 'business',
    };
    const journeyRes = await fetch(`${BASE_URL}/journeys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(journeyPayload),
    });
    assert(journeyRes.status === 201, 'Anonymous Journey creation returned HTTP 201');
    const journeyData = await journeyRes.json();
    assert(journeyData.success === true, 'Journey response has success: true');
    journeyId = journeyData.data._id;

    // --- 6. SECURE METHOD BLOCK WITHOUT TOKEN ---
    console.log('\n--- Test 6: Secure Endpoint Block (Unauthorized check) ---');
    const unauthorizedRes = await fetch(`${BASE_URL}/users`);
    assert(unauthorizedRes.status === 401, 'Requesting GET /api/users without token returns HTTP 401');
    const unauthorizedData = await unauthorizedRes.json();
    assert(unauthorizedData.success === false, 'Unauthorized response has success: false');

    const unauthorizedContactRes = await fetch(`${BASE_URL}/contact-us`);
    assert(unauthorizedContactRes.status === 401, 'Requesting GET /api/contact-us without token returns HTTP 401');

    // --- 7. SECURE ADMIN CREATE (USER MODULE) WITHOUT TOKEN ---
    console.log('\n--- Test 7: Secure User Creation Block (Anonymous register blocked) ---');
    const createUserPayload = {
      name: 'Second Admin',
      email: 'secadmin@entertab.com',
      password: 'adminpassword123',
    };
    const userBlockRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createUserPayload),
    });
    assert(userBlockRes.status === 401, 'Requesting POST /api/users without token returns HTTP 401');

    // --- 8. LOGIN SUCCESS ---
    console.log('\n--- Test 8: Login with Seeded Admin Credentials ---');
    const loginPayload = {
      email: 'admin@entertab.com',
      password: 'admin123', // From local .env settings default
    };
    const loginRes = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload),
    });
    assert(loginRes.status === 200, 'Login returned HTTP 200');
    const loginData = await loginRes.json();
    assert(loginData.success === true, 'Login response has success: true');
    assert(loginData.token !== undefined, 'Login response includes JWT token');
    adminToken = loginData.token;

    // --- 9. AUTHORIZED READ: CONTACT US LIST ---
    console.log('\n--- Test 9: Authorized GET with Admin JWT ---');
    const contactListRes = await fetch(`${BASE_URL}/contact-us`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    assert(contactListRes.status === 200, 'Authorized Contact Us GET returned HTTP 200');
    const contactListData = await contactListRes.json();
    assert(contactListData.success === true, 'Authorized response has success: true');
    assert(contactListData.count > 0, 'Response includes records created previously');

    // --- 10. AUTHORIZED UPDATE: SERVICES ---
    console.log('\n--- Test 10: Authorized PUT to Update Service ---');
    const updateServicePayload = {
      price: 200, // Update price
    };
    const updateRes = await fetch(`${BASE_URL}/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updateServicePayload),
    });
    assert(updateRes.status === 200, 'Authorized Service update returned HTTP 200');
    const updateData = await updateRes.json();
    assert(updateData.success === true, 'Update response success: true');
    assert(updateData.data.price === 200, 'Updated field matches payload changes');

    // --- 11. AUTHORIZED DELETE: PROJECTS ---
    console.log('\n--- Test 11: Authorized DELETE of Project ---');
    const deleteRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    assert(deleteRes.status === 200, 'Authorized Project delete returned HTTP 200');
    const deleteData = await deleteRes.json();
    assert(deleteData.success === true, 'Delete response success: true');

    // Confirm it's gone
    const checkDeletedRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    assert(checkDeletedRes.status === 404, 'Retrieving deleted Project returns HTTP 404');

  } catch (error) {
    console.error('An unexpected runtime error occurred during fetching:', error);
    testFailed = true;
  } finally {
    // 5. Kill background process
    console.log('\nShutting down backend dev server process...');
    serverProcess.kill();
    await sleep(2000);

    console.log('==================================================');
    if (testFailed) {
      console.error('❌ E2E VERIFICATION FAILED. Check log errors.');
      process.exit(1);
    } else {
      console.log('🎉 ALL SECURITY & CRUD E2E TESTS COMPLETED SUCCESSFULLY!');
      process.exit(0);
    }
    console.log('==================================================');
  }
}

runTests();
