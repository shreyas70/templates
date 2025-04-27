// Configuration
const API_URL = 'http://localhost:8000';

// Initialize Reveal.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Reveal
    Reveal.initialize({
        hash: true,
        controls: true,
        progress: true,
        center: false,
        width: '100%',
        height: '100%',
        margin: 0,
        minScale: 1,
        maxScale: 1
    });
    
    // Initialize the app
    initApp();
});

// App State
let habits = [];
let selectedHabit = null;

// Initialize the application
function initApp() {
    // Add event listeners
    document.getElementById('add-habit-form').addEventListener('submit', handleAddHabit);
    
    // Load initial data
    loadHabits();
    
    // Set up event delegation for dynamically created elements
    document.addEventListener('click', handleGlobalClick);
    
    // Set up habit selector for calendar
    document.getElementById('calendar-habit-select').addEventListener('change', handleHabitSelect);
    
    // Update stats when navigating to the stats slide
    Reveal.on('slidechanged', event => {
        const currentSlide = event.currentSlide;
        if (currentSlide.querySelector('#stats-container')) {
            updateStats();
        } else if (currentSlide.querySelector('#calendar-container')) {
            updateCalendar();
        }
    });
}

// Handle global click events using event delegation
function handleGlobalClick(event) {
    // Complete button
    if (event.target.classList.contains('complete-btn')) {
        const habitItem = event.target.closest('.habit-item');
        const habitId = habitItem.dataset.id;
        completeHabit(habitId);
    }
    
    // View details button
    if (event.target.classList.contains('view-btn')) {
        const habitItem = event.target.closest('.habit-item');
        const habitId = habitItem.dataset.id;
        viewHabitDetails(habitId);
    }
    
    // Delete button
    if (event.target.classList.contains('delete-btn')) {
        const habitItem = event.target.closest('.habit-item');
        const habitId = habitItem.dataset.id;
        deleteHabit(habitId);
    }
}

// Load habits from the API
async function loadHabits() {
    try {
        const response = await fetch(`${API_URL}/habits/`);
        if (!response.ok) throw new Error('Failed to load habits');
        
        habits = await response.json();
        renderHabits();
        updateHabitSelector();
        updateStats();
    } catch (error) {
        console.error('Error loading habits:', error);
        document.getElementById('habits-list').innerHTML = `
            <p class="error">Failed to load habits. Please try again.</p>
        `;
    }
}

// Render habits in the habits list
function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    habitsList.innerHTML = '';
    
    if (habits.length === 0) {
        habitsList.innerHTML = '<p>No habits yet. Add your first habit!</p>';
        return;
    }
    
    habits.forEach(habit => {
        const template = document.getElementById('habit-item-template');
        const habitItem = template.content.cloneNode(true);
        
        habitItem.querySelector('.habit-item').dataset.id = habit.id;
        habitItem.querySelector('.habit-name').textContent = habit.name;
        habitItem.querySelector('.habit-description').textContent = habit.description;
        
        // Fetch and update streak
        fetchHabitStreak(habit.id).then(streak => {
            const habitElement = document.querySelector(`.habit-item[data-id="${habit.id}"]`);
            if (habitElement) {
                habitElement.querySelector('.streak-value').textContent = `${streak} days`;
            }
        });
        
        habitsList.appendChild(habitItem);
    });
}

// Handle adding a new habit
async function handleAddHabit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('habit-name');
    const descriptionInput = document.getElementById('habit-description');
    
    const habitData = {
        name: nameInput.value,
        description: descriptionInput.value
    };
    
    try {
        const response = await fetch(`${API_URL}/habits/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habitData)
        });
        
        if (!response.ok) throw new Error('Failed to add habit');
        
        const newHabit = await response.json();
        habits.push(newHabit);
        
        // Reset form
        nameInput.value = '';
        descriptionInput.value = '';
        
        // Update UI
        renderHabits();
        updateHabitSelector();
        updateStats();
        
    } catch (error) {
        console.error('Error adding habit:', error);
        alert('Failed to add habit. Please try again.');
    }
}

// Complete a habit for today
async function completeHabit(habitId) {
    const today = new Date().toISOString().split('T')[0];
    
    try {
        const response = await fetch(`${API_URL}/habits/${habitId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completion_date: today })
        });
        
        if (!response.ok) throw new Error('Failed to complete habit');
        
        // Update UI
        fetchHabitStreak(habitId).then(streak => {
            const habitElement = document.querySelector(`.habit-item[data-id="${habitId}"]`);
            if (habitElement) {
                habitElement.querySelector('.streak-value').textContent = `${streak} days`;
            }
        });
        
        // If habit details are open, update them
        if (selectedHabit && selectedHabit.id === habitId) {
            viewHabitDetails(habitId);
        }
        
        // Update calendar if needed
        updateCalendar();
        
        // Update stats
        updateStats();
        
    } catch (error) {
        console.error('Error completing habit:', error);
        alert('Failed to complete habit. Please try again.');
    }
}

