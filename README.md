# Back-End Developer Task: Secure REST API for User Authentication
Develop a secure REST API for user authentication and payments using Node.js,
Express/NestJS, Passport.js, JWT, and a payment gateway.

## Tech Stack

- NestJS
- Passport.js for authentication
- jwt for secure token-based authentication 
- PostgreSQL (Prisma) for database management
- Bcrypt.js for password hashing
- Stripe for payment integration

## Endpoints to Implement:
○ POST /auth/register → Register a new user (store hashed password) [No rate limit]
  - body 
  ```bash
{
    "email":"string",
    "password":"string"
}
  ```
○ POST /auth/login → Authenticate user (return JWT token using passport local strategy) [in 5 min maximum 3 request]
  - body 
  ```bash
{
    "email":"string",
    "password":"string"
}
  ```
○ GET /auth/me → Fetch logged-in user details (protected route using passport jwt strategy) [in 1 sec maximum 15 request]
    - Bearer Token(accessToken)
○ POST /payments/checkout → Simulate a payment (store transaction
details) (protected route using passport jwt strategy) [in 5 min maximum 2 request]
    - Bearer Token(accessToken)
    - body 
  ```bash
{
    "amount":40,
    "currency":"usd"
}
  ```

