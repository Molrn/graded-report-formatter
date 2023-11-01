const initFunctions = [setSortableAccordion, setGradeSelect, setGradeToggle, setAddingButtons, setDeleteReportElementButtons];

for (let i = 0; i < initFunctions.length; i++) {
    document.addEventListener('DOMContentLoaded', initFunctions[i]);
}

const removedPartIds = [];
const removedSubPartIds = [];

function setGradeSelect(){
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
}

function setAddingButtons(){
    const templatePart = document.querySelector('#template-part > .accordion-item');
    const templateSubPart = document.querySelector('#template-part > .accordion-item');
    const templateDirectSubPart = document.querySelector('#template-direct-subpart > .accordion-item');
    const addingButtons = document.getElementsByClassName('add-accordion-item');

    for (let i = 0; i < addingButtons.length; i++) {
        addingButtons[i].addEventListener('click', function (event) {
            const accordionContent = this.parentNode;
            if (this.classList.contains('add-subpart')) { 
                accordionContent.insertBefore(templateSubPart.cloneNode(true), event.target);
            } else if (this.classList.contains('add-part')){
                accordionContent.insertBefore(templatePart.cloneNode(true), event.target);
            }else if (this.classList.contains('add-direct-subpart')){
                accordionContent.insertBefore(templateDirectSubPart.cloneNode(true), event.target);
            }
            setSortableAccordion();
            setAddingButtons();
            setDeleteReportElementButtons();
        });
    }
}

function setGradeToggle(){
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
}

function setDeleteReportElementButtons(){
    const deleteButton = document.getElementsByClassName('delete-report-element');
    for (let i = 0; i < deleteButton.length; i++) {
        deleteButton[i].addEventListener('click', function () {
            const reportElement = this.parentElement.parentElement;
            const objectId = reportElement.getAttribute('object-id');
            reportElement.remove();
            if(this.classList.contains('delete-part')){
                removedPartIds.push(objectId);
            }else if(this.classList.contains('delete-subpart')){
                removedSubPartIds.push(objectId);
            }
        });
    }
}

function setSortableAccordion(event){
    $('.accordion-toggle').click(function () {
        $(this).parent('.accordion-item').toggleClass('active');
    });

    // Make accordion items sortable within their parent accordion
    $('.accordion').each(function () {
        $(this).sortable({
            items: '.accordion-item',
            handle: '.accordion-drag-handle',
            tolerance: 'pointer',
            connectWith: '.accordion#' + $(this).attr('id'),
        });
    });

    // Prevent dragging on accordion content
    $('.accordion-content').on('mousedown', function (e) {
        e.stopPropagation();
    });

    // Make the accordion collapsible
    $('.accordion .accordion-item').each(function () {
        var $header = $(this).find('.accordion-header');
        var $content = $(this).find('.accordion-content');
        var $toggleButton = $header.find('.accordion-toggle');

        if (!$(this).hasClass('active')) {
            $toggleButton.html('▼'); 
        } else {
            $toggleButton.html('▲'); 
        }

        $toggleButton.click(function (event) {
            event.stopImmediatePropagation();
            $(this).parent('.accordion-header').next('.accordion-content').slideToggle();
            if ($(this).html() == '▼') {
                $(this).html('▲'); 
            } else {
                $(this).html('▼'); 
            }
        });
    });
}
