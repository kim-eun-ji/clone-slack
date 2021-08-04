import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('api/workspaces')
export class WorkspacesController {
    @Get()
    getMyWorkspaces() { }

    @Post()
    createWorkspace() { }

    @Get(':url/members')
    getAllMembersFromWorkspace() { }

    @Post(':url/member')
    inviteMembersToWorkspace() { }

    @Delete(':url/members/:id')
    kickMemberFromWorkspace() { }

    @Get(':url/members/:id')
    getMemberInfoInWorkspace() { }

}