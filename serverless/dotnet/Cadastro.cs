using System.Globalization;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Text.Unicode;

namespace CVSLeitor
{
  public class CadastroStatus 
  {
    public string type {get;set;}
    public string msg {get;set;}
    public string? loc {get;set;}
  }
  public class Cadastro
  {
    const string DATA_FORMATO = @"dd \de MMMM \de yyyy";

    static JsonSerializerOptions options = new JsonSerializerOptions
    {
        // Encoder = JavaScriptEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.Cyrillic),
        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        // WriteIndented = true
    };
    // nome,email,cpf,celular,idade,data_nascimento,data_cadastro
    public string status => _status.GetStatus();
    public string nome
    {
      get 
      {
        return _nome;
      }
    }
    public string email 
    {
      get
      {
        return _email;
      }
    }
    public string cpf 
    {
      get
      {
        List<int> c = _cpf.ToList();
        return $"{string.Join("",c.GetRange(0,3))}.{string.Join("",c.GetRange(3,3))}.{string.Join("",c.GetRange(6,3))}-{string.Join("",c.GetRange(9,2))}";
      }
    }
    public string celular 
    {
      get
      {
        return _celular.numero;
      }
    }
    public string idade
    {
      get
      {
        return $"{_idade} anos";
      }
    }
    public string data_nascimento
    {
      get
      {
        return _data_nascimento.ToString(DATA_FORMATO, CultureInfo.CreateSpecificCulture("pt-BR"));
      }
    }
    public string data_cadastro
    {
      get
      {
        return _data_cadastro.ToString(DATA_FORMATO, CultureInfo.CreateSpecificCulture("pt-BR"));
      }
    }


    private List<CadastroStatus> _status;
    private string _nome;
    private string _email;
    private int[] _cpf;
    private TelefoneNumero _celular;
    private int _idade;
    private DateOnly _data_nascimento;
    private DateOnly _data_cadastro;


    private string _raw;



    public Cadastro() {}
    public Cadastro(string[] data, bool _exception = true)
    {
      // nome,email,cpf,celular,idade,data_nascimento,data_cadastro
      _raw = string.Join(",",data);

      _status = new();
      if (data.Length < 7)
      {
        AddStatus("err",$"ERRO: Comprimento dos dados invalido: Menor que 07 argumentos.", "length");
        return;
      }

      _nome = data[0];// Nome

      if (!data[1].ParseEmail()) AddStatus("err",$"Email invalido em {data[1]}", "email"); else _email = data[1];

      bool cpfInvalido = !data[2].ParseCPF(out int[] _cpf);
      if (cpfInvalido) AddStatus("err", $"O CPF {data[2]} é inválido.", "cpf"); else this._cpf = _cpf;

      bool telefoneInvalido = !data[3].ParseTelefone(out int[] _telefone);
      if (telefoneInvalido) AddStatus("err", $"O número de telefone {data[3]} é inválido.", "celular"); else this._celular = new TelefoneNumero(data[3], _telefone);
      
      bool idadeInvalida = !data[4].ParseIdade(out int _idade);
      if (idadeInvalida) AddStatus("err", $"O valor para idade {data[4]} está inválido.", "idade"); else this._idade = _idade;

      bool dataNascimentoInvalida = !data[5].ParseData(out DateOnly _data_nascimento);
      if (dataNascimentoInvalida) AddStatus("err", $"A data {data[5]} para \"Data de Nascimento\" está inválida.", "data_nascimento"); else this._data_nascimento = _data_nascimento;
      
      bool dataCadastroInvalida = !data[6].ParseData(out DateOnly _data_cadastro);
      if (dataCadastroInvalida) AddStatus("err", $"A data {data[6]} para \"Data de Cadastro\" está inválida.", "data_cadastro"); else this._data_cadastro = _data_cadastro;
    }

    public void AddStatus(string status, string msg, string? location = null)
    {
      if (_status == null) _status = new();

      _status.Add(new() {
        type = status,
        msg = msg,
        loc = location
      });
    }

    public string? GetErrorJson()
    {
      return _status.HasErrors() ? $"{{\"status\":\"error\",\"data\":{JsonSerializer.Serialize(_status.Errors(),options)},\"values\":\"{_raw}\"}}" : null;
    }

