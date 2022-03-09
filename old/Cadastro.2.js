// validação de email
const emailReg = /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/gm

// validação de telefone
const telefoneReg = /^((0|)(\d{2})|\((0|)\d{2}\))(| )(((\d{4})(-| |)(\d{5}))|((\d{5})(-| )(\d{4})))$/gm
// https://regex101.com/r/bN9tTb/1

// validação de cpf
const cpfReg = /^([0-9]{3})\.?([0-9]{3})\.?([0-9]{3})\-?([0-9]{2})$/gm

// validação de nome com acentos
const nomeComAcento = /^(([a-zA-ZA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]){1,})(?: [a-zA-ZA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+){1,}$/gm // https://regex101.com/r/4XN536/1

// validação de nome sem acentos
const nomeSemAcento = /[0-9]{1,}/g

// validação de data em geral
const dataReg = /(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]{1}|[1-9]{1}|1[0-2]{1})\/(?<!\d)(\d{2}|\d{4})(?!\d)/gm

// letra maiuscula
const letraMaius = /[0-9]{1,}/g



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
    const idadeReg = /([0-9]{1,3})/gm // https://regex101.com/r/9gmqVf/1

    // /(\(?\d{2}\)?)\s?(\d{5})-(\d{4})/gi
    
    if (data.length != 7)
    {
      this.#status = `${data.length} não tem a quantidade aceitavel de parametos.`
      return
    }

    // validações
    // nome
    // if (!this.validarNomeCompleto(data[0])) return
    if (!this.validar('nome', nomeSemAcento, data[0], true, (sts,value) => { if (sts===true) this.#nome = value })) return

    // if (!this.validarEmail(data[1])) return
    if (!this.validar('email', emailReg, data[1], false, (sts, value) => { if (sts === true) this.#email = value })) return
    // if (!this.validarCPF(data[2], true)) return
    if (!this.validar('cpf', cpfReg, data[2], false, (sts, value) => { if (sts === true) this.#cpf = value })) return
    // if (!this.validarTelefone(data[3])) return
    if (!this.validar('telefone', telefoneReg, data[3], false, (sts, value) => { if (sts === true) this.#telefone = value })) return
    // idade
    if (!this.validar('idade', idadeReg, data[4], false, (sts, value) => { if (sts === true) this.#idade = value })) return
    
    // if (!this.validarData(data[5],true)) return
    if (!this.validar('nascimento', dataReg, data[5], false, (sts, value) => { if (sts === true) this.#dataNascimento = value })) return
    
    // if (!this.validarData(data[6])) return
    if (!this.validar('cadastro', dataReg, data[6], false, (sts, value) => { if (sts === true) this.#dataCadastro = value })) return

    this.#valido = true
  }

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
      Status: "Inválido",
      Location: this.#erroLoc,
      Message: this.#status
    }
  }

  // validarEmail(_email)
  // {
  //   let m
  //   while ((m = emailReg.exec(_email)) !== null)
  //   {
  //     this.#email = m[0]
  //     return true
  //   }
    
  //   this.#status = `O email '${_email}' está inválido`
  //   return false
  // }

  // validarTelefone(_telefone)
  // {

  //   if (!telefoneReg.test(_telefone))
  //   {
  //     this.#status = `O número de telefone '${_telefone}' está inválido.`
  //     return false
  //   }
  //   this.#telefone = _telefone
  //   return true
  // }

  // validarCPF(_cpf, completo = true)
  // {
  //   if (!cpfReg.test(_cpf))
  //   {
  //     this.#status = `O CPF '${_cpf}' está inválido.`
  //     return false
  //   }

  //   var _cpfValidado = _cpf.replace(/\./g,"")

  //   if (_cpfValidado == "00000000000")
  //   {
  //     this.#status = "Este CPF é nulo."
  //     return false;
  //   }

  //   var soma;
  //   var resto;

  //   this.#cpf = _cpfValidado
  //   return true
  // }

  // validarNomeCompleto(_nome, _comAcento = false)
  // {
  //   // const nomeReg = _comAcento === true ? nomeComAcento : nomeSemAcento
  //   let m

  //   if ((m = nomeSemAcento.exec(_nome)) !== null)
  //   {
  //     this.#nome = m[0]
  //     // console.log(this.#nome)
  //     return true
  //   }
    
  //   this.#status = `O nome '${_nome}' está inválido.`
  //   return false
  // }

  // validarData(_data, _nascimento = true)
  // {

  //   // _data = _data.slice(0,10) + ". "
  //   // var _ndata = _data.split(".")[0]
  //   let m
  //   let s = false
  //   let _m = false

  //   while ((m = dataReg.exec(_data)) !== null)
  //   {
  //     s = true
  //     if (m.index === dataReg.lastIndex) dataReg.lastIndex++
  //     m.forEach((match, groupIndex) => {
  //       if (match.length == 10) _m = match
  //     })
  //   }

  //   if (s === true)
  //   {
  //     if (_m === false) _m = _data
  //     if (_nascimento === true)
  //       this.#dataNascimento = _m
  //     else
  //       this.#dataCadastro = _m

  //     return true
  //   }
    
  //   this.#status = `A data '${_data}' para ${_nascimento ? 'nacimento' : 'cadastro'} é inválida.`
  //   return false
  // }

  validar(_nome, regex, data, inverte = false, callback = (sts,value) => null)
  {
    // console.log(`validando ${data}`)
    // _data = _data.slice(0,10) + ". "
    // var _ndata = _data.split(".")[0]
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

    callback(s, _m)

    return s
  }

  validaErros(data)
  {

  }
}

module.exports = {
  Cadastro: Cadastro
}