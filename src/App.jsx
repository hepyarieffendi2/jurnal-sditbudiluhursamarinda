import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import GuruDashboard from './pages/GuruDashboard';
import KepsekDashboard from './pages/KepsekDashboard';
import FormJurnal from './pages/FormJurnal';
import ProfilMurid from './pages/ProfilMurid';
import TilawatiTracker from './pages/TilawatiTracker';
import PresensiPage from './pages/PresensiPage';
import IbadahHarian from './pages/IbadahHarian';
import AreaTracker from './pages/AreaTracker';
import LessonPlan from './pages/LessonPlan';
import ClassSetup from './pages/ClassSetup';
import CurriculumManager from './pages/CurriculumManager';
import StudentManager from './pages/StudentManager';
import DailyJournal from './pages/DailyJournal';
import CommandCardGenerator from './pages/CommandCardGenerator';
import DisiplinPositifPage from './pages/DisiplinPositifPage';
import UserManagement from './pages/UserManagement';
import LaporanSekolah from './pages/LaporanSekolah';
import KumerMapping from './pages/KumerMapping';
import StudentReport from './pages/StudentReport';
import CurriculumTimeline from './pages/CurriculumTimeline';
import DashboardLayout from './components/DashboardLayout';
import { useAuth, ROLES, canManageAccounts, isKepsek } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

// Role-based route guard
const RoleRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
    return children;
};

// Smart Dashboard — routes to the correct dashboard based on role
const SmartDashboard = () => {
    const { user } = useAuth();
    if (user?.role === ROLES.KEPSEK) return <KepsekDashboard />;
    return <GuruDashboard />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route (Tanpa Sidebar/Layout) */}
                <Route path="/login" element={<LoginPage />} />

                {/* Internal Routes (Dengan Sidebar/Layout Bersama) */}
                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Smart Dashboard — auto-detects role */}
                    <Route path="/dashboard" element={<SmartDashboard />} />

                    {/* Guru & Kurikulum — daily input pages */}
                    <Route path="/presensi" element={<PresensiPage />} />
                    <Route path="/ibadah" element={<IbadahHarian />} />
                    <Route path="/eksplorasi" element={<AreaTracker />} />
                    <Route path="/tilawati" element={<TilawatiTracker />} />
                    <Route path="/murid/:id" element={<ProfilMurid />} />
                    <Route path="/observasi/baru" element={<FormJurnal />} />
                    <Route path="/setelan-rak" element={<Navigate to="/eksplorasi?mode=kelola" />} />
                    <Route path="/jurnal-harian" element={<DailyJournal />} />

                    {/* Administration pages */}
                    <Route path="/manajemen-kurikulum" element={<CurriculumManager />} />
                    <Route path="/students" element={<StudentManager />} />
                    <Route path="/cetak-lkpd" element={<CommandCardGenerator />} />
                    <Route path="/disiplin-positif" element={<DisiplinPositifPage />} />

                    {/* Kurikulum & Kepsek only — account management & mapping */}
                    <Route path="/manajemen-akun" element={
                        <RoleRoute allowedRoles={[ROLES.KURIKULUM, ROLES.KEPSEK]}>
                            <UserManagement />
                        </RoleRoute>
                    } />

                    <Route path="/mapping-kumer" element={
                        <RoleRoute allowedRoles={[ROLES.KURIKULUM, ROLES.KEPSEK]}>
                            <KumerMapping />
                        </RoleRoute>
                    } />

                    <Route path="/timeline" element={<CurriculumTimeline />} />

                    <Route path="/rapor/:id" element={<StudentReport />} />

                    {/* Kepsek only — school reports */}
                    <Route path="/laporan" element={
                        <RoleRoute allowedRoles={[ROLES.KEPSEK, ROLES.KURIKULUM]}>
                            <LaporanSekolah />
                        </RoleRoute>
                    } />
                </Route>

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
