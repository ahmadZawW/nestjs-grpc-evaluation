import { ReflectionService } from '@grpc/reflection';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['evaluation'],
    protoPath: [ join(__dirname, './evaluation/evaluation.proto')],
    url: '0.0.0.0:50051',
    onLoadPackageDefinition: (pkg, server) => {
      new ReflectionService(pkg).addToServer(server);
    },
    loader: {
      keepCase: true,
    },
  },
  
};
