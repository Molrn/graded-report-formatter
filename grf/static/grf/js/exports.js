const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', function(){
    const dictReport = reportToDict();
    sendReport(dictReport);
});

const jsonExportButton = document.getElementById('json-export-button');
jsonExportButton.addEventListener('click', function (){
    const dictReport = reportToDict(true);
    const jsonReport = JSON.stringify(dictReport);
    const blob = new Blob([jsonReport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dictReport['title']+".json";
    a.click();
    URL.revokeObjectURL(url);
});

const pdfExportButton = document.getElementById('pdf-export-button');
pdfExportButton.addEventListener('click', async function (){
    const reportTitle = document.getElementById('report-title').value;
    const dictReport = reportToDict();
    const reportId = await sendReport(dictReport, skip_alert=true);
    fetch('/grf/report/'+reportId+'/display')
        .then(response => response.text())
        .then(html => {
            var parser = new DOMParser();
            var reportHtmlExport = parser.parseFromString(html, 'text/html');
            var editableStyle = reportHtmlExport.getElementById('editable-style');
            if (editableStyle) {
                editableStyle.style.display = 'none';
            }
            var modifiedHtmlReport = new XMLSerializer().serializeToString(reportHtmlExport);
            var doc = new jspdf.jsPDF();
            doc.html(modifiedHtmlReport, {
                callback: function (pdf) {
                    pdf.save(reportTitle + '.pdf');
                },
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
