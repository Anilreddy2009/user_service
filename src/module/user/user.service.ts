import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { signinUserDto, signupUserDto, userCart } from "src/submodules/entities/src/dto/user.dto";
import { Queues } from "src/submodules/entities/src/enum/queues";
import { rmqEvents } from "src/submodules/entities/src/enum/rmqEvents";
import { User } from "src/submodules/entities/src/schema/user.schema";
require("custom-env").env(true);
const Cryptr = require("cryptr");
const cryptr = new Cryptr("ReallySecretKey");


@Injectable()
export class UserService{

    constructor(
        @InjectModel('userSchema') private userSchema = Model<User>,
        @Inject(Queues.CART) private cartClient : ClientProxy
    ){}


    private logger=new Logger(UserService.name)


    async createUser(body:signupUserDto){
        try{
            //let { password } = body
            body.password = cryptr.encrypt(body.password);
            this.logger.debug(`user encrypted password is ${body.password}`)
            const userData = new this.userSchema(body)
                             userData.save()
            const payload:userCart={
                phoneNumber:body.phoneNumber,
                productIds:[]
            }
            if(userData){
                this.cartClient.emit(rmqEvents.CREATE_CART, payload)
            }
            return {success : true}
            
        }catch(err){
            console.log(err)
        }
    }

    async getUser(body:signinUserDto){
        try{
            const {email, phoneNumber, password} = body
            const user:signupUserDto = await this.userSchema.findOne({ $or: [{ email }, { phoneNumber }] }).exec()
            if(user){
                this.logger.debug(`user decrypted password is ${cryptr.decrypt(user.password)} and ${password}`)
                if(cryptr.decrypt(user.password) == password){
                    return "login true"
                }
                return "incorrect password"
            }
            return "user not found please sign up"
        }catch(err){
            console.log(err)
        }
    }

}