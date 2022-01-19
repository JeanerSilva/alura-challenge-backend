import Despesa from "../models/Despesa";
import dbConnect from "../config";
import { NextApiRequest, NextApiResponse } from "next";

dbConnect();

function ehPost(method: String) {
  return method === "POST";
}

function ehGet(method: String) {
  return method === "GET";
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
    const despesas = await Despesa.aggregate(agg);
    return despesas.length > 0 ? false : true;
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
        throw "Falta dados para a inserção da despesa";
      } else {
        if (await naoExisteMesmaReceitaNoMesmoMes(res, descricao, data)) {
          const despesa = await Despesa.create({ descricao, valor, data });
          res.status(201).json({ success: true, data: despesa });
        } else {
          res.status(500).json({
            success: false,
            error: "Já existe a mesma despesa neste mês",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
    }
  } else {
    if (ehGet(method)) {
      try {
        const despesas = await Despesa.find({});
        res.status(200).json({ success: true, despesas });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
    }
  }
}
