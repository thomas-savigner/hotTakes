
//          Mise en place du serveur d'application

//  Import des composants
const http = require('http');
const app = require('./app');


/* Ajoutons la normalisation de port, la gestion d'erreur 
et du logging basique à votre serveur Node pour le rendre plus 
constant et plus facile à déboguer. */

//  recherche d'un port valide pour l'attribuer au serveur
const normalizePort = val => {

    const port = parseInt(val, 10);
  
    if (isNaN(port)) {

      return val;

    }
    if (port >= 0) {

      return port;

    }

    return false;

  };


const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);


//  recherche, gestion des erreurs et enregistrement sur le serveur 
const errorHandler = error => {

    if (error.syscall !== 'listen') {

      throw error;

    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    switch (error.code) {

      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;

      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;

      default:
        throw error;

    }

  };
  

  const server = http.createServer(app);
  
  server.on('error', errorHandler);


  // écouteur d'évènement sur le port retenu
  server.on('listening', () => {

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);

  });
  
  server.listen(port);


