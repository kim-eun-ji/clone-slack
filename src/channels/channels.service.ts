import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { channel } from "diagnostics_channel";
import { ChannelChats } from "src/entities/ChannelChats";
import { ChannelMembers } from "src/entities/ChannelMembers";
import { Channels } from "src/entities/Channels";
import { Users } from "src/entities/Users";
import { Workspaces } from "src/entities/Workspaces";
import { EventsGateway } from "src/events/events.gateway";
import { MoreThan, Repository } from "typeorm";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private eventsGateway: EventsGateway
  ) {}

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder("channels")
      .innerJoinAndSelect(
        "channels.ChannelMembers",
        "channelMembers",
        "channelMembers.userId = :myId",
        { myId }
      )
      .innerJoinAndSelect(
        "channels.Workspace",
        "workspace",
        "workspace.url = :url",
        { url }
      )
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url
      })
      .where("channel.name = :name", { name })
      .getOne();
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url }
    });

    const channel = new Channels();
    channel.name = name;
    channel.WorkspaceId = workspace.id;

    const channelReturned = await this.channelsRepository.save(channel);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;

    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder("user")
      .innerJoin("user.Channels", "channels", "channels.name = :name", { name })
      .innerJoin("channels.Workspace", "workspace", "workspace.url = :url", {
        url
      })
      .getMany();
  }

  async createWorkspaceChannelMembers(
    url: string,
    name: string,
    email: string
  ) {
    // 1. ?????? ??????
    const channel = await this.channelsRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url
      })
      .where("channel.name = :name", { name })
      .getOne();
    if (!channel) {
      throw new NotFoundException("????????? ???????????? ????????????.");
    }

    // 2. ????????? ??????
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .innerJoin("user.Workspaces", "workspace", "workspace.url = :url", {
        url
      })
      .getOne();
    if (!user) {
      throw new NotFoundException("???????????? ???????????? ????????????.");
    }

    // 3. ?????? ?????? ??????
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channel.id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  // ?????? ?????? ????????????
  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number
  ) {
    return this.channelChatsRepository
      .createQueryBuilder("channelChats")
      .innerJoin("channelChats.Channel", "channel", "channel.name = :name", {
        name
      })
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url
      })
      .innerJoinAndSelect("channelChats.User", "user")
      .orderBy("channelChats.createAt", "DESC")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  // ?????? ?????? ????????? ??????
  async getChannelUnreadsCount(url: string, name: string, after: number) {
    const channel = await this.channelsRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url
      })
      .where("channel.name = :name", { name })
      .getOne();

    return this.channelChatsRepository.count({
      where: {
        ChannelId: channel.id,
        createAt: MoreThan(new Date(after))
      }
    });
  }

  // async createWorkspaceChannelChats() {}
  async postChat({ url, name, content, myId }) {
    const channel = await this.channelsRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url
      })
      .where("channel.name = :name", { name })
      .getOne();
    if (!channel) {
      throw new NotFoundException("????????? ???????????? ????????????.");
    }

    const chats = new ChannelChats();
    chats.content = content;
    chats.UserId = myId;
    chats.ChannelId = channel.id;

    const savedChat = await this.channelsRepository.save(chats);
    const chatWithUser = await this.channelChatsRepository.findOne({
      where: { id: savedChat.id },
      relations: ["User", "Channel"]
    });

    // socket.io??? ??????????????????+?????? ??????????????? ??????
    // ws-?????????????????????-??????????????? ??????. (socketio??? room??? ??????)
    this.eventsGateway.server
      .to(`/ws-${url}-${channel.id}}`)
      .emit("message", chatWithUser);
  }

  async createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    myId: number
  ) {
    console.log(files);
    const channel = await this.channelsRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url
      })
      .where("channel.name = :name", { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException("????????? ???????????? ????????????");
    }

    //????????? n??? ??????, ???????????? ????????????
    for (let i = 0; i < files.length; i++) {
      const chats = new ChannelChats();
      chats.content = files[i].path;
      chats.UserId = myId;
      chats.ChannelId = channel.id;

      const savedChat = await this.channelChatsRepository.save(chats);
      const chatWithUser = await this.channelChatsRepository.findOne({
        where: { id: savedChat.id },
        relations: ["User", "Channel"]
      });

      this.eventsGateway.server
        .to(`/ws-${url}-${chatWithUser.ChannelId}`)
        .emit("message", chatWithUser);
    }
  }
}
