# Solo-Project-2

# Fitness Tracker - Solo Project 2

A vibrant, full-stack workout management system designed for high visibility and ease of use. This project features a decoupled architecture with a frontend hosted on Netlify and a Python-based REST API hosted on Render.

## Live Deployment
* **Frontend (Netlify):** https://melodic-kataifi-464e96.netlify.app/
* **Backend API (Render):** https://solo-project-2-v9lh.onrender.com/workouts

---

## Technology Stack

### 1. Backend Language & Framework
* **Language:** Python 3.13
* **Framework:** Flask
* **Deployment:** Render.com
* **Key Feature:** The backend utilizes `Flask-CORS` to securely communicate with the Netlify frontend, enabling cross-origin data requests.

### 2. Explanation of JSON Persistence
Data persistence is handled through a server-side JSON strategy:
* **Data Source:** The backend maintains a `data.json` file which acts as the primary data store.
* **The Process:** When a user interacts with the app, the JavaScript frontend sends an asynchronous `fetch` request to the Python API. 
* **Persistence Logic:** The Python backend reads from `data.json` to serve the initial 30 records. When a user creates, updates, or deletes a workout, the Python logic modifies the data array and overwrites the `data.json` file on the server.
* **Reliability:** This ensures that even if the user refreshes their browser or accesses the site from a different device, the workout logs remain exactly as they left them.

### 3. Key UI Features
* **Vibrant Design:** Custom "Teal and Coral" theme with large, touch-friendly buttons and high-contrast typography.
* **Paging (Requirement 5):** The application logic restricts the display to exactly **10 records per page**, automatically calculating the necessary pages (e.g., 3 pages for the initial 30 records).
* **Dashboard (Requirement 4):** A dedicated stats view that aggregates the total number of sessions and cumulative workout minutes across the entire cloud database.

---
