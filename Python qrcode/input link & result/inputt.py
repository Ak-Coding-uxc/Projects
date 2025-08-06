import qrcode as qr

link = input("Paste link here:- ")

img = qr.make(link)

img.save("input_image.png")

