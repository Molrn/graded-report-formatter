const editableStyleElement = document.querySelector('#editable-style > style');   

const cssEditor = CodeMirror.fromTextArea(
    document.getElementById('css-editor'), {
        mode: 'text/css',
        lineNumbers: true,
        autoCloseBrackets: true,
        theme: 'default',
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
    });

function saveReportStyle() {
    const reportId = editableStyleElement.getAttribute('report-id');
    fetch(`/grf/save_report_styling/${reportId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({  style: cssEditor.getValue() }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => { console.error(error); });
}
    
//CodeMirror.showHint(cssEditor, CodeMirror.hint.css);

document.addEventListener('DOMContentLoaded', function(){
    editableStyleElement.textContent = cssEditor.getValue();
});

cssEditor.on('change', (editor, change) => {
    setTimeout(function() {
        editableStyleElement.textContent = cssEditor.getValue();
    }, 200); 
});
