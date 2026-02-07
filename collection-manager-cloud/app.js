const API_URL = "https://solo-project-2-v9lh.onrender.com"; 

let allWorkouts = [];
let currentPage = 1;
const perPage = 10;

async function loadData() {
    try {
        const res = await fetch(API_URL);
        allWorkouts = await res.json();
        render();
    } catch (err) {
        console.error("Connection to Python API failed:", err);
    }
}

function render() {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const currentItems = allWorkouts.slice(start, end);

    const grid = document.getElementById('grid');
    grid.innerHTML = currentItems.map(w => `
        <div class="card">
            <h3>${w.name}</h3>
            <p><strong>Category:</strong> ${w.category}</p>
            <p><strong>Duration:</strong> ${w.duration} mins</p>
            <div style="margin-top:20px; display:flex; gap:10px;">
                <button onclick="editItem(${w.id})" style="background:var(--dark); color:white; padding:10px 18px; border:none; border-radius:8px;">Edit</button>
                <button onclick="deleteItem(${w.id})" style="background:var(--accent); color:white; padding:10px 18px; border:none; border-radius:8px;">Delete</button>
            </div>
        </div>
    `).join('');

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

function updateStats() {
    document.getElementById('stat-total').innerText = allWorkouts.length;
    const totalMins = allWorkouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0);
    document.getElementById('stat-minutes').innerText = totalMins;
}

// CRUD - CREATE/UPDATE
document.getElementById('workout-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const workout = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        duration: parseInt(document.getElementById('duration').value)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout)
    });

    e.target.reset();
    document.getElementById('edit-id').value = '';
    showSection('list-view');
    loadData();
};

// CRUD - DELETE
async function deleteItem(id) {
    if (confirm("Delete this workout from the Python database?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadData();
    }
}

function editItem(id) {
    const w = allWorkouts.find(item => item.id === id);
    document.getElementById('edit-id').value = w.id;
    document.getElementById('name').value = w.name;
    document.getElementById('category').value = w.category;
    document.getElementById('duration').value = w.duration;
    showSection('form-view');
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

loadData();
