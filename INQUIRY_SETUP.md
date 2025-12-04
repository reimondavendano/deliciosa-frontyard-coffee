# Deliciosa Inquiry Form Setup

## Email Integration Setup

The inquiry form now sends emails to **reimondavendano@gmail.com** and opens Facebook Messenger automatically.

### Step 1: Get Your Web3Forms Access Key

1. Go to [https://web3forms.com](https://web3forms.com)
2. Click "Get Started" or "Create Access Key"
3. Enter your email: **reimondavendano@gmail.com**
4. Verify your email
5. Copy the Access Key provided

### Step 2: Add the Access Key to Your Project

1. Open the file: `c:\Users\Admin\react\deliciosa\.env`
2. Add this line (replace with your actual key):
   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```

### Step 3: Update the Information Component

The component has been updated, but you need to replace the placeholder access key.

Open `components/Information.tsx` and find this line (around line 35):
```typescript
access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
```

Replace it with:
```typescript
access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '',
```

### Step 4: Restart the Development Server

After adding the environment variable:
1. Stop the current dev server (Ctrl+C)
2. Run `npm run dev` again

## How It Works

When someone submits an inquiry:

1. ✅ **Email is sent** to reimondavendano@gmail.com with all inquiry details
2. 💬 **Facebook Messenger opens** automatically with a pre-filled message containing the inquiry
3. 📱 The messenger link goes to: https://web.facebook.com/reimondavendano

## Facebook Messenger Integration

The Facebook Messenger integration uses the `m.me` link format:
- Profile: reimondavendano
- The inquiry details are pre-filled in the message
- Opens in a new tab automatically

## Testing

1. Fill out the inquiry form on your website
2. Click "Send Inquiry"
3. You should receive an email at reimondavendano@gmail.com
4. Facebook Messenger should open with the inquiry details

## Troubleshooting

- **Email not sending?** Check that your Web3Forms access key is correct
- **Messenger not opening?** Check browser popup blocker settings
- **Form not submitting?** Check browser console for errors

## Alternative: Using EmailJS (Optional)

If you prefer EmailJS instead of Web3Forms:

1. Sign up at [https://www.emailjs.com](https://www.emailjs.com)
2. Create an email service
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Update the code accordingly

---

**Note:** Web3Forms is free for up to 250 submissions per month. For higher volume, consider upgrading or using a different service.
