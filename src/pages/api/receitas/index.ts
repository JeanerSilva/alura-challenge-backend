import Receita from "../models/Receita";
import dbConnect from "../config";
import { NextApiRequest, NextApiResponse } from "next";

dbConnect();

function ehPost(method: String) {
  return method === "POST";
}

function obtemDatasLimite (data:Date){
  const dataDate = new Date(data)
  const d = new Date(dataDate.getFullYear(), dataDate.getMonth() + 1, 0);
  const dataInicial = `${dataDate.getFullYear()}-${dataDate.getMonth()+1}-01`
  const ultimoDia = d.getDate()
  const dataFinal = `${dataDate.getFullYear()}-${dataDate.getMonth()+1}-${ultimoDia}`
  return {dataInicial, dataFinal}
}

async function naoExisteMesmaReceitaNoMesmoMes(res: NextApiResponse, descricao: String, data: Date):Promise<boolean> {
  const {dataInicial, dataFinal } = obtemDatasLimite(data)
  
  try {
    const receitas = await Receita.find({
      descricao,
      data: {
        $gte:new Date(dataInicial),
        $lte:new Date(dataFinal),
    }
    });
    
    return receitas.length > 0 ? false : true

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
          res
            .status(500)
            .json({
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
