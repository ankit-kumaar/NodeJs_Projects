import json

file = open("login.json","r")
login = file.read()
file.close()

loginDetails = json.loads(login)
print (loginDetails)