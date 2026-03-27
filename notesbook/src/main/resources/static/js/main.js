// main.js

const API_URL = "http://localhost:8080/api";
let noteModal;
let currentEditId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    if (window.location.pathname.includes('dashboard.html')) {
        checkAuth();
        loadNotes();
        noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
    } else {
        setupAuthForms();
    }
});

// Setup authentication forms
function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            register();
        });
    }
}

// Login function
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        return data;
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userId', data.user.id);
            window.location.href = 'dashboard.html';
        }
    })
    .catch(error => {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    });
}

// Register function - UPDATED to redirect to login instead of auto-login
function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        return data;
    })
    .then(data => {
        if (data.token) {
            // Show success message
            const successDiv = document.getElementById('registerSuccess');
            successDiv.textContent = 'Registration successful! Please login to continue.';
            successDiv.style.display = 'block';
            
            // Clear the registration form
            document.getElementById('regName').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
            
            // Switch to login tab
            const loginTab = document.getElementById('login-tab');
            const registerTab = document.getElementById('register-tab');
            const loginPane = document.getElementById('login');
            const registerPane = document.getElementById('register');
            
            if (loginTab && registerTab && loginPane && registerPane) {
                loginTab.classList.add('active');
                registerTab.classList.remove('active');
                loginPane.classList.add('show', 'active');
                registerPane.classList.remove('show', 'active');
            }
            
            // Auto-fill the email field in login form for convenience
            document.getElementById('loginEmail').value = email;
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 3000);
        }
    })
    .catch(error => {
        const errorDiv = document.getElementById('registerError');
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    });
}

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    
    if (!token || !userName) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('username').textContent = userName;
}

// Logout function
function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Load all notes
function loadNotes() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_URL}/notes`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            if (response.status === 401) {
                logout();
            }
            throw new Error('Failed to load notes');
        }
        return response.json();
    })
    .then(notes => {
        displayNotes(notes);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('notesList').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">Error loading notes: ${error.message}</div>
            </div>
        `;
    });
}

// Display notes in the dashboard
function displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    
    if (!notes || notes.length === 0) {
        notesList.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h4>No notes yet</h4>
                    <p>Click the "Create New Note" button to get started!</p>
                </div>
            </div>
        `;
        return;
    }
    
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteCard = `
            <div class="col-md-6 col-lg-4 note-card">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="note-title">${escapeHtml(note.title)}</h5>
                        <p class="note-content">${escapeHtml(note.content.substring(0, 150))}${note.content.length > 150 ? '...' : ''}</p>
                        <div class="note-meta">
                            <small><i class="far fa-calendar-alt"></i> Created: ${new Date(note.createdAt).toLocaleDateString()}</small><br>
                            <small><i class="far fa-clock"></i> Updated: ${new Date(note.updatedAt).toLocaleString()}</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <button class="btn btn-sm btn-warning" onclick="editNote(${note.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        notesList.innerHTML += noteCard;
    });
}

// Show create note modal
function showCreateModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Create Note';
    document.getElementById('noteId').value = '';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    noteModal.show();
}

// Edit note
function editNote(id) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_URL}/notes`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(notes => {
        const note = notes.find(n => n.id === id);
        if (note) {
            currentEditId = id;
            document.getElementById('modalTitle').textContent = 'Edit Note';
            document.getElementById('noteId').value = note.id;
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            noteModal.show();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error loading note: ' + error.message);
    });
}

// Save note (create or update)
function saveNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    const token = localStorage.getItem('token');
    
    if (!title.trim() || !content.trim()) {
        alert('Please fill in both title and content');
        return;
    }
    
    const url = currentEditId ? `${API_URL}/notes/update/${currentEditId}` : `${API_URL}/notes/create`;
    const method = currentEditId ? 'PUT' : 'POST';
    const body = JSON.stringify({ title, content });
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: body
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        return response.json();
    })
    .then(() => {
        noteModal.hide();
        loadNotes();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving note: ' + error.message);
    });
}

// Delete note
function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_URL}/notes/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        loadNotes();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error deleting note: ' + error.message);
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}