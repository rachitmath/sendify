module.exports = {
  apps: [
    {
      name: 'sendify-backend',
      script: 'dist/main.js',
      instances: 1, // Change to 'max' to utilize all CPU cores
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        // Loads variables from .env.production file if specified in CLI,
        // but typically PM2 can read standard env variables natively.
      }
    }
  ]
};
