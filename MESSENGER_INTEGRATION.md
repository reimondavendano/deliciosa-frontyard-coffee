# 📱 Facebook Messenger Integration Details

## How the Messenger Link Works

The inquiry form uses the Facebook Messenger URL format to automatically open a chat with pre-filled content.

### Your Facebook Profile
**URL:** https://web.facebook.com/reimondavendano
**Username:** reimondavendano

### Messenger Link Format
```
https://m.me/reimondavendano?text=[encoded_message]
```

## What Happens When Someone Submits an Inquiry

1. **Form Submission** → User fills out the inquiry form
2. **Email Sent** → Email goes to reimondavendano@gmail.com
3. **Messenger Opens** → New tab opens with Messenger
4. **Pre-filled Message** → The inquiry details are already typed in
5. **User Sends** → Customer just needs to click "Send" in Messenger

## Message Format in Messenger

When Messenger opens, the customer will see this pre-filled message:

```
🍽️ NEW INQUIRY - Deliciosa Food Products

👤 Name: John Doe
📧 Email: john@example.com
📱 Phone: 0927 123 4567
📅 Event Date: 2025-12-25

💬 Message:
I would like to book your venue for a birthday party...
```

## Benefits of This Approach

✅ **Dual Notification System**
- You get an email (permanent record)
- You get a Messenger message (instant notification)

✅ **Customer Convenience**
- One-click submission
- Automatic Messenger connection
- No need to copy/paste information

✅ **Fallback System**
- If email fails, Messenger still works
- Ensures you never miss an inquiry

## Testing the Messenger Link

You can test the Messenger link manually:

1. Open this URL in your browser:
   ```
   https://m.me/reimondavendano
   ```

2. Or with a test message:
   ```
   https://m.me/reimondavendano?text=Test%20message
   ```

## Customization Options

If you want to change the Messenger behavior:

### Change the Facebook Profile
Edit line 60 and 86 in `components/Information.tsx`:
```typescript
const messengerUrl = `https://m.me/YOUR_USERNAME?text=${encodeURIComponent(messengerMessage)}`;
```

### Change the Message Format
Edit lines 22-32 in `components/Information.tsx` to customize the pre-filled message format.

### Disable Messenger (Email Only)
Remove or comment out lines 59-61 and 86-87 in `components/Information.tsx`.

## Browser Compatibility

The Messenger link works on:
- ✅ Desktop browsers (opens Messenger web)
- ✅ Mobile browsers (opens Messenger app if installed)
- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)

## Privacy & Security

- ✅ No data stored on your website
- ✅ Customer controls what they send via Messenger
- ✅ Message is pre-filled but not auto-sent
- ✅ Customer can edit before sending

## Troubleshooting

**Messenger doesn't open?**
- Check browser popup blocker settings
- Allow popups for localhost:3000

**Wrong Facebook profile?**
- Verify the username in the URL
- Check that the profile is public

**Message not pre-filled?**
- Check browser console for errors
- Verify URL encoding is working

---

**Current Configuration:**
- Email: reimondavendano@gmail.com
- Messenger: https://m.me/reimondavendano
- Profile: https://web.facebook.com/reimondavendano
