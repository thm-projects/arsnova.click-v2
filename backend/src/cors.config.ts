import * as cors from 'cors';

const whitelist: Array<string> = ['http://localhost:4200', 'https://localhost:3000', 'http://localhost:4711', 'http://192.168.2.124:4200'];

const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: whitelist,
  preflightContinue: false
};

export default options;
