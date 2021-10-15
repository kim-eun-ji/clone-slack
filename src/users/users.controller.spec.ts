import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

class MockUsersService {}

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService, // 서비스는 service.spec 에서 테스트하니 서비스를 mock으로 만들지 않음. 혹은 컨트롤러 테스트를 서비스단까찌 통합테스트로 사용해도 된다.
          useClass: MockUsersService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
