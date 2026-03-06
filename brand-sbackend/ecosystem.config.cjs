/**
 * PM2 ecosystem file.
 * Use from backend directory: pm2 start ecosystem.config.cjs
 *
 * If you see "injecting env (0)" in logs, .env is not loading (wrong cwd or no .env).
 * Either: cd to the backend folder before pm2 start, or set env vars in this file.
 */
module.exports = {
  apps: [
    {
      name: "brandedF",
      script: "index.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
    },
  ],
};
