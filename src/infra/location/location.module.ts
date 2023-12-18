import { Locator } from "@/domain/account/application/location/locator";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { BrasilApiLocator } from "./brasilapi-locator";

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: Locator,
      useClass: BrasilApiLocator,
    },
  ],
  exports: [Locator],
})
export class LocationModule {}
