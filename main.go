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
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"golang.org/x/crypto/bcrypt"
)

//Item object provides interface for items collection
type Item struct {
	Name  string  `json:"name" bson:"name"`
	Price float32 `json:"price" bson:"price"`
	Image string  `json:"image" bson:"image"`
	Info  string  `json:"info" bson:"info"`
}

type itemList struct {
	Items []Item `json:"items"`
}

//User object provides interface for users collection
type User struct {
	Name  string `json:"name" bson:"name"`
	Email string `json:"email" bson:"email"`
	Pwd   string `json:"pwd" bson:"pwd"`
}

//Cred object provides interface for credentials
type Cred struct {
	Name string `json:"name" bson:"name"`
	Pwd  string `json:"pwd" bson:"pwd"`
}

var mongoURL string = "mongodb://localhost:27017"
var dbName string = "cinemo_db"
var dataPath string = "db/data.json"
var port string = ":12345"
var client *mongo.Client

func main() {
	fmt.Println("Starting Cinemo Trial App...")
	connectMongo()
	initItemsCollection()
	initUsersCollection()

	fmt.Println("Starting go-server...")
	router := mux.NewRouter()
	router.HandleFunc("/items", FetchAllItemsEndpoint).Methods("GET")
	router.HandleFunc("/checkTransaction", CheckTransactionEndpoint).Methods("POST")
	router.HandleFunc("/createUser", CreateUserEndpoint).Methods("POST")
	router.HandleFunc("/checkCred", CheckCredEndpoint).Methods("POST")
	http.ListenAndServe(port, router)
}

func connectMongo() {
	client, _ = mongo.NewClient(options.Client().ApplyURI(mongoURL))
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err := client.Connect(ctx)

	if err = client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatalf("could not ping to mongo db service: %v\n", err)
	}

	fmt.Println("connected to nosql database:", mongoURL)
}

func initItemsCollection() {
	list, _ := client.ListDatabaseNames(context.TODO(), bson.D{})
	if checkIfIn(dbName, list) == false {
		fmt.Println("Creating items collection...")
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
	json.Unmarshal(byteValue, &itemList)
	j := 0
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

func initUsersCollection() {
	fmt.Println("Creating users collection...")
	userCollection := client.Database(dbName).Collection("users")
	index, err := userCollection.Indexes().CreateOne(
		context.TODO(),
		mongo.IndexModel{
			Keys: bson.M{
				"name": 1,
			},
			Options: options.Index().SetUnique(true),
		},
	)
	if err != nil {
		log.Println(err)
	}
	log.Println("Created unique key in users collection:", index)
	addUser("root", "root@root.com", "root")
}

func addUser(name string, email string, pwd string) bool {
	hash := hashAndSalt([]byte(pwd))
	userCollection := client.Database(dbName).Collection("users")
	result, err := userCollection.InsertOne(context.TODO(), bson.D{
		{Key: "name", Value: name},
		{Key: "email", Value: email},
		{Key: "pwd", Value: hash},
	})
	if err != nil {
		log.Println("User with name", name, "already exists...")
		return false
	}
	log.Println("Created new user with _id:", result)
	return true
}

func hashAndSalt(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
		return ""
	}
	return string(hash)
}

func checkCred(name string, pwd string) bool {
	userCollection := client.Database(dbName).Collection("users")
	hash := hashAndSalt([]byte(pwd))
	result, err := userCollection.Find(context.TODO(), bson.D{
		{Key: "name", Value: name},
		{Key: "pwd", Value: hash},
	})
	if err != nil {
		log.Println(err)
		return false
	}
	log.Println(result)
	return true
}

//FetchAllItemsEndpoint returns all items of the 'items' collection
func FetchAllItemsEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	response.Header().Add("Access-Control-Allow-Origin", "*")
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

//CheckTransactionEndpoint checks if the transaction was successful
func CheckTransactionEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	response.Header().Add("Access-Control-Allow-Origin", "*")
	var transactionID int
	json.NewDecoder(request.Body).Decode(&transactionID)
	log.Println("Transaction with id", transactionID, "was successful...")
	results := true
	json.NewEncoder(response).Encode(results)
}

//CreateUserEndpoint creates a new user in 'users' collection
func CreateUserEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	response.Header().Add("Access-Control-Allow-Origin", "*")
	var user User
	json.NewDecoder(request.Body).Decode(&user)
	check := addUser(user.Name, user.Email, user.Pwd)
	if check == true {
		json.NewEncoder(response).Encode("User was created successfully ...")
	} else {
		json.NewEncoder(response).Encode("User could not be created...")
	}
}

//CheckCredEndpoint checks user credentials in 'users' collection and returns token
func CheckCredEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	response.Header().Add("Access-Control-Allow-Origin", "*")
	var cred Cred
	json.NewDecoder(request.Body).Decode(&cred)
	check := checkCred(cred.Name, cred.Pwd)
	json.NewEncoder(response).Encode(check)
}
