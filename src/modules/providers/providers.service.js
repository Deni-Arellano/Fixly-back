import * as providersModel from './providers.model.js';

export const obtenerPrestadoresPorCategoria = async (categoria_id) => {
    const prestadores = await providersModel.obtenerPrestadoresPorCategoria(categoria_id);
    
    if (!prestadores || prestadores.length === 0) {
        const error = new Error('No se encontraron prestadores para esta categoría');
        error.codigo = 404;
        throw error;
    }

    return prestadores.map(prestador => {
        return {
            id: prestador.id,
            nombre_completo: [
                prestador.nombre,
                prestador.apellido_paterno,
                prestador.apellido_materno
            ].filter(Boolean).join(" "),
            foto_perfil: prestador.foto_perfil,
            id_prestador: prestador.id_prestador,
            descripcion: prestador.descripcion
        };
    });
}
