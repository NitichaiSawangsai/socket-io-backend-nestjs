import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { TestUtil } from './config/test-util';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await TestUtil.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
