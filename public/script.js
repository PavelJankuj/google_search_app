document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const keyword = document.getElementById('keyword').value;

    const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword })
    });

    const data = await response.json();
    displayResults(data);
});

function displayResults(results) {
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = '';
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.innerHTML = `<p><a href="${result.link}">${result.title}</a></p>`;
        resultDiv.appendChild(resultElement);
    });
    // Zobrazit tlačítko pro stažení, pokud jsou výsledky
    document.getElementById('downloadBtn').style.display = results.length ? 'block' : 'none';
}

// Přidání události kliknutí na tlačítko pro stažení
document.getElementById('downloadBtn').addEventListener('click', function() {
    fetch('/download?keyword=${encodeURIComponent(keyword)}')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'vysledky.json'; //  Zde můžu měnit na .csv nebo .xml
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => console.error('Chyba při stahování:', err));
});


