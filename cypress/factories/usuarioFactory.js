const ts = () => Date.now()

export const usuarioFactory = {
  comum: (overrides = {}) => ({
    nome:          `User Teste ${ts()}`,
    email:         `qa.${ts()}@test.com`,
    password:      'Senha@123',
    administrador: 'false',
    ...overrides,
  }),

  admin: (overrides = {}) => ({
    nome:          `User Admin ${ts()}`,
    email:         `admin.${ts()}@test.com`,
    password:      'Senha@123',
    administrador: 'true',
    ...overrides,
  }),
}
