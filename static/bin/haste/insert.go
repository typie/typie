package main

import (
	json "github.com/jgranstrom/go-simplejson"
	"time"
)

func insert(payload *json.Json) (response *json.Json) {
	response, res, _ := json.MakeMap()
	item, itemMap, _ := json.MakeMap()

	res["affectedRows"] = 1
	res["err"] = 0

	dbName, _ := payload.Get("packageName").String()
	collection, err := db.getCollection(dbName)
	if err != nil {
		res["error"] = "not found collection"
		res["err"] = 1
		return response
	}

	title, _ := payload.Get("title").String()
	if len(title) > 50 {
		title = title[0:50]
	}
	itemMap["title"], _ = payload.Get("title").String()
	itemMap["t"], _ = payload.Get("packageName").String()
	itemMap["d"], _ = payload.Get("description").String()
	itemMap["p"], _ = payload.Get("path").String()
	itemMap["i"], _ = payload.Get("icon").String()
	itemMap["u"] 	= time.Now().UTC().Unix()
	i,_ := item.MarshalJSON()

	itemStrValue := string(i)
	collection.insert(title, itemStrValue)
	collection.persistItem(itemStrValue)
	return response
}