document.addEventListener('DOMContentLoaded', setSortableAccordion);
document.addEventListener('NewAccordionItemAdded', setSortableAccordion);


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
