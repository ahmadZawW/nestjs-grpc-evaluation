import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { EvaluationController } from './evaluation.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVALUATION_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [EvaluationController],
})
export class EvaluationModule {}