    public string? GetSuccessJson()
    {
      return !_status.HasErrors() ? JsonSerializer.Serialize(this, options) : null;
    }
  }

  public static class CadastroExtensions
  {
    static Regex emailReg = new Regex(@"/^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/gm");
    static string _email = @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z";

    public static bool ParseEmail(this string value)
    {
      MatchCollection collection = emailReg.Matches(value);

      if (collection.Count > 0)
      {
        Console.WriteLine($"{collection.Count} matches found in: {value}");
        return true;
      }

      // return emailReg.IsMatch(value);
      return Regex.IsMatch(value, _email, RegexOptions.IgnoreCase);
    }

    public static bool ParseCPF(this string cpfString, out int[] cpfNumeros)
    {
      List<int> numeros = new();
      cpfNumeros = new int[0];

      foreach(char c in cpfString)
      {
        if (char.IsDigit(c))
          numeros.Add(c.ToInt32());
      }

      if (numeros.Count != 11)
        return false;

      cpfNumeros = numeros.ToArray();

      return true;
    }

    public static bool ParseTelefone(this string telefoneString, out int[] telefoneNumeros)
    {
      telefoneNumeros = new int [0];

      // (31) 9164-05374
      List<int> numeros = new();
      foreach(char c in telefoneString)
        if (char.IsDigit(c))
          numeros.Add(c.ToInt32());
      
      if (numeros.Count == 0) return false;

      if (numeros[0] == 0) numeros = new(numeros.GetRange(1,numeros.Count - 1));

      telefoneNumeros = numeros.ToArray();

      if (numeros.Count == 11) return true;

      return false;
    }

    public static bool ParseIdade(this string idadeString, out int idade)
    {
      idade = 0;

      try
      {
        idade = Convert.ToInt32(idadeString);
      }
      catch {
        return false;
      }

      return true;
    }

    public static bool ParseData(this string dataString, out DateOnly data)
    {
      data = new DateOnly();

      List<int> _data = new();
      List<string> _dataString = new();

      foreach(char c in dataString)
        if (char.IsDigit(c))
          _dataString.Add(c.ToString());

      if (_dataString.Count == 8)
      {
        _data.Add((_dataString[0]+_dataString[1]).ToInt32());
        _data.Add((_dataString[2]+_dataString[3]).ToInt32());
        _data.Add((_dataString[4]+_dataString[5]+_dataString[6]+_dataString[7]).ToInt32());

        data = new DateOnly(_data[2],_data[1],_data[0]);

        return true;
      }

      return false;
    }

    public static bool HasErrors(this List<CadastroStatus> list)
    {
      return list.Where(l => l.type == "err").ToList().Count() > 0;
    }

    public static List<CadastroStatus> Errors(this List<CadastroStatus> list)
    => list.Where(l => l.type == "err").ToList();

    

    public static string Status(this List<Cadastro> cadastros)
    {
      List<string> _status = new();

      foreach(var c in cadastros)
      {
        if (!string.IsNullOrEmpty(c.status))
        {
          _status.Add($"{c.status}");
        }
      } 

      return string.Join("\n",_status);
    }

    public static string GetResult(this List<Cadastro> list, params string[] args)
    {
      string result = "{\"result:\":[";
      

      foreach(var arg in args)
      {
        switch(arg)
        {
          case "--error":
            result += $"{{\"status\":\"error\",\"data\":[{list.GetFieldsWith("error")}]}},";
          break;
          case "--success":
          default:
            result += $"{{\"status\":\"success\",\"data\":[{list.GetFieldsWith("success")}]}},";
          break;
        }
      }

      return result.Substring(0,result.Length - 1) + "]}";
    }

    public static string GetFieldsWith(this List<Cadastro> list, string status)
    {
      string m = "";
      foreach(var c in list)
      {
        switch(status)
        {
          case "error":
            string? _m = c.GetErrorJson();
            if (_m != null)
              m+= $"{_m},";
          break;
          case "success":
            string? _n = c.GetSuccessJson();
            if (_n != null)
              m+= $"{_n},";
          break;
        }
      }
      return m.Substring(0,m.Length-1);
    }

    public static string GetStatus(this List<CadastroStatus> list)
    {
      List<string> msg = new();
      foreach(var c in list) msg.Add($"{c.type} => {c.msg}");

      return string.Join("\n", msg);
    }
  }
}