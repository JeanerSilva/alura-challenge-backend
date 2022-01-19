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

async function verificaMesmaReceitaNoMesmoMes(res: NextApiResponse, descricao: String, data: Date):Promise<boolean> {
  const {dataInicial, dataFinal } = obtemDatasLimite(data)
  
  try {
    const receitas = await Receita.find({
      data: {
        $gte:new Date(dataInicial),
        $lte:new Date(dataFinal),
    }
    });
    const resultado = receitas.find(d => d.descricao === descricao)
    const existeMesmaReceitaNoMesmoMes = resultado ? false : true
    //res.status(200).json({ existeMesmaReceitaNoMesmoMes , resultado });
    return existeMesmaReceitaNoMesmoMes

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
        const existeMesmaReceitaNoMesmoMes = await verificaMesmaReceitaNoMesmoMes(res, descricao, data)
        if (existeMesmaReceitaNoMesmoMes) {
          const receita = await Receita.create({ descricao, valor, data });
          res.status(201).json({ success: true, data: receita });
           res.status(201).json({ success: true, data: existeMesmaReceitaNoMesmoMes });
        } else {
          res
            .status(500)
            .json({
              success: false,
              error: "Já existe a mesma receita neste mês",
            });
        }
        console.log(`existeMesmaReceitaNoMesmoMes =  ${existeMesmaReceitaNoMesmoMes}`)
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
    }
  }
}
