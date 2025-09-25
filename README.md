## Basic Authentication Demo

This project is a demo of using node.js and redis to store user credentials and control access to a rest endpoint. It is not at all ready for production, but it does demonstrate some of the main ideas. 

## How to Run the App

1. 
[![Open the project in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/beep-patrick/basic-auth)
Alternatively you can clone this repository and run this project anywhere you can run a containerized application. 

2. Start the app

```bash
docker-compose up -d 
````

3. This will start up the node.js service as well as a redis instance in a separate container. Once started, the app will be available at `http://localhost:3000`.

4. You can make REST requests using curl on the terminal, or with a tool like postman.

#### Example: Create a User

To create a user, send a POST request to `/users` with a JSON body containing `username` and `password`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "SuperSecretPassword123"}' \
  http://localhost:3000/users
````

#### Example: Access the Root Endpoint that requires basic authentication

The root endpoint (/) is protected by basic authentication. Use your new credentials to access it like this:

```bash
curl -u alice:SuperSecretPassword123 http://localhost:3000/
````

If authentication succeeds, you'll receive a welcome message and a 200 response. If not, you'll get a 401 error response. 

---

## Is this even a good idea?

Unless authentication and identity is the core business value we are trying to deliver, I'd avoid doing credential management ourselves and use some third party cloud service provider. 

If this system is being used to control access to internal tools for a business, I'd make sure that we integrate with the company's existing employee identity provider instead. That way you can more easily deal with the whole lifecycle of a user's access. For instance you can revoke access automatically when a user is no longer an employee, and you can control access based on membership to an active directory group. 

Of course this is just an exercize, so I'm probably taking this too seriously 😊.

## Password complexity best practices

- [x] Passwords should be at least 12 characters long
- [x] Allow all printable ASCII and Unicode characters
- [x] Avoid composition rules (e.g., requiring uppercase, numbers, symbols)
- [ ] Block commonly used, leaked, or easily guessable passwords 
- [ ] Prefer multi-factor authentication over single factor authentication

These password complexity requirements are based on [OWASP's Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

## Necessary improvements for production use

- Right now the user registration endpoint is completely unauthenticated. We would need a way to controll access to user registration. Right now anyone can create a new user and use their credentials right away.

- Transport security. Enforce HTTPS for all API requests. Right now all of the requests to the API, including those that have passwords in plain text, are transmitted over the wire unencrypted. This means that those passwords can be stolen by anyone who intercepts the communication. 

- Access control in addition to authentication. If this service is used internally for a company, we can reduce the attack surface area substantially by making sure that only other known services can even connect to the service in the first place instead of putting it on the internet.

- Add a way to revoke a user's access. Right now once you are a user, you're a user forever. 

- Add a way to change your password.

- Add a way to notify users that they should change their password. I wouldn't want to force people to unnecessarily rotate their credentials, but it would be pretty important to be able to request password change in the event that there was a data leak. 

- Protection against DOS or DDOS attack. Right now there is nothing preventing someone from hammering this service and making it unavailable for others. 

- Throttling or rate limiting (maybe exponential backoff?) for failed attempts to use basic authentication for the same user. Right now an attacker could use brute-force to guess a password.

- Logging. In particular there should probably be audit logging for creation of users. 

- Service health montioring. It's important to know if the service goes down, and to be able to recover. 

- Backups. 

- Continuous Integration, and software development processes for the repostiory. Who can make changes to this service's code? Where are bugs tracked? How do we manage vulnerabilities found in node packages or container images that are being used? If this is to be used in a production environment it needs someone or some group to be it's caretaker.

- Scaling. You'd have to make sure that the service can scale up to meet the demands you put on it. You might have to consider redis connection availability, and you might have to add instances and have a load ballancer. (Or more realistically you might want to just get a third party service provider to do all of this for you so you can focus on your main business.) 

## Further improvements I'd recommend
- Use multiple factors of authentication instead of a simple username and password scheme

- Use token based authentication instead of basic authentication.

- If there is a UI provided for user registration, I'd suggest implementing password strength meters and user guidance to promote strong password creation.

- Add a mechanism for rejecting common passwords (like 'password1234') and passwords with low entropy (like 'aaaaaaaaaaaa'). There are some libraries in the node ecosystem that can help with this including 'passablewords' and 'zxcvbn'.
