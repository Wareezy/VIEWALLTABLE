document.addEventListener('DOMContentLoaded', function() {
    // Fetch data
    fetch("https://api.sheety.co/fb7b0a64d321e1a7a621630c9009fd2c/wcs/sheet1")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const tbody = document.getElementById('data-body');
            const cohortFilter = document.getElementById('cohortFilter');
            const learningJourneyFilter = document.getElementById('learningJourneyFilter');
            const sortSelect = document.getElementById('sortSelect');
            let allRows = [];
            let sortOrder = 'asc'; // Default sort order

            // Get unique cohorts for the dropdown
            const cohorts = new Set();

            data.sheet1.forEach(item => {
                cohorts.add(item.Cohort);

                const row = document.createElement('tr');

                // Only include the columns you want to display
                const columnsToInclude = ['firstname', 'lastname', 'cohort', 'journey', 'module'];
                columnsToInclude.forEach((column) => {
                    if (item[column] !== undefined) {
                        const cell = document.createElement('td');
                        cell.textContent = item[column];
                        row.appendChild(cell);
                    }
                });

                // Add the 'Profile' column with the view profile button
                const buttonCell = document.createElement('td');
                const viewProfileButton = document.createElement('button');
                viewProfileButton.className = 'view-profile-button'; // Apply custom CSS class
                viewProfileButton.textContent = "View User Profile";
                buttonCell.appendChild(viewProfileButton);
                row.appendChild(buttonCell);


                viewProfileButton.addEventListener('click', function() {
                    const modalText = document.getElementById('modalText');
                    modalText.innerHTML = '';
                    
                    // Retrieve the date and other fields from the item
                    const itemData = {
                        'Firstname': item['firstname'] || '',
                        'Lastname': item['lastname'] || '',
                        'Cohort': item['cohort'] || '',
                        'Journey': item['journey'] || '',
                        'Module': item['module'] || '',
                        'Email': item['email'] || '',
                        // 'Password': item['Password'] || '',
                    };

                    // Made use of a spread operator to push every object into array uniquely
                    const userArray = [
                        { ...itemData }
                    ]
                    
                    // Object.entries(itemData).forEach(([key, value]) => {
                    //     const p = document.createElement('p');
                    //     p.className = `modal-field ${key}`;
                    //     p.innerHTML = `<strong>${key}:</strong> ${value}`;
                    //     modalText.appendChild(p);
                    // });

                    const className = 'user-data-view';
                    const imageClassName = 'img-img-placeholder';
                    const bannerClass = 'lc-banner'

                    userArray.map((idx, index) => {
                        const createdElem = document.createElement('div')
                        createdElem.innerHTML += `
                        <!-- creates a random new key for each student in cohort -->
                        <div key='${Math.random(index).toFixed(2)}' class='${className}'> 
                            <div class="${bannerClass}">
                                <div class="inner-banner">
                                    <img class="${imageClassName}" src="https://cdn-images.imagevenue.com/c5/24/95/ME18U3KN_o.png" alt="${idx.Firstname}" />
                                    <h1 class="firstname">${idx.Firstname} ${idx.Lastname}</h1>
                                </div>
                            </div>
                        </div>
                        <div class="grid-ui">
                        
                            <div class="grid-col-vh-left">
                                vh
                            </div>

                            <div class="grid-l-50">
                                <div class="grid-col-top-right">
                                tp
                                </div>
                                <div class="grid-col-bottom-right">
                                bt
                                </div>
                            </div>
                        </div>
                        `
                        modalText.appendChild(createdElem)
                    })

                    // console.log(y)
                    // ${idx.Lastname}
                    // ${idx.Cohort}
                    // ${idx.Journey}
                    // ${idx.Module}
                    // ${idx.Email}
                    document.getElementById('profileModal').style.display = 'block';
                
                    document.querySelector('.close').addEventListener('click', function() {
                        document.getElementById('profileModal').style.display = 'none';
                    });
                
                    document.getElementById('modalButton').addEventListener('click', function() {
                        alert('Button inside modal clicked!');
                    });
                });
                


                tbody.appendChild(row);
                allRows.push(row);
            });

            // Populate cohort dropdown
            cohorts.forEach(cohort => {
                const option = document.createElement('option');
                option.value = cohort;
                option.textContent = cohort;
                cohortFilter.appendChild(option);
            });

            function filterRows() {
                const searchTerm = document.getElementById('searchBar').value.toLowerCase();
                const selectedCohort = cohortFilter.value;
                const selectedLearningJourney = learningJourneyFilter.value;

                allRows.forEach(row => {
                    const firstnameCell = row.children[0].textContent.toLowerCase();
                    const lastnameCell = row.children[1].textContent.toLowerCase();
                    const cohortCell = row.children[2].textContent;
                    const learningJourneyCell = row.children[3].textContent;

                    // Search only by firstname and lastname
                    const matchesSearch = firstnameCell.includes(searchTerm) || lastnameCell.includes(searchTerm);

                    // Apply filters for cohort and learning journey
                    const matchesCohort = !selectedCohort || cohortCell === selectedCohort;
                    const matchesLearningJourney = !selectedLearningJourney || learningJourneyCell === selectedLearningJourney;

                    // Show row if it matches search and filters
                    row.style.display = (matchesSearch && matchesCohort && matchesLearningJourney) ? "" : "none";
                });
            }

            function sortRows(columnIndex, order) {
                const rowsArray = Array.from(allRows);
                rowsArray.sort((a, b) => {
                    const aText = a.children[columnIndex].textContent.trim().toLowerCase();
                    const bText = b.children[columnIndex].textContent.trim().toLowerCase();

                    if (order === 'asc') {
                        return aText.localeCompare(bText);
                    } else {
                        return bText.localeCompare(aText);
                    }
                });

                rowsArray.forEach(row => tbody.appendChild(row));
            }

            document.getElementById('searchBar').addEventListener('input', filterRows);
            cohortFilter.addEventListener('change', filterRows);
            learningJourneyFilter.addEventListener('change', filterRows);
            sortSelect.addEventListener('change', handleSort);
        })
        .catch(error => console.error('Error:', error));
});



// let url = 'https://api.sheety.co/fb7b0a64d321e1a7a621630c9009fd2c/wcs/sheet1';
// fetch(url)
// .then((response) => response.json())
// .then(json => {
//   // Do something with the data
//   console.log(json.data);
// });