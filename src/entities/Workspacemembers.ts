import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Workspaces } from "./Workspaces";

@Index("FK_workspaces_TO_workspacemembers_1", ["workspaceId"], {})
@Entity("workspacemembers", { schema: "slack" })
export class Workspacemembers {
  @Column("int", { primary: true, name: "UserId" })
  userId: number;

  @Column("int", { primary: true, name: "WorkspaceId" })
  workspaceId: number;

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column("datetime", { name: "loggedInAt", nullable: true })
  loggedInAt: Date | null;

  @ManyToOne(() => Users, (users) => users.workspacemembers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.workspacemembers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "WorkspaceId", referencedColumnName: "id" }])
  workspace: Workspaces;
}
