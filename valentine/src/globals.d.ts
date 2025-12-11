// src/globals.d.ts

// 1. กำหนด Interface สำหรับออบเจกต์ 'id' โดยใส่ทุกเมธอดที่ใช้ลงไป
// เราจะใช้ชื่อที่ชัดเจนขึ้น เช่น GoogleIdentityIdService
interface GoogleIdentityIdService {
    initialize(config: { 
        client_id: string; 
        callback: (response: any) => void; 
        hosted_domain?: string;
        auto_select?: boolean; 
    }): void;
    
    renderButton(element: HTMLElement | null, config: any): void;
    prompt(): void;
    
    // ✅ เพิ่มเมธอดที่ทำให้เกิด Error (disableAutoSelect)
    disableAutoSelect(): void; 
    
    // เพิ่มเมธอดอื่น ๆ ที่คุณต้องการใช้ (เช่น revoke)
    revoke(callback: (response: { error: any }) => void): void;
}

// 2. ประกาศ Interface สำหรับออบเจกต์ 'accounts'
interface GoogleAccounts {
    id: GoogleIdentityIdService; // ใช้ Interface ที่เราสร้าง
}

// 3. ขยาย Global Window Interface เพื่อเพิ่ม property 'google'
// เราใช้การประกาศ interface Window ซ้ำได้ (Declaration Merging) 
// แต่ต้องมั่นใจว่า Type ที่กำหนดไม่ขัดแย้งกัน
interface Window {
    google: {
        accounts: GoogleAccounts; 
        // หากมี property อื่น ๆ ใน window.google ให้เพิ่มที่นี่
    };
}