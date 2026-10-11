import mongoose from 'mongoose';

/** admin_users — só credencial. Sem perfil, sem PII além do e-mail de login. */
const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const AdminUser = mongoose.model('AdminUser', adminUserSchema, 'admin_users');
