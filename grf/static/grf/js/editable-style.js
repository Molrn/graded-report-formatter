const styleTextAreaElement = document.querySelector('#editable-style > textarea');
const editableStyleElement = document.querySelector('#editable-style > style');   

function saveReportStyle() {
    const reportId = editableStyleElement.getAttribute('report-id');
    fetch(`/grf/save_report_styling/${reportId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({  style: styleTextAreaElement.value }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => { console.error(error); });
}
     
styleTextAreaElement.addEventListener('input', function(){
    setTimeout(function() {
        editableStyleElement.textContent = styleTextAreaElement.value;
    }, 200); 
});

document.addEventListener('DOMContentLoaded', function(){
    editableStyleElement.textContent = styleTextAreaElement.value;
});

styleTextAreaElement.setAttribute("style", 
    "height:" + (styleTextAreaElement.scrollHeight) + "px;"+
    "overflow-y:hidden;"+
    "width:100%;"+
    "tab-size: 4;");
  
styleTextAreaElement.addEventListener("input", function () {
    this.style.height = 0;
    this.style.height = (this.scrollHeight) + "px";
});

styleTextAreaElement.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const tabCharacter = "\t";
    const text = this.value;
    this.value = text.substring(0, start) + tabCharacter + text.substring(end);
    this.selectionStart = this.selectionEnd = start + tabCharacter.length;
  }
});

