// validação de email
const emailReg = /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/gm

// validação de telefone
const telefoneReg = /^((0|)(\d{2})|\((0|)\d{2}\))(| )(((\d{4})(-| |)(\d{5}))|((\d{5})(-| )(\d{4})))$/gm

// validação de cpf
const cpfReg = /^([0-9]{3})\.?([0-9]{3})\.?([0-9]{3})\-?([0-9]{2})$/gm

// validação de nome sem acentos
const nomeSemAcento = /[0-9]{1,}/g

// validação de data em geral
const dataReg = /(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]{1}|[1-9]{1}|1[0-2]{1})\/(?<!\d)(\d{2}|\d{4})(?!\d)/gm

// idade
const idadeReg = /([0-9]{1,3})/gm


class Cadastro
{
  #nome
  #email
  #cpf
  #telefone
  #idade
  #dataNascimento
  #dataCadastro

  #valido = false
  #status = ""
  #erroLoc = ""

  get valido() { return this.#valido }
  get status() { return this.#status }

  get nome() { return this.#nome }


  constructor(data, index, nomesComAcento = false)
  {
    // regex

    
    if (data.length != 7)
    {
      this.#status = `${data.length} não tem a quantidade aceitavel de parametos.`
      return
    }

    // validações
    if (!this.validar('nome', nomeSemAcento, data[0], true, (sts,value) => { if (sts===true) this.#nome = value })) return
    if (!this.validar('email', emailReg, data[1], false, (sts, value) => { if (sts === true) this.#email = value })) return
    if (!this.validar('cpf', cpfReg, data[2], false, (sts, value) => { if (sts === true) this.#cpf = value })) return
    if (!this.validar('telefone', telefoneReg, data[3], false, (sts, value) => { if (sts === true) this.#telefone = value })) return
    if (!this.validar('idade', idadeReg, data[4], false, (sts, value) => { if (sts === true) this.#idade = value })) return
    if (!this.validar('nascimento', dataReg, data[5], false, (sts, value) => { if (sts === true) this.#dataNascimento = value })) return
    if (!this.validar('cadastro', dataReg, data[6], false, (sts, value) => { if (sts === true) this.#dataCadastro = value })) return

    this.#valido = true
  }

  /**
   * 
   * @returns Json
   */
  toJSON()
  {
    return this.#valido === true ? {
      Status: "valido",
      NomeCompleto: this.#nome,
      Email: this.#email,
      Telefone: this.#telefone,
      DataDeCadastro: this.#dataCadastro,
      DataNascimento: this.#dataNascimento,
      Idade: this.#idade,
      CPF: this.#cpf
    } : {
      Status: "invalido",
      Location: this.#erroLoc,
      Message: this.#status
    }
  }

  validar(_nome, regex, data, inverte = false, callback = (sts,value) => null)
  {
    let m
    let s = false
    let _m = false

    while ((m = regex.exec(data)) !== null)
    {
      s = true
      if (m.index === regex.lastIndex) { regex.lastIndex++ }
      m.forEach((match, groupIndex) => {
        if (groupIndex == 0) _m = match
      })
    }

    if (inverte) s = !s;

    if (!s) 
    {
      this.#status = `O valor ${data} é invalido para ${_nome}`
      this.#erroLoc = _nome

      console.log(this.#status)
    }

    callback(s, data)

    return s
  }

  validaErros(data)
  {

  }
}

module.exports = {
  Cadastro: Cadastro
}