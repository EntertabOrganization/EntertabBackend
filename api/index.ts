import app from '../src/app';
import { ensureAppInitialized } from '../src/bootstrap';

export default async function handler(req: any, res: any): Promise<void> {
  await ensureAppInitialized();
  app(req, res);
}
