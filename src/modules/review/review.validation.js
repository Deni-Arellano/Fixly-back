import { z } from 'zod';

export const crearCalificacionSchema = z.object({
    estrellas: z.number()
        .int('Las estrellas deben ser un número entero')
        .min(1, 'Las estrellas deben ser mínimo 1')
        .max(5, 'Las estrellas deben ser máximo 5'),
    
    comentario: z.string()
        .max(500, 'El comentario no puede superar 500 caracteres')
        .optional()
        .or(z.literal(""))
});
