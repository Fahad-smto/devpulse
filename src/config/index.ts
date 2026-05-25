import dotenv from 'dotenv';



dotenv.config({
    path:path.join(process.cwd(),'.env')});
 
   

    const config = {
        connectionString: process.env.CONNECTIONSTRING as string,
        port: process.env.PORT || 3000
    }

export default config;