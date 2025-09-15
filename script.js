let brani = []; // array con tutti i brani

async function caricaCSV() {
    const response = await fetch("dati.csv");
    const text = await response.text();
    const righe = text.trim().split("\n").slice(1); // salto intestazione

    brani = righe.map(riga => {
        const [titolo, artista, genere, anno] = riga.split(",");
        return { titolo, artista, genere, anno: parseInt(anno) };
    });

    popolaFiltri();
    mostraTabella(brani);
}

function mostraTabella(lista) {
    const tbody = document.querySelector("#tabella-musica tbody");
    tbody.innerHTML = "";

    lista.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${b.titolo}</td>
            <td>${b.artista}</td>
            <td>${b.genere}</td>
            <td>${b.anno}</td>
        `;
        tbody.appendChild(tr);
    });
}

function popolaFiltri() {
    const generi = [...new Set(brani.map(b => b.genere))];
    const artisti = [...new Set(brani.map(b => b.artista))];

    const selGenere = document.querySelector("#filtro-genere");
    const selArtista = document.querySelector("#filtro-artista");

    generi.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g;
        opt.textContent = g;
        selGenere.appendChild(opt);
    });

    artisti.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a;
        opt.textContent = a;
        selArtista.appendChild(opt);
    });
}

function applicaFiltri() {
    const genere = document.querySelector("#filtro-genere").value;
    const artista = document.querySelector("#filtro-artista").value;
    const annoMin = parseInt(document.querySelector("#filtro-anno-min").value);
    const annoMax = parseInt(document.querySelector("#filtro-anno-max").value);

    let filtrati = brani;

    if (genere) filtrati = filtrati.filter(b => b.genere === genere);
    if (artista) filtrati = filtrati.filter(b => b.artista === artista);
    if (!isNaN(annoMin)) filtrati = filtrati.filter(b => b.anno >= annoMin);
    if (!isNaN(annoMax)) filtrati = filtrati.filter(b => b.anno <= annoMax);

    mostraTabella(filtrati);
}

function aggiungiCanzone() {
    const titolo = document.querySelector("#nuovo-titolo").value.trim();
    const artista = document.querySelector("#nuovo-artista").value.trim();
    const genere = document.querySelector("#nuovo-genere").value.trim();
    const anno = parseInt(document.querySelector("#nuovo-anno").value.trim());

    if (!titolo || !artista || !genere || isNaN(anno)) {
        alert("Compila tutti i campi correttamente!");
        return;
    }

    const nuovaCanzone = { titolo, artista, genere, anno };
    brani.push(nuovaCanzone);

    // Aggiorniamo filtri se necessario
    popolaFiltri();

    // Mostriamo subito la nuova canzone in tabella
    mostraTabella(brani);

    // Puliamo i campi
    document.querySelector("#nuovo-titolo").value = "";
    document.querySelector("#nuovo-artista").value = "";
    document.querySelector("#nuovo-genere").value = "";
    document.querySelector("#nuovo-anno").value = "";
}

caricaCSV();
