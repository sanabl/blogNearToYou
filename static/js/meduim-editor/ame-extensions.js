/**
 * Created by sadra on 5/6/17.
 */

var insertImageExtension = MediumEditor.Extension.extend({
    name: 'insertImage',

    init: function () {
        this.button = this.document.createElement('button');
        this.button.classList.add('medium-editor-action');
        this.button.innerHTML = '<i class="fa fa-image" aria-hidden="true"></i>';
        this.button.title = 'Insert Image';

        this.on(this.button, 'click', this.handleClick.bind(this));
    },

    getButton: function () {
        return this.button;
    },

    handleClick: function (event) {
        this.base.checkContentChanged();

        console.log(this.document.getSelection().toString().trim());

        var imgSrc = this.document.getSelection().toString().trim();
        var theHTML = '<div class="medium-insert-images">' + '<figure contenteditable="false">' +
            '<img src="' + imgSrc + '" alt=""></figure></div><br/>';

        insertImageElements(theHTML, '')
    }

});

function insertImageElements(html, selectPastedContent) {

    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            var firstNode = frag.firstChild;
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                if (selectPastedContent) {
                    range.setStartBefore(firstNode);
                } else {
                    range.collapse(true);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if ((sel = document.selection) && sel.type != "Control") {
        // IE < 9
        var originalRange = sel.createRange();
        originalRange.collapse(true);
        sel.createRange().pasteHTML(html);
        if (selectPastedContent) {
            range = sel.createRange();
            range.setEndPoint("StartToStart", originalRange);
            range.select();
        }
    }


}

var title = new MediumEditor('.title', {
    placeholder: {
        /* This example includes the default options for placeholder,
           if nothing is passed this is what it used */
        text: 'العنوان',
        hideOnClick: false
    },
   toolbar: {
       buttons: ['bold', 'italic', 'anchor', 'h1', 'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight', 'removeFormat', 'insertImage'],
       disableDoubleReturn: true,
   },
                forcePlainText: false,
        cleanPastedHTML: false,

    // extensions: {
    //     'insertImage': new insertImageExtension(),
    // }
});

var editor = new MediumEditor('.editable', {
    buttonLabels: 'fontawesome',
    placeholder: {
        /* This example includes the default options for placeholder,
           if nothing is passed this is what it used */
        text: 'إبدأ من هنا ....',
        hideOnClick: true
    },
                forcePlainText: false,
        cleanPastedHTML: false,

    toolbar: {
        /* These are the default options for the toolbar,
         if nothing is passed this is what is used */
        allowMultiParagraphSelection: true,
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'h3', 'quote', 'strikethrough', 'orderedlist', 'unorderedlist', 'indent', 'outdent', 'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight', 'removeFormat', 'insertImage'],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,

        /* options which only apply when static is true */
        align: 'center',
        sticky: false,
        updateOnEmptySelection: false
    },
    disableDoubleReturn: true,
    // extensions: {
    //     'insertImage': new insertImageExtension(),
    // }
});

function get_post_data() {
    let base_content = editor.getContent()
    let base_title = title.getContent()
    let base_index_to_cut = base_content.indexOf('<div class="medium-insert-buttons"')
    let base_index_to_cut_title = base_title.indexOf('<div class="medium-insert-buttons"')
    let content = $(base_content.substring(0, base_index_to_cut)).text()
    if (!content)
        return null
    editor.saveSelection()

    return [base_title, base_content.substring(0, base_index_to_cut), editor.selectionState]
}
function save_post(post_date){
    let crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
    let id =null;
    if(path.length >=3){
        id = path[path.length-1]
    }
    $.ajax({
            url: `/api/v1/posts/${id??''}/`,
            type: id?'PUT':"POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("X-CSRFToken", crf_token);
            },
            data: JSON.stringify({
                'title': post_date[0],
                'body': post_date[1],
                'lastPosition': post_date[3],
                'status': post_date[4]
            }),
            dataType: "json",
            success: function (data) {
                window.location.href = '/';
            },
            error: function (xhr, status, error) {
                alert('هناك خطأ ما يرجى المحاولة لاحقا');
            }
        })
}
$(function () {
        let crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');

    $('.editable').mediumInsert({
        editor: editor,
        addons: { // (object) Addons configuration
            images: { // (object) Image addon configuration
                label: '<span class="fa fa-camera"></span>', // (string) A label for an image addon
                deleteScript: '/api/v1/image', // (string) A relative path to a delete script
                deleteMethod: 'POST',
                fileDeleteOptions: {
                    'headers': {
                        'csrfmiddlewaretoken': crf_token,
                    }
                }, // (object) extra parameters send on the delete ajax request, see http://api.jquery.com/jquery.ajax/
                preview: true, // (boolean) Show an image before it is uploaded (only in browsers that support this feature)
                captions: true, // (boolean) Enable captions
                captionPlaceholder: 'اضف توضيح للصورة (إختياري)', // (string) Caption placeholder
                autoGrid: 3, // (integer) Min number of images that automatically form a grid
                formData: {}, // DEPRECATED: Use fileUploadOptions instead
                fileUploadOptions: { // (object) File upload configuration. See https://github.com/blueimp/jQuery-File-Upload/wiki/Options
                    url: '/api/v1/photos/', // (string) A relative path to an upload script
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i, // (regexp) Regexp of accepted file types,
                    'headers': {
                        'csrfmiddlewaretoken': crf_token,
                    }
                },
                styles: { // (object) Available image styles configuration
                    wide: { // (object) Image style configuration. Key is used as a class name added to an image, when the style is selected (.medium-insert-images-wide)
                        label: '<span class="fa fa-align-justify"></span>', // (string) A label for a style
                        added: function ($el) {
                        }, // (function) Callback function called after the style was selected. A parameter $el is a current active paragraph (.medium-insert-active)
                        removed: function ($el) {
                        } // (function) Callback function called after a different style was selected and this one was removed. A parameter $el is a current active paragraph (.medium-insert-active)
                    },
                    left: {
                        label: '<span class="fa fa-align-left"></span>'
                    },
                    right: {
                        label: '<span class="fa fa-align-right"></span>'
                    },
                    grid: {
                        label: '<span class="fa fa-th"></span>'
                    },

                },
                actions: { // (object) Actions for an optional second toolbar
                    remove: { // (object) Remove action configuration
                        label: '<span class="fa fa-times"></span>', // (string) Label for an action
                        clicked: function ($el) { // (function) Callback function called when an action is selected
                            var $event = $.Event('keydown');

                            $event.which = 8;
                            $(document).trigger($event);
                        }
                    }
                },
                messages: {
                    acceptFileTypesError: 'This file is not in a supported format: ',
                    maxFileSizeError: 'This file is too big: '
                },
                uploadCompleted: function ($el, data) {
                }, // (function) Callback function called when upload is completed
                uploadFailed: function (uploadErrors, data) {
                } // (function) Callback function called when upload failed
            },
            embeds: false
        }
    });
    $('.js-PublishButton').click(function () {
        let post_data = get_post_data();
        if (!post_data) {
            alert('لا يوجد شيء لنشره')
            return
        }
        post_data[4] = 'P'

        save_post(post_data)

    })
    $('.js-DraftButton').click(function () {

        let post_data = get_post_data();
        if (!post_data) {
            alert('لا يوجد شيء لحفظه')
            return
        }
        post_data[4] = 'D'
        save_post(post_data)

    })

});

