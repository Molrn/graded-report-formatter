let textEditorsElements = document.getElementsByClassName( 'text-editor' );
for (let index = 0; index < textEditorsElements.length; index++) {
    ClassicEditor
        .create(textEditorsElements[index], {
            toolbar: {
                items: [
                    'bold',
                    'italic',
                    '|',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'link',
                    'imageUpload',
                    '|',
                    'undo',
                    'redo'
                ],
                shouldNotGroupWhenFull: true,
                removeButtons: ''
            },
            language: 'en',
            image: {
                toolbar: [
                    'imageTextAlternative',
                    'imageStyle:full',
                    'imageStyle:side'
                ]
            } 
        })
        .then( editor => {
            editor.setData(textEditorsElements[index].getAttribute('html-content'));
        } )
        .catch( error => {
            console.error( 'There was a problem initializing the editor.', error );
        } );
}


