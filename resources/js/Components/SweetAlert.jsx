import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function SweetAlert({
    show,
    type = 'alert', // 'alert', 'confirm', 'toast'
    icon = 'info', // 'success', 'error', 'warning', 'info', 'question'
    title,
    text,
    confirmButtonText = 'Đồng ý',
    cancelButtonText = 'Hủy',
    confirmButtonColor = '#f97316',
    cancelButtonColor = '#6b7280',
    showConfirmButton = true,
    timer,
    input,
    inputPlaceholder,
    html,
    onConfirm,
    onCancel,
    onClose
}) {
    useEffect(() => {
        if (show) {
            if (type === 'toast') {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });
                
                Toast.fire({
                    icon: icon,
                    title: title
                }).then(() => {
                    if (onClose) onClose();
                });
            } else if (type === 'confirm') {
                Swal.fire({
                    title: title || 'Bạn có chắc chắn không?',
                    text: text || '',
                    html: html,
                    icon: icon || 'warning',
                    input: input,
                    inputPlaceholder: inputPlaceholder,
                    showCancelButton: true,
                    confirmButtonColor: confirmButtonColor,
                    cancelButtonColor: cancelButtonColor,
                    confirmButtonText: confirmButtonText,
                    cancelButtonText: cancelButtonText,
                    background: '#ffffff',
                    customClass: {
                        popup: 'border-radius-10'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (onConfirm) onConfirm(result.value);
                    } else if (result.isDismissed) {
                        if (onCancel) onCancel();
                    }
                    if (onClose) onClose();
                });
            } else {
                Swal.fire({
                    title: title,
                    text: text,
                    html: html,
                    icon: icon,
                    input: input,
                    inputPlaceholder: inputPlaceholder,
                    showConfirmButton: showConfirmButton,
                    timer: timer,
                    confirmButtonText: confirmButtonText,
                    confirmButtonColor: confirmButtonColor,
                    background: '#ffffff',
                    customClass: {
                        popup: 'border-radius-10'
                    }
                }).then((result) => {
                    if (result.isConfirmed && onConfirm) onConfirm();
                    if (onClose) onClose();
                });
            }
        }
    }, [show, title, text, icon]); // Trigger again if show becomes true or content changes

    return null;
}
