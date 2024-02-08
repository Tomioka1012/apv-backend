import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();

conectarDB();
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //el origen del req esta permitido
            callback(null,true);
        }else{
            callback(new Error('No permitido por cors'));
        }

    }
};

app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);


const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log('servidor funcionando en el puerto 4000');
});

// Enable cors
app.use(
    cors({
      origin: '*',
    }),
  );

