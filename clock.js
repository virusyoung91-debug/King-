// Initialize stored time zones
let timeZones = JSON.parse(localStorage.getItem('timeZones')) || ['UTC', 'America/New_York', 'Asia/Tokyo'];

// Initialize clocks on page load
document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');
    const select = document.getElementById('timezone-select');

    addBtn.addEventListener('click', addTimeZone);
    clearBtn.addEventListener('click', clearAllTimeZones);
    select.addEventListener('change', function() {
        if (this.value) {
            timeZones.push(this.value);
            saveTimeZones();
            renderClocks();
            this.value = '';
        }
    });

    renderClocks();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
});

function addTimeZone() {
    const select = document.getElementById('timezone-select');
    if (select.value) {
        if (!timeZones.includes(select.value)) {
            timeZones.push(select.value);
            saveTimeZones();
            renderClocks();
        }
        select.value = '';
    }
}

function clearAllTimeZones() {
    if (confirm('Are you sure you want to clear all time zones?')) {
        timeZones = [];
        saveTimeZones();
        renderClocks();
    }
}

function saveTimeZones() {
    localStorage.setItem('timeZones', JSON.stringify(timeZones));
}

function removeTimeZone(tz) {
    timeZones = timeZones.filter(t => t !== tz);
    saveTimeZones();
    renderClocks();
}

function renderClocks() {
    const container = document.getElementById('clocks-container');
    container.innerHTML = '';

    if (timeZones.length === 0) {
        container.innerHTML = '<div class="empty-message">📍 Select a time zone above to add a clock</div>';
        return;
    }

    timeZones.forEach(tz => {
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.innerHTML = `
            <button class="remove-btn" onclick="removeTimeZone('${tz}')">×</button>
            <div class="timezone-name">${tz}</div>
            <div class="digital-time" id="time-${tz}">--:--:--</div>
            <div class="date-info" id="date-${tz}"></div>
        `;
        container.appendChild(card);
    });

    updateAllClocks();
}

function updateAllClocks() {
    timeZones.forEach(tz => {
        updateClock(tz);
    });
}

function updateClock(timeZone) {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const parts = formatter.formatToParts(now);
        const partMap = {};
        parts.forEach(part => {
            partMap[part.type] = part.value;
        });

        const timeStr = `${partMap.hour}:${partMap.minute}:${partMap.second}`;
        const dateStr = `${partMap.month}/${partMap.day}/${partMap.year}`;

        const timeElement = document.getElementById(`time-${timeZone}`);
        const dateElement = document.getElementById(`date-${timeZone}`);

        if (timeElement) {
            timeElement.textContent = timeStr;
        }
        if (dateElement) {
            dateElement.textContent = dateStr;
        }
    } catch (e) {
        console.error(`Error updating clock for ${timeZone}:`, e);
    }
}