import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    // 의존성 주입을 통해 테스트db 혹은 가짜db로 바꿔서 테스트 하기 수월해짐
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }

    getUser() { }

    async join(email: string, nickname: string, password: string) {
        // 사실 dto단에서 자동으로 체크가능
        if (!email) {
            throw new HttpException('이메일은 필수 입력값입니다.', 400);
        }
        if (!nickname) {
            throw new HttpException('닉네임은 필수 입력값입니다.', 400);
        }
        if (!password) {
            throw new HttpException('비밀번호는 필수 입력값입니다.', 400);
        }
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user) {
            throw new HttpException('이미 존재하는 사용자입니다.', 401);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.usersRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });
    }
}
