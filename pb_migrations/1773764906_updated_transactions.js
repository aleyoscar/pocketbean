/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // remove field
  collection.fields.removeById("relation3256409694")

  // remove field
  collection.fields.removeById("relation1874629670")

  // remove field
  collection.fields.removeById("relation3514999064")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3256409694",
    "max": 0,
    "min": 0,
    "name": "payee",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1874629670",
    "max": 0,
    "min": 0,
    "name": "tags",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3514999064",
    "max": 0,
    "min": 0,
    "name": "links",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2685195880",
    "hidden": false,
    "id": "relation3256409694",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "payee",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1219621782",
    "hidden": false,
    "id": "relation1874629670",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_449060851",
    "hidden": false,
    "id": "relation3514999064",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "links",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("text3256409694")

  // remove field
  collection.fields.removeById("text1874629670")

  // remove field
  collection.fields.removeById("text3514999064")

  return app.save(collection)
})
