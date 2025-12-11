// ไฟล์: ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Authcontext'; // 👈 นำเข้า useAuth

const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth(); // 👈 ดึงสถานะ isLoggedIn จาก Context
    
    // 1. ถ้า isLoggedIn เป็นจริง: อนุญาตให้เข้าถึง Component ลูก
    if (isLoggedIn) {
        return <Outlet />; 
    }
    
    // 2. ถ้า isLoggedIn เป็นเท็จ: บังคับเปลี่ยนเส้นทางไปยังหน้า Login
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;