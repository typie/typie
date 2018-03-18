package main

import (
	"errors"
	"github.com/xrash/smetrics"
	"io/ioutil"
	"os"
	"log"
	"bufio"
	json "github.com/jgranstrom/go-simplejson"
)

type RowItem struct {
	key string
	value string
}
type Collection struct {
	name string
	data []*RowItem
}
type DB struct {
	db []*Collection
}
type searchItemResult struct {
	score float64
	key string
	value string
}

func (DB *DB) getCollection(name string) (*Collection, error) {
	for _, collection := range DB.db {
		if collection.name == name {
			return collection, nil
		}
	}
	return nil, errors.New("no collection found '" + name +"'")
}




func (collection *Collection) insert(key string, value string) {
	item := RowItem{key: key, value: value}
	if len(collection.data) > 100000 {
		collection.data = append(collection.data, &item)[1:]
	} else {
		collection.data = append(collection.data, &item)
	}
}
func (collection *Collection) get(key string) (*RowItem, error) {
	for _, item := range collection.data {
		if item.key == key {
			return item, nil
		}
	}
	return nil, errors.New("item not found in collection '" + collection.name + "'")
}
func (collection *Collection) toString() string {
	data := ""
	for _, item := range collection.data {
		data = data + "|" + item.key
	}
	return data
}

func (collection *Collection) scan(key string, iterator func(item *RowItem) bool) (Collection) {
	resultCollection := Collection{name:"result for search", data:[]*RowItem{}}
	for _, item := range collection.data {
		if iterator(item) {
			resultCollection.data = append(resultCollection.data, item)
		}
	}
	return resultCollection
}
func (collection *Collection) fuzzySearch(searchKey string) []searchItemResult {
	var searchListResults []searchItemResult
	for _, item := range collection.data {
		r := smetrics.JaroWinkler(searchKey, item.key, 0.7, 4)
		if r > 0.04 {
			item := searchItemResult{
				r,
				item.key,
				item.value,
			}
			searchListResults = append(searchListResults, item)
		}
	}
	return searchListResults
}



func (DB *DB) persist() {
	for _, coll := range DB.db {
		go coll.persist()
	}
}
func (collection *Collection) persist() {
	file := collection.name + ".db"
	temp := ""
	for _, item := range collection.data {
		temp += item.value + "\n"
	}
	_ = ioutil.WriteFile(file, []byte(temp), 0644)
}
func (collection *Collection) persistItem(itemValue string) {
	file := collection.name + ".db"
	f, err := os.OpenFile(file, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0660)
	defer f.Close()
	if err != nil {
		log.Fatal(err)
	}

	// write to file, f.Write()
	f.Write([]byte(itemValue + "\n"))
	f.Close()
}
func (DB *DB) load() {
	for _, coll := range DB.db {
		go coll.load()
	}
}
func (collection *Collection) load() {
	file := collection.name + ".db"

	inFile, _ := os.Open(file)
	defer inFile.Close()
	scanner := bufio.NewScanner(inFile)
	scanner.Split(bufio.ScanLines)

	for scanner.Scan() {
		item, _ := json.NewJson(scanner.Bytes())
		_ = insert(item)
	}

	inFile.Close()
}

func (DB *DB) addCollection(name string) *Collection {
	for _, col := range DB.db {
		if col.name == name {
			return col
		}
	}

	coll := Collection{
		name: name,
		data: []*RowItem{},
	}
	DB.db = append(DB.db, &coll)



	coll.load()

	return &coll
}