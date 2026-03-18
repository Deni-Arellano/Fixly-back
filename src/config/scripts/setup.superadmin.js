import 'dotenv/config';
import pool from '../db.js';
import bcrypt from 'bcrypt';

async function crearSuperAdmin( ) {
    const connection = await pool.getConnection();
    let transaccionIniciada = false;

    try{
        
        const email = process.env.SUPER_EMAIL;
        const contrasena = process.env.SUPER_PW;

        if (!email || !contrasena){
            throw new Error('Faltan SUPER_EMAIL o SUPER_PW en el archivo .env');
        }

        const contrasenaHash = await bcrypt.hash(contrasena, 12);

        await connection.beginTransaction();
        transaccionIniciada = true;


        const [resultadoInsertado] = await connection.execute(
        `INSERT INTO usuarios (correo, contrasena_hash,  fecha_registro, id_rol,)
        VALUES (?, ?,  NOW(), ?)`,
        [email, contrasenaHash, 1]  
        );
        
        const idUsuario = resultadoInsertado.insertId;

        await connection.execute(
            `INSERT INTO datos_personales (id_usuario, nombre, primer_apellido, telefono, fecha_nacimiento, rfc) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [idUsuario, 'Deni', 'Admin', '0000000000', '2000-01-01', 'XAXX010101000']
        );

        await connection.commit();
        console.log('Superdaministrador creado con éxito');  

    } catch (error){
        if (transaccionIniciada) {
            await connection.rollback();
        }
            
        console.error('No se pudo agregar el Superadministrador', error.message);

    } finally{
        if (connection) connection.release();
        process.exit();
    }
}
crearSuperAdmin()
