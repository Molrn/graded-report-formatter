
var gradeSelect = document.getElementsByClassName('grade-select');
const gradesArray = [1, 2, 3, 4, 5];
for (let index = 0; index < textEditorsElements.length; index++) {
    if(gradeSelect[index]){
        let value = gradeSelect[index].getAttribute('value');
        if(!gradesArray.includes(value)){
            gradeSelect[index].value='empty';
        } else {
            gradeSelect[index].value=value;
        }
    }
}

const gradeToggles = document.getElementsByClassName('part-grade-toggle');

for (let i = 0; i < gradeToggles.length; i++) {

    gradeToggles[i].addEventListener('change', function () {
        const accordionItem = this.parentElement.parentElement;
        const headerPath = '.accordion-content > .accordion > .accordion-item > .accordion-header';
        const gradeSelects = accordionItem.querySelectorAll(headerPath + ' > .grade-select');
        const gradeLabels = accordionItem.querySelectorAll(headerPath + ' > .grade-label');
        if (this.checked) {
            gradeSelects.forEach(function (select) {select.style.display = 'block';});
            gradeLabels.forEach(function (select) {select.style.display = 'block';});
        } else {
            gradeSelects.forEach(function (select) {select.style.display = 'none';});
            gradeLabels.forEach(function (select) {select.style.display = 'none';});
        }
    });
}

function saveReport(){
    const dictReport = reportToDict();
    const jsonDisplay = document.getElementById('json-result');
    formattedJson = JSON.stringify(dictReport, null, 2);
    jsonDisplay.innerHTML = formattedJson;
    console.log(formattedJson);

}

function reportToDict(){
    const reportAccordion = document.getElementById('report-accordion');
    const reportId = parseInt(reportAccordion.getAttribute('object-id'));
    var dictReport = {
        'id': reportId,
        'title': document.getElementById('report-title').value,
        'parts': []
    }
    const reportParts = reportAccordion.getElementsByClassName('part-accordion-item');
    for (let i = 0; i < reportParts.length; i++) {
        dictReport['parts'].push(partToDict(reportParts[i], i));
    }
    return dictReport;
}

function partToDict(partElement, order){
    const partId = partElement.getAttribute('object-id');
    const header = partElement.querySelector('.accordion-header'); 
    var dictPart = {
        'id': parseInt(partId),
        'order': order,
        'is_graded': header.querySelector('.grade-toggle').checked,
        'is_included': header.querySelector('.include').checked,
        'introduction': partElement.querySelector('.ck-content').innerHTML,
        subparts: []
    }
    const reportSubParts = partElement.querySelectorAll('.accordion-content > #part-'+partId+' > .accordion-item');
    for (let i = 0; i < reportSubParts.length; i++) {
        dictPart['subparts'].push(subPartToDict(reportSubParts[i], i));
    }
    return dictPart;
}

function subPartToDict(subPartElement, order){
    const subPartId = subPartElement.getAttribute('object-id');
    const header = subPartElement.querySelector('.accordion-header'); 
    const textEditors = subPartElement.getElementsByClassName('ck-content');
    var dictSubPart = {
        'id': parseInt(subPartId),
        'order': order,
        'title': header.querySelector('.title').value,
        'grade': parseInt(header.querySelector('.grade-select').value),
        'is_included': header.querySelector('.include').checked,
        'is_intro_included': subPartElement.querySelector('.intro-include').value,
        'content': textEditors[1].innerHTML,
        'introduction': textEditors[0].innerHTML,
        subparts: []
    } 
    const reportSubParts = subPartElement.querySelectorAll('.accordion-content > #subpart-'+subPartId+' > .accordion-item');
    for (let i = 0; i < reportSubParts.length; i++) {
        dictSubPart['subparts'].push(subPartToDict(reportSubParts[i], i));
    }
    return dictSubPart;
}

const saveButton = document.getElementById('save-button')
saveButton.addEventListener('click', saveReport) 
