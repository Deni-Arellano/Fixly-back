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

export const cambiarContraseiaSchema = z.object({
  contrasena_actual: z.string()
    .min(8, 'La contraseña actual debe de tener al menos 8 caracteres'),
  contrasena_nueva: z.string()
    .min(8, 'La contraseña nueva debe de tener al menos 8 caracteres')
    .max(20, 'La contraseña nueva no puede superar los 20 caracteres')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "La contraseña nueva debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"),
  contrasena_confirmacion: z.string()
    .min(8, 'La confirmación de contraseña debe de tener al menos 8 caracteres')
}).refine((data) => data.contrasena_nueva === data.contrasena_confirmacion, {
  message: "Las contraseñas nuevas no coinciden",
  path: ["contrasena_confirmacion"],
}).refine((data) => data.contrasena_actual !== data.contrasena_nueva, {
  message: "La contraseña nueva debe ser diferente a la actual",
  path: ["contrasena_nueva"],
});