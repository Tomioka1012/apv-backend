import { json } from "express";
import Paciente from "../models/Paciente.js";
//Función para agregar Paciente
const agregarPaciente = async (req,res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json({pacienteAlmacenado});
        
    } catch (error) {
        console.log(error);
    }

};

//Función para OBTENER y LISTAR los PACIENTES
const obtenerPacientes = async (req,res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes);
}

//Función para OBTENER un paciente en especifico
const obtenerPaciente = async (req, res) => {
    const {id} = req.params ;
    const paciente = await Paciente.findById(id);
    //Si el paciente NO existe
    if(!paciente){
        return res.status(404).json({msg:'No encontrado'});
    }
    //Verificar si el usuario tiene acceso a esa información   
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no válida'});
    }
    //Si el paciente existe y el usuario tiene acceso a la información
    //Mostrar datos del paciente
    res.json(paciente);
    

};

//Función para ACTUALIZAR un paciente en especifico
const actualizarPaciente = async (req, res) => {
    const {id} = req.params ;
    const paciente = await Paciente.findById(id);
    //Si el paciente NO existe
    if(!paciente){
        return res.status(404).json({msg:'No encontrado'});
    }
    //Verificar si el usuario tiene acceso a esa información   
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no válida'});
    }
    //Si el paciente existe y el usuario tiene acceso a la in formación
    //Actualizar datos del paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error); 
    }
    

};

//Función para ELIMINAR un paciente en especifico
const eliminarPaciente = async (req, res) => {
    const {id} = req.params ;
    const paciente = await Paciente.findById(id);
    //Si el paciente NO existe
    if(!paciente){
        return res.status(404).json({msg:'No encontrado'});
    }
    //Verificar si el usuario tiene acceso a esa información   
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no válida'});
    }
    //Si el paciente existe y el usuario tiene acceso a la in formación
    //ELIMINAR al  paciente
    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado'});
    } catch (error) {
        console.log(error);
    }

};

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente

}