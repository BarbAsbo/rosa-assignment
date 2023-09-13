import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { baseURL } from './config/constants';
import appointmentRoutes from './routes/appointment-routes'

export const app = express();

app.use(bodyParser.json());
app.use("/api", appointmentRoutes);


const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on base url: ' + baseURL);
});