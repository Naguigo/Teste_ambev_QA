/**
 * TE03 — Gestão de produtos no frontend (área administrativa)
 */

import LoginPage           from '../../pages/LoginPage'
import NavBar              from '../../pages/NavBar'
import CadastroProdutoPage from '../../pages/CadastroProdutoPage'
import ListaProdutosPage   from '../../pages/ListaProdutosPage'
import { UsuariosApi }     from '../../support/api/UsuariosApi'
import { LoginApi }        from '../../support/api/LoginApi'
import { ProdutosApi }     from '../../support/api/ProdutosApi'
import { usuarioFactory }  from '../../factories/usuarioFactory'
import { produtoFactory }  from '../../factories/produtoFactory'

const ADMIN = usuarioFactory.admin()

// Produto fixo para os testes de listagem/exclusão — criado via API no before()
const PRODUTO_PERSISTENTE = produtoFactory.valido({ nome: `Produto Persistente QA ${Date.now()}` })

describe('TE03 - Gestão de produtos (admin)', () => {
  before(() => {
    UsuariosApi.criarIgnorandoErro(ADMIN)
  })

  beforeEach(() => {
    LoginPage.login(ADMIN.email, ADMIN.password)
    LoginPage.deveEstarNaHome()
  })

  it('TE03-01: deve cadastrar um novo produto via UI',
    { tags: ['@smoke', '@regression'] },
    () => {

      const produto = produtoFactory.valido()

      NavBar.irParaCadastrarProdutos()
      CadastroProdutoPage.cadastrar(produto)
      CadastroProdutoPage.deveTerRedirecionadoComProduto(produto.nome)
    })

  it('TE03-02: deve exibir um produto criado via API na listagem',
    { tags: ['@regression'] },
    () => {

      const produto = produtoFactory.valido()

      LoginApi.obterToken(ADMIN.email, ADMIN.password)
        .then((token) => ProdutosApi.criar(token, produto))

      NavBar.irParaListarProdutos()
      ListaProdutosPage.deveExibirProduto(produto.nome)
    })

  it('TE03-03: deve excluir um produto da listagem',
    { tags: ['@regression'] },
    () => {

      const produto = produtoFactory.valido()

      LoginApi.obterToken(ADMIN.email, ADMIN.password)
        .then((token) => ProdutosApi.criar(token, produto))

      NavBar.irParaListarProdutos()
      ListaProdutosPage.excluirProduto(produto.nome)
      ListaProdutosPage.naoDeveExibirProduto(produto.nome)
    })
})