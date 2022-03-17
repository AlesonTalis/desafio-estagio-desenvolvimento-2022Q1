using System.Text.RegularExpressions;

/*
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
*/

namespace CVSLeitor
{
  public static class Extensions
  {
    public static int ToInt32(this char c)
    {
      return Convert.ToInt32(c.ToString());
    }

    public static int ToInt32(this string s) => Convert.ToInt32(s);

    public static string ToUppercaseWords(this string value)
    {
        char[] array = value.ToCharArray();
        // Handle the first letter in the string.
        if (array.Length >= 1)
        {
            if (char.IsLower(array[0]))
            {
                array[0] = char.ToUpper(array[0]);
            }
        }
        // Scan through the letters, checking for spaces.
        // ... Uppercase the lowercase letters following spaces.
        for (int i = 1; i < array.Length; i++)
        {
            if (array[i - 1] == ' ')
            {
                if (char.IsLower(array[i]))
                {
                    array[i] = char.ToUpper(array[i]);
                }
            }
        }
        return new string(array);
    }
  }
}