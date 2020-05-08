package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

//Item is object type of database table "Items"
type Item struct {
	ID    primitive.ObjectID `json:"id" bson:"_id"`
	Name  string             `json:"name" bson:"name"`
	Price float32            `json:"price" bson:"price"`
	Image string             `json:"image" bson:"image"`
	Info  string             `json:"info" bson:"info"`
}

type itemList struct {
	Items []Item `json:"items"`
}

var mongoURL string = "mongodb://localhost:27017"
var dbName string = "cinemo_db"
var dataPath string = "db/data.json"
var client *mongo.Client

func main() {
	fmt.Println("Start Cinemo Trial App...")
	connectMongo()
	checkDbContent()

	router := mux.NewRouter()
	router.HandleFunc("/items", FetchAllItemsEndpoint).Methods("GET")
	router.HandleFunc("/checkPayment", CheckPaymentEndpoint).Methods("GET")
	http.ListenAndServe(":12345", router)
}

func connectMongo() {
	client, _ = mongo.NewClient(options.Client().ApplyURI(mongoURL))
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err := client.Connect(ctx)

	if err = client.Ping(ctx, readpref.Primary()); err != nil {
		fmt.Printf("could not ping to mongo db service: %v\n", err)
	}

	fmt.Println("connected to nosql database:", mongoURL)
}

func checkDbContent() {
	list, _ := client.ListDatabaseNames(context.TODO(), bson.D{})
	if checkIfIn(dbName, list) == false {
		fmt.Println("here")
		createDatabaseEntries(client)
	}
	itemsCollection := client.Database(dbName).Collection("items")
	count, err := itemsCollection.CountDocuments(context.TODO(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	if count == 0 {
		createDatabaseEntries(client)
	}
}

func createDatabaseEntries(client *mongo.Client) {
	fmt.Println("Creating Cinemo Database...")
	itemsCollection := client.Database(dbName).Collection("items")

	stream, err := os.Open(dataPath)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Creating default database entries...")
	defer stream.Close()
	byteValue, _ := ioutil.ReadAll(stream)

	var itemList itemList
	var j int
	json.Unmarshal(byteValue, &itemList)
	fmt.Println(itemList)

	for i := 0; i < len(itemList.Items); i++ {
		j++
		result, err := itemsCollection.InsertOne(context.TODO(), bson.D{
			{Key: "name", Value: itemList.Items[i].Name},
			{Key: "price", Value: itemList.Items[i].Price},
			{Key: "image", Value: itemList.Items[i].Image},
			{Key: "info", Value: itemList.Items[i].Info},
		})
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(result)
	}

	fmt.Printf("Inserted %v items into items table\n", j)
}

func checkIfIn(item string, list []string) bool {
	for i := 0; i < len(list); i++ {
		if item == list[i] {
			return true
		}
	}
	return false
}

//FetchAllItemsEndpoint returns all items of the 'items' collection
func FetchAllItemsEndpoint(response http.ResponseWriter, request *http.Request) {
	itemsCollection := client.Database(dbName).Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	cursor, err := itemsCollection.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	var results []*Item
	for cursor.Next(context.TODO()) {
		var item Item
		cursor.Decode(&item)
		results = append(results, &item)
	}
	json.NewEncoder(response).Encode(results)
}

//CheckPaymentEndpoint returns all items of the 'items' collection
func CheckPaymentEndpoint(response http.ResponseWriter, request *http.Request) {
	results := true
	json.NewEncoder(response).Encode(results)
}
