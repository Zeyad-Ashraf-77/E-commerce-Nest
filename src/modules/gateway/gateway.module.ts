import { Module } from "@nestjs/common";
import { socketGateway } from "./socket.gateway";
import { TokenService } from "src/cammon/service/Token";
import { UserRepo } from "src/DB/repisitories/user.repo";
import { userModel } from "src/DB/model";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [userModel],
    controllers: [],
    providers: [socketGateway,TokenService,UserRepo,JwtService],
    exports: []
})
export class GatewayModule {}