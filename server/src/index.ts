import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 VIASET Intelligence Platform Backend API Online`);
  console.log(`📡 Port: ${config.port} | Mode: ${config.nodeEnv}`);
  console.log(`🌐 Base URL: http://localhost:${config.port}/api/v1`);
  console.log(`====================================================`);
});
