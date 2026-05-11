import { z } from 'zod';

const direccionRegex = /^[a-zA-Z0-9\s\-ñáéíóúÁÉÍÓÚ.]+$/;
const numeroExteriorInteriorRegex = /^[0-9][0-9A-Z\-]*$/;
const coloniaRegex = /^[a-zA-Z\sÁÉÍÓÚáéíóúñÑ.]+$/;
const ciudadRegex = /^[a-zA-Z\sÁÉÍÓÚáéíóúñÑ.]+$/;
const estadoRegex = /^[a-zA-Z\sÁÉÍÓÚáéíóúñÑ]+$/;

export const solicitudServicioSchema = z.object({
    
    calle: z.string()
        .min(3, 'La calle debe tener al menos 3 caracteres')
        .max(100, 'La calle no puede superar 100 caracteres')
        .regex(direccionRegex, 'Solo se permiten letras, numeros, espacios, acentos, ñ, guion y punto'),

    numero_exterior: z.string()
        .min(1, 'El número exterior es obligatorio')
        .max(20, 'El número exterior no puede superar 20 caracteres')
        .regex(numeroExteriorInteriorRegex, 'Solo se permiten números al inicio, letras mayúsculas y guión'),

    numero_interior: z.string()
        .max(20, 'El número interior no puede superar 20 caracteres')
        .regex(numeroExteriorInteriorRegex, 'Solo se permiten números al inicio, letras mayúsculas y guión')
        .optional()
        .or(z.literal("")),

    colonia: z.string()
        .min(3, 'La colonia debe tener al menos 3 caracteres')
        .max(100, 'La colonia no puede superar 100 caracteres')
        .regex(coloniaRegex, 'Solo se permiten letras, puntos, espacios, ñ y acentos'),

    ciudad: z.string()
        .min(3, 'La ciudad debe tener al menos 3 caracteres')
        .max(100, 'La ciudad no puede superar 100 caracteres')
        .regex(ciudadRegex, 'Solo se permiten letras, puntos, espacios, ñ y acentos'),

    estado: z.string()
        .min(3, 'El estado debe tener al menos 3 caracteres')
        .max(100, 'El estado no puede superar 100 caracteres')
        .regex(estadoRegex, 'Solo se permiten letras, espacios, ñ y acentos'),

    codigo_postal: z.string()
        .regex(/^\d{5}$/, 'El código postal debe ser válido (5 dígitos)'),

    referencia: z.string()
        .max(200, 'La referencia no puede superar 200 caracteres')
        .optional()
        .or(z.literal("")),

    descripcion: z.string()
        .max(500, 'La descripción no puede superar 500 caracteres')
        .optional()
        .or(z.literal("")),

    
    servicio_id: z.number()
        .int('El servicio debe ser un número entero')
        .positive('El servicio debe ser válido'),


    prestador_id: z.number()
        .int('El prestador debe ser un número entero')
        .positive('El prestador debe ser válido')
}).strict();

