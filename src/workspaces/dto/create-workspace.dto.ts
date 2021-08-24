import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "첫번째 워크스페이스",
    description: "워크스페이스명"
  })
  public workspace: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "sleact",
    description: "url 주소"
  })
  public url: string;
}
