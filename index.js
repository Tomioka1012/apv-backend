import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();
//conectar bd
conectarDB();
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback) {
        
        if (origin === 'http://localhost:5173/') {
            // Permitir solicitudes sin origen (por ejemplo, solicitudes locales)
            callback(null, true);
            return;
        }

        if (dominiosPermitidos.includes(origin)) {
            // El origen está en la lista de dominios permitidos
            callback(null, true);
        } else {
            // El origen no está permitido
            callback(new Error('No permitido por CORS'));
        }
    },
    
};

app.use(cors( {origin: '*'}));
// app.use((req, res, next) => {
//     //allow access to current url. work for https as well
//     res.setHeader('Access-Control-Allow-Origin',req.header('Origin'));
//     res.removeHeader('x-powered-by');
//     //allow access to current method
//     res.setHeader('Access-Control-Allow-Methods',req.method);
//     res.setHeader('Access-Control-Allow-Headers','Content-Type');
//     next();
//   })
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);


const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`servidor funcionando en el puerto ${PORT}`);
});


