# Quick Setup Instructions

## 🚀 To Enable Email Sending

1. **Get your FREE Web3Forms Access Key:**
   - Visit: https://web3forms.com
   - Enter your email: reimondavendano@gmail.com
   - Verify your email and copy the access key

2. **Add the key to your .env file:**
   ```bash
   # Open .env file and add this line:
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=paste_your_key_here
   ```

3. **Restart the dev server:**
   ```bash
   # Press Ctrl+C to stop the current server
   npm run dev
   ```

## ✅ What's Already Working

- ✅ Form collects: Name, Email, Phone, Event Date, Message
- ✅ Facebook Messenger integration (opens automatically with inquiry details)
- ✅ Email sending code (just needs the access key)
- ✅ Loading state while submitting
- ✅ Form validation

## 📧 Email Destination

All inquiries will be sent to: **reimondavendano@gmail.com**

## 💬 Facebook Messenger

Opens to: **https://web.facebook.com/reimondavendano**

---

**Note:** The form will still work without the access key - it will just open Facebook Messenger. Once you add the key, it will also send emails!
