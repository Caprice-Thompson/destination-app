import pgPromise from "pg-promise";

// sort this out for local and production
const pgp = pgPromise();

const db = pgp({
  connectionString: process.env.LOCAL_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default db;
