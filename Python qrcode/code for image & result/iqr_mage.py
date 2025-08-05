import qrcode

src= "https://drive.google.com/file/d/16OjOVaUXThKXAEtstMoxbDvvWdoSoS7j/view?usp=sharing" #source

qr_img = qrcode.make(src)

qr_img.save("try.jpg")

''''
#steps using perplexity:-

To create a QR code for an image stored in your Google Drive, follow these steps:

1. **Get the Shareable Google Drive Link:**
   - In Google Drive, right-click your image and choose **Share**.
   - Under "General access," change permission to **Anyone with the link can view**.
   - Click **Copy link** to copy the shareable URL.

2. **Generate the QR Code:**

   *Online Method (Simple & Free):*
   - Go to any online QR code generator (such as The QR Code Generator, QRCodeDynamic, or Pageloot).
   - Paste your copied Google Drive image link into the link or URL field.
   - Customize the QR code (optional), and download the generated QR code image to your device[1][2][3].

   *Python Method (for automation, using qrcode library):*
   ```python
   import qrcode

   link = "PASTE_YOUR_GOOGLE_DRIVE_LINK_HERE"
   qr_img = qrcode.make(link)
   qr_img.save("qr_code_for_drive_image.jpg")
   ```
   Replace `"PASTE_YOUR_GOOGLE_DRIVE_LINK_HERE"` with your actual Google Drive image link.

**Note:**  
- Anyone scanning the QR code will be able to view or download the image (as long as permission is set to "Anyone with the link can view").
- If you want to share with selected people only, keep the sharing permissions limited.

This is the standard and most effective way of creating a QR code that allows others to access your image in Google Drive[1][2][3].

[1] https://www.the-qrcode-generator.com/google-drive-qr-code
[2] https://pageloot.com/google-drive-qr-code-generator/
[3] https://qrcodedynamic.com/blog/how-to-create-a-qr-code-for-a-google-drive-folder/
[4] https://workspace.google.com/marketplace/app/dynamic_qr_code_file_sharing_for_drive/878471720006
[5] https://trueqrcode.com/convert/google-drive-to-qr-code/
[6] https://me-qr.com/qr-code-generator/google-doc
[7] https://myqrcode.com/qr-code-generator/google-drive
[8] https://www.uniqode.com/blog/qr-code-for-productivity/how-to-make-a-google-drive-qr-code
[9] https://www.youtube.com/watch?v=kjtJS3yKLeU
[10] https://support.google.com/drive/thread/15739054/how-can-generat-link-qr-code?hl=en
'''

