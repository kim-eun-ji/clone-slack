import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Channelchats } from "./Channelchats";
import { Channelmembers } from "./Channelmembers";
import { Workspaces } from "./Workspaces";

@Index("FK_workspaces_TO_channels_1", ["workspaceId"], {})
@Entity("channels", { schema: "slack" })
export class Channels {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { primary: true, name: "WorkspaceId" })
  workspaceId: number;

  @Column("varchar", { name: "name", length: 30 })
  name: string;

  @Column("tinyint", {
    name: "private",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  private: boolean | null;

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany(() => Channelchats, (channelchats) => channelchats.channel)
  channelchats: Channelchats[];

  @OneToMany(() => Channelmembers, (channelmembers) => channelmembers.channel)
  channelmembers: Channelmembers[];

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.channels, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "WorkspaceId", referencedColumnName: "id" }])
  workspace: Workspaces;
}
