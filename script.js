// Carregar os dados da tabela quando a página é carregada
window.onload = () => loadTableData(stores);

// Função para carregar os dados das lojas na tabela
function loadTableData(stores) {
    const tableBody = document.querySelector("#storeTable tbody");
    let dataHtml = "";

    stores.forEach(store => {
        dataHtml += `<tr>
                        <td><span class="print-btn" onclick="addToPrintList('${store.sigla}')" title="Clique para adicionar à lista de impressão">${store.sigla}</span></td>
                        <td>${store.nome_fantasia}</td>
                        <td><span class="copy-btn" onclick="copyText('${store.razao_social}')" title="Clique para copiar">${store.razao_social}</span></td>
                        <td><span class="copy-btn" onclick="copyText('${store.cnpj}')" title="Clique para copiar">${store.cnpj}</span></td>
                     </tr>`;
    });

    tableBody.innerHTML = dataHtml;
}

// Função para alternar a visibilidade do card de configuração
function toggleConfigCard() {
    const configCard = document.getElementById("configCard");
    configCard.style.display = configCard.style.display === "none" ? "block" : "none";
}

// Função para adicionar sigla à lista de impressão
function addToPrintList(sigla) {
    const printList = document.getElementById("printList");
    const li = document.createElement("li");
    li.innerHTML = `${sigla} <button class="remove-btn" onclick="removeFromPrintList(this)">Remover</button>`;
    printList.appendChild(li);
}

// Função para remover sigla da lista de impressão
function removeFromPrintList(button) {
    button.parentElement.remove();
}

// Função para copiar texto (Razão Social ou CNPJ)
function copyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Texto copiado: " + text);
}

// Função para imprimir todas as siglas da lista
function printList() {
    const fontSize = document.getElementById("fontSize").value;
    const fontColor = document.getElementById("fontColor").value;
    const siglas = Array.from(document.querySelectorAll("#printList li")).map(li =>
        li.textContent.replace("Remover", "").trim()
    );

    if (siglas.length === 0) {
        alert("Adicione siglas à lista antes de imprimir.");
        return;
    }

    const newWindow = window.open('', '', 'height=600,width=800');
    newWindow.document.write('<html><head><title>Impressão das Siglas</title>');
    newWindow.document.write('<style>');
    newWindow.document.write(`
        body {
            font-family: Consolas, Arial, sans-serif;
            color: ${fontColor};
            margin: 20px;
        }
        .siglas-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .sigla-item {
            font-size: ${fontSize}px;
            font-weight: bold;
            margin: 10px;
        }
    `);
    newWindow.document.write('</style></head><body>');
    newWindow.document.write('<div class="siglas-container">');

    siglas.forEach(sigla => {
        newWindow.document.write(`<div class="sigla-item">${sigla}</div>`);
    });

    newWindow.document.write('</div></body></html>');
    newWindow.document.close();
    newWindow.print();
}

// Função para filtrar a tabela de lojas
function filterTable() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#storeTable tbody tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(" ");
        row.style.display = rowText.includes(searchInput) ? "" : "none";
    });
}
