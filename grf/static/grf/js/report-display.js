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
    setTableOfContents(doc);
} 

function setTableOfContents(doc=document){
    
    var previousDepth = 0;
    var tocElements = [];
    const tableOfContents = doc.createElement('ul');
    doc.querySelectorAll('.section-number').forEach(function (element) {
        var tagName = element.parentElement.tagName.toLowerCase();
        var depth = parseInt(tagName.replace('h',''));  
        if(previousDepth >= depth) {
            for(var i=previousDepth; i >= depth; i--) { 
                if (i==1) {
                    tableOfContents.appendChild(tocElements[tocElements.length-1]);
                } else {
                    tocElements[tocElements.length-2]
                        .getElementsByTagName('ul')[0]
                        .appendChild(tocElements[tocElements.length-1]);
                }       
                tocElements.pop();
            } 
        }
        const title = element.parentElement.getElementsByClassName('section-title')[0].textContent;
        tocElements.push(createTOCElement(title, element.id, element.textContent, depth, doc));
        previousDepth = depth;
    });
    for (var i=previousDepth; i > 1; i--){
        tocElements[tocElements.length-2]
            .getElementsByTagName('ul')[0]
            .appendChild(tocElements[tocElements.length-1]);
        tocElements.pop();
    }
    tableOfContents.appendChild(tocElements[tocElements.length-1]);
    doc.getElementById("table-of-contents").appendChild(tableOfContents);
}

function createTOCElement(title, sectionId, sectionNumber, depth, doc=document){
    const tocElement = doc.createElement("li");
    const link = doc.createElement("a");
    link.textContent = title;
    link.href = "#" + sectionId;
    link.style = "text-decoration:none";
    tocElement.appendChild(link);
    tocElement.appendChild(doc.createElement("ul"));
    return tocElement;
}
