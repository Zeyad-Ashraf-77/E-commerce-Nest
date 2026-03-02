import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { Auth } from "src/cammon/decretors";
import { TokenType, UserRole } from "src/cammon/enume";

@WebSocketGateway(80,{namespace:"/socket",cors:{origin:"*"}})
export class socketGateway implements OnGatewayConnection,OnGatewayDisconnect {
    constructor() {}

    @WebSocketServer()
    private io:Server

      @Auth(TokenType.access, [UserRole.ADMIN,UserRole.USER])
      @SubscribeMessage("say_Hi")
      handleTestEvent(@MessageBody() data:any,@ConnectedSocket()socket:Socket){
        console.log(data);
        this.io.emit("say_Hi",{msg:"Hello"});
      }      

      handleConnection(@ConnectedSocket()socket:Socket){
        console.log(socket.id);
      }
      handleDisconnect(@ConnectedSocket()socket:Socket){
        console.log(socket.id);
      }

      handleProductChange(productId:Types.ObjectId|string,quantity:number){
        this.io.emit("product_change",{productId,quantity});
      }
}

