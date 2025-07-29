import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { V1Module } from './v1/v1.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }),
    V1Module,],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
