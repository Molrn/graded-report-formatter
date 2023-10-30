
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

const gradeToggles = document.getElementsByClassName('grade-toggle');

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
