const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Contact form email endpoint
// Required env vars: SMTP_USER (Gmail address), SMTP_PASS (Gmail App Password)
app.post('/api/contact', async (req, res) => {
    const { name, phone, caseType, email, message, lang } = req.body;

    if (!process.env.SMTP_PASS) {
        console.warn('SMTP_PASS not configured – email skipped');
        return res.status(503).json({ ok: false, error: 'Email not configured' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER || 'pardooren@gmail.com',
            pass: process.env.SMTP_PASS
        }
    });

    const isHe = lang === 'he';
    const subject = isHe
        ? `פנייה חדשה: ${name} – ${caseType}`
        : `New Contact: ${name} – ${caseType}`;

    const html = `
        <div dir="${isHe ? 'rtl' : 'ltr'}" style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#926d27">${isHe ? 'פנייה חדשה מאתר אלון פרדו' : 'New contact from Alon Pardo website'}</h2>
            <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;width:30%">${isHe ? 'שם' : 'Name'}</td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">${isHe ? 'טלפון' : 'Phone'}</td><td style="padding:8px;border-bottom:1px solid #eee">${phone}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">${isHe ? 'סוג התיק' : 'Case Type'}</td><td style="padding:8px;border-bottom:1px solid #eee">${caseType}</td></tr>
                ${email ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">${isHe ? 'אימייל' : 'Email'}</td><td style="padding:8px;border-bottom:1px solid #eee">${email}</td></tr>` : ''}
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top">${isHe ? 'פרטים' : 'Message'}</td><td style="padding:8px;border-bottom:1px solid #eee">${message.replace(/\n/g, '<br>')}</td></tr>
            </table>
        </div>`;

    try {
        await transporter.sendMail({
            from: `"Alon Pardo Website" <${process.env.SMTP_USER || 'pardooren@gmail.com'}>`,
            to: 'pardooren@gmail.com',
            subject,
            html
        });
        res.json({ ok: true });
    } catch (err) {
        console.error('Email send error:', err.message);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Root route serves the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// SEO-friendly practice area routes
app.get('/practice/criminal-lawyer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.get('/practice/traffic-lawyer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.get('/practice/administrative-lawyer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.get('/practice/employment-lawyer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.get('/practice/accessibility-lawyer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

// Legal and Policy Routes
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.get('/cookies', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.get('/disclaimer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.get('/accessibility-statement', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expertise.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});