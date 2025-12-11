// ใน Component Dashboard.tsx/jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 👈 นำเข้า Link
// ... (imports อื่นๆ)

const Dashboard = () => {
    // ... (State และ Logic สำหรับดึงข้อมูล Profile - ตามที่แนะนำก่อนหน้านี้)
    const [profile, setProfile] = useState("กำลังโหลดข้อมูล...");
    const [userEmail, setUserEmail] = useState(''); // State สำหรับเก็บอีเมลผู้ใช้

    useEffect(() => {
        // ... (Logic เดิมสำหรับดึง Token และดึงข้อมูล profile)
        const email = localStorage.getItem('userEmail'); // ดึงอีเมลที่เก็บไว้ตอนล็อกอิน
        if (email) {
            setUserEmail(email);
        }
    }, []); 

    return (
        <div className="card">
            <h1>Dashboard ส่วนตัว</h1>
            <p>{profile}</p>

            <hr />

            {/* 🚨 ปุ่มสำหรับไปหน้า Profile */}
            <h3>ข้อมูลส่วนตัว</h3>
            <p>ล็อกอินด้วย: {userEmail}</p>
            <Link to="/profile">
                <button>
                    ดูข้อมูล Profile ของฉัน
                </button>
            </Link>
        </div>
    );
};
export default Dashboard;