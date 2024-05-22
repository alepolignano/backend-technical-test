document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(document.location);
    const endpoint = url.pathname
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');

    // Exercise 5 - not all proteins at once (get url param)
    let page = url.searchParams.get("page") ? url.searchParams.get("page") : 0
    getData(endpoint, page);
});

// Exercise 5 - not all proteins at once (button navigation)
function addPaginationButtonsUniprot(prevPageUrl, nextPageUrl){

    let nextPageButtonDiv = document.createElement("div")
    nextPageButtonDiv.classList.add("page-div")
    nextPageButtonDiv.setAttribute("id", "page-div")
    document.getElementById("page-content").appendChild(nextPageButtonDiv)

    let nextPageButton = document.createElement("a")
    nextPageButton.innerText = "Next"
    nextPageButton.href = nextPageUrl
    nextPageButton.classList.add("page-btn")

    let prevPageButton = document.createElement("a")
    prevPageButton.innerText = "Previous"
    prevPageButton.href = prevPageUrl
    prevPageButton.classList.add("page-btn")

    document.getElementById('page-div').appendChild(prevPageButton);
    document.getElementById('page-div').appendChild(nextPageButton);
}

async function getData(endpoint, page = 0) {

    let apiURL = `/api/${endpoint}`;
    let fn = null;

    // Exercise 5 - not all proteins at once (setup)
    let paginationData = false;
    let notNullPage = false
    let prevPageUrl = "#"
    let nextPageUrl = "uniprot?page=2"

    
    switch (endpoint) {
        case 'interpro':
            columns = ['Accession', 'Name', 'Description', 'Proteins'];
            fn = renderInterPro;
            break;
        case 'pfam':
            columns = ['Accession', 'Name', 'Description', 'Integrated in'];
            fn = renderPfam;
            break;
        case 'uniprot':
            columns = ['Accession', 'Name', 'Source', 'Length'];
            fn = renderUniProt;
            paginationData = true;

            // Exercise 5 - not all proteins at once (edit url to include page)
            if (page != 0) {
                apiURL += `/?page=${page}`
            }

            break
    }

    const response = await fetch(apiURL);
    let data = await response.json();

    if (paginationData){

        // Exercise 5 - not all proteins at once (setup URLs for next and prev buttons)
        prevPageUrl = data["previous"] ? `uniprot?page=${parseInt(page) - 1}`: "#"
        nextPageUrl = data["next"] ? `uniprot?page=${parseInt(page) + 1}`: "#"

        // Exercise 5 - not all proteins at once (now the actual data is stored in data["results"])
        data = data["results"]
    }
    
    if (fn === null)
        return;

    const table = initTable(columns);
    const tbody = document.createElement('tbody');
    tbody.append(...data.map((item,) => {
        const tr = document.createElement('tr');
        tr.append(...fn(item));
        return tr;
    }));
    table.appendChild(tbody);
    document.getElementById('page-content').appendChild(table);

    // Exercise 5 - not all proteins at once (add buttons to page)
    if (endpoint == 'uniprot'){
        addPaginationButtonsUniprot(prevPageUrl, nextPageUrl)
    }
}

function initTable(columns) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    tr.append(...columns.map((name,) => {
        const th = document.createElement('th');
        th.innerText = name;
        return th;
    }));
    thead.append(tr);
    table.append(thead);
    return table;
}

function renderInterPro(item) {
    return ['accession', 'name', 'description', 'protein_count'].map((key,) => {
        const td = document.createElement('td');
        if (key === 'protein_count')
            td.innerText = item[key].toLocaleString();
        else
            td.innerText = item[key];
        return td;
    });
}

function renderPfam(item) {
    return ['accession', 'name', 'description', 'interpro_accession'].map((key,) => {
        const td = document.createElement('td');
        td.innerText = item[key] !== null ? item[key] : '';
        return td;
    });
}

// Exercise 4 - Edit the field name and innerText to get directly the sequence length
function renderUniProt(item) {    

    return ['accession', 'name', 'reviewed', 'sequence_length'].map((key,) => {
        const td = document.createElement('td');

        if (key === 'accession' || key === 'name')
            td.innerText = item[key];
        else if (key === 'reviewed')
            td.innerText = item[key] ? 'UniProtKB/Swiss-Prot' : 'UniProtKB/TrEMBL';
        else
            td.innerText = `${item[key]} AA`;
        return td;
    })
}