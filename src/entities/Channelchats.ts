import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Channels } from "./Channels";
import { Users } from "./Users";
import { Mentions } from "./Mentions";

@Index("FK_channels_TO_channelchats_1", ["channelId"], {})
@Index("FK_users_TO_channelchats_1", ["userId"], {})
@Entity("channelchats", { schema: "slack" })
export class Channelchats {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { primary: true, name: "ChannelId" })
  channelId: number;

  @Column("int", { primary: true, name: "UserId" })
  userId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToOne(() => Channels, (channels) => channels.channelchats, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "ChannelId", referencedColumnName: "id" }])
  channel: Channels;

  @ManyToOne(() => Users, (users) => users.channelchats, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(() => Mentions, (mentions) => mentions.chat)
  mentions: Mentions[];
}
