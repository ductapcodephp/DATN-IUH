/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
    config.filebrowserBrowseUrl = '/cms/ckeditor/open-popup'; // Keep your file browser URL
    config.skin = 'office2013';
    config.allowedContent = true; // Allow all content (no filtering)
    config.removeDialogTabs = ''; // Ensure all dialog tabs are available

    // Comprehensive toolbar configuration for "full option" CKEditor
    // config.toolbar = [
    //     [
    //         "Cut",
    //         "Copy",
    //         "-",
    //         "Undo",
    //         "Redo",
    //         "-",
    //         "Link",
    //         "Unlink",
    //         "-",
    //         "CopyFormatting",
    //         "RemoveFormat",
    //         "-",
    //         "Source",
    //         "-", // Dấu phân cách
    //         "CreateDiv", // Tạo div
    //         "-", // Dấu phân cách
    //         "Table", // Bảng
    //         "-", // Dấu phân cách
    //         "ShowBlocks", // Hiển thị khối
    //         "-", // Dấu phân cách
    //         "Maximize", // Tăng cỡ,
    //         "Picture"
    //     ],
    //     "/",
    //     [
    //         "Bold",
    //         "Italic",
    //         "Underline",
    //         "Strike",
    //         "-",
    //         "TextColor",
    //         "BGColor",
    //         "-",
    //         "NumberedList",
    //         "BulletedList",
    //         "-",
    //         "Outdent",
    //         "Indent",
    //         "-",
    //         "Blockquote",
    //         "HorizontalRule",
    //         "-",
    //         "JustifyLeft",
    //         "JustifyCenter",
    //         "JustifyRight",
    //         "JustifyBlock",
    //         "-",
    //         "Format", // Thêm nút cho Format
    //         "Image", // Thêm nút cho Format
    //     ],
    //
    // ];
    // Enable extra plugins for full functionality
    config.extraPlugins = 'image, justify, iframe, colorbutton';

    // Remove only the magicline plugin as per your original config
    config.removePlugins = 'sourcearea';
    config.removeButtons = 'PasteFromWord';
    // Optional: Set height and width for better editor experience
    config.height = 400;
    config.width = '100%';

    // Optional: Enable auto-grow for dynamic height adjustment
    config.autoGrow_onStartup = true;
    config.autoGrow_minHeight = 200;
    config.autoGrow_maxHeight = 600;
    config.extraAllowedContent = 'img[width,height]';
    config.disallowedContent = 'img{width,height}';
    config.image_prefillDimensions = false;
};

// Intercept Image dialog to use custom React Media Picker via CustomEvent
CKEDITOR.on('dialogDefinition', function(ev) {
    if (ev.data.name === 'image') {
        var infoTab = ev.data.definition.getContents('info');
        var browseButton = infoTab.get('browse');
        if (browseButton) {
            // Remove the default filebrowser plugin behavior
            delete browseButton.filebrowser;
            browseButton.hidden = false;
            
            // Trigger the React MediaPickerModal
            browseButton.onClick = function() {
                window.dispatchEvent(new CustomEvent('open-ckeditor-media', {
                    detail: {
                        callback: function(url) {
                            var dialog = window.CKEDITOR.dialog.getCurrent();
                            if (dialog) {
                                dialog.setValueOf('info', 'txtUrl', url);
                            }
                        }
                    }
                }));
                return false;
            };
        }
    }
});