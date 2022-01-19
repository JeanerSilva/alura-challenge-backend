import mongoose from "mongoose";

const DespesaSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  valor: { type: String, required: true , min: [0, 'O valor da receita deve ser superior a zero'],},
  data: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const Despesa =
  mongoose.models.Despesa || mongoose.model("despesa", DespesaSchema);

export default Despesa;
