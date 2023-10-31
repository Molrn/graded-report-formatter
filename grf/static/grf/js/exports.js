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
