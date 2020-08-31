module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [process.env.ORM_ENTITIES || 'dist/models/**/*.js'],
  migrations: [
    process.env.ORM_MIGRATIONS || 'dist/database/migrations/**/*.js',
  ],
  subcribers: [process.env.ORM_SUBCRIBERS || 'dist/subcribers/**/*.js'],
  cli: {
    entitesDir: process.env.ORM_ENTITIES_DIR,
    migrationsDir: process.env.ORM_MIGRATIONS_DIR,
  },
};
