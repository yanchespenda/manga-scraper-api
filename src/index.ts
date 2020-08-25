import fastify /* FastifyRequest, FastifyReply */ from 'fastify';
import mongoose from 'mongoose';

import FastifyRoutes from 'fastify-routes';
import FastifyRateLimit from 'fastify-rate-limit';
import FastifyFormBody from 'fastify-formbody';
import FastifyEtag from 'fastify-etag';
import FastifyUrlData from 'fastify-url-data';
import FastifyCors from 'fastify-cors';
import FastifyMultipart from 'fastify-multipart';

import mangaRoutes from './routes/mangaRoute';
import { config } from './config';
// const env = process.env.NODE_ENV

const server = fastify({ logger: true });

server.register(FastifyRoutes);
server.register(FastifyRateLimit);
server.register(FastifyFormBody);
server.register(FastifyMultipart, {
	addToBody: true,
	limits: {
		fieldSize: 2e6,
		files: 1,
	},
});
server.register(FastifyEtag);
server.register(FastifyUrlData);
server.register(FastifyCors);

mongoose
	.connect(`${config.db.mongoURI}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		config: {
			autoIndex: true,
		},
		useCreateIndex: true,
	})
	.then(() => server.log.info('MongoDB connected...'))
	.catch(err => server.log.error(err));

mangaRoutes.forEach(route => {
	server.route(route);
});

const start = async (): Promise<void> => {
	try {
		await server.listen(config.app.port, '0.0.0.0' );
		console.log('Server listening');
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};
start();

export default server;
