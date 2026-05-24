import dotenv from 'dotenv';



dotenv.config({
    path:path.join(process.cwd(),'.env')});

    console.log('CONNECTIONSTRING:', process.env.CONNECTIONSTRING); // এটা যোগ করুন
    console.log('PORT:', process.env.PORT); // এটা যোগ করুন

    const config = {
        connectionString: process.env.CONNECTIONSTRING as string,
        port: process.env.PORT || 3000
    }

export default config;