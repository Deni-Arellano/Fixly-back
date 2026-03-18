import { z } from 'zod';

const nombreRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/;
const telefonoRegex = /^\d{10,15}$/;
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
const rfcRegex = /^[A-Z0-9]{13}$/;


const usuarioSchema = z.object({
    correo: z.email('El correo no es válido'),
    contrasena: z.string()
        .min(8, 'La contraseña debe de tener al menos 8 caracteres')
        .max(20, 'La contraseña no puede superarlos 20 caracteres')
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
            "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial")
}).strict();

const datosPersonalesSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .regex(nombreRegex, "Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto"),

  primer_apellido: z.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede superar los 100 caracteres")
    .regex(nombreRegex, "Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto"),

  segundo_apellido: z.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede superar los 100 caracteres")
    .regex(nombreRegex, "Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto")
    .optional(),

  telefono: z.string()
    .regex(telefonoRegex, "El teléfono debe contener entre 10 y 15 dígitos"),

  fecha_nacimiento: z.string()
    .regex(fechaRegex, "Formato de fecha inválido (YYYY-MM-DD)"),

  rfc: z.string()
    .regex(rfcRegex, "El RFC debe tener exactamente 13 caracteres alfanuméricos en mayúsculas")
}).strict();

export const usuarioAgregarSchema = z.object({
    usuario: usuarioSchema,
    datos_personales: datosPersonalesSchema
});

const datosPersonalesAutoEdicionSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto')
    .optional(),

  primer_apellido: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto')
    .optional(),

  segundo_apellido: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto')
    .optional(),

  telefono: z.string()
    .regex(telefonoRegex, 'El teléfono debe contener entre 10 y 15 dígitos')
    .optional(),

  fecha_nacimiento: z.string()
    .regex(fechaRegex, 'Formato de fecha inválido (YYYY-MM-DD)')
    .optional()
}).strict();


const datosPersonalesAdminSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto')
    .optional(),
  primer_apellido: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto')
    .optional(),
  segundo_apellido: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede superar los 100 caracteres')
    .regex(nombreRegex, 'Solo se permiten letras, espacios, acentos, ñ, guion, apóstrofe y punto')
    .optional(),
  telefono: z.string()
    .regex(telefonoRegex, 'El teléfono debe contener entre 10 y 15 dígitos')
    .optional(),
  fecha_nacimiento: z.string()
    .regex(fechaRegex, 'Formato de fecha inválido (YYYY-MM-DD)')
    .optional(),
  rfc: z.string()
    .regex(rfcRegex, 'El RFC debe tener exactamente 13 caracteres alfanuméricos en mayúsculas')
    .optional()
}).strict();


export const autoEdicionSchema = z.object({
  datos_personales: datosPersonalesAutoEdicionSchema.optional()
}).strict();

export const superadministradorEdicionSchema = z.object({
  usuario: z.object({
    correo: z.email('El correo no es válido')
      .min(5, 'El correo debe tener al menos 5 caracteres')
      .optional(),
    activo: z.number('El campo activo debe ser un número')
      .int('El campo activo debe ser un número entero')
      .min(0, 'El campo activo debe ser 0 o 1')
      .max(1, 'El campo activo debe ser 0 o 1')
      .optional(),
    verificado: z.number('El campo verificado debe ser un número')
      .int('El campo verificado debe ser un número entero')
      .min(0, 'El campo verificado debe ser 0 o 1')
      .max(1, 'El campo verificado debe ser 0 o 1')
      .optional()
  }).optional(),

  datos_personales: datosPersonalesAdminSchema.optional()
}).strict();


export const administradorEdicionSchema = z.object({
  usuario: z.object({
    activo: z.number('El campo activo debe ser un número')
      .int('El campo activo debe ser un número entero')
      .min(0, 'El campo activo debe ser 0 o 1')
      .max(1, 'El campo activo debe ser 0 o 1')
      .optional(),
    verificado: z.number('El campo verificado debe ser un número')
      .int('El campo verificado debe ser un número entero')
      .min(0, 'El campo verificado debe ser 0 o 1')
      .max(1, 'El campo verificado debe ser 0 o 1')
      .optional()
  }).optional(),

  datos_personales: datosPersonalesAdminSchema.optional()
}).strict();

export const estadoSchema = z.object({
  activo: z.number('El campo activo debe ser un número')
      .int('El campo activo debe ser un número entero')
      .min(0, 'El campo activo debe ser 0 o 1')
      .max(1, 'El campo activo debe ser 0 o 1')
}).strict();
