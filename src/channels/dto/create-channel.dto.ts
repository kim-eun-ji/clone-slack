import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "기본 채널",
    description: "채널 명"
  })
  public name: string;
}
