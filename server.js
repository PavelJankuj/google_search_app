// Import závislostí
const express = require('express');
const bodyParser = require('body-parser');
const { getJson } = require('serpapi');

// Vytvoření aplikace Express
const app = express();

// Middleware pro zpracování JSON požadavků
app.use(bodyParser.json());

// Servírování statických souborů z veřejné složky
app.use(express.static('public'));

// API endpoint pro zpracování vyhledávání
app.post('/search', async (req, res) => {
    const keyword = req.body.keyword; // Získání klíčového slova z požadavku
    const apiKey = 'd043b60fa71063b0f4ae03f4d42367939db013cf69de0ced5c581a09a4e977e4'; // SerpAPI klíč

    try {
        // Parametry pro SerpAPI
        const params = {
            api_key: apiKey,
            q: keyword, // Klíčové slovo
            google_domain: "google.com", // Vyhledávání v Google doméně
            hl: "cs", // Jazyk
            gl: "cz"  // Země
        };

        // Odeslání požadavku na SerpAPI a zpracování odpovědi
        const response = await getJson(params);
        console.log(response);

        // Extrahování organických výsledků z odpovědi
        const organicResults = response.organic_results.map(result => ({
            title: result.title,
            link: result.link,
            snippet: result.snippet
        }));

        // Odeslání výsledků zpět na frontend
        res.json(organicResults);
    } catch (error) {
        console.error(error);
        res.status(500).send('Nastala chyba při vyhledávání.');
    }
});

app.get('/download', async (req, res) => {
    const keyword = req.query.keyword; // Získání klíčového slova z dotazu
    if (!keyword) {
        return res.status(400).send('Chybějící klíčové slovo.');
    }
    
    const apiKey = 'd043b60fa71063b0f4ae03f4d42367939db013cf69de0ced5c581a09a4e977e4'; // API klíč z SerpAPI

    console.log(`Vyhledávací klíč pro stažení: ${keyword}`); // Log klíčového slova

    try {
        // Parametry pro SerpAPI
        const params = {
            api_key: apiKey,
            q: keyword,
            google_domain: "google.com",
            hl: "cs",
            gl: "cz"
        };

        console.log(`Odesílám dotaz do SerpAPI: ${JSON.stringify(params)}`); // Log dotazu


        const response = await getJson(params);

        console.log(`Odpověď od SerpAPI: ${JSON.stringify(response)}`); // Log odpovědi

        const organicResults = response.organic_results.map(result => ({
            title: result.title,
            link: result.link,
            snippet: result.snippet
        }));

        // Nastavení hlavičky pro stažení souboru
        res.setHeader('Content-disposition', 'attachment; filename=vysledky.json');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(organicResults, null, 2)); // Formátovaný JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Nastala chyba při generování souboru.');
    }
});


// Spuštění serveru na portu 3000
app.listen(3000, () => {
    console.log('Server běží na http://localhost:3000');
});
