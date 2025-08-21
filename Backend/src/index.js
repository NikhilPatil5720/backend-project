// require ('dotenv').config()
// import Connectdb from './db/index.js'

// Connectdb();





// ✅ Load .env at the VERY top
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });



// ⬇ Now import everything else
import Connectdb from './db/index.js';
import { app } from './app.js';
 
 const PORT = process.env.PORT || 3000 ; 
 Connectdb();
 
console.log("DB URL:", process.env.DB_Url);

app.get('/dog', (req, res) => res.send("Server is working!"));


app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

