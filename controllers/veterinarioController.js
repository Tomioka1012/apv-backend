import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarid.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

//registrar a un nuevo veterinario
const registrar = async (req,res) =>{

    const {email,nombre} = req.body;
    
    //prevenir usuarios duplicados

    const existeUsuario = await Veterinario.findOne({email});
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();
        //Enviar el email
        emailRegistro({email,nombre,token: veterinarioGuardado.token});
        

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
        
    }
}
//Mostrar el perfil de un veterinario previamente registrado
const perfil =  (req,res) =>{
    const{veterinario}=req;
    res.json(veterinario);
}

//Función para confirmar la cuenta de un veterinario (confirmación mendiante email)
const confirmar = async (req, res) =>{

    const{token} = req.params;
    const usuarioConfirmar = await Veterinario.findOne({token});
    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }

    try {

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario confirmado correctamente'});

        
    } catch (error) {
        console.log(error);
        
    }

    //console.log(usuarioConfirmar);
    
}

//función para autentincar un usuario previamente registrado
const autenticar = async (req, res) =>{
    const {email,password,confirmado} = req.body;
    //comprobar que el usuario existe
    const usuario = await Veterinario.findOne({email});
    if(!usuario){
        const error = new Error('El usuario no exite');
        return res.status(404).json({msg: error.message});
    }
    //comprobar si el usuario esta confirmado 
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }
    //revisar el password
    if(await usuario.comprobarPassword(password)){
        //Autenticar al usuario 
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
            
        });
    }else{
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message});
    }  
}
//Función para la recuperación de contraseñas
const olvidePassword = async (req, res) =>{
    const {email} = req.body;
    const existeVeterinario = await Veterinario.findOne({email});
    //en caso de que el email no exista
    if(!existeVeterinario){
        const error = new Error('Usuario no existente');
        return res.status(400).json({msg: error.message});
    }
    //Si el email si existe
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        //Enviar email con las instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token

        });
        res.json({msg: 'Hemos enviado un email con las instrucciones (spam)'});
    } catch (error) {
        console.log(error);
        
    }
    

}
//
const comprobarToken = async (req, res) =>{
    const {token }= req.params;
    const tokenValido = await Veterinario.findOne({token});
    if(tokenValido){
        //el token es valido
        res.json({msg:'Token válido y el usuario existe'});

    }else{
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});

    }

};
//
const nuevoPassword = async (req, res) =>{
    const {token }= req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg:'Password modificado correctamente'});
        console.log(veterinario);
    } catch (error) {
        console.log(error);
    }

}

const actualizarPerfil = async (req,res) =>{
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg:error.message});
    }
    const {email}= req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({msg:error.message});
        }

    }

    try {
        veterinario.nombre = req.body.nombre ;
        veterinario.email = req.body.email ;
        veterinario.web = req.body.web ;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
        
    } catch (error) {
        console.log(error);
        
    }

}

const actualizarPassword = async (req, res) => {
    //leer los datos
    const {id} = req.veterinario;
    const{pwd_actual,pwd_nuevo} = req.body;
    //comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg:error.message});
    }
    //comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        //Almacenar nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg:'Password actualizado correctamente'})
    }else{
        const error = new Error('El password actual es incorrecto');
        return res.status(400).json({msg:error.message});;
    }
    

}

export{
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil, 
    actualizarPassword
};