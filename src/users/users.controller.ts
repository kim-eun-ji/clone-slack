import { Controller, Get, Post, Req, Res } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get()
    getUsers() {}

    @Post()
    postUsers() { }

    @Post('login')
    logIn(@Req() req) {
        return req.user;
     }

    @Post('logout')
    logOut(@Req() req, @Res() res) { 
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok');
    }
}
