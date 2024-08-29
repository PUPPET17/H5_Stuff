document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const tableBody = document.querySelector('#trending-table tbody');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    
    const rowsPerPage = 10;
    let currentPage = 1;
    let data = [];

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    data = results.data.map(item => ({
                        rank: item.rank,
                        repo_name: item.repo_name,
                        stars: item.stars,
                        forks: item.forks,
                        language: item.language,
                        repo_url: item.repo_url,
                        username: item.username,
                        issues: item.issues,
                        last_commit: item.last_commit,
                        description: item.description
                    }));

                    renderTable();
                }
            });
        } else {
            alert('Please select a valid CSV file.');
        }
    });

    function renderTable() {
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);

        paginatedData.forEach(item => {
            const rowElement = document.createElement('tr');
            rowElement.innerHTML = `
                <td>${item.rank}</td>
                <td>
                    <a href="${item.repo_url}" target="_blank"><strong>${item.repo_name}</strong></a>
                    <br>
                    <small>${item.username}</small>
                </td>
                <td>${item.stars}</td>
                <td>${item.forks}</td>
                <td>${item.language}</td>
                <td>${item.issues}</td>
                <td>${item.last_commit}</td>
                <td class="description">${item.description}</td>
            `;
            tableBody.appendChild(rowElement);
        });

        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(data.length / rowsPerPage)}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(data.length / rowsPerPage);
    }

    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentPage < Math.ceil(data.length / rowsPerPage)) {
            currentPage++;
            renderTable();
        }
    });
});
