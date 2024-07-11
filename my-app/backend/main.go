
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
)

var db *sql.DB

func main() {
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	dbPath := filepath.Join(dir, "urls.db")

	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal("Error opening database file:", err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, long_url TEXT NOT NULL, short_url TEXT NOT NULL)")
	if err != nil {
		log.Fatal("Error creating table:", err)
	}

	log.Println("Table created or already exists")

	http.HandleFunc("/shorten", shortenURLHandler)
	http.HandleFunc("/", redirectHandler)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(http.DefaultServeMux)

	log.Println("Server is running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func generateShortURL() string {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	rand.Seed(time.Now().UnixNano())
	b := make([]byte, 6)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func shortenURLHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		LongURL string `json:"long_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	shortCode := generateShortURL()
	shortURL := fmt.Sprintf("http://localhost:8080/%s", shortCode)

	_, err := db.Exec("INSERT INTO urls (long_url, short_url) VALUES (?, ?)", req.LongURL, shortCode)
	if err != nil {
		log.Printf("Error inserting URL into database: %v", err)
		http.Error(w, fmt.Sprintf("Error inserting URL into database: %v", err), http.StatusInternalServerError)
		return
	}

	res := struct {
		ShortURL string `json:"short_url"`
	}{
		ShortURL: shortURL,
	}

	json.NewEncoder(w).Encode(res)
}

func redirectHandler(w http.ResponseWriter, r *http.Request) {
	shortCode := r.URL.Path[1:] // Trim leading "/"
	if shortCode == "" {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	var longURL string
	err := db.QueryRow("SELECT long_url FROM urls WHERE short_url = ?", shortCode).Scan(&longURL)
	if err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	http.Redirect(w, r, longURL, http.StatusFound)
}
