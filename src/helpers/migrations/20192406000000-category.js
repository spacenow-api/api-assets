exports.up = (db, callback) => (
  db.addColumn("Categories", "isActive", {
    type: "boolean",
    defaultValue: true,
    allowNull: false
  }, callback)
)

exports.down = (db) => (
  db.removeColumn("Categories", "isActive")
)

exports._meta = {
  version: 1
};