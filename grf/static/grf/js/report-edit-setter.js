const initFunctions = [setSortableAccordion, setGradeSelect, setGradeToggle, setAddingButtons, setDeleteReportElementButtons, setIntroShowButton];

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
            if(!gradesArray.includes(parseInt(value))){
                gradeSelect[index].value='empty';
            } else {
                gradeSelect[index].value=value;
            }
        }
    }
}

function setAddingButtons(event, element=document){
    const templatePartId = 'template-part';
    const templateSubPartId = 'template-subpart';
    const templateDirectSubPartId = 'template-direct-subpart';
    const addingButtons = element.getElementsByClassName('add-accordion-item');
    for (let i = 0; i < addingButtons.length; i++) {
        addingButtons[i].addEventListener('click', function (event) {
            var newElementId;
            if (this.classList.contains('add-subpart')) { 
                newElementId = templateSubPartId;
            } else if (this.classList.contains('add-part')){
                newElementId = templatePartId;
            }else if (this.classList.contains('add-direct-subpart')){
                newElementId = templateDirectSubPartId;
            } else {
                console.error('Element to add no specified (subpart, part, direct subpart)');
                return ;
            }
            const templateElement = document.querySelector('#'+newElementId+' > .accordion-item')
            const newElement = templateElement.cloneNode(true);
            this.parentNode.insertBefore(newElement, event.target);
            setSortableAccordion();
            setAddingButtons(element=newElement);
            setDeleteReportElementButtons(element=newElement);
            setIntroShowButton(element=newElement);
            setGradeToggle(element=newElement);
        }, { once: true });
    }
}

function setGradeToggle(event, element=document){
    const gradeToggles = element.getElementsByClassName('grade-toggle');
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
        }, { once: true });
    }
}

function setIntroShowButton(event, element=document){
    const introButton = element.getElementsByClassName('hide-show-subpart-intro');
    for (let i = 0; i < introButton.length; i++) {
        introButton[i].addEventListener('click', function () {
            const isShow = introButton[i].innerHTML=="Show"; 
            introButton[i].innerHTML= isShow ? "Hide" : "Show";
            introButton[i].nextElementSibling.style.display = isShow ? 'block' : 'none';
        }, { once: true });
    }
}

function setDeleteReportElementButtons(event, element=document){
    const deleteButton = element.getElementsByClassName('delete-report-element');
    for (let i = 0; i < deleteButton.length; i++) {
        deleteButton[i].addEventListener('click', function () {
            const reportElement = this.parentElement.parentElement;
            const objectId = parseInt(reportElement.getAttribute('object-id'));
            reportElement.remove();
            if (objectId){
                if(this.classList.contains('delete-part')){
                    removedPartIds.push(objectId);
                }else if(this.classList.contains('delete-subpart')){
                    removedSubPartIds.push(objectId);
                }
            }
        }, { once: true });
    }
}

function setSortableAccordion(){
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
