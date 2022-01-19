import Receita from "../models/Receita";
import dbConnect from "../config";
import { NextApiRequest, NextApiResponse } from "next";

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const receita = await Receita.find({ _id: id });
        res.status(200).json({ success: true, receita });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case "PUT":
      try {
        const { descricao, valor, data } = req.body;
        if (!descricao && !valor && !data) return "Dados inválidos";
        const resposta = await Receita.updateOne(
          { _id: id },
          { descricao, valor, data }
        );

        if (resposta.matchedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: `Alterada receita id ${id}` });
        } else {
          res
            .status(500)
            .json({
              success: false,
              message: `A id ${id} não existe no banco de dados`,
            });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case "DELETE":
      try {
        const resposta = await Receita.deleteOne({ _id: id });
        if (resposta.deletedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: `Deletada receita id ${id}` });
        } else {
          res
            .status(500)
            .json({
              success: false,
              message: `A id ${id} não existe no banco de dados`,
            });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;
  }
}
