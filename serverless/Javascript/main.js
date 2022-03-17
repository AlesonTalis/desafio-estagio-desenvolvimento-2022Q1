fs = require("fs");
const path = "../../data/cadastros.csv"

const result = process.argv !== null && process.argv[process.argv.length - 1] !== null ? process.argv[process.argv.length - 1] : "result.json"
// console.log(process.argv)

// classe Cadastro
Cadastro = require('./Cadastro.js').Cadastro

function ParseCVSToArray(_path, _callback, _error)
{
  try
  {
    const filename = require.resolve(path)

    fs.readFile(filename, 'utf8', (e,data) => {

      if (e) return console.log(e)

      const splited = data.split(/\r\n?|\n/).map(p => { return p.split(/\,/) })

      _callback(splited)

    })
  }
  catch(e)
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

  fs.writeFile(result, JSON.stringify({

    CadastrosSalvos: cadastros, 

    Erros: erros

  }), (err) => {

    if (err) throw err

  })


}, (e) => {console.log(e)})

