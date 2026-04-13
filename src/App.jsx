import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import GuruDashboard from './pages/GuruDashboard';
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
import DashboardLayout from './components/DashboardLayout';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
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
                    <Route path="/dashboard" element={<GuruDashboard />} />
                    <Route path="/presensi" element={<PresensiPage />} />
                    <Route path="/ibadah" element={<IbadahHarian />} />
                    <Route path="/eksplorasi" element={<AreaTracker />} />
                    <Route path="/tilawati" element={<TilawatiTracker />} />
                    <Route path="/murid/:id" element={<ProfilMurid />} />
                    <Route path="/observasi/baru" element={<FormJurnal />} />
                    <Route path="/rencana" element={<LessonPlan />} />
                    <Route path="/setelan-rak" element={<ClassSetup />} />
                    <Route path="/manajemen-kurikulum" element={<CurriculumManager />} />
                    <Route path="/students" element={<StudentManager />} />
                    <Route path="/jurnal-harian" element={<DailyJournal />} />
                    <Route path="/cetak-lkpd" element={<CommandCardGenerator />} />
                    <Route path="/disiplin-positif" element={<DisiplinPositifPage />} />
                </Route>

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
