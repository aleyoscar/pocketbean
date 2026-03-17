/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json3535784144",
    "maxSize": 0,
    "name": "postings",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // update field
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
})
