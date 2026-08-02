/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
    
    // config.extraPlugins = "file-manager";
    // config.apiKey = "YOUR-KEY"; // if you have own Flmngr API key, get it on https://flmngr.com/dashboard
    
    config.skin = "n1theme";
    config.allowedContent = true;
    config.toolbar = [
        [
            "Cut",
            "Copy",
            "-",
            "Undo",
            "Redo",
            "-",
            "Font",
            "-",
            "FontSize",
            "-",
            "Link",
            "Unlink",
            "-",
            "CopyFormatting",
            "RemoveFormat",
        "-",
        "Source"
        ],
        "/",
        [
            "Bold",
            "Italic",
            "Underline",
            "Strike",
            "-",
            "TextColor",
            "BGColor",
            "-",
            "NumberedList",
            "BulletedList",
            "-",
            "Outdent",
            "Indent",
            "-",
            "Blockquote",
            "HorizontalRule",
            "-",
            "JustifyLeft",
            "JustifyCenter",
            "JustifyRight",
            "JustifyBlock"
        ]
    ];
};
