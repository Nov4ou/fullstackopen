module.exports = {
  apps: [
    {
      name: "backend",
      script: "index.js",
      cwd: "./phonebook_backend",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
};

