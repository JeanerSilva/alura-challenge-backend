import Receita from "../models/Receita";
import dbConnect from "../config";

dbConnect();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  switch (method) {
    case "PUT":
      try {
        const { descricao, valor, data } = req.body;
        if (!descricao && !valor && !data) return "Dados inválidos";
        await Receita.updateOne({ _id: id }, { descricao, valor, data });
        res.status(200).json({ success: true });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case "DELETE":
      try {
        await Receita.deleteOne({ _id: id });
        res.status(200).json({ success: true });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;
  }
}
