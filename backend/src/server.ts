import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function bootstrap(): Promise<void> {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`CarbonWise API listening on http://127.0.0.1:${env.port}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to start CarbonWise API", error);
  process.exit(1);
});
