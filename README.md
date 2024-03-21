1. To start the project:
   npm start
2. User routes
   [POST]localhost:3001/users
   [GET]localhost:3001/users?phone=01749896582
   [PUT]localhost:3001/users
   [DELETE]localhost:3001/users?phone=01749896582

   User Object:
   {
   "firstName": "Pavel",
   "lastName" : "Parvez",
   "phone": "01749896582",
   "password": "1234",
   "tosAgreement": true
   }

3. Token routes
   [POST]localhost:3001/tokens
   [GET]localhost:3001/tokens?id=ynk8eisdeetpkqe7j5nj
   [PUT]localhost:3001/tokens
   [DELETE]localhost:3001/tokens?id=ynk8eisdeetpkqe7j5nj

   Token Object
   {
   "phone": "01749896582",
   "password": "1234"
   }
   Edit:
   {
   "extend": true,
   "id": "bfx1r7ubysf7n7jq8d4r"
   }

   Header:-> token: w3mh0au6hduvaduryn0m

4. Check/Link routes
   [POST]localhost:3001/checks
   [GET]localhost:3001/checks?id=4ajn87dm0pxqtd7qvik3
   [PUT]localhost:3001/checks
   [DELETE]localhost:3001/checks?id=4ajn87dm0pxqtd7qvik3

   Check Object
   {
   "protocol": "http",
   "url": "yahoo.com",
   "method": "GET",
   "successCodes": [200, 201, 301],
   "timeoutSeconds": 2
   }

   {
   "url": "facebook.com",
   "id": "knhqh27fef2ujbtplcc1"
   }

5. To enable notification system, signup/login to twilio api and get this configuration stuff.
   { // signup/login for below credintial
   fromPhone: '',
   accountSid: '',
   authToken: '',
   }
