import qrcode

str=" Aman is a great boy"

data= str

photo = qrcode.make(data)

photo.save("string.png")

