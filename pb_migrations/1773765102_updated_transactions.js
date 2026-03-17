/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // remove field
  collection.fields.removeById("relation3535784144")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json3535784144",
    "maxSize": 0,
    "name": "postings",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2465304777",
    "hidden": false,
    "id": "relation3535784144",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "postings",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("json3535784144")

  return app.save(collection)
})
