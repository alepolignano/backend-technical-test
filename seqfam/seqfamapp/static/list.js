document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(document.location);
    const endpoint = url.pathname
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');

    getData(endpoint);
});

async function getData(endpoint) {
    const apiURL = `/api/${endpoint}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    let columns = [];
    let fn = null;
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
            break
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
    return ['accession', 'name', 'description', 'interpro_entry'].map((key,) => {
        const td = document.createElement('td');
        td.innerText = item[key] !== null ? item[key] : '';
        return td;
    });
}


function renderUniProt(item) {
    return ['accession', 'name', 'reviewed', 'sequence'].map((key,) => {
        const td = document.createElement('td');

        if (key === 'accession' || key === 'name')
            td.innerText = item[key];
        else if (key === 'reviewed')
            td.innerText = item[key] ? 'UniProtKB/Swiss-Prot' : 'UniProtKB/TrEMBL';
        else
            td.innerText = `${item[key].length.toLocaleString()} AA`;

        return td;
    })
}