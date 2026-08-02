import React, { useEffect, useRef, useState } from 'react';
import MediaPickerModal from '@/Components/CMS/MediaPickerModal';

export default function CKEditorComponent({ value, onChange }) {
    const editorRef = useRef(null);
    const [editorInstance, setEditorInstance] = useState(null);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [pickerCallback, setPickerCallback] = useState(null);

    useEffect(() => {
        if (!window.CKEDITOR) {
            console.error("CKEditor script not found!");
            return;
        }

        const handleOpenMedia = (e) => {
            if (e.detail && e.detail.callback) {
                setPickerCallback(() => e.detail.callback);
            }
            setShowMediaPicker(true);
        };
        window.addEventListener('open-ckeditor-media', handleOpenMedia);

        if (!window.hasInterceptedCKEditorDialog_v3) {
            window.CKEDITOR.on('dialogDefinition', function(ev) {
                if (ev.data.name === 'image') {
                    const infoTab = ev.data.definition.getContents('info');
                    const browseButton = infoTab.get('browse');
                    if (browseButton) {
                        delete browseButton.filebrowser;
                        browseButton.hidden = false;
                        browseButton.onClick = function() {
                            window.dispatchEvent(new CustomEvent('open-ckeditor-media', {
                                detail: {
                                    callback: function(url) {
                                        const dialog = window.CKEDITOR.dialog.getCurrent();
                                        if (dialog) {
                                            dialog.setValueOf('info', 'txtUrl', url);
                                            // Tự động bấm nút Đồng ý để chèn luôn vào bài viết
                                            setTimeout(() => {
                                                const okBtn = dialog.getButton('ok');
                                                if (okBtn) okBtn.click();
                                            }, 100);
                                        }
                                    }
                                }
                            }));
                            return false;
                        };
                    }
                }
            });
            window.hasInterceptedCKEditorDialog_v3 = true;
        }

        const editor = window.CKEDITOR.replace(editorRef.current, {});

        if (value) {
            editor.setData(value);
        }

        editor.on('change', () => {
            if (onChange) {
                onChange(editor.getData());
            }
        });

        setEditorInstance(editor);

        return () => {
            window.removeEventListener('open-ckeditor-media', handleOpenMedia);
            if (editor) {
                editor.destroy(true);
            }
        };
    }, []);

    const handleMediaSelect = (url) => {
        if (url && pickerCallback) {
            pickerCallback(url);
        }
        setShowMediaPicker(false);
    };

    return (
        <div>
            <textarea ref={editorRef} defaultValue={value}></textarea>
            {showMediaPicker && (
                <MediaPickerModal 
                    show={true}
                    onSelect={handleMediaSelect} 
                    onClose={() => setShowMediaPicker(false)} 
                    multiple={false} 
                />
            )}
        </div>
    );
}
