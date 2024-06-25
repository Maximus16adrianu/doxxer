let users = [];

// Load the JSON data
fetch('data/users.json')
    .then(response => response.json())
    .then(data => {
        users = data;
    })
    .catch(error => console.error('Error loading JSON data:', error));

// Function to search for users
function searchUser() {
    const query = document.getElementById('search').value.toLowerCase().trim();
    const results = users.filter(user => {
        const fullName = `${user.firstName.toLowerCase()} ${user.familyName.toLowerCase()}`;
        return user.searchName.toLowerCase().includes(query) ||
               fullName.includes(query);
    });
    displayResults(results);
}

// Function to display the search results
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(user => {
        const userDiv = createUserCard(user);
        resultsDiv.appendChild(userDiv);
    });
}

// Function to create a user card
function createUserCard(user) {
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-card');

    userDiv.innerHTML = `
        <img src="${user.image}" alt="${user.firstName} ${user.familyName}">
        <button onclick="toggleMoreImages('${user.firstName}_${user.familyName}')">More Pictures</button>
        <button onclick="downloadUserInfo('${user.searchName}')">Download Info</button>
        <div id="${user.firstName}_${user.familyName}_moreImages" class="more-images"></div>
        <p><strong>First Name:</strong> ${user.firstName}</p>
        <p><strong>Second Name:</strong> ${user.secondName}</p>
        <p><strong>Family Name:</strong> ${user.familyName}</p>
        <p><strong>Street:</strong> ${user.street}</p>
        <p><strong>Languages:</strong> ${user.languages.join(', ')}</p>
        <p><strong>Mother Language:</strong> ${user.motherLanguage}</p>
        <p><strong>Age:</strong> ${user.age}</p>
        <p><strong>Birthday:</strong> ${user.birthday}</p>
        <p><strong>Favorite Color:</strong> ${user.favoriteColor}</p>
        <p><strong>Hobbies:</strong> ${user.hobbies.join(', ')}</p>
        <p><strong>Fears:</strong> ${user.fears.join(', ')}</p>
        <p><strong>Family Members:</strong> ${user.familyMembers.join(', ')}</p>
    `;
    
    return userDiv;
}

// Function to toggle more images display
function toggleMoreImages(userId) {
    const moreImagesDiv = document.getElementById(`${userId}_moreImages`);
    const isVisible = moreImagesDiv.style.display === 'block';

    if (!isVisible) {
        moreImagesDiv.innerHTML = '';
        const user = users.find(user => `${user.firstName}_${user.familyName}` === userId);
        if (user) {
            user.moreImages.forEach((image, index) => {
                const img = document.createElement('img');
                img.src = image;
                img.alt = `${user.firstName} ${user.familyName}`;
                img.className = 'popup-image'; // Add a class for styling and event handling
                img.setAttribute('onclick', `openPopup('${image}')`); // Set onclick attribute to openPopup function
                moreImagesDiv.appendChild(img);
            });
        }
    }

    moreImagesDiv.style.display = isVisible ? 'none' : 'block';
}

// Function to open a popup with a larger image
function openPopup(imageUrl) {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Popup Image';

    popup.appendChild(img);
    document.body.appendChild(popup);

    // Close popup when clicking outside of the image or on the image itself
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.remove();
        }
    });
}

// Function to download user information as JSON
function downloadUserInfo(searchName) {
    const user = users.find(user => user.searchName === searchName);
    if (user) {
        const filename = `${user.firstName}_${user.familyName}_info.json`;
        const jsonContent = JSON.stringify(user, null, 2);

        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
