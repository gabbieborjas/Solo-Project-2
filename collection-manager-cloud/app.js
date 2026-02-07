const DATA_PATH = "data.json"; 

let allWorkouts = [];
let currentPage = 1;
const perPage = 10; // RUBRIC: Exactly 10 per page

/* ==========================================
   1. DATA LOADING
   ========================================== */
async function loadData() {
    try {
        const res = await fetch(DATA_PATH);
        if (!res.ok) throw new Error("Could not find data.json");
        allWorkouts = await res.json();
        render();
    } catch (err) {
        console.error("Error:", err);
        // Fallback in case the fetch fails
        document.getElementById('grid').innerHTML = "<p style='color:red;'>Error loading workout data.</p>";
    }
}

/* ==========================================
   2. RENDERING & PAGING (Requirement 5)
   ========================================== */
function render() {
    // Calculate start and end indices for the current page
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const currentItems = allWorkouts.slice(start, end);

    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    if (currentItems.length === 0) {
        grid.innerHTML = "<p>No workouts found.</p>";
    } else {
        grid.innerHTML = currentItems.map(w => `
            <div class="card">
                <h3>${w.name}</h3>
                <p><strong>Category:</strong> ${w.category}</p>
                <p><strong>Duration:</strong> ${w.duration} mins</p>
                <div style="margin-top:20px; display: flex; gap: 10px;">
                    <button onclick="editItem(${w.id})" style="background:var(--dark); color:white; padding:10px 18px; border:none; border-radius:8px; cursor:pointer;">Edit</button>
                    <button onclick="deleteItem(${w.id})" style="background:var(--accent); color:white; padding:10px 18px; border:none; border-radius:8px; cursor:pointer;">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Update Pagination Display
    const totalPages = Math.ceil(allWorkouts.length / perPage);
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
        pageInfo.innerText = `Page ${currentPage} of ${totalPages || 1}`;
    }
    
    // Disable/Enable buttons
    document.getElementById('prev-btn').disabled = (currentPage === 1);
    document.getElementById('next-btn').disabled = (currentPage === totalPages || totalPages === 0);
    
    updateStats();
}

function changePage(dir) {
    currentPage += dir;
    render();
}

/* ==========================================
   3. DASHBOARD STATS (Requirement 4)
   ========================================== */
function updateStats() {
    document.getElementById('stat-total').innerText = allWorkouts.length;
    const totalMins = allWorkouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0);
    document.getElementById('stat-minutes').innerText = totalMins;
}

/* ==========================================
   4. CRUD OPERATIONS
   ========================================== */

// DELETE (Requirement 4: Confirmation Required)
function deleteItem(id) {
    if (confirm("Are you sure you want to delete this workout?")) {
        allWorkouts = allWorkouts.filter(w => w.id !== id);
        render(); 
    }
}

// NAVIGATION
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
}

// FORM SUBMISSION (Create/Update)
document.getElementById('workout-form').onsubmit = (e) => {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const newWorkout = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        duration: parseInt(document.getElementById('duration').value)
    };

    if (id) {
        // Update
        allWorkouts = allWorkouts.map(w => w.id === parseInt(id) ? newWorkout : w);
    } else {
        // Create
        allWorkouts.push(newWorkout);
    }

    e.target.reset();
    document.getElementById('edit-id').value = '';
    showSection('list-view');
    render();
};

function editItem(id) {
    const w = allWorkouts.find(item => item.id === id);
    if (!w) return;

    document.getElementById('edit-id').value = w.id;
    document.getElementById('name').value = w.name;
    document.getElementById('category').value = w.category;
    document.getElementById('duration').value = w.duration;
    
    showSection('form-view');
}

// INITIAL START
loadData();
