import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Workspaces } from "./Workspaces";

@Index("FK_users_TO_dms_1", ["senderId"], {})
@Index("FK_users_TO_dms_2", ["receiverId"], {})
@Index("FK_workspaces_TO_dms_1", ["workspaceId"], {})
@Entity("dms", { schema: "slack" })
export class Dms {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { primary: true, name: "SenderId" })
  senderId: number;

  @Column("int", { primary: true, name: "WorkspaceId" })
  workspaceId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column("int", { name: "ReceiverId", nullable: true })
  receiverId: number | null;

  @ManyToOne(() => Users, (users) => users.dms, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "SenderId", referencedColumnName: "id" }])
  sender: Users;

  @ManyToOne(() => Users, (users) => users.dms2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "ReceiverId", referencedColumnName: "id" }])
  receiver: Users;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.dms, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "WorkspaceId", referencedColumnName: "id" }])
  workspace: Workspaces;
}
