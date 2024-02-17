import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/submodules/entities/src/schema/user.schema";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Queues } from "src/submodules/entities/src/enum/queues";
require("custom-env").env(true);

@Module({
    imports:[
        MongooseModule.forFeature([{
            name:'userSchema',
            schema:UserSchema
        }]),
        ClientsModule.register([
            {
                name:Queues.CART,
                transport:Transport.RMQ,
                options:{
                    urls:[process.env.RBTMQ_HOST],
                    queue: Queues.CART,
                    queueOptions: {
                        durable: true
                    }
                }
            }
        ])
    ],
    controllers:[UserController],
    providers:[UserService]
})

export class UserModule{}