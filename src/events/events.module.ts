import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";

@Module({ exports: [EventsGateway] })
export class EventsModule {
  providers: [EventsGateway];
}
