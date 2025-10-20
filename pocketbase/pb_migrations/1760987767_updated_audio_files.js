/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wbzryti42j4f1bz")

  collection.listRule = "@request.auth.id = uploader_id"
  collection.viewRule = "@request.auth.id = uploader_id"
  collection.createRule = "@request.auth.id != \"\""
  collection.updateRule = "@request.auth.id = uploader_id"
  collection.deleteRule = "@request.auth.id = uploader_id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wbzryti42j4f1bz")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
