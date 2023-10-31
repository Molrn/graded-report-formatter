const fileSelector = document.getElementById('import-file-selector');
const uploadButton = document.getElementById('json-import-button');

uploadButton.addEventListener('click', function () {
    fileSelector.click();
});

fileSelector.addEventListener('change', function () {
    if (fileSelector.files.length > 0) {
        const file = fileSelector.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            try {
                dictReport = JSON.parse(reader.result);
                sendReport(dictReport);
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file. Please select a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
});
