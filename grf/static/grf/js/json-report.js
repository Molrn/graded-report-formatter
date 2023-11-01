function sendReport(dictReport){
    fetch('/grf/save_report/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ report: dictReport }),
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.json().then(data => {
                    let message = `Status ${response.status}`;
                    if (data.hasOwnProperty('message')) {
                        message += `: ${data.message}`;
                    }
                    throw new Error(message);
                });
            }
        })
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            alert('Error : Report not saved\n'+error.message);
        });
}

function reportToDict(is_export=false){
    const reportAccordion = document.getElementById('report-accordion');
    const reportId = parseInt(reportAccordion.getAttribute('object-id'));
    var dictReport = {
        id: is_export ? null : reportId,
        title: document.getElementById('report-title').value,
        parts: []
    }
    if (!is_export){
        dictReport.parts_to_remove = removedPartIds;
        dictReport.subparts_to_remove = removedSubPartIds;
    }
    const reportParts = reportAccordion.getElementsByClassName('part-accordion-item');
    for (let i = 0; i < reportParts.length; i++) {
        dictReport['parts'].push(partToDict(reportParts[i], is_export));
    }
    return dictReport;
}

function partToDict(partElement, is_export){
    const partId = partElement.getAttribute('object-id');
    const header = partElement.querySelector('.accordion-header'); 
    var dictPart = {
        id: is_export ? null : parseInt(partId),
        title: header.querySelector('.title').value,
        is_graded: header.querySelector('.grade-toggle').checked,
        is_included: header.querySelector('.include').checked,
        introduction: partElement.querySelector('.ck-content').innerHTML,
        subparts: []
    }
    const reportSubParts = partElement.querySelectorAll('.accordion-content > #part-'+partId+' > .accordion-item');
    for (let i = 0; i < reportSubParts.length; i++) {
        dictPart['subparts'].push(subPartToDict(reportSubParts[i], is_export));
    }
    return dictPart;
}

function subPartToDict(subPartElement, is_export){
    const subPartId = subPartElement.getAttribute('object-id');
    const header = subPartElement.querySelector('.accordion-header'); 
    const textEditors = subPartElement.getElementsByClassName('ck-content');
    var dictSubPart = {
        id: is_export ? null : parseInt(subPartId),
        title: header.querySelector('.title').value,
        grade: parseInt(header.querySelector('.grade-select').value),
        is_included: header.querySelector('.include').checked,
        is_intro_included: subPartElement.querySelector('.intro-include').checked,
        content: textEditors[1].innerHTML,
        introduction: textEditors[0].innerHTML,
        subparts: []
    } 
    const reportSubParts = subPartElement.querySelectorAll('.accordion-content > #subpart-'+subPartId+' > .accordion-item');
    for (let i = 0; i < reportSubParts.length; i++) {
        dictSubPart['subparts'].push(subPartToDict(reportSubParts[i], is_export));
    }
    return dictSubPart;
}
