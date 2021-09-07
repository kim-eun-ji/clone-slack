import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import fs from "fs";
import multer from "multer";
import { userInfo } from "os";
import path from "path";
import { User } from "src/common/decorator/user.decorator";
import { Users } from "src/entities/Users";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { PostChatDto } from "./dto/post-chat.dto";

// image upload folder create
try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성하였습니다.");
  fs.mkdirSync("uploads");
}

@ApiTags("CHANNEL")
@Controller("api/workspaces/:url/channels")
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @ApiOperation({ summary: "워크스페이스 모든 채널 가져오기" })
  @Get(":url/channels")
  async getWorkspaceChannels(@Param("url") url: string, @User() user: Users) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @ApiOperation({ summary: "워크스페이스 특정 채널 가져오기" })
  @Get(":url/channels/:name")
  async getWorkspaceChannel(
    @Param("url") url: string,
    @Param("name") name: string
  ) {
    return this.channelsService.getWorkspaceChannel(url, name);
  }

  @ApiOperation({ summary: "워크스페이스 채널 생성" })
  @Post(":url/channels")
  async createWorkspaceChannels(
    @Param("url") url: string,
    @Body() body: CreateChannelDto,
    @User() user: Users
  ) {
    return this.channelsService.createWorkspaceChannels(
      url,
      body.name,
      user.id
    );
  }

  @ApiOperation({ summary: "워크스페이스 채널 멤버 가져오기" })
  @Post(":url/channels/:name/members")
  async getWorkspaceChannelMembers(
    @Param("url") url: string,
    @Param("name") name: string
  ) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @ApiOperation({ summary: "워크스페이스 채널 멤버 초대하기" })
  @Post(":url/channels/:name/members")
  async createWorkspaceChannelMembers(
    @Param("url") url: string,
    @Param("name") name: string,
    @Body("email") email
  ) {
    return this.channelsService.createWorkspaceChannelMembers(url, name, email);
  }

  @ApiOperation({ summary: "워크스페이스 특정 채널 채팅 내역 가져오기" })
  @Post(":url/channels/:name/chats")
  async getWorkspaceChannelChats(
    @Param("url") url: string,
    @Param("name") name: string,
    @Query("perPage", ParseIntPipe) perPage: number,
    @Query("page", ParseIntPipe) page: number
  ) {
    return this.channelsService.getWorkspaceChannelChats(
      url,
      name,
      perPage,
      page
    );
  }

  @Post(":name/chats")
  postChat(
    @Param("url") url: string,
    @Param("name") name: string,
    @Body() body: PostChatDto,
    @User() user
  ) {
    return this.channelsService.postChat({
      url,
      name,
      content: body.content,
      myId: user.id
    });
  }

  // 이미지 하나 FileInterceptor - UploadedFile, n개 FilesInterceptor - UploadedFiles
  @UseInterceptors(
    FilesInterceptor("image", 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, "uploads/");
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
      }),
      limits: { fileSize: 5 * 1024 * 1024 } // 5MB
    })
  )
  @Post(":name/images")
  postImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param("url") url: string,
    @Param("name") name: string,
    @User() user
  ) {
    return this.channelsService.createWorkspaceChannelImages(
      url,
      name,
      files,
      user.id
    );
  }

  @Get(":name/unreads")
  async getUnreads(
    @Param("url") url: string,
    @Param("name") name: string,
    @Query("after", ParseIntPipe) after: number
  ) {
    return this.channelsService.getChannelUnreadsCount(url, name, after);
  }
}
