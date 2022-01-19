import mongoose from "mongoose";

const DespesaSchema = new mongoose.Schema({
  descricao: String,
  valor: String,
  data: {
    type: Date,
    default: new Date(),
  },
});

const Despesa = mongoose.models.Despesa || mongoose.model("despesa", DespesaSchema);

export default Despesa;