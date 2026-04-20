import Swal from 'sweetalert2';

/**
 * Centered Toast Utility for SweetAlert2
 * Standardizes all alerts across the system for consistent UX/UI.
 */
export const toast = {
  /**
   * Success alert - Auto closes after 1.5s
   */
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'success',
      title: title || 'Berhasil!',
      text: text,
      showConfirmButton: false,
      timer: 1500,
      padding: '2rem',
      customClass: {
        popup: 'rounded-2xl shadow-xl border-none',
        title: 'text-xl font-bold text-gray-900',
        htmlContainer: 'text-sm text-gray-600',
      },
    });
  },
  /**
   * Info alert - For general information
   */
  info: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'info',
      title: title || 'Informasi',
      text: text,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Mengerti',
      padding: '2rem',
      customClass: {
        popup: 'rounded-2xl shadow-xl border-none',
        confirmButton: 'rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:opacity-90',
        title: 'text-xl font-bold text-gray-900',
        htmlContainer: 'text-sm text-gray-600',
      },
    });
  },

  /**
   * Error alert - Requires user to click "Tutup"
   */
  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'error',
      title: title || 'Gagal',
      text: text,
      confirmButtonColor: '#2563eb', // Indigo-600 to match app theme
      confirmButtonText: 'Tutup',
      padding: '2rem',
      customClass: {
        popup: 'rounded-2xl shadow-xl border-none',
        confirmButton: 'rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:opacity-90',
        title: 'text-xl font-bold text-gray-900',
        htmlContainer: 'text-sm text-gray-600',
      },
    });
  },

  /**
   * Warning alert - For conflicts or information that needs attention
   */
  warning: (title: string, text?: string, html?: string) => {
    return Swal.fire({
      icon: 'warning',
      title: title || 'Peringatan',
      text: text,
      html: html,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Mengerti',
      padding: '2rem',
      customClass: {
        popup: 'rounded-2xl shadow-xl border-none',
        confirmButton: 'rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:opacity-90',
        title: 'text-xl font-bold text-gray-900',
        htmlContainer: 'text-sm text-gray-600',
      },
    });
  },

  /**
   * Confirmation dialog - Usually for Delete or important actions
   */
  confirm: async (title: string, text: string, type: 'warning' | 'danger' = 'warning', html?: string) => {
    return Swal.fire({
      title: title || 'Apakah Anda yakin?',
      text: text,
      html: html,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: type === 'danger' ? '#dc2626' : '#2563eb', // Red-600 or Indigo-600
      cancelButtonColor: '#6b7280', // Gray-500
      confirmButtonText: type === 'danger' ? 'Ya, Hapus!' : 'Ya, Lanjutkan',
      cancelButtonText: 'Batal',
      reverseButtons: true, // Cancel on left, Confirm on right
      padding: '2rem',
      customClass: {
        popup: 'rounded-2xl shadow-xl border-none',
        confirmButton: 'rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:opacity-90',
        cancelButton: 'rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:opacity-90',
        title: 'text-xl font-bold text-gray-900',
        htmlContainer: 'text-sm text-gray-600',
      },
    });
  },
};
