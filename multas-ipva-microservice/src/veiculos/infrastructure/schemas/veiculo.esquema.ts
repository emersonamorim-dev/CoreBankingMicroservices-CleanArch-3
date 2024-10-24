import { Schema, Document } from 'mongoose';

export const VeiculoEsquema = new Schema({
  placa: { type: String, required: true },
  multas: { type: Number, required: true },
  ipva: { type: Number, required: true },
  idProprietario: { type: String, required: true },
});

export interface VeiculoDocumento extends Document {
  placa: string;
  multas: number;
  ipva: number;
  idProprietario: string;
}
