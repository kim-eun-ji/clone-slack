import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Channels } from "./Channels";
import { Users } from "./Users";

@Index("FK_channels_TO_channelmembers_1", ["channelId"], {})
@Entity("channelmembers", { schema: "slack" })
export class Channelmembers {
  @Column("int", { primary: true, name: "UserId" })
  userId: number;

  @Column("int", { primary: true, name: "ChannelId" })
  channelId: number;

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne(() => Channels, (channels) => channels.channelmembers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "ChannelId", referencedColumnName: "id" }])
  channel: Channels;

  @ManyToOne(() => Users, (users) => users.channelmembers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
  user: Users;
}
