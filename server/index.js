const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const UserRoutes = require('./Routes/User');
const NewsRoutes = require('./Routes/News')
const { sqlConnection } = require('./Connection/sqlConnection');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT_NUMBER || 5000;

// Database connection
sqlConnection();

// Middlewares
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT","DELETE"],
    credentials: true,
}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// API endpoints
app.use('/api/user', UserRoutes);
app.use('/api/news',NewsRoutes)  ; 

// Server start
app.listen(PORT, () => {
    console.log(`Server is running on Port Number: ${PORT}`);
});