import sql from 'sqlite3'

let db = new sql.Database('.hatchyt/database.db')

// FUTURE - connect to different databases based on settings.
// store all versions of generic queries here.

export default db