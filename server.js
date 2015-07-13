/*
 * HTTP Server - for serving client side HTML and JavaScript
 */
var http = require( 'http' );
var fs = require( 'fs' );

var httpServer = http.createServer( function( request, response ) {
	if( request.method == 'GET' ) {
		var indexStream = fs.createReadStream( 'index.html' );
		indexStream.setEncoding( 'utf8' );

		response.writeHead( 200, { 'Content-Type': 'text/html' } );
		indexStream.pipe( response );
	}
});

httpServer.listen( 80 );

/*
 * WebSocket Server - for server side chat functionality
 */
var WebSocketServer = require( 'ws' ).Server,
	wss = new WebSocketServer( { port: 8080 } ),
	cSocket = 0;

/*
 * Create onMessage handler that will simply send the message to all clients
 */
function createMessageHandler( socketID ){
	return( function( message ){
		wss.clients.forEach( function ( client ){
			client.send( socketID + ': ' + message );
		});
	});
}

/*
 * Handle socket connection
 */
wss.on( 'connection', function( ws ){
	cSocket++;

	ws.on( 'message', createMessageHandler( cSocket ) );
	ws.send( 'Your ID is: ' + cSocket );
});
