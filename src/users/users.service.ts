import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, TransactionRepository } from "typeorm";
import bcrypt from "bcrypt";
import { Users } from "src/entities/Users";
import { WorkspaceMembers } from "src/entities/WorkspaceMembers";
import { ChannelMembers } from "src/entities/ChannelMembers";

@Injectable()
export class UsersService {
  // 의존성 주입을 통해 테스트db 혹은 가짜db로 바꿔서 테스트 하기 수월해짐. 서비스에 추가후 module에import 하는것 잊지 말기
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaveMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>
  ) {}

  getUser() {}

  async join(email: string, nickname: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException("이미 존재하는 사용자입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const returned = await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword
    });
    // 회원가입 후, 기본적으로 하나의 워크스페이스를 제공한다.
    await this.workspaveMembersRepository.save({
      UserId: returned.id,
      WorkspaceId: 1
    });
    // 기본제공하는 워크스페이스에 기본 채널도 추가제공한다.
    await this.channelMembersRepository.save({
      UserId: returned.id,
      ChannelId: 1
    });
    return true;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ["id", "email", "password"]
    });
  }
}
