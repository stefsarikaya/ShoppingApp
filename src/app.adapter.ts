import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';

export class AppAdapter extends ExpressAdapter {
  constructor(private app: NestExpressApplication) {
    super(app);
  }
}
