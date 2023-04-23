import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  user.token = req.headers.authorization;

  if (!user)
    throw new InternalServerErrorException('User not found in request');

  return user;
});
