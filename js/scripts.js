// Best practices data
const bestPractices = [
    { id: 1, title: "Separate Concerns", explanation: "HTML for structure, CSS for styling, JavaScript for behavior" },
    { id: 2, title: "Use Semantic HTML", explanation: "Use elements like <header>, <footer>, <article> etc." },
    { id: 3, title: "Responsive Design", explanation: "Ensure your website works on all devices" },
    { id: 4, title: "Optimize Performance", explanation: "Minimize file sizes and reduce HTTP requests" },
    { id: 5, title: "Accessibility", explanation: "Make your website usable for everyone" },
    // Add more practices as needed
];

// Initialize practices
document.addEventListener('DOMContentLoaded', function() {
    const practicesList = document.getElementById('practicesList');
    const summaryText = document.getElementById('summaryText');
    const rewardContainer = document.getElementById('rewardContainer');
    
    // Load practices
    loadPractices();
    
    // Load user selections from localStorage
    const userSelections = JSON.parse(localStorage.getItem('userSelections')) || new Array(bestPractices.length).fill(false);
    
    // Update summary
    function updateSummary() {
        const count = userSelections.filter(selection => selection).length;
        summaryText.textContent = `You've implemented ${count} out of ${bestPractices.length} best practices`;
        
        // Success criteria check
        if (count >= bestPractices.length * 0.8) { // Adjust threshold as needed
            if (!rewardContainer.querySelector('img')) {
                fetchRandomAnimalImage().then(url => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'reward-image';
                    rewardContainer.appendChild(img);
                });
            }
        }
    }
    
    // Load practices into DOM
    function loadPractices() {
        bestPractices.forEach((practice, index) => {
            const practiceElement = document.createElement('div');
            practiceElement.className = 'practice-item';
            practiceElement.innerHTML = `
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="practice-${index}" ${userSelections[index] ? 'checked' : ''}>
                    <label class="form-check-label" for="practice-${index}">
                        <h4>${practice.title}</h4>
                        <p>${practice.explanation}</p>
                    </label>
                </div>
            `;
            
            practicesList.appendChild(practiceElement);
            
            // Add event listener for checkbox changes
            const checkbox = practiceElement.querySelector('.form-check-input');
            checkbox.addEventListener('change', function() {
                userSelections[index] = this.checked;
                localStorage.setItem('userSelections', JSON.stringify(userSelections));
                updateSummary();
            });
        });
        
        updateSummary();
    }
    
    // Fetch random animal image
    async function fetchRandomAnimalImage() {
        try {
            const response = await fetch('https://random.dog/woof.json');
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Error fetching animal image:', error);
            return '';
        }
    }
});
