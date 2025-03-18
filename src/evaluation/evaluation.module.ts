import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { EvaluationController } from './evaluation.controller';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVALUATION_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
    OpenaiModule, 
  ],
  controllers: [EvaluationController],
})
export class EvaluationModule {}
