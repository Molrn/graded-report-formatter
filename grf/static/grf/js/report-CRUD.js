function openModal(){
    document.getElementById('modal-container').style.display = 'block';
}

function closeModal(){
    document.getElementById('modal-container').style.display = 'none';
}

async function createReport(){
    const newReportTitle = document.getElementById('new-report-title').value;
    const templateReportId = parseInt(document.getElementById('template-report').value);
    var newReport;
    if (templateReportId){
        newReport = await getReportDict(templateReportId, true);
        newReport.title = newReportTitle; 
    } else {
        newReport = { 
            id: null,
            parts: [],
            title: newReportTitle
        };
    }
    const reportId = await sendReport(newReport);    
    window.location.href = 'report/'+reportId.toString();
}

function deleteReport(button) {
    const reportId = button.getAttribute('data-report-id');
    fetch(`/grf/delete_report/${reportId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(error => { console.error(error); });
}

async function importReport(){
    if (fileSelector.files.length > 0) {
        const file = fileSelector.files[0];
        const reader = new FileReader();
        reader.onload = async function () {
            try {
                dictReport = JSON.parse(reader.result);
                await sendReport(dictReport);
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file. Please select a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
}

function saveReport(){
    const dictReport = reportToDict();
    sendReport(dictReport);
}

function exportToJSON(){
    const dictReport = reportToDict(true);
    const jsonReport = JSON.stringify(dictReport);
    const blob = new Blob([jsonReport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dictReport['title']+".json";
    a.click();
    URL.revokeObjectURL(url);
}

async function exportToPDF() {
    const reportTitle = document.getElementById('report-title').value;
    const dictReport = reportToDict();
    const reportId = await sendReport(dictReport, skip_alert = true);

    fetch('/grf/report/' + reportId + '/display')
        .then(response => response.text())
        .then(html => {
            var element = document.getElementById('editable-style');
            element.style.display = 'none';

            var opt = {
                margin: 10,
                filename: reportTitle + '.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().from(html).set(opt).outputPdf().then(pdf => {
                pdf.save();
                element.style.display = 'block';
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
