// This path is special for Netlify Functions
const API_URL = "/.netlify/functions/api"; 

let allWorkouts = [];
let currentPage = 1;
const perPage = 10; // RUBRIC: Exactly 10 records per page

/* ==========================================
   1. DATA LOADING (READ)
   ========================================== */
async function loadData() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch from cloud");
        allWorkouts = await res.json();
        render();
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

/* ==========================================
   2. RENDERING & PAGING
   ========================================== */
function render() {
    // Paging logic: Slice the array to get only 10 items for the current page
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const currentItems = allWorkouts.slice(start, end);

    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    if (currentItems.length === 0) {
        grid.innerHTML = "<p>No workouts found. Add one!</p>";
    } else {
        grid.innerHTML = currentItems.map(w => `
            <div class="card">
                <h3>${w.name}</h3>
                <p><strong>Category:</strong> ${w.category}</p>
                <p><strong>Duration:</strong> ${w.duration} mins</p>
                <div class="card-actions">
                    <button onclick="editItem(${w.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${w.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Update Pagination Controls (RUBRIC Requirement 5)
    const totalPages = Math.ceil(allWorkouts.length / perPage);
    document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages || 1}`;
    document.getElementById('prev-btn').disabled = (currentPage === 1);
    document.getElementById('next-btn').disabled = (currentPage === totalPages || totalPages === 0);
    
    updateStats();
}

function changePage(dir) {
    currentPage += dir;
    render();
}

/* ==========================================
   3. CRUD OPERATIONS (CREATE, UPDATE, DELETE)
   ========================================== */

// FORM SUBMISSION (CREATE & UPDATE)
document.getElementById('workout-form').onsubmit = async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const workout = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        duration: parseInt(document.getElementById('duration').value)
    };

    // Determine if we are updating (PUT) or creating (POST)
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}?id=${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workout)
        });

        if (res.ok) {
            e.target.reset();
            document.getElementById('edit-id').value = '';
            document.getElementById('form-title').innerText = "Log Exercise";
            showSection('list-view');
            loadData(); // Reload to see changes
        }
    } catch (err) {
        alert("Error saving workout to cloud.");
    }
};

// DELETE (RUBRIC: Confirmation Required)
async function deleteItem(id) {
    if (confirm("Are you sure you want to delete this workout from the cloud?")) {
        try {
            const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
            if (res.ok) loadData();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }
}

// EDIT - PRE-FILL FORM
function editItem(id) {
    const w = allWorkouts.find(item => item.id === id);
    if (!w) return;

    document.getElementById('edit-id').value = w.id;
    document.getElementById('name').value = w.name;
    document.getElementById('category').value = w.category;
    document.getElementById('duration').value = w.duration;
    
    document.getElementById('form-title').innerText = "Edit Exercise";
    showSection('form-view');
}

/* ==========================================
   4. NAVIGATION & STATS
   ========================================== */
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function updateStats() {
    // RUBRIC Requirement 4: Total records and one domain-specific stat
    document.getElementById('stat-total').innerText = allWorkouts.length;
    
    // Domain stat: Total cumulative workout minutes
    const totalMins = allWorkouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0);
    document.getElementById('stat-minutes').innerText = totalMins;
}

// INITIAL LOAD
loadData();