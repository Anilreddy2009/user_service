import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { CustomResponse } from "src/submodules/entities/src/constants/customResponse";

@Controller('user')
export class UserController{

    constructor(
        private userService: UserService
    ){}

    @Post('/sign-up')
    async createUser(@Body() body){
        try{
            const resp = await this.userService.createUser(body)
            return new CustomResponse(200, 'saved user sucessfully', resp);
        }catch(err){
            return new CustomResponse(500, `fetched results failed!`, err);
        }
    }

    @Post('/login-in')
    async getUser(@Body() body){
        try{
            //const resp = await this.userService.getUser(body)
            return await this.userService.getUser(body)
        }catch(err){
            return new CustomResponse(500, `fetched results failed!`, err);
        }
    }

}