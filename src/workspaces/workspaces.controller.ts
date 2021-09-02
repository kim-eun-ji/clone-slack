import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorator/user.decorator";
import { Users } from "src/entities/Users";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { WorkspacesService } from "./workspaces.service";

@ApiTags("WORKSPACE")
@Controller("api/workspaces")
export class WorkspacesController {
  constructor(private WorkspacesService: WorkspacesService) {}

  @Get()
  getMyWorkspaces(@User() user: Users) {
    return this.WorkspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.WorkspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id
    );
  }

  @Get(":url/members")
  getAllMembersFromWorkspace(@Param("url") url: string) {
    return this.WorkspacesService.getWorkspaceMembers(url);
  }

  @Post(":url/member")
  inviteMembersToWorkspace() {}

  @Delete(":url/members/:id")
  kickMemberFromWorkspace() {}

  @Get(":url/members/:id")
  getMemberInfoInWorkspace() {}
}
