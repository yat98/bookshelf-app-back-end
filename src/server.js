require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        host:
            process.env.NODE_ENV.trim() !== 'production'
                ? 'localhost'
                : process.env.APP_PROD_URL,
        port: process.env.APP_PORT,
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan ${server.info.uri}`);
};

init();
