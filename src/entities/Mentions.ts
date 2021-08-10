import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Channelchats } from "./Channelchats";
import { Users } from "./Users";
import { Workspaces } from "./Workspaces";

@Index("FK_channelchats_TO_mentions_1", ["chatId"], {})
@Index("FK_users_TO_mentions_1", ["senderId"], {})
@Index("FK_users_TO_mentions_2", ["receiverId"], {})
@Index("FK_workspaces_TO_mentions_1", ["workspaceId"], {})
@Entity("mentions", { schema: "slack" })
export class Mentions {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { primary: true, name: "chatId" })
  chatId: number;

  @Column("int", { primary: true, name: "WorkspaceId" })
  workspaceId: number;

  @Column("int", { primary: true, name: "SenderId" })
  senderId: number;

  @Column("enum", { name: "category", enum: ["a"] })
  category: "a";

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column("int", { name: "ReceiverId", nullable: true })
  receiverId: number | null;

  @ManyToOne(() => Channelchats, (channelchats) => channelchats.mentions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "chatId", referencedColumnName: "id" }])
  chat: Channelchats;

  @ManyToOne(() => Users, (users) => users.mentions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "SenderId", referencedColumnName: "id" }])
  sender: Users;

  @ManyToOne(() => Users, (users) => users.mentions2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "ReceiverId", referencedColumnName: "id" }])
  receiver: Users;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.mentions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "WorkspaceId", referencedColumnName: "id" }])
  workspace: Workspaces;
}
