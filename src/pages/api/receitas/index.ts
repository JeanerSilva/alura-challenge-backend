import Receita from "../models/Receita";
import dbConnect from "../config";

dbConnect();

export default async function handler(req, res) {
  const { method } = req;
  
  if (method === "POST"){
      try {
        const { descricao, valor, data } = req.body;

        if (!descricao && !valor && !data) throw "Falta dados para inserção";
        const receita = await Receita.create({ descricao, valor, data });

        res.status(201).json({success:true, data:receita});
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
   
  }
}
