import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { UsersService } from "./users.service";

class MockUserRepository {
  // 가짜 private 데이터 및 가짜 함수
  #data = [
    {
      email: "qwert@na.cpom",
      id: 1
    }
  ];
  findOne({ where: { email } }) {
    const data = this.#data.find(v => v.email === email);
    if (data) {
      return data;
    }
    return null;
  }
}
class MockworkspaveMembersRepository {}
class MockchannelMembersRepository {}

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, // 사실 {provide: UsersService, useClass: UserService} 와 같음 축약해서 사용하는것.
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository // 함수라면 useFactory, 일반값이라면 useValue
        },
        {
          provide: getRepositoryToken(Users),
          useClass: MockworkspaveMembersRepository
        },
        {
          provide: getRepositoryToken(Users),
          useClass: MockchannelMembersRepository
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("findByEmail은 이메일을 통해 유저를 조회함", () => {
    expect(service.findByEmail("qwert@na.cpom")).resolves.toStrictEqual({
      email: "qwert@na.cpom",
      id: 1
    });
  });

  it("findByEmail은 유저를 찾지 못하면 null을 반환해야 함", () => {
    expect(service.findByEmail("qwert@naver.cpom")).resolves.toBe(null);
  });
});
