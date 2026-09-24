# PROG2002 Assessment 2: Zhejiang Community Charity Events Platform

## Student Information
- **Student Name:** Xuanhao Zhang
- **Course:** PROG2002 Object-Oriented Application Development / Web Development
- **Project Title:** Zhejiang Community Charity Events Platform

---

## Project Overview
This full-stack web application allows users to explore and view details of community charity running events across various cities in Zhejiang Province (e.g., Hangzhou, Ningbo, Shaoxing, Huzhou, Jiaxing, Wenzhou). 

The platform features a responsive frontend client and a RESTful API backend connected to a relational SQLite database.

---

## Tech Stack
- **Backend:** Node.js, Express.js, SQLite3
- **Frontend:** HTML5, CSS3, Modern JavaScript (ES6 Fetch API)
- **Database:** SQLite (`charity_events.db`)

---

## Repository Structure

```text
PROG2002-A2/
├── XuanhaoZhangA2-api/       # Backend REST API Server
│   ├── db/                   # Database storage directory
│   ├── server.js             # Express application & API routes
│   ├── setup-db.js            # Database schema setup & seeding script
│   └── package.json          # Node.js package dependencies
├── XuanhaoZhangA2-client/    # Frontend Web Application
│   ├── index.html            # Main event discovery page
│   ├── details.html          # Individual event details page
│   ├── main.js               # Event listing & filtering logic
│   ├── details.js            # Single event fetch & render logic
│   └── style.css             # UI styling and layout rules
├── .gitignore                # Git exclusion rules
└── README.md                 # Project documentation