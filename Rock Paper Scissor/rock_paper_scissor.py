import random
comp_win = 0
user_win = 0

while True:
    comp = random.randint(1,3)

    print("\n")
    user = int(input("Available Choices:\n(1 => Rock , 2 => Paper , 3 => Scissor)\nEnter your choice: "))

    user_choice = 0
    comp_choice = 0

    if user == 1:
        user_choice = "Rock"

    elif(user == 2):
        user_choice = "Paper"
    elif(user == 3):
        user_choice = "Scissor"

    if comp == 1:
        comp_choice = "Rock"
    elif(comp == 2):
        comp_choice = "Paper"
    elif(comp == 3):
        comp_choice = "Scissor"

    print("\n")
    print(f'User choice: {user_choice}')
    print(f'Comp chice: {comp_choice}')
    if(user == comp):
        print("IT's Tie!")
    elif(user == 1 and comp == 3) or (user == 2 and comp == 1) or (user == 3 and comp == 2):
        print("You are the winner")
        user_win += 1
    else:
        print("Computer is the winner")
        comp_win += 1
    

    if(user_win == 5):
        print("\n")
        print("You are the WINNER!")
        print(f'You win = {user_win} and computer win = {comp_win}')
        quit()

    if(comp_win == 5):
        print("\n")
        print("You are the LOSSER!")
        print(f'computer win = {comp_win} and You win = {user_win}')
        quit()


