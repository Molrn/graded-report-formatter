function setSectionNumbers(doc=document){
    var sectionCounters = [];
    doc.querySelectorAll('.section-number').forEach(function (element) {
        const tagName = element.parentElement.tagName.toLowerCase();
        var depth = parseInt(tagName.replace('h',''));  
        if(sectionCounters.length<depth) {
            sectionCounters.push(1);
        } else if(sectionCounters.length==depth) {
            sectionCounters[sectionCounters.length-1]++;
        } else {
            do { sectionCounters.pop();
            } while(sectionCounters.length!=depth);
            sectionCounters[sectionCounters.length-1]++;
        }
        element.setAttribute('id', sectionCounters.join('-'));
        element.textContent = sectionCounters.join('.')+'.';
    });
}

function initializeReportDisplay(doc=document){
    setSectionNumbers(doc);
} 

