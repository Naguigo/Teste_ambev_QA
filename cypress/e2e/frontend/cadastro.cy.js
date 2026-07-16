/**
 * TE02 — Cadastro de novo usuário no frontend
 */

import CadastroPage       from '../../pages/CadastroPage'
import { UsuariosApi }    from '../../support/api/UsuariosApi'
import { usuarioFactory } from '../../factories/usuarioFactory'

describe('TE02 - Cadastro de novo usuário', () => {

  it('TE02-01: deve cadastrar usuário válido, fazer login automático e ir para a home',
    { tags: ['@smoke', '@regression'] },
    () => {
      CadastroPage.cadastrar(usuarioFactory.comum())
      CadastroPage.deveRedirecionarParaHomeStore()
    })

  it('TE02-02: deve exibir erro exato ao cadastrar com e-mail já existente',
    { tags: ['@regression'] },
    () => {
      const usuario = usuarioFactory.comum()

      UsuariosApi.criar(usuario).then(() => {
        CadastroPage.cadastrar(usuario)
        CadastroPage.deveExibirErroEmailDuplicado()
      })
    })

  it('TE02-03: deve exibir validação por campo ao submeter formulário vazio',
    { tags: ['@regression'] },
    () => {
      CadastroPage.visitar().submeter()
      CadastroPage.deveExibirValidacaoDeCamposObrigatorios()
    })
})
