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

  // Protected Routes Group
  layout("layouts/AuthGuard.tsx", [
    layout("layouts/DashboardLayout.tsx", [
      // ---------------------------------------------------------
      // ADMIN ROUTES
      // ---------------------------------------------------------
      route("admin/dashboard", "routes/dashboards/AdminDashboard.tsx"),
      route("admin/users", "routes/admin/UserManagementPage.tsx"),
      route("admin/periode", "routes/admin/PeriodeManagementPage.tsx"),
      route("admin/pimpinan", "routes/admin/PimpinanManagementPage.tsx"),
      route("admin/profile", "routes/ProfilePage.tsx", { id: "admin-profile" }),

      // ---------------------------------------------------------
      // SESPRI ROUTES
      // ---------------------------------------------------------
      route("sespri/dashboard", "routes/dashboards/SespriDashboard.tsx"),
      route("sespri/verifikasi-permohonan", "routes/sespri/VerifikasiPermohonanPage.tsx"),
      route("sespri/agenda-pimpinan", "routes/sespri/AgendaPimpinanPage.tsx"),
      route("sespri/konfirmasi-pengganti", "routes/sespri/KonfirmasiPenggantiPage.tsx"),
      route("sespri/laporan-kegiatan-jadwal", "routes/sespri/LaporanKegiatanJadwalPage.tsx"),
      route("sespri/laporan-kegiatan-jadwal/:id", "routes/sespri/LaporanKegiatanJadwalDetailPage.tsx"),
      route("sespri/profile", "routes/ProfilePage.tsx", { id: "sespri-profile" }),

      // ---------------------------------------------------------
      // KASUBAG PROTOKOL ROUTES
      // ---------------------------------------------------------
      route("kasubag-protokol/dashboard", "routes/dashboards/KasubagProtokolDashboard.tsx"),
      route("kasubag-protokol/assign-staff", "routes/kasubag-protokol/AssignStaffPage.tsx"),
      route("kasubag-protokol/monitor-penugasan", "routes/kasubag-protokol/MonitorPenugasanPage.tsx"),
      route("kasubag-protokol/agenda-pimpinan", "routes/kasubag-protokol/AgendaPimpinanPage.tsx"),
      route("kasubag-protokol/penugasan/:id", "routes/kasubag-protokol/DetailPenugasanPage.tsx"),
      route("kasubag-protokol/profile", "routes/ProfilePage.tsx", { id: "kasubag-protokol-profile" }),

      // ---------------------------------------------------------
      // KASUBAG MEDIA ROUTES
      // ---------------------------------------------------------
      route("kasubag-media/dashboard", "routes/dashboards/KasubagMediaDashboard.tsx"),
      route("kasubag-media/assign-staff", "routes/kasubag-media/AssignStaffMediaPage.tsx"),
      route("kasubag-media/draft-berita", "routes/kasubag-media/DraftBeritaPage.tsx"),
      route("kasubag-media/review-draft", "routes/kasubag-media/ReviewDraftBeritaPage.tsx"),
      route("kasubag-media/agenda-pimpinan", "routes/kasubag-media/AgendaPimpinanMediaPage.tsx"),
      route("kasubag-media/laporan-kegiatan", "routes/kasubag-media/LaporanKegiatanPage.tsx"),
      route("kasubag-media/laporan-kegiatan/:id", "routes/kasubag-media/DetailLaporanPage.tsx"),
      route("kasubag-media/profile", "routes/ProfilePage.tsx", { id: "kasubag-media-profile" }),

      // ---------------------------------------------------------
      // AJUDAN ROUTES
      // ---------------------------------------------------------
      route("ajudan/dashboard", "routes/dashboards/AjudanDashboard.tsx"),
      route("ajudan/konfirmasi-agenda", "routes/ajudan/KonfirmasiAgendaPage.tsx"),
      route("ajudan/agenda-pimpinan", "routes/ajudan/AgendaPimpinanPage.tsx"),
      route("ajudan/profile", "routes/ProfilePage.tsx", { id: "ajudan-profile" }),

      // ---------------------------------------------------------
      // STAF PROTOKOL ROUTES
      // ---------------------------------------------------------
      route("staff-protokol/dashboard", "routes/dashboards/StafProtokolDashboard.tsx"),
      route("staff-protokol/agenda-pimpinan", "routes/staf-protokol/AgendaPimpinanStafProtokolPage.tsx"),
      route("staff-protokol/tugas-saya", "routes/staf-protokol/TugasSayaPage.tsx"),
      route("staff-protokol/tugas-detail/:id", "routes/staf-protokol/TugasDetailPage.tsx"),
      route("staff-protokol/laporan-kegiatan-staf", "routes/staf-protokol/LaporanKegiatanStafProtokolPage.tsx"),
      route("staff-protokol/profile", "routes/ProfilePage.tsx", { id: "staf-protokol-profile" }),

      // ---------------------------------------------------------
      // STAF MEDIA ROUTES
      // ---------------------------------------------------------
      route("staff-media/dashboard", "routes/dashboards/StafMediaDashboard.tsx"),
      route("staff-media/tugas-saya", "routes/staf-media/TugasSayaMediaPage.tsx"),
      route("staff-media/draft-berita", "routes/staf-media/DraftBeritaMediaPage.tsx"),
      route("staff-media/agenda-pimpinan", "routes/staf-media/AgendaPimpinanStafMediaPage.tsx"),
      route("staff-media/laporan-kegiatan", "routes/staf-media/LaporanKegiatanStafMediaPage.tsx"),
      route("staff-media/laporan-kegiatan/:id", "routes/staf-media/DetailLaporanStafMediaPage.tsx"),
      route("staff-media/draft-berita/:id", "routes/staf-media/DetailDraftBeritaPage.tsx"),
      route("staff-media/agenda", "routes/AgendaManagementPage.tsx", { id: "staf-media-agenda" }),
      route("staff-media/profile", "routes/ProfilePage.tsx", { id: "staf-media-profile" }),
      route("staff-media/laporan", "routes/LaporanPage.tsx", { id: "staf-media-laporan" }),

      // ---------------------------------------------------------
      // PEMOHON ROUTES
      // ---------------------------------------------------------
      route("pemohon/dashboard", "routes/dashboards/PemohonDashboard.tsx"),
      route("pemohon/riwayat-permohonan", "routes/pemohon/RiwayatPermohonanPage.tsx"),
      route("pemohon/submit-request", "routes/pemohon/SubmitRequestPage.tsx"),
      route("pemohon/profile", "routes/ProfilePage.tsx", { id: "pemohon-profile" }),
    ]),
  ]),

  // Catch-all
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;