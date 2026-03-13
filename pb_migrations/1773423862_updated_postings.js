/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2465304777")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2617963193",
    "hidden": false,
    "id": "relation1586311028",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "commodity",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2465304777")

  // remove field
  collection.fields.removeById("relation1586311028")

  return app.save(collection)
})
