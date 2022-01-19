import Receita from "../models/Receita";
import dbConnect from "../config";
import { NextApiRequest, NextApiResponse } from "next";
import assert from "assert";

dbConnect();

function ehPost(method: String) {
  return method === "POST";
}

async function naoExisteMesmaReceitaNoMesmoMes(
  res: NextApiResponse,
  descricao: String,
  data: Date
): Promise<boolean> {

  data = new Date(data);
  const agg = [
    {
      $project: {
        year: {
          $year: "$data",
        },
        month: {
          $month: "$data",
        },
        descricao: 1,
      },
    },
    {
      $match: {
        year: data.getFullYear(),
        month: data.getMonth()+1,
        descricao: descricao,
      },
    },
  ];

  try {
    const receitas = await Receita.aggregate(agg);
    return receitas.length > 0 ? false : true;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (ehPost(method)) {
    try {
      const { descricao, valor, data } = req.body;

      if (!descricao && !valor && !data) {
        throw "Falta dados para a inserção da receita";
      } else {
        if (await naoExisteMesmaReceitaNoMesmoMes(res, descricao, data)) {
          const receita = await Receita.create({ descricao, valor, data });
          res.status(201).json({ success: true, data: receita });
        } else {
          res.status(500).json({
            success: false,
            error: "Já existe a mesma receita neste mês",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
    }
  }
}
