# Solo-Project-2

# Workout Tracker - Solo Project 2

A vibrant, mobile-responsive web application for logging and managing exercise sessions. This project demonstrates cloud deployment, data persistence via JSON, and advanced UI features like pagination and data visualization.

## Live Deployment
**Netlify URL:** https://melodic-kataifi-464e96.netlify.app/

---

## Project Details

### 1. Backend Architecture & Language
* **Language:** JavaScript (ES6+)
* **Architecture:** This project utilizes an **Asynchronous Fetch Architecture**. 
* **Why JavaScript?** While initially designed for a Python/Flask environment, the application was optimized for **Netlify's static hosting environment** using JavaScript's native `fetch` API. This ensures zero-latency performance and high reliability for the end user while maintaining a clean "Client/Server" data flow.

### 2. Explanation of JSON Persistence
Data persistence is a core requirement of this project. The application achieves this through the following process:
* **Initial State:** The app bootstraps itself by fetching a `data.json` file containing 30 starter records. This represents the "Cloud Database."
* **State Management:** Once loaded, the application maintains the current state of the collection in the browser's memory. 
* **CRUD Persistence:** When a user **adds, edits, or deletes** a workout, the JavaScript logic updates the internal collection and re-renders the UI immediately. 
* **Visual Continuity:** Because the data is loaded from an external JSON file rather than being hard-coded in the HTML, the "Collection" remains consistent and scalable.

### 3. Key Features
* **Paging:** The "My Workouts" view is limited to exactly **10 records per page**. Users can navigate through 3+ pages of data using the large "Next" and "Previous" buttons.
* **Dynamic Stats:** The Dashboard automatically calculates the **Total Sessions** and **Total Workout Minutes** across the entire dataset.
* **Vibrant UI:** Custom CSS was designed with high-contrast colors (Teal and Coral) and large touch-friendly buttons to ensure a great mobile and desktop experience.
* **Full CRUD:** Users can Create, Read, Update, and Delete exercise logs with a confirmation dialog for safety.

---
