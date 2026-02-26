const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const request = require('supertest');

const app = require('../app');

const tasksPath = path.join(__dirname, '..', 'tasks.json');
let originalTasksRaw = null;

function seedData() {
  const seeded = {
    projects: [
      {
        id: 'proj-test01',
        name: 'Seed Project',
        description: 'seed',
        docs: '# Seed',
        color: '#112233',
        tasks: [],
        createdAt: '2026-01-01T00:00:00.000Z'
      }
    ]
  };
  fs.writeFileSync(tasksPath, JSON.stringify(seeded, null, 2), 'utf8');
}

test.before(() => {
  originalTasksRaw = fs.readFileSync(tasksPath, 'utf8');
});

test.after(() => {
  if (originalTasksRaw !== null) {
    fs.writeFileSync(tasksPath, originalTasksRaw, 'utf8');
  }
});

test('PUT /api/projects/:id accepts allowlisted field updates', async () => {
  seedData();

  const response = await request(app)
    .put('/api/projects/proj-test01')
    .send({ name: 'Renamed Project', color: '#aabbcc' })
    .expect(200);

  assert.equal(response.body.name, 'Renamed Project');
  assert.equal(response.body.color, '#aabbcc');

  const data = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
  assert.equal(data.projects[0].name, 'Renamed Project');
});

test('PUT /api/projects/:id rejects unsupported fields', async () => {
  seedData();

  const response = await request(app)
    .put('/api/projects/proj-test01')
    .send({ tasks: [{ id: 'bad' }] })
    .expect(400);

  assert.equal(response.body.error, 'Unsupported project field(s)');
  assert.ok(Array.isArray(response.body.unsupported));
  assert.ok(response.body.unsupported.includes('tasks'));
});

test('PUT /api/projects/:id rejects invalid body type', async () => {
  seedData();

  const response = await request(app)
    .put('/api/projects/proj-test01')
    .send([])
    .expect(400);

  assert.equal(response.body.error, 'Invalid request body');
});
