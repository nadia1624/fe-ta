import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Public Routes
  index("routes/LandingPage.tsx"),
  route("login", "routes/LoginPage.tsx"),
  route("register", "routes/RegisterPage.tsx"),

  // Dashboard Layout & Children
  route("dashboard", "layouts/DashboardLayout.tsx", [
    index("routes/DashboardRedirect.tsx"),

    // Role-based Dashboards
    route("admin", "routes/dashboards/AdminDashboard.tsx"),
    route("sespri", "routes/dashboards/SespriDashboard.tsx"),
    route("kasubag-protokol", "routes/dashboards/KasubagProtokolDashboard.tsx"),
    route("kasubag-media", "routes/dashboards/KasubagMediaDashboard.tsx"),
    route("ajudan", "routes/dashboards/AjudanDashboard.tsx"),
    route("staf-protokol", "routes/dashboards/StafProtokolDashboard.tsx"),
    route("staf-media", "routes/dashboards/StafMediaDashboard.tsx"),
    route("pemohon", "routes/dashboards/PemohonDashboard.tsx"),

    // Shared Routes
    route("agenda", "routes/AgendaManagementPage.tsx"),
    route("surat-permohonan", "routes/SuratPermohonanPage.tsx"),
    route("penugasan", "routes/PenugasanStafPage.tsx"),
    route("draft-berita", "routes/DraftBeritaPage.tsx"),
    route("laporan", "routes/LaporanPage.tsx"),
    route("users", "routes/UserManagementPage.tsx"),
    route("profile", "routes/ProfilePage.tsx"),

    // Admin Specific
    route("periode", "routes/admin/PeriodeManagementPage.tsx"),
    route("pimpinan", "routes/admin/PimpinanManagementPage.tsx"),

    // Sespri Specific
    route("verifikasi-permohonan", "routes/sespri/VerifikasiPermohonanPage.tsx"),
    route("agenda-pimpinan", "routes/sespri/AgendaPimpinanPage.tsx"),
    route("konfirmasi-pengganti", "routes/sespri/KonfirmasiPenggantiPage.tsx"),
    route("laporan-kegiatan-jadwal", "routes/sespri/LaporanKegiatanJadwalPage.tsx"),
    route("laporan-kegiatan-jadwal/:id", "routes/sespri/LaporanKegiatanJadwalDetailPage.tsx"),

    // Kasubag & Other Specific
    route("assign-staff", "routes/kasubag/AssignStaffPage.tsx"),
    route("review-draft", "routes/kasubag-media/ReviewDraftBeritaPage.tsx"),
    route("konfirmasi-agenda", "routes/ajudan/KonfirmasiAgendaPage.tsx"),
    route("agenda-pimpinan-ajudan", "routes/ajudan/AgendaPimpinanPage.tsx"),
    route("monitor-penugasan-protokol", "routes/kasubag-protokol/MonitorPenugasanPage.tsx"),
    route("agenda-pimpinan-kasubag", "routes/kasubag-protokol/AgendaPimpinanPage.tsx"),
    route("detail-penugasan/:id", "routes/kasubag-protokol/DetailPenugasanPage.tsx"),
    route("my-assignments", "routes/staf/MyAssignmentsPage.tsx"),
    route("submit-report", "routes/staf/SubmitReportPage.tsx"),
    route("riwayat-permohonan-pemohon", "routes/pemohon/RiwayatPermohonanPage.tsx"),
    route("submit-request", "routes/pemohon/SubmitRequestPage.tsx"),
    route("upload-draft-berita", "routes/staf-media/UploadDraftBeritaPage.tsx"),

    // Kasubag Media
    route("assign-staff-media", "routes/kasubag-media/AssignStaffMediaPage.tsx"),
    route("agenda-pimpinan-kasubag-media", "routes/kasubag-media/AgendaPimpinanMediaPage.tsx"),
    route("laporan-kegiatan-media", "routes/kasubag-media/LaporanKegiatanPage.tsx"),
    route("detail-laporan-media/:id", "routes/kasubag-media/DetailLaporanPage.tsx"),

    // Staf Protokol
    route("staf-protokol/laporan", "routes/staf-protokol/LaporanKegiatanPage.tsx"),
    route("tugas-saya", "routes/staf-protokol/TugasSayaPage.tsx"),
    route("tugas-detail/:id", "routes/staf-protokol/TugasDetailPage.tsx"),
    route("laporan-kegiatan-protokol", "routes/staf-protokol/LaporanKegiatanProtokolPage.tsx"),
    route("laporan-kegiatan-protokol/:id", "routes/staf-protokol/LaporanKegiatanProtokolDetailPage.tsx"),
    route("tambah-laporan-protokol/:id", "routes/staf-protokol/TambahLaporanPage.tsx"),
    route("agenda-pimpinan-staf-protokol", "routes/staf-protokol/AgendaPimpinanStafProtokolPage.tsx"),
    route("tambah-progress/:id", "routes/staf-protokol/TambahProgressPage.tsx"),
    route("laporan-kegiatan-staf-protokol", "routes/staf-protokol/LaporanKegiatanStafProtokolPage.tsx"),

    // Staf Media
    route("tugas-saya-media", "routes/staf-media/TugasSayaMediaPage.tsx"),
    route("draft-berita-media", "routes/staf-media/DraftBeritaMediaPage.tsx"),
    route("agenda-pimpinan-staf-media", "routes/staf-media/AgendaPimpinanStafMediaPage.tsx"),
    route("laporan-kegiatan-staf-media", "routes/staf-media/LaporanKegiatanStafMediaPage.tsx"),
    route("detail-laporan-staf-media/:id", "routes/staf-media/DetailLaporanStafMediaPage.tsx"),
    route("detail-draft-berita/:id", "routes/staf-media/DetailDraftBeritaPage.tsx"),
  ]),

  // Catch-all
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;