const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: '192.168.1.29',
    user: 'pino',
    password: '1993',
    database: 'mundosnack'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Endpoint de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta el usuario en la base de datos
    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error en el servidor' });
        } else if (results.length > 0) {
            const user = results[0];

            // Comparar la password
            if (password === user.password) { // Asegúrate de ajustar esta línea si la contraseña está encriptada
                res.json({ 
                    success: true, 
                    message: 'Inicio de sesión exitoso', 
                    rol: user.rol // Incluye el rol en la respuesta
                });
            } else {
                res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('Servidor corriendo correctamente.');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
