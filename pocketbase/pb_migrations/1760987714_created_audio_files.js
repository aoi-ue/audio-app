/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "wbzryti42j4f1bz",
    "created": "2025-10-20 19:15:14.292Z",
    "updated": "2025-10-20 19:15:14.292Z",
    "name": "audio_files",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xndqtwvh",
        "name": "uploader_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "ymo8qywp",
        "name": "description",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "uiukasyq",
        "name": "category",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Music",
            "Podcast",
            "Audiobook",
            "Lecture",
            "Others"
          ]
        }
      },
      {
        "system": false,
        "id": "ezj48rnq",
        "name": "file",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [
            "audio/mp4",
            "audio/mpeg",
            "video/x-msvideo"
          ],
          "thumbs": [],
          "maxSelect": 1,
          "maxSize": 5242880,
          "protected": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wbzryti42j4f1bz");

  return dao.deleteCollection(collection);
})
