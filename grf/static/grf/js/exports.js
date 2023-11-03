const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', function(){
    const dictReport = reportToDict();
    console.log(JSON.stringify(dictReport, null, 2));
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
pdfExportButton.addEventListener('click', function (){
    const reportId = document.getElementById('report-accordion').getAttribute('object-id');
    const reportTitle = document.getElementById('report-title').value;
    fetch('/grf/report/'+reportId+'/display')
        .then(response => response.text())
        .then(html => {
            var doc = new jspdf.jsPDF();
            doc.html(html, {
                callback: function (pdf) {
                    pdf.save(reportTitle + '.pdf');
                },
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });    
});
