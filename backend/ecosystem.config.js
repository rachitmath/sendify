module.exports = {
  apps: [
    {
      name: 'sendify-backend',
      script: 'dist/main.js',
      autorestart: true,
      watch: false,
      // Tell PM2 to load .env.production file directly
      env_production: {
        NODE_ENV: "production",
      }
    }
  ]
};
