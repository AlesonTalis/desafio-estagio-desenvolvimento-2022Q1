using System.IO;
using System.Text;

namespace CVSLeitor
{
  public static class Program
  {
    public static void Main(string[] args)
    {
      bool isLocal = args.Contains("--local");
      bool isResultPath = args.Contains("--result");
      string resultPath = isResultPath ? args[Array.IndexOf(args, "--result") + 1] : "result.json";

      string dataFile = $"{(isLocal?"/../../":"")}/data/cadastros.csv";

      var file = File.ReadAllLines(Directory.GetCurrentDirectory() + dataFile);
      string[] s = new [] { "," };

      // tamanho do arquivo
      // Console.WriteLine(file.Length);
      List<Cadastro> cadastros = new List<Cadastro>();
      foreach(var c in file)
      {
        cadastros.Add(new Cadastro(c.Split(s, StringSplitOptions.RemoveEmptyEntries), false));
      }

      Console.WriteLine(cadastros.Status());
      File.WriteAllText(resultPath, cadastros.GetResult("--success", "--error"));
    }
  }
}