package main

import (
	gonode "github.com/jgranstrom/gonodepkg"
	json "github.com/jgranstrom/go-simplejson"
)

var colData []*RowItem
var globalCollection = Collection{name:"global", data:colData}
var db = DB{[]*Collection{&globalCollection}}

func main() {

	// load persisted global data back into memory
	db.load()

	// Start the gonode listener which is an infinite loop until closed
	// It takes the processor function as only argument
	gonode.Start(process)
}


// This is the processor function which will be used to process each received command
// It takes a representation of the JSON received as parameter and returns
// the same structure as a representation for the JSON to respond
// Each process will be called on its own routine and does not block the gonode command loop
// The Json objects has methods for reading and manipulating the data received and responded
func process(packet *json.Json) (response *json.Json) {

	payload := packet.Get("payload")
	response, res, _ := json.MakeMap()
	res["err"] = 0

	switch command := packet.Get("command").MustString(); command {
	case "search": return search(payload)
	case "insert": return insert(payload)
	case "addCollection":  return addCollection(payload)
	case "start":
		res["msg"] = "Haste Started Listening!"
		return response
	default:
		res["err"] = 1
		res["msg"] = "No command found"
		return response
	}
}