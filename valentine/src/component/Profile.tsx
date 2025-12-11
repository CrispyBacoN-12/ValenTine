// ใน Component Profile.tsx/jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [status, setStatus] = useState("กำลังโหลด...");
    
    // Endpoint ที่ Server Back-end จะตรวจสอบ JWT และส่งข้อมูลผู้ใช้กลับมา
    const PROFILE_API_URL = 'http://localhost:3000/api/user/profile'; 

    useEffect(() => {
        const token = localStorage.getItem('userAuthToken');
        if (!token) {
            setStatus("คุณไม่ได้ล็อกอิน");
            // นำกลับไปหน้า Login หากไม่มี Token
            navigate('/login'); 
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get(PROFILE_API_URL, {
                    headers: {
                        // 🚨 สำคัญ: ส่ง JWT Token ไปใน Authorization Header
                        'Authorization': `Bearer ${token}` 
                    }
                });
                setUserData(res.data);
                setStatus("แสดงข้อมูลส่วนตัว");

            } catch (error) {
                // หาก Token หมดอายุหรือ Server ปฏิเสธ
                setStatus("Session หมดอายุ หรือ Token ไม่ถูกต้อง");
                localStorage.removeItem('userAuthToken'); 
                navigate('/login');
            }
        };

        fetchProfile();
    }, [navigate]);

    if (!userData) {
        return <div className="card"><h2>{status}</h2></div>;
    }

    return (
        <div className="card">
            <h1>ข้อมูล Profile ส่วนตัว</h1>
            <p><strong>สวัสดีครับ/ค่ะ:</strong> {userData.greeting}</p>
            <p><strong>ชื่อ:</strong> {userData.name}</p>
            <p><strong>อีเมล:</strong> {userData.email}</p>
            <p><strong>สถานะการตรวจสอบ:</strong> {userData.message}</p>
        </div>
    );
};

export default Profile;