// View habit details
async function viewHabitDetails(habitId) {
    try {
        // Get habit details
        const habitResponse = await fetch(`${API_URL}/habits/${habitId}`);
        if (!habitResponse.ok) throw new Error('Failed to load habit details');
        
        const habit = await habitResponse.json();
        selectedHabit = habit;
        
        // Get habit completions
        const completionsResponse = await fetch(`${API_URL}/habits/${habitId}/completions`);
        if (!completionsResponse.ok) throw new Error('Failed to load habit completions');
        
        const completions = await completionsResponse.json();
        
        // Get habit streak
        const streakResponse = await fetch(`${API_URL}/habits/${habitId}/streak`);
        if (!streakResponse.ok) throw new Error('Failed to load habit streak');
        
        const streakData = await streakResponse.json();
        
        // Render habit details
        renderHabitDetails(habit, completions, streakData.streak);
        
        // Navigate to the details slide
        Reveal.slide(2); // Index 2 is the habit details slide
        
    } catch (error) {
        console.error('Error loading habit details:', error);
        alert('Failed to load habit details. Please try again.');
    }
}

// Render habit details
function renderHabitDetails(habit, completions, streak) {
    const detailsContainer = document.getElementById('habit-details');
    const template = document.getElementById('habit-details-template');
    const detailsElement = template.content.cloneNode(true);
    
    detailsElement.querySelector('.habit-name').textContent = habit.name;
    detailsElement.querySelector('.habit-description').textContent = habit.description;
    detailsElement.querySelector('.habit-created').textContent = formatDate(habit.created_at);
    detailsElement.querySelector('.habit-streak').textContent = streak;
    
    // Set form values for editing
    detailsElement.querySelector('.edit-name').value = habit.name;
    detailsElement.querySelector('.edit-description').value = habit.description;
    
    // Add submit handler for edit form
    const editForm = detailsElement.querySelector('.edit-habit-form');
    editForm.addEventListener('submit', event => {
        event.preventDefault();
        updateHabit(habit.id, editForm);
    });
    
    // Render completions
    const completionsList = detailsElement.querySelector('.completions-list');
    completionsList.innerHTML = '';
    
    if (completions.length === 0) {
        completionsList.innerHTML = '<p>No completions yet.</p>';
    } else {
        // Sort completions by date (newest first)
        completions.sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date));
        
        completions.forEach(completion => {
            const completionItem = document.createElement('div');
            completionItem.classList.add('completion-item');
            completionItem.textContent = formatDate(completion.completion_date);
            completionsList.appendChild(completionItem);
        });
    }
    
    detailsContainer.innerHTML = '';
    detailsContainer.appendChild(detailsElement);
}

