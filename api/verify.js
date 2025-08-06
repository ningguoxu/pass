// api/verify.js - Vercel API 路由
export default function handler(req, res) {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // 从环境变量获取配置
        const CORRECT_PASSWORD = process.env.ACCESS_PASSWORD;
        const TARGET_URL = process.env.TARGET_URL;
        
        // 检查环境变量是否设置
        if (!CORRECT_PASSWORD || !TARGET_URL) {
            console.error('Missing environment variables');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        
        const { password } = req.body;
        
        // 验证请求数据
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        
        // 验证密码
        if (password === CORRECT_PASSWORD) {
            return res.status(200).json({ 
                success: true, 
                url: TARGET_URL,
                message: 'Access granted'
            });
        } else {
            // 记录失败的登录尝试（可选）
            console.log(`Failed login attempt from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
            
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password'
            });
        }
        
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}