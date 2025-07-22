import express from 'express';
import { login } from './authController';
import { authenticateToken, authorizeRoles } from './authMiddleware';
import cors from 'cors';
import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    trustServerCertificate: process.env.TRUST_SERVER_CERTIFICATE === 'true',
  },
};

sql.connect(config).then(() => {
  console.log('Connected to MSSQL database');
}).catch(err => {
  console.error('DB connection failed:', err);
});

app.get('/', (req, res) => {
  res.send('Blog Admin Backend Running');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


app.post('/login', login);

// Example protected route
app.get('/protected', authenticateToken, authorizeRoles('admin', 'editor'), (req, res) => {
  res.json({ message: 'You are authorized to access this route.' });
});
