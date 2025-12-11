import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { useAuth } from './component/Authcontext'; // 🚨 ตรวจสอบ Path ให้ถูกต้อง

// [Type Interface และ Global Constants]
interface CredentialResponse {
    credential: string; 
    select_by: string;
}
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const BACKEND_URL = 'http://localhost:3000/api/auth/google'; 

const GoogleLoginButton = () => {
    
    const navigate = useNavigate(); 
    // 🚨 ดึง isLoggedIn มาใช้เพื่อจัดการการ Redirect
    const { login, isLoggedIn } = useAuth(); 
    
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    // =================================================================
    // 🚨 1. Logic สำหรับ Redirect ถ้าล็อกอินอยู่แล้ว (แก้ปัญหาคลิก /login ซ้ำ)
    // =================================================================
    useEffect(() => {
        if (isLoggedIn) {
            // ถ้าล็อกอินอยู่แล้ว ให้เปลี่ยนหน้าไป Dashboard ทันที
            navigate('/dashboard', { replace: true });
        }
    }, [isLoggedIn, navigate]); // ใช้ isLoggedIn และ navigate เป็น Dependency

    // =================================================================
    // 2. Logic สำหรับ Callback เมื่อ Google ส่ง Token กลับมา
    // =================================================================
    const handleCredentialResponse = useCallback(async (response: CredentialResponse) => {
        setIsLoading(true);
        setLoginError(null);
        const idToken = response.credential;
        
        try {
            const res = await axios.post(BACKEND_URL, { token: idToken });
            
            console.log("Login Successful!", res.data);
            
            const serverToken = res.data.authToken;
            const userEmail = res.data.email;
            
            if (serverToken && userEmail) {
                // บันทึก Token ใน Local Storage
                localStorage.setItem('userAuthToken', serverToken); 
                localStorage.setItem('userEmail', userEmail); 
                
                // 🚨 อัปเดต Context State ทันที!
                login(userEmail); 
                
                setIsLoading(false);
                // navigate('/dashboard') จะถูกเรียกจาก useEffect ตัวบนเมื่อ isLoggedIn เปลี่ยน
            } else {
                 throw new Error("Server did not return authentication token.");
            }
        } catch (error) {
            setIsLoading(false);
            
            const errorMessage = axios.isAxiosError(error) 
                ? error.response?.data?.error || "Server rejected login." 
                : "An unexpected error occurred.";
                
            setLoginError(errorMessage);
            console.error("Login failed on server:", error);
            // ถ้า Login ล้มเหลว เราไม่ลบ Token (เพราะไม่มีอยู่แล้ว) และไม่ redirect
        }
    }, [login, navigate]); 


    // =================================================================
    // 3. Logic สำหรับ Google Initialization และ Render
    // =================================================================
    useEffect(() => {
        if (window.google && GOOGLE_CLIENT_ID) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });
            
            window.google.accounts.id.renderButton(
                document.getElementById("signInDiv"), // ต้องชี้ไปที่ DIV ที่ต้องการให้ปุ่มปรากฏ
                { theme: "filled_blue", size: "large", width: "280", text: "signin_with" }
            );
        }
    }, [handleCredentialResponse]); 


    // 🚨 ป้องกันการแสดงปุ่ม Login ถ้ากำลังจะ Redirect
    if (isLoggedIn) {
        return <div className="login-container card"><h2>เข้าสู่ระบบแล้ว... กำลังเปลี่ยนหน้า</h2></div>;
    }

    // =================================================================
    // 4. Component Render (ถ้ายังไม่ได้ล็อกอิน)
    // =================================================================
    return (
        <div className="login-container card">
             <h3>กรุณาล็อกอินด้วยบัญชีมหาวิทยาลัย</h3>
             {loginError && <p style={{color: 'red'}}>Error: {loginError}</p>}
             {isLoading && <p>กำลังตรวจสอบข้อมูล...</p>}
             {/* ปุ่ม Google จะถูก Render ลงใน Div นี้ */}
             <div id="signInDiv" style={{ opacity: isLoading || loginError ? 0.5 : 1 }}></div>
        </div>
    );
};

export default GoogleLoginButton;