## Register

post : http://localhost:4000/api/auth/signup

{
  "name": "Admin Pranav",
  "email": "adminprana@vtest.com",
  "password": "admin@123",
  "role": "admin"
}

{
    "msg": "User registered successfully"
}

post : http://localhost:4000/api/auth/login

{
  "name": "Customer Pranav",
  "email": "customerpranav@vtest.com",
  "password": "admin@123",
  "role": "customer"
}

{
    "msg": "User registered successfully"
}

## Login

post: http://localhost:4000/api/auth/login

{
    "email": "prana@vtest.com",
    "password": "admin@123",
}

{
    "msg": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU5MjMxNTk5LCJleHAiOjE3NTkzMTc5OTl9.0EqSZ4b4xJHi6bDRTXLrdqXRSH02_3IQLd1KOB613nk"
}

post: http://localhost:4000/api/auth/login

{
    "email": "pranavcust@vtest.com",
    "password": "admin@123",
}

{
    "msg": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzU5MjMxNjU1LCJleHAiOjE3NTkzMTgwNTV9.jTl46fKnEDXx33K6b1rt9nbvrHlP1O3-VX6HlTcX3ho"
}