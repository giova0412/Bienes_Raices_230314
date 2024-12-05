import express from 'express';

const router = express.Router();

//HOME
router.get("/", function(req, res) {
    res.send("Hola desde la Web, en NodeJS")
})

router.get("/quienEres", function(req, res) {
    res.json(
        {
            "nombre": "Marco Antonio Ramírez Hernández",
            "carrera": "TI DSM",
            "grado": "4°",
            "grupo": "A"
        }
    )
})


export default router;    //Esta palabra reservada de JS me permite exportar los elementos definidos y utilizarlos en otros archivos del mismo sitio.