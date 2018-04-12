var express = require('express');

var mdAutentucacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

//=================================
//Obtener todos los Medicos
//=================================

app.get('/', (req, res) => {

    Medico.find({}, 'nombre img usuario hospital')
        .exec(
            (err, Medicos) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Medico',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    Medicos: Medicos
                });

            }
        );
    }
);

//=================================
// Crear Medico
//=================================

app.post('/', mdAutentucacion.verificaToken , (req, res) =>{

    var body = req.body;


    var medico = new Medico({
        nombre : body.nombre,
        img: body.img,
        usuario: body.id_usuario,
        hospital: body.id_hospital
    });

    medico.save( ( err, medicoGuardado ) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico : medicoGuardado,
            usuariotoken: req.usuario
        });


    });


});

// =================================
// actualizacion de hospital
// =================================

app.put('/:id',mdAutentucacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById( id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Medico',
                errors: err
            });
        }

        if ( !medico ) {
            
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: {message: 'no existe un medico con ese ID'}
            });

        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = body.id_usuario;
        medico.hospital = body.id_hospital;

        medico.save( (err, medicoGuardado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });


    });

});



// =================================
// Borrar un medico por el ID
// =================================

app.delete('/:id', mdAutentucacion.verificaToken ,(req, res)=>{
    
    var id = req.params.id;

    Medico.findByIdAndRemove(id, ( err, medicoBorrado )=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if ( !medicoBorrado ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con el id '+id ,
                errors: {message: 'No existe un medico con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});

module.exports = app;