document.addEventListener('DOMContentLoaded', function() {
    // Fetch data
    fetch("https://sheetdb.io/api/v1/13o2nnci5qfks")
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('data-body');
            const cohortFilter = document.getElementById('cohortFilter');
            const learningJourneyFilter = document.getElementById('learningJourneyFilter');
            const sortSelect = document.getElementById('sortSelect');
            let allRows = [];
            let sortOrder = 'asc'; // Default sort order

            // Get unique cohorts for the dropdown
            const cohorts = new Set();

            data.forEach(item => {
                cohorts.add(item.Cohort);

                const row = document.createElement('tr');

                // Only include the columns you want to display
                const columnsToInclude = ['Firstname', 'Lastname', 'Cohort', 'Journey', 'Module']; // Excluding 'Email' and 'Password'
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
                        'Firstname': item['Firstname'] || '',
                        'Lastname': item['Lastname'] || '',
                        'Cohort': item['Cohort'] || '',
                        'Journey': item['Journey'] || '',
                        'Module': item['Module'] || '',
                        'Email': item['Email'] || '',
                        'Password': item['Password'] || '',
                    };
                    
                    Object.entries(itemData).forEach(([key, value]) => {
                        const p = document.createElement('p');
                        p.className = `modal-field ${key}`;
                        p.innerHTML = `<strong>${key}:</strong> ${value}`;
                        modalText.appendChild(p);
                    });
                    
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
