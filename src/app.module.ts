import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import CompanyModule from './company/company.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CompanyModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
