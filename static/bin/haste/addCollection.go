package main

import json "github.com/jgranstrom/go-simplejson"

func addCollection(payload *json.Json) (response *json.Json) {
	response, res, _ := json.MakeMap()

	name := payload.Get("name").MustString()

	db.addCollection(name)

	res["msg"] = "added collection '" + name + "'"
	res["err"] = 0

	return response
}
