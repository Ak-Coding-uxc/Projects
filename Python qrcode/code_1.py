import qrcode 

data= "https://www.google.com/"

img=qrcode.make(data) 

img.save("hello.png")

# optinal

qr = qrcode.QRCode(
    version=1,  # 1 is smallest QR code. Higher numbers = more data/larger image.
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction (H)
    box_size=10,  # How many pixels each "box" is
    border=4,     # How many boxes thick the border should be
)
qr.add_data(data)
qr.make(fit=True)

img = qr.make_image(fill_color="darkblue", back_color="white")
img.save("custom_qrcode.png")


'''
#steps
1} First type this in terminal
    || pip install qrcode[pil] ||
    (pil stands for pillow.)

2} import qrcode library.

3} paste link or type in text in quotes('',"") in variable ,name as data.
     ex:-  data = "www.google.com"

4} Make another variable img and by using |make| method generate qrcode.
     ex:- img = qrcode.make(data)

5} Now save img as png.
     ex:- img.save("name.png")

'''

