import mongoose from 'mongoose';

/** Conecta ao MongoDB (Atlas). Sem `useNewUrlParser` etc. — Mongoose 8 usa os defaults modernos. */
export async function connectDb(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose.connection;
}
