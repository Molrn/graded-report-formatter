document.getElementById('create-report-button').addEventListener('click', function() {
    document.getElementById('popup-container').style.display = 'block';
});

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('popup-container').style.display = 'none';
});

document.getElementById('submit-report').addEventListener('click', async function() {
    const newReportTitle = document.getElementById('new-report-title').value;
    const templateReportId = parseInt(document.getElementById('template-report').value);

    if (templateReportId){
        fetch('report/'+templateReportId.toString())
            .then(response => response.text())
            .then(async html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                console.log(doc);
                var newReport = reportToDict(true, doc);
                newReport.title = newReportTitle; 
                const reportId = await sendReport(newReport);    
                document.getElementById('popup-container').style.display = 'none';
                window.location.href = 'report/'+reportId.toString();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        const newReport = { 
            id: null,
            parts: [],
            title: newReportTitle
        };
        const reportId = await sendReport(newReport);    
        document.getElementById('popup-container').style.display = 'none';
        window.location.href = 'report/'+reportId.toString();
    }
});
