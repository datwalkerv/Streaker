// Initialize Chart
const ctx = document.getElementById('progressChart').getContext('2d');
let progressChart;

// Load data from LocalStorage or initialize empty
let progressData = JSON.parse(localStorage.getItem('progressData')) || {
  labels: [], // Days
  datasets: [{
    label: 'Progress',
    data: [], // Progress values
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // White with opacity
    borderColor: 'white', // White
    borderWidth: 2,
    tension: 0.4 // Smooth line
  }]
};

let endGoal = localStorage.getItem('endGoal') || null;
let goalImage = localStorage.getItem('goalImage') || null;

// Initialize the chart
function initializeChart() {
  progressChart = new Chart(ctx, {
    type: 'line',
    data: progressData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Update progress
document.getElementById('updateProgress').addEventListener('click', () => {
  const progressInput = document.getElementById('progress');
  const progressValue = parseInt(progressInput.value);

  if (!isNaN(progressValue)) {
    // Add today's progress to the chart
    const today = new Date().toLocaleDateString();
    progressData.labels.push(today);
    progressData.datasets[0].data.push(progressValue);

    // Update the chart
    progressData.datasets[0].borderColor = 'white';
    progressChart.update();

    // Save to LocalStorage
    localStorage.setItem('progressData', JSON.stringify(progressData));

    // Update progress bar
    updateProgressBar();

    // Clear input
    progressInput.value = '';
  } else {
    alert('Please enter a valid number!');
  }
});

// Modals
const goalModal = document.getElementById('goalModal');
const imageModal = document.getElementById('imageModal');

// Function to close modals when clicking outside
function closeModalOnClickOutside(modal, event) {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
}

// Open Goal Modal
document.getElementById('goalIcon').addEventListener('click', () => {
  goalModal.classList.remove('hidden');
  gsap.from(goalModal, { opacity: 0, y: -20, duration: 0.3 });
});

// Close Goal Modal when clicking outside
goalModal.addEventListener('click', (event) => {
  closeModalOnClickOutside(goalModal, event);
});

// Open Image Modal
document.getElementById('imageIcon').addEventListener('click', () => {
  imageModal.classList.remove('hidden');
  gsap.from(imageModal, { opacity: 0, y: -20, duration: 0.3 });
});

// Close Image Modal when clicking outside
imageModal.addEventListener('click', (event) => {
  closeModalOnClickOutside(imageModal, event);
});

// Set End Goal
document.getElementById('submitGoal').addEventListener('click', () => {
  const endGoalInput = document.getElementById('endGoalInput');
  const goalValue = parseInt(endGoalInput.value);

  if (!isNaN(goalValue)) {
    endGoal = goalValue;
    localStorage.setItem('endGoal', endGoal);
    endGoalInput.value = '';
    goalModal.classList.add('hidden');

    // Show toaster notification
    Toastify({
      text: "End goal updated!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50",
    }).showToast();

    // Update progress bar
    updateProgressBar();
  } else {
    alert('Please enter a valid number!');
  }
});

// Set Image
document.getElementById('submitImage').addEventListener('click', () => {
  const imageLinkInput = document.getElementById('imageLinkInput');
  const imageUrl = imageLinkInput.value;

  if (imageUrl) {
    goalImage = imageUrl;
    localStorage.setItem('goalImage', goalImage);

    // Set background image
    const background = document.getElementById('background');
    background.style.backgroundImage = `url(${goalImage})`;

    // Show toaster notification
    Toastify({
      text: "Background image updated!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50",
    }).showToast();

    // Clear input and close modal
    imageLinkInput.value = '';
    imageModal.classList.add('hidden');
  } else {
    alert('Please enter a valid image URL!');
  }
});

// Update Progress Bar
function updateProgressBar() {
  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const progressNow = document.getElementById('progressNow');

  if (endGoal && progressData.datasets[0].data.length > 0) {
    const totalProgress = progressData.datasets[0].data.reduce((a, b) => a + b, 0);
    const progressPercentage = Math.min((totalProgress / endGoal) * 100, 100);

    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${progressPercentage.toFixed(2)}% completed`;
    progressNow.textContent = `${totalProgress}/${endGoal}`

    progressBarContainer.classList.remove('hidden');
  } else {
    progressBarContainer.classList.add('hidden');
  }
}

// Load saved image on page load
window.addEventListener('load', () => {
  if (goalImage) {
    const background = document.getElementById('background');
    background.style.backgroundImage = `url(${goalImage})`;
  }

  // Update progress bar
  updateProgressBar();

  // Set dynamic year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Initialize
progressData.datasets[0].borderColor = 'white';
initializeChart();