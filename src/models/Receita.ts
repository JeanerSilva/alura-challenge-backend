import mongoose from "mongoose";

const ReceitaSchema = new mongoose.Schema({
  descricao: String,
  valor: String,
  data: {
    type: Date,
    default: new Date(),
  },
});

const Receita = mongoose.models.Receita || mongoose.model("receita", ReceitaSchema);

export default Receita;
