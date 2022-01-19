import mongoose from "mongoose";

const ReceitaSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  valor: { type: String, required: true , min: [0, 'O valor da receita deve ser superior a zero'],},
  data: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const Receita =
  mongoose.models.Receita || mongoose.model("Receita", ReceitaSchema);

export default Receita;
