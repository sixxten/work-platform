const request = require('supertest');
const { app } = require('../app');

describe('API Tests', () => {
  // 1. Тест публичных справочников
  test('GET /api/employment-types должен вернуть список', async () => {
    const res = await request(app).get('/api/employment-types');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 2. Тест публичных справочников
  test('GET /api/work-formats должен вернуть список', async () => {
    const res = await request(app).get('/api/work-formats');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 3. Тест публичных справочников
  test('GET /api/specializations должен вернуть список', async () => {
    const res = await request(app).get('/api/specializations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 4. Тест регистрации с неверным email
  test('POST /api/auth/register - неверный email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-email', password: '123456', role: 'student' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // 5. Тест регистрации с коротким паролем
  test('POST /api/auth/register - короткий пароль', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123', role: 'student' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // 6. Тест успешной регистрации
  test('POST /api/auth/register - успешная регистрация', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: Date.now() + '@test.com', password: '123456', role: 'student' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
  });

  // 7. Тест логина с неверным паролем
  test('POST /api/auth/login - неверный пароль', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Wrong password');
  });

  // 8. Тест получения списка вакансий
  test('GET /api/vacancies должен вернуть массив', async () => {
    const res = await request(app).get('/api/vacancies');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 9. Тест получения несуществующей вакансии
  test('GET /api/vacancies/99999 - 404', async () => {
    const res = await request(app).get('/api/vacancies/99999');
    expect(res.statusCode).toBe(404);
  });

  // 10. Тест создания вакансии без авторизации
  test('POST /api/vacancies - без авторизации возвращает 401', async () => {
    const res = await request(app)
      .post('/api/vacancies')
      .send({
        title: 'Тестовая вакансия',
        description: 'Описание',
        company: 'Тестовая компания',
        employmentTypeId: 1,
        workFormatId: 1,
        specializationId: 1
      });
    expect(res.statusCode).toBe(401);
  });
});