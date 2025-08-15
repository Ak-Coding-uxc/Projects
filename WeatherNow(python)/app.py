import requests

api_key = '4a97686454dbdcc34a104ce2f75b164d'
user_input = input("Enter city: ")
print(user_input)

weather_data = requests.get(
    f"https://api.openweathermap.org/data/2.5/weather?q={user_input}&units=metric&APPID={api_key}")

if weather_data.json()['cod'] == '404':
        print("No City Found")
else:

    weather = weather_data.json()['weather'][0]['main']
    temp = weather_data.json()['main']['temp']

    print(f"The weather in {user_input} is: {weather}")
    print(f'The temperature in {user_input} is: {temp}°C')


  