import dotenv from 'dotenv';
import Server from './models/server.model';

dotenv.config({ quiet: true });

const server = new Server();