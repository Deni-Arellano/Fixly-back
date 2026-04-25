import { z } from 'zod';

const nombreRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/;
const telefonoRegex = /^\d{10,15}$/;


const clienteSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto'),

  apellido_paterno: z.string()
    .min(2, 'El apellido paterno debe tener al menos 2 caracteres')
    .max(100, 'El apellido paterno no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto'),

  apellido_materno: z.string()
    .min(2, 'El apellido materno debe tener al menos 2 caracteres')
    .max(100, 'El apellido materno no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto')
    .optional().or(z.literal("")),

  correo: z.email('El correo no es válido')
    .min(5, 'El correo debe tener al menos 5 caracteres')
    .max(100, 'El correo no puede superar los 100 caracteres'),

  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede superar los 100 caracteres')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    ),

  telefono: z.string()
    .regex(telefonoRegex, 'El teléfono debe contener entre 10 y 15 dígitos')
}).strict();

const prestadorSchema = z.object({
  descripcion: z.string()
    .min(1, 'La descripción es obligatoria'),

  categoria_id: z.number()
    .int('El categoria_id debe ser un número entero')
    .positive('El categoria_id debe ser mayor a 0'),

  servicios: z.array(
    z.number()
      .int('El servicio debe ser un número entero')
      .positive('El servicio debe ser mayor a 0')
  ).min(1, 'Debes seleccionar al menos un servicio')
}).strict();

const integradoPrestadorSchema = z.object({
  usuario: clienteSchema,
  datos_prestador: prestadorSchema
}).strict();

export const clienteRegistroSchema = clienteSchema;
export const prestadorRegistroSchema = integradoPrestadorSchema;
