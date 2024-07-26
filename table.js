document.addEventListener('DOMContentLoaded', function() {
    // Fetch data
    fetch("https://sheetdb.io/api/v1/13o2nnci5qfks")
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('data-body');
            let allRows = [];
            data.forEach(item => {
                const row = document.createElement('tr');
                Object.values(item).forEach((text, index) => {
                    const cell = document.createElement('td');
                    cell.textContent = text;
                    row.appendChild(cell);

                    if (index === Object.keys(item).length - 1) {
                        const buttonCell = document.createElement('td');
                        const viewProfileButton = document.createElement('button');
                        viewProfileButton.className = 'view-profile-button'; // Apply custom CSS class
                        viewProfileButton.textContent = "View User Profile";
                        buttonCell.appendChild(viewProfileButton);
                        row.appendChild(buttonCell);

                        viewProfileButton.addEventListener('click', function() {
                            const modalText = document.getElementById('modalText');
                            modalText.innerHTML = '';
                            Object.entries(item).forEach(([key, value]) => {
                                const p = document.createElement('p');
                                p.textContent = `${key}: ${value}`;
                                modalText.appendChild(p);
                            });

                            document.getElementById('profileModal').style.display = 'block';

                            document.querySelector('.close').addEventListener('click', function() {
                                document.getElementById('profileModal').style.display = 'none';
                            });
                        });
                    }
                });
                tbody.appendChild(row);
                allRows.push(row);
            });

            function filterRows(searchTerm) {
                searchTerm = searchTerm.toLowerCase();
                allRows.forEach(row => {
                    const columnsToSearch = [0, 1, 2, 3, 4]; // Adjusted to column indices
                    let foundMatch = false;

                    columnsToSearch.forEach(index => {
                        const cell = row.children[index];
                        if (cell && cell.textContent.toLowerCase().indexOf(searchTerm) > -1) {
                            foundMatch = true;
                        }
                    });

                    row.style.display = foundMatch ? "" : "none";
                });
            }

            document.getElementById('searchBar').addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                filterRows(searchTerm);
            });
        })
        .catch(error => console.error('Error:', error));
});
