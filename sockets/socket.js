
const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand( new Band('Queen') );
bands.addBand( new Band('The Offspring') );
bands.addBand( new Band('S.O.A.D') );
bands.addBand( new Band('Metallica') );

// Mensajes de Sockets
io.on('connection', client => {
    // client.on('event', data => { /* … */ });
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands() )

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje:', payload );
        io.emit('mensajeTodos', { admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', ( payload ) => {
        // console.log( payload );
        bands.voteBand( payload.id );
        io.emit( 'active-bands', bands.getBands() );
    });

    client.on('add-band', (payload) => {
        const newBand = new Band( payload.name );
        bands.addBand( newBand );
        io.emit( 'active-bands', bands.getBands() );
    });

    client.on('delete-band', ( payload ) => {
        bands.deleteBand( payload.id );
        io.emit( 'active-bands', bands.getBands() );
    });

    // client.on('emitir-mensaje', ( payload ) => {

    //     console.log(payload);
    //     // io.emit('nuevo-mensaje', payload ); // emite a todos los clientes que esten escuchando incluyendo al cliente que lo emitió
    //     client.broadcast.emit('emitir-mensaje', payload ); // emite a todos los clientes que esten escuchando NO incluye al que lo emitió
    // });

});