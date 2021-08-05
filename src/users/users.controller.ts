import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOkResponse({
        description: '성공',
        type: UserDto,
    })
    @ApiResponse({
        status: 500,
        description: '서버 에러'
    })
    @ApiOperation({summary: '내 정보 조회'})
    @Get()
    getUsers(@Req() req) {
        return req.user;
    }

    @ApiOperation({summary: '회원가입'})
    @Post()
    postUsers(@Body() data: JoinRequestDto) { 
        this.usersService.postUsers(data.email, data.nickname, data.password);
    }

    @ApiOkResponse({
        description: '성공',
        type: UserDto,
    })
    @ApiOperation({summary: '로그인'})
    @Post('login')
    logIn(@Req() req) {
        return req.user;
     }

    @ApiOperation({summary: '로그아웃'})
    @Post('logout')
    logOut(@Req() req, @Res() res) { 
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok');
    }
}
