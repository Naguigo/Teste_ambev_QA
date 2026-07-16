# 🚀 ServeRest — Automação de Testes com Cypress

> 🎯 Projeto de automação E2E e API utilizando Cypress 12 com arquitetura Page Object Model (POM).


Projeto de testes automatizados E2E (frontend) e de API para a aplicação [ServeRest](https://serverest.dev), utilizando **Cypress 12** e o padrão **Page Object Model (POM)**.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Cenários de Teste](#cenários-de-teste)
  - [Frontend E2E](#frontend-e2e)
  - [API](#api)
- [Relatório](#relatório)
- [Padrões e Decisões de Projeto](#padrões-e-decisões-de-projeto)
- [Observações Importantes](#observações-importantes)

---

## 🛠️ Tecnologias

| Ferramenta | Versão | Finalidade |
|---|---|---|
| [Cypress](https://www.cypress.io/) | 12.17.4 | Framework de testes E2E e API |
| [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) | 4.0.2 | Geração de relatório HTML |
| [@faker-js/faker](https://fakerjs.dev/) | 10.x | Geração de dados dinâmicos |
| Node.js | ≥ 18 | Runtime |

---

## 📋 Pré-requisitos

- Node.js 18 ou superior instalado
- npm 8 ou superior
- Acesso à internet (os testes consomem APIs e frontend públicos)

---

## 🚀 Instalação

```bash
# Clonar / entrar na pasta do projeto
cd cypress

# Instalar dependências
npm install
```

> O binário do Cypress é baixado automaticamente na primeira execução.

---

## ⚙️ Configuração

### `cypress.config.js`

```js
module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',   // pasta de saída do relatório
    charts: true,                   // gráficos de pizza no HTML
    embeddedScreenshots: true,      // screenshots embutidas inline
    inlineAssets: true,             // HTML totalmente portável (sem dependências externas)
  },
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,   // captura automática em caso de falha
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    env: {
      apiUrl: 'https://serverest.dev',  // URL base da API — acessível via Cypress.env('apiUrl')
    },
  },
})
```

### Variáveis de ambiente disponíveis

| Chave | Valor padrão | Descrição |
|---|---|---|
| `apiUrl` | `https://serverest.dev` | URL base da API ServeRest |

Para sobrescrever em tempo de execução:

```bash
npx cypress run --env apiUrl=https://outra-api.dev
```

### Problema conhecido no Windows com VS Code

O VS Code define `ELECTRON_RUN_AS_NODE=1`, o que impede o Cypress de iniciar. Todos os scripts do projeto já tratam isso. Ao rodar manualmente no terminal, utilize:

```powershell
$env:ELECTRON_RUN_AS_NODE = ""; npx cypress run
```

---

## 🗂️ Estrutura do Projeto

```
cypress/
├── cypress.config.js               # Configuração global do Cypress e reporter
├── package.json
│
└── cypress/
    ├── e2e/
    │   ├── api/                    # Testes de API (cy.request)
    │   │   ├── login.api.cy.js     # TA02 — Autenticação
    │   │   ├── produtos.api.cy.js  # TA03 — CRUD de Produtos
    │   │   └── usuarios.api.cy.js  # TA01 — CRUD de Usuários
    │   │
    │   └── frontend/               # Testes E2E (browser)
    │       ├── cadastro.cy.js      # TE02 — Cadastro de usuário
    │       ├── login.cy.js         # TE01 — Login
    │       └── produtos.cy.js      # TE03 — Gestão de produtos
    │
    ├── pages/                      # Page Objects (POM)
    │   ├── LoginPage.js            # Seletores e ações da tela de login
    │   ├── CadastroPage.js         # Seletores e ações do cadastro de usuário
    │   ├── NavBar.js               # Navegação pelo menu admin
    │   ├── CadastroProdutoPage.js  # Formulário de cadastro de produto
    │   └── ListaProdutosPage.js    # Tabela de listagem de produtos
    │
    ├── support/
    │   ├── commands.js             # Comandos customizados do Cypress
    │   └── e2e.js                  # Ponto de entrada do suporte (imports globais)
    │
    ├── fixtures/
    │   └── usuarios.json           # Massa de dados estática de referência
    │
    └── reports/                    # Relatório HTML gerado automaticamente
        └── index.html
```

---

## ▶️ Como Executar

### 💻 Interface gráfica (modo interativo)

```bash
npm run cy:open
```

### 🤖 Headless — todos os testes

```bash
npm run cy:run
# ou
npm run cy:report   # idêntico, com geração explícita do relatório
```

### 🌍 Apenas testes de frontend

```bash
npm run cy:frontend
```

### 🔗 Apenas testes de API

```bash
npm run cy:api
```

### 🎯 Spec específico

```bash
npx cypress run --spec "cypress/e2e/api/login.api.cy.js"
```


## 📊 Relatório

O relatório HTML é gerado automaticamente ao final de qualquer execução em modo headless, salvo em:

```
cypress/reports/index.html
```

É um arquivo **autossuficiente** (assets e screenshots embutidos) — pode ser aberto diretamente no browser ou compartilhado sem dependências externas.

Para abrir após a execução:

```powershell
# Windows
Start-Process "cypress\reports\index.html"
```

---

## 📐 Padrões e por que tomei essas decisões de projeto

### Por que usar Page Object Model (POM)?

Se a tela do sistema muda (um botão muda de ID, por exemplo), você não deve precisar corrigir dezenas de arquivos de teste. O POM resolve isso centralizando a busca por elementos e as interações de cada tela em uma classe própria.

No meu projeto, cada Page Object foi construído seguindo três regras:

1. Getters dinâmicos (get): Elementos como get `emailInput()` só são buscados no DOM pelo `cy.get()` no exato momento em que o teste precisa deles. Isso evita problemas de elementos que ainda não carregaram na tela.

2. Ações encadeadas (Fluent API): Métodos que realizam ações (como digitar ou clicar) sempre retornam `this` (a própria classe). Com isso, dá para escrever fluxos inteiros em uma linha contínua, deixando o código muito elegante.

3. Asserções semânticas (`deve...()`): Em vez de encher os arquivos de teste com validações soltas, criei métodos específicos de validação dentro da página. Isso deixa claro o que está sendo testado.


Veja como o teste fica limpo, legível (parece até inglês fluente!) e totalmente livre de seletores CSS expostos:

```js
// 🌟 O arquivo de teste apenas dita o comportamento, sem saber detalhes técnicos da tela
LoginPage.login(email, senha)
LoginPage.deveEstarNaHome()
```

### 🧪 Como garanto o isolamento e a independência dos dados?

Testes que dependem de dados fixos (como um usuário estático no banco) costumam falhar quando rodados mais de uma vez ou em paralelo. Para evitar isso, apliquei duas estratégias:

- Massa de dados sob demanda: No gancho `before()` de cada suíte de teste, o Cypress faz uma requisição rápida via API (`cy.request()`) para criar os usuários ou produtos necessários para aquele cenário específico.

- Dados verdadeiramente únicos: Para evitar conflitos de cadastro duplicado (como o clássico erro "Este email já está cadastrado"), uso o gerador dinâmico do Faker e a função `Date.now()`. Isso gera strings numéricas únicas baseadas nos milissegundos atuais, permitindo que os testes rodem infinitas vezes em paralelo sem que um atrapalhe o outro.


### `failOnStatusCode: false`

Usado exclusivamente em requisições onde o teste valida respostas de erro HTTP (4xx), para evitar que o Cypress interrompa o teste antes da asserção.

---