using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;

namespace CVSLeitor
{
  public class TelefoneNumero
  {
    public int codArea;
    public List<int> telefone;

    public string raw;
    private int[] fullRaw;

    public string numero => $"({codArea}) {string.Join("",telefone.GetRange(0,5))}-{string.Join("",telefone.GetRange(5,4))}";

    public TelefoneNumero() {}

    public TelefoneNumero(string raw, int[] _telefone)
    {
      this.raw = raw;
      fullRaw = _telefone;

      codArea = Convert.ToInt32(_telefone[0] + "" + _telefone[1]);
      telefone = _telefone.ToList().GetRange(2,_telefone.Length - 2);
    }
  }
}