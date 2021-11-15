require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require('./db');
const app = express();

const port = process.env.PORT || 3002;
var server_host = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

//get all restaurants
app.get('/api/v1/restaurants', async (req, res) => {
    try {
        const results = await db.query("select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;")
        
        res.status(200).json({
            "status": "success",
            "results": results.rows.length,
            "data" : { "restaurants" : results.rows}
        })
    }catch(err) {
        console.log("Sorry, did not work!!!!")
    }
   
});

//get single restaurant
app.get('/api/v1/restaurants/:id', async (req, res) => {
        
    
        
        // const results = await db.query(`SELECT * FROM restaurants WHERE id = ${id}`);
        try {
            const {id} = req.params;
            const restaurant = await db.query("select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
            [id])
            const reviews = await db.query("SELECT * FROM reviews WHERE restaurant_id = $1", [id])
            res.status(200).json({
                "status" : "success",
                "data": {
                   "restaurant": restaurant.rows[0],
                   "reviews": reviews.rows
                }
            })
        }catch(err) {
            console.log(err);
        }
        
        
});


//add restaurant
app.post('/api/v1/restaurants', async (req, res) => {
    try {
        const {name, location, price_range} = req.body;
        const results = await db.query("INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *", [name, location, price_range])
        
        res.status(201).json({
            "status" : "success", 
            "data" : {
            "restaurant": results.rows[0]
        }});
    }catch(err) {
        console.log(err);
    }
});


//update restaurant
app.put('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const {name, location, price_range} = req.body;
        const {id} = req.params;
        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *", [name, location, price_range, id]);
        res.status(200).json({
            "status" : "success", 
            "data" : {
            "restaurant": results.rows[0]
        }})
    }catch(err) {
        console.log(err);
    }
});

//delete restaurant
app.delete('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const results = await db.query("DELETE FROM restaurants WHERE id = $1", [id])
        res.status(204).json({
            "status" : "success"
        });
    }catch(err) {
        console.log(err)
    }
});

//add reviews
app.post('/api/v1/restaurants/:id/addReview', async (req, res) => {
    try {
        const {id} = req.params;
        const {name, review, rating} = req.body;
        const newReview = await db.query('INSERT INTO reviews (restaurant_id, name, review, rating) VALUES ($1, $2, $3, $4) returning *;', [id, name, review, rating ])
        
        res.status(201).json({
            "status": "success",
            "data" : {
                "review": newReview.rows[0],
            }
        });
    }catch(err) {
        console.log(err);
    }
});

app.listen(port,server_host, () => {
    console.log(`Server Running On Port ${port}`)
});