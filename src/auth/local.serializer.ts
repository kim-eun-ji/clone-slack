import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "../entities/Users";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService, @InjectRepository(Users) private usersRepository: Repository<Users>) {
    super();
  }

  serializeUser(user: Users, done: CallableFunction) {
    // 전체 다 저장하기엔 데이터가 너무 많으므로 user의 id만 뽑아서 세션에 저장해둠
    console.log("serializeUser user", user);
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    //req.user가 필요할때마다 세션에 저장된id로 user객체를 복원해서 req.user에 넣어준다
    return await this.usersRepository
      .findOneOrFail(
        {
          id: +userId
        },
        {
          select: ["id", "email", "nickname"],
          relations: ["Workspaces"]
        }
      )
      .then(user => {
        console.log("user", user);
        done(null, user); // req.user
      })
      .catch(error => done(error));
  }
}
