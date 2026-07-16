const ts = () => Date.now()

export const produtoFactory = {
  valido: (overrides = {}) => ({
    nome:       `Produto para Teste ${ts()}`,
    preco:      399,
    descricao:  'Produto criado para teste',
    quantidade: 50,
    ...overrides,
  }),
}
