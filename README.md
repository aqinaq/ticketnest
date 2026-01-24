# TicketNest

## Project Description
TicketNest is an online ticket booking web application that allows users to
browse events and book tickets easily. The system is designed to handle events
such as movies, concerts, and sports matches.

## Team Member
- Akbope Bakytkeldy - SE-2426


## Project Topic
Online Ticket Booking System

## Planned Features
- Event listing and search
- Ticket availability display
- Online ticket booking
- User authentication
- Admin event management

## Installation & Run Instructions
1. Install dependencies:
   npm install
2. Start the server:
   node server.js
3. Open browser:
   http://localhost:3000

## Assignment 1 – Part 2

### Routes
- GET / – Home page
- GET /about – Project and team info
- GET /contact – Contact form
- POST /contact – Handles form submission
- 404 – Custom page for unknown routes

### Contact Form
The contact form sends data using POST. Submitted data is accessible
via req.body and logged in the server console.

### How to Run
npm install  
node server.js  
Visit http://localhost:3000

## Assignment 2 – Part 1

### Implemented Routes
- GET / – Home page
- GET /search?q= – Search using query parameter
- GET /item/:id – Dynamic item route
- POST /contact – Handles form submission and saves data
- GET /api/info – Returns project info in JSON
- 404 – Handles unknown routes

### Middleware
- express.urlencoded() for form data
- Custom logger middleware

### Data Storage
Contact form messages are saved to data/messages.json using fs.

### How to Run
npm install  
node server.js  
Visit http://localhost:3000
# TicketNest – Online Ticket Booking Platform


**Database Used:** SQLite (`sqlite3`)  
**Database File:** `./data/ticketnest.db`  

**Table: `events`**  

| Column   | Type    | Description                       | Constraints                |
|----------|---------|-----------------------------------|----------------------------|
| id       | INTEGER | Unique event identifier           | PRIMARY KEY, AUTOINCREMENT |
| title    | TEXT    | Event title                       | NOT NULL                   |
| location | TEXT    | Event location                    | NOT NULL                   |
| date     | TEXT    | Event date (YYYY-MM-DD recommended) | NOT NULL                   |

**Table Creation:** The table is created automatically when the server starts if it does not exist.  

---

## API Routes (CRUD)

Base URL: `/api/events`

| Method | Route            | Description                                   | Response Example / Status Code |
|--------|-----------------|-----------------------------------------------|-------------------------------|
| GET    | `/api/events`     | Get all events (sorted by `id ASC`)          | 200 OK – JSON array of events |
| GET    | `/api/events/:id` | Get a single event by ID                      | 200 OK / 400 Invalid ID / 404 Not Found |
| POST   | `/api/events`     | Create a new event (JSON body required)      | 201 Created / 400 Missing Fields / 500 DB Error |
| PUT    | `/api/events/:id` | Update an existing event by ID (JSON body)  | 200 OK / 400 Invalid ID or Missing Fields / 404 Not Found / 500 DB Error |
| DELETE | `/api/events/:id` | Delete an event by ID                        | 200 OK / 400 Invalid ID / 404 Not Found / 500 DB Error |

**Request Body Example (POST/PUT):**

```json
{
  "title": "Live Concert",
  "location": "Seoul Arena",
  "date": "2026-03-10"
}
Assignment 3 – Part 1: Backend API with MongoDB (CRUD)
Database

Database Used: MongoDB (native Node.js driver)

Database Name: ticketnest

Collection: events

The collection is created automatically on first insert.

Collection Structure
Field	Type	Description	Required
_id	ObjectId	Unique identifier	Yes
title	String	Event title	Yes
location	String	Event location	Yes
date	Date	Event date	Yes
API Routes (CRUD)

Base URL: /api/events

Method	Route	Description	Response Example / Status Code
GET	/api/events	Get all events (supports filtering, sorting, projection)	200 OK – JSON array of events
GET	/api/events/:id	Get a single event by ID	200 OK / 400 Invalid ID / 404 Not Found
POST	/api/events	Create a new event (JSON body required)	201 Created / 400 Missing Fields / 500 DB Error
PUT	/api/events/:id	Update an existing event by ID (JSON body required)	200 OK / 400 Invalid ID or Missing Fields / 404 Not Found / 500 DB Error
DELETE	/api/events/:id	Delete an event by ID	200 OK / 400 Invalid ID / 404 Not Found / 500 DB Error
Request Body Example (POST/PUT)
{
  "title": "Live Concert",
  "location": "Seoul Arena",
  "date": "2026-03-10"
}

Features Added in Assignment 3

MongoDB integration (native driver, no Mongoose)

Full CRUD for events

Filtering, sorting, and projection support on GET /api/events

Validation and proper HTTP status codes

Home page with links for API testing

Global 404 handler for API routes# ticketnest


# TicketNest

Live URL: https://ticketnest-3kbp.onrender.com/

## Description
TicketNest is an online ticket booking system built with Node.js, Express, and MongoDB.

## Features
- Full CRUD functionality
- REST API
- MongoDB Atlas
- Production deployment
- Web UI using fetch()

## Setup
npm install  
npm start

