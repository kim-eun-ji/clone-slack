import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelMembers } from "src/entities/ChannelMembers";
import { Channels } from "src/entities/Channels";
import { Users } from "src/entities/Users";
import { WorkspaceMembers } from "src/entities/WorkspaceMembers";
import { Workspaces } from "src/entities/Workspaces";
import { Repository } from "typeorm";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }]
      }
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    // 트랜잭션 추가해야함
    // 실행1
    const workspace = new Workspaces();
    workspace.name = name;
    workspace.url = url;
    workspace.OwnerId = myId;
    const returned = await this.workspacesRepository.save(workspace);
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    // await this.workspaceMembersRepository.save(workspaceMember);
    const channel = new Channels();
    channel.name = "일반";
    channel.WorkspaceId = returned.id;
    // const channelReturned = await this.channelsRepository.save(channel);
    // 실행2 동시실행 가능하기때문에 promise all로 묶음
    const [, channelReturned] = await Promise.all([this.workspaceMembersRepository.save(workspaceMember), this.channelsRepository.save(channel)]);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder("u")
      .innerJoin("u.WorkspaceMembers", "wm")
      .innerJoin("wm.Workspace", "w", "w.url = :url", { url: url })
      .getMany();
    // getRawMany는 조인시 같은 이름의 컬럼이 있다면 id. wm.id 이런식으로 가져오는데
    // getMany는 {id, name ... workspace:{id, name} 이렇게 객체로 가져옴
  }

  async createWorkspaceMembers(url: string, email: string) {
    // 동일. 앞으론 웬만하면 쿼리빌더 형식으로 쓰는 걸 고려
    // const workspace = await this.workspacesRepository.createQueryBuilder('workspace').innerJoinAndSelect('workspace.Channels', 'channels').getOne()
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      // join 대신 가능
      // relations: ['Channels'],
      join: {
        alias: "workspace",
        innerJoinAndSelect: {
          channels: "workspace.Channels"
        }
      }
    });

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = user.id;
    workspaceMember.WorkspaceId = workspace.id;
    await this.workspaceMembersRepository.save(workspaceMember);

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(v => v.name === "일반").id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .innerJoin("user.Workspace", "workspace", "workspace.url = :url", { url })
      .getOne();
  }
}
