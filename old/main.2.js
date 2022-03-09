fs = require("fs");
Cadastro = require('./Cadastro.2.js').Cadastro

const path = "./data/cadastros.csv"


function ParseCVSToArray(_path, _callback, _error)
{
  try
  {
    const filename = require.resolve(path)
    fs.readFile(filename, 'utf8', (e,data) => {
      if (e) return console.log(e)

      // replace(, ",")
      const splited = data.split(/\r\n?|\n/).map(p => { return p.split(/\,/) })

      _callback(splited)
    })
  }
  catch
  {
    _error(e)
  }
}

ParseCVSToArray(path, (file) => {

  var cadastros = []
  var erros = []

  file.forEach((data, index) => {
    
    var cadastro = new Cadastro(data, index)

    if (cadastro.valido)
      cadastros.push(cadastro)
    else
      erros.push(cadastro)

      return
  })

  fs.writeFile('result.json', JSON.stringify({
    // TotalDeCadastros: cadastros.length, 
    CadastrosSalvos: cadastros, 
    // TotalDeErros: erros.length, 
    Erros: erros
  }), (err) => {
    if (err) throw err
  })


}, (e) => {console.log(e)})

