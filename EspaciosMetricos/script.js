// Función para calcular la distancia de Levenshtein
function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Función para obtener palabras similares utilizando la API de Datamuse
async function getSuggestions(word) {
    const response = await fetch(`https://api.datamuse.com/sug?s=${word}&v=es`);
    const data = await response.json();
    return data.map(item => item.word);
}

// Función para verificar la ortografía y sugerir palabras
async function checkSpelling() {
    const inputWord = document.getElementById("inputWord").value.toLowerCase();
    let suggestions = [];

    if (inputWord.length === 0) {
        document.getElementById("suggestions").innerHTML = "Por favor, escribe una palabra.";
        return;
    }

    const words = await getSuggestions(inputWord);

    words.forEach(word => {
        const distance = levenshteinDistance(inputWord, word);
        suggestions.push({ word, distance });
    });

    suggestions.sort((a, b) => a.distance - b.distance);

    let suggestionHTML = "<h3>Sugerencias:</h3><ul>";
    suggestions.slice(0, 5).forEach(suggestion => {
        suggestionHTML += `<li>${suggestion.word} (distancia: ${suggestion.distance})</li>`;
    });
    suggestionHTML += "</ul>";

    document.getElementById("suggestions").innerHTML = suggestionHTML;
}
