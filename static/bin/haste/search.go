package main

import (
	json "github.com/jgranstrom/go-simplejson"
	"sort"
	"strconv"
)

func search(payload *json.Json) (response *json.Json) {
	response, res, _ := json.MakeMap()

	dbName, _ := payload.Get("packageName").String()
	collection, err := db.getCollection(dbName)
	if err != nil {
		res["error"] = "not found collection"
		res["err"] = 1
		return response
	}

	searchText := payload.Get("value").MustString()
	searchListResults := collection.fuzzySearch(searchText)

	sort.Slice(searchListResults, func(i, j int) bool {
		return searchListResults[i].score > searchListResults[j].score
	})

	if len(searchListResults) > 5 {
		searchListResults = searchListResults[0:5]
	}


	_, n, _ := json.MakeMap()
	for i, item := range searchListResults {
		_, j, _ := json.MakeMap()
		jsItem, _ := json.NewJson([]byte(item.value))
		j["score"] = item.score * 100
		j["title"] = jsItem.Get("title").MustString()
		j["icon"] = jsItem.Get("i").MustString()
		j["d"] = jsItem.Get("d").MustString()
		j["path"] = jsItem.Get("p").MustString()
		n[strconv.Itoa(i)] = j
	}

	res["length"] = len(searchListResults)
	res["data"] = n

	return response
}