import random;

a = int(input("Enter Lower Bound:- "))
b = int(input("Enter Upper Bound:- "))

ranNum = random.randint(a,b)

guessNum = 0
i = 0

while(guessNum != ranNum):
    guessNum = int(input("Enter Guess Number:- "))
    i = i + 1
    if(guessNum == ranNum):
        print("Congratulations!")
        break

    if(guessNum > ranNum):
        print("Try Again! You guessed too high")

    if(guessNum < ranNum):
        print("Try Again! You guessed too low")


print(f"You guess Number after {i} Time")

