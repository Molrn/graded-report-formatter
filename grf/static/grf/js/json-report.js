async function sendReport(dictReport, skip_alert=false) {
    try {
        const response = await fetch('/grf/save_report/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ report: dictReport }),
        });

        if (response.status === 200) {
            const data = await response.json();
            if (data.hasOwnProperty('id')) {
                if (!skip_alert) {
                    alert('Report saved');
                }
                return data.id;
            }
        } else {
            const data = await response.json();
            let message = `Status ${response.status}`;
            if (data.hasOwnProperty('message')) {
                message += `: ${data.message}`;
            }
            throw new Error(message);
        }
    } catch (error) {
        alert('Error: Report not saved\n' + error.message);
        console.error(error);
    }
}

function reportToDict(is_export=false, doc=document){
    const reportAccordion = doc.getElementById('report-accordion');
    const reportId = parseInt(reportAccordion.getAttribute('object-id'));
    const is_editor_loaded = !!(document.querySelector('.ck-content'));
    var dictReport = {
        id: is_export ? null : reportId,
        title: doc.getElementById('report-title').value,
        parts: []
    }
    if (!is_export){
        dictReport.parts_to_remove = removedPartIds;
        dictReport.subparts_to_remove = removedSubPartIds;
    }
    const reportParts = reportAccordion.getElementsByClassName('part-accordion-item');
    for (let i = 0; i < reportParts.length; i++) {
        dictReport['parts'].push(partToDict(reportParts[i], is_export, is_editor_loaded));
    }
    return dictReport;
}

function partToDict(partElement, is_export, is_editor_loaded){
    const partId = partElement.getAttribute('object-id');
    const header = partElement.querySelector('.accordion-header'); 
    var dictPart = {
        id: is_export ? null : parseInt(partId),
        title: header.querySelector('.title').value,
        is_graded: header.querySelector('.grade-toggle').checked,
        is_included: header.querySelector('.include').checked,
        introduction: is_editor_loaded ? partElement.querySelector('.ck-content').innerHTML : partElement.querySelector('.text-editor').getAttribute('html-content'),
        subparts: []
    }
    const reportSubParts = partElement.querySelectorAll('.accordion-content > #part-'+partId+' > .accordion-item');
    for (let i = 0; i < reportSubParts.length; i++) {
        dictPart['subparts'].push(subPartToDict(reportSubParts[i], is_export));
    }
    return dictPart;
}

function subPartToDict(subPartElement, is_export, is_editor_loaded){
    const subPartId = subPartElement.getAttribute('object-id');
    const header = subPartElement.querySelector('.accordion-header'); 
    const textEditorClass = is_editor_loaded ? 'ck-content' : 'text-editor';
    const textEditors =  subPartElement.getElementsByClassName(textEditorClass);
    var dictSubPart = {
        id: is_export ? null : parseInt(subPartId),
        title: header.querySelector('.title').value,
        grade: parseInt(header.querySelector('.grade-select').value),
        is_included: header.querySelector('.include').checked,
        is_intro_included: subPartElement.querySelector('.intro-include').checked,
        content: is_editor_loaded ? textEditors[1].innerHTML: textEditors[1].getAttribute('html-content'),
        introduction: is_editor_loaded ? textEditors[0].innerHTML: textEditors[0].getAttribute('html-content'),
        subparts: []
    } 
    const reportSubParts = subPartElement.querySelectorAll('.accordion-content > #subpart-'+subPartId+' > .accordion-item');
    for (let i = 0; i < reportSubParts.length; i++) {
        dictSubPart['subparts'].push(subPartToDict(reportSubParts[i], is_export));
    }
    return dictSubPart;
}
