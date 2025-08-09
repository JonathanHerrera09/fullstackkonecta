import Swal from 'sweetalert2';

export const showSuccess = (title = 'Éxito', text = '') =>
  Swal.fire({ icon: 'success', title, text, confirmButtonColor: '#3085d6' });

export const showError = (title = 'Error', text = '') =>
  Swal.fire({ icon: 'error', title, text, confirmButtonColor: '#d33' });

export const showConfirm = (text = '¿Estás seguro?', confirmText = 'Sí', cancelText = 'Cancelar') =>
  Swal.fire({
    title: 'Confirmar',
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
