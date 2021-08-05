import { ApiProperty } from "@nestjs/swagger";

export class JoinRequestDto {
    @ApiProperty({
        example: 'qwert01311@gamilc.com',
        description: '이메일',
        required: true,
    })
    public email: string;

    @ApiProperty({
        example: '보리',
        description: '닉네임',
        required: true,
    })
    public nickname: string;

    @ApiProperty({
        example: 'password',
        description: '비밀번호',
        required: true,
    })
    public password: string;
}