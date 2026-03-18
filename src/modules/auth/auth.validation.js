import { z } from 'zod';

export const loginSchema = z.object({
  correo: z.email('El correo no es válido'),
  contrasena: z.string()
  .min(8, 'La contraseña debe de tener al menos 8 caracteres')
  .max(20, 'La contraseña no puede superarlos 20 caracteres')
  .regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
    "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial")
});