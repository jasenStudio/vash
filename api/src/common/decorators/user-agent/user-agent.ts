import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as useragent from 'useragent';
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'];
    const userAgentDevice = request.headers['x-device-info'];

    return optimizedDataUserAgent(userAgent, userAgentDevice);
  },
);

export const optimizedDataUserAgent = (userAgent: string, device: string) => {
  const agent = useragent.parse(userAgent);

  const optimizedData = {
    browser: agent.family,
    browser_version: `${agent.major}.${agent.minor}.${agent.patch}`,
    os: agent.os.family,
    os_version: `${agent.os.major}.${agent.os.minor}`,
    device: device,
  };

  return `${optimizedData.browser} - ${optimizedData.os} - ${optimizedData.device}`;
};
