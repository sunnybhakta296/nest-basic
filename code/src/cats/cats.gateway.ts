import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class CatsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    // Echo the message back to the client
    return `Received: ${data}`;
  }

  // Example: broadcast to all clients
  broadcastCatEvent(cat: any) {
    this.server.emit('catEvent', cat);
  }
}