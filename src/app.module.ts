import { Module } from '@nestjs/common';
import { EvaluationModule } from './evaluation/evaluation.module';
import { ConfigModule } from "@nestjs/config";
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [ConfigModule.forRoot(), OpenaiModule, EvaluationModule],
})
export class AppModule {}
