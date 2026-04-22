/**
 * Utility to check if an agenda is in the past.
 * @param tanggal Date string in 'YYYY-MM-DD' format.
 * @param waktuSelesai Time string in 'HH:mm:ss' or 'HH:mm' format.
 * @returns boolean
 */
export const isAgendaPast = (tanggal: string, waktuSelesai: string): boolean => {
  if (!tanggal || !waktuSelesai) return false;
  
  // Combine date and time: YYYY-MM-DDTHH:mm:ss
  // Ensure time has seconds if it's just HH:mm
  const time = waktuSelesai.length === 5 ? `${waktuSelesai}:00` : waktuSelesai;
  const agendaEnd = new Date(`${tanggal}T${time}`);
  
  return agendaEnd < new Date();
};