// Update a habit
async function updateHabit(habitId, form) {
    const nameInput = form.querySelector('.edit-name');
    const descriptionInput = form.querySelector('.edit-description');
    
    const habitData = {
        name: nameInput.value,
        description: descriptionInput.value
    };
    
    try {
        const response = await fetch(`${API_URL}/habits/${habitId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habitData)
        });
        
        if (!response.ok) throw new Error('Failed to update habit');
        
        const updatedHabit = await response.json();
        
        // Update habits array
        const index = habits.findIndex(h => h.id === habitId);
        if (index !== -1) {
            habits[index] = updatedHabit;
        }
        
        // Update UI
        renderHabits();
        viewHabitDetails(habitId);
        updateHabitSelector();
        
    } catch (error) {
        console.error('Error updating habit:', error);
        alert('Failed to update habit. Please try again.');
    }
}

// Delete a habit
async function deleteHabit(habitId) {
    if (!confirm('Are you sure you want to delete this habit?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/habits/${habitId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete habit');
        
        // Remove from habits array
        habits = habits.filter(h => h.id !== habitId);
        
        // Update UI
        renderHabits();
        updateHabitSelector();
        updateStats();
        
        // If viewing details of the deleted habit, go back to dashboard
        if (selectedHabit && selectedHabit.id === habitId) {
            selectedHabit = null;
            Reveal.slide(1); // Go to dashboard slide
        }
        
    } catch (error) {
        console.error('Error deleting habit:', error);
        alert('Failed to delete habit. Please try again.');
    }
}

// Fetch habit streak
async function fetchHabitStreak(habitId) {
    try {
        const response = await fetch(`${API_URL}/habits/${habitId}/streak`);
        if (!response.ok) throw new Error('Failed to load habit streak');
        
        const data = await response.json();
        return data.streak;
    } catch (error) {
        console.error('Error fetching streak:', error);
        return 0;
    }
}

// Update habit selector for calendar
function updateHabitSelector() {
    const selector = document.getElementById('calendar-habit-select');
    selector.innerHTML = '<option value="">-- Select a habit --</option>';
    
    habits.forEach(habit => {
        const option = document.createElement('option');
        option.value = habit.id;
        option.textContent = habit.name;
        selector.appendChild(option);
    });
}

// Handle habit selection for calendar
function handleHabitSelect(event) {
    const habitId = event.target.value;
    if (habitId) {
        renderCalendar(habitId);
    } else {
        document.getElementById('calendar').innerHTML = '<p>Select a habit to view its calendar.</p>';
    }
}

// Render calendar for a habit
async function renderCalendar(habitId) {
    try {
        // Get habit completions
        const response = await fetch(`${API_URL}/habits/${habitId}/completions`);
        if (!response.ok) throw new Error('Failed to load habit completions');
        
        const completions = await response.json();
        
        // Create calendar for the last 30 days
        const calendarContainer = document.getElementById('calendar');
        calendarContainer.innerHTML = '';
        
        const today = new Date();
        const completionDates = completions.map(c => c.completion_date);
        
        // Create day cells for the last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            const dateString = date.toISOString().split('T')[0];
            const isCompleted = completionDates.includes(dateString);
            const isToday = i === 0;
            
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            if (isCompleted) dayCell.classList.add('completed');
            if (isToday) dayCell.classList.add('today');
            
            dayCell.textContent = date.getDate();
            dayCell.title = formatDate(dateString);
            
            calendarContainer.appendChild(dayCell);
        }
    } catch (error) {
        console.error('Error rendering calendar:', error);
        document.getElementById('calendar').innerHTML = '<p>Failed to load calendar data.</p>';
    }
}

// Update calendar
function updateCalendar() {
    const selector = document.getElementById('calendar-habit-select');
    if (selector.value) {
        renderCalendar(selector.value);
    }
}

// Update stats
async function updateStats() {
    try {
        // Update total habits
        document.getElementById('total-habits').textContent = habits.length;
        
        // Count completions for today
        const today = new Date().toISOString().split('T')[0];
        let todayCompletions = 0;
        let bestStreak = 0;
        
        // Get completions and streaks for all habits
        for (const habit of habits) {
            // Check if completed today
            const completionsResponse = await fetch(`${API_URL}/habits/${habit.id}/completions`);
            if (completionsResponse.ok) {
                const completions = await completionsResponse.json();
                if (completions.some(c => c.completion_date === today)) {
                    todayCompletions++;
                }
            }
            
            // Get streak
            const streakResponse = await fetch(`${API_URL}/habits/${habit.id}/streak`);
            if (streakResponse.ok) {
                const streakData = await streakResponse.json();
                bestStreak = Math.max(bestStreak, streakData.streak);
            }
        }
        
        document.getElementById('today-completions').textContent = todayCompletions;
        document.getElementById('best-streak').textContent = bestStreak;
        
        // Render habit stats
        const habitStats = document.getElementById('habit-stats');
        habitStats.innerHTML = '<h3>Habit Streaks</h3>';
        
        if (habits.length === 0) {
            habitStats.innerHTML += '<p>No habits yet.</p>';
            return;
        }
        
        const statsList = document.createElement('ul');
        statsList.classList.add('stats-list');
        
        for (const habit of habits) {
            const streakResponse = await fetch(`${API_URL}/habits/${habit.id}/streak`);
            if (streakResponse.ok) {
                const streakData = await streakResponse.json();
                
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${habit.name}:</strong> ${streakData.streak} day streak`;
                statsList.appendChild(listItem);
            }
        }
        
        habitStats.appendChild(statsList);
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Helper function to format dates
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
