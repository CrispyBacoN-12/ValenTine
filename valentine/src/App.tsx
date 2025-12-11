import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import GoogleLoginButton from './google-button.tsx'; 
// 🚨 นำเข้า Component Dashboard และ Profile ที่แท้จริงจาก component/
import Dashboard from './component/Dashboard'; 
import Profile from './component/Profile'; // (แก้ไขชื่อไฟล์เป็น .tsx ถ้าเป็น TS)
import ProtectedRoute from './component/ProtectedRoute.tsx'; 
import  {AuthProvider}  from './component/Authcontext.tsx';
import './App.css';

// 1. Component หน้าหลัก (Home)
function Home() {
  return (
    <div className="card">
      <h1>Valentine</h1>
      {/* ลิงก์ไปยังหน้าล็อกอิน */}
      <Link to="/login">
        <button>ไปหน้าล็อกอิน</button>
      </Link>
    </div>
  );
}

// 🚨 หมายเหตุ: เราลบ function Dashboard() ที่ประกาศซ้ำออกไปแล้ว

function App() {
  return (
  <AuthProvider>
    <BrowserRouter>
      {/* เมนูนำทางง่ายๆ */}
      <nav>
        <Link to="/">หน้าหลัก</Link> | <Link to="/login">ล็อกอิน</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      
      {/* กำหนดเส้นทางต่างๆ */}
      <Routes>
        {/* เส้นทางสาธารณะ */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GoogleLoginButton />} /> 
        
        {/* 🛡️ เส้นทางส่วนตัว: ห่อหุ้มด้วย ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
            {/* เส้นทางเหล่านี้จะเข้าได้ก็ต่อเมื่อมี userAuthToken ใน Local Storage เท่านั้น */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} /> 
        </Route>
        
        {/* 404 Page */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
</AuthProvider>
  )
}

export default App;