const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configura middleware para servir archivos estáticos desde la carpeta 'public'

// Configura middleware para servir archivos estáticos desde el directorio raíz del proyecto
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'HTML', 'index.html'));
});

// Maneja conexiones de clientes
io.on('connection', (socket) => {
    console.log('Usuario en el panel de juego');

    // Maneja eventos de movimiento de las paletas
    socket.on('paddleMove', (data) => {
        // Emitir la posición a todos los demás clientes
        socket.broadcast.emit('opponentPaddleMove', { keyCode: data.keyCode, position: data.position });
    });

    // Maneja desconexiones de clientes
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        // Puedes agregar lógica adicional cuando un usuario se desconecta
    });
});

// Configura el puerto del servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
