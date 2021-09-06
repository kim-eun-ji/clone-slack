import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { channel } from "diagnostics_channel";
import { Socket, Server } from "socket.io";
import { onlineMap } from "./onlineMap";

// 사용자들이 만드는 워크스페이스를 모두 처리하기위해서 정규식으로 표현
// 워크스페이스 이름은 socket.nsp.name으로 접근 가능
@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
    console.log("init websocket server");
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log("connected", socket.nsp.name);
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }

    socket.emit("hi there", socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log("disconnected", socket.nsp.name);
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit("onlineList", Object.values(onlineMap[socket.nsp.name]));
  }

  @SubscribeMessage("test")
  handleTest(@MessageBody() data: string) {
    console.log("test", data);
  }

  // MessageBody 의존성 주입
  @SubscribeMessage("login")
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket
  ) {
    const newNamespace = socket.nsp;
    console.log("login", newNamespace);
    onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit("onlineList", Object.values(onlineMap[socket.nsp.name]));
    data.channels.forEach((channel: number) => {
      console.log("join", socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }
}

// namespace(전체대기실) 안에 room(개인방)
// workspace => channel/dm
