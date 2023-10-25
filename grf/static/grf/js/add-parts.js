const templatePart = document.querySelector('#template-part > .accordion-item');
const templateSubPart = document.querySelector('#template-part > .accordion-item');
const templateDirectSubPart = document.querySelector('#template-direct-subpart > .accordion-item');


document.addEventListener('click', function (event) {
    if (event.target.classList.contains('add-accordion-item')) {
      const accordionContent = event.target.parentNode;
        if (event.target.classList.contains('add-subpart')) { 
            accordionContent.insertBefore(templateSubPart.cloneNode(true), event.target);
        } else if (event.target.classList.contains('add-part')){
            accordionContent.insertBefore(templatePart.cloneNode(true), event.target);
        }else if (event.target.classList.contains('add-direct-subpart')){
            accordionContent.insertBefore(templateDirectSubPart.cloneNode(true), event.target);
        }
        document.dispatchEvent((new Event('NewAccordionItemAdded')));
    }
});
