<<<<<<< HEAD
\# Notesbook - Note Taking Application



Notesbook is a secure note-taking backend application built with Java 25 and Spring Boot 4.x. 

It uses JWT authentication to ensure that each user can safely register, login, and manage personal notes.



\## Features



\- \*\*User Authentication\*\*: Secure registration and login using JWT (JSON Web Tokens)

\- \*\*Password Encryption\*\*: BCrypt password encoding for enhanced security

\- \*\*Note Management\*\*: Create, read, update, and delete notes

\- \*\*User-Specific Notes\*\*: Each user can only access their own notes

\- \*\*RESTful API\*\*: Well-structured API endpoints for all operations

\- \*\*CORS Support\*\*: Configured for frontend integration



\## Tech Stack



\### Backend

\- \*\*Java 25\*\*

\- \*\*Spring Boot 3.x\*\*

\- \*\*Spring Security\*\* with JWT authentication

\- \*\*Spring Data JPA\*\* for database operations

\- \*\*MySQL\*\* database

\- \*\*Maven\*\* for dependency management



\### Dependencies

\- Spring Boot Starter Web

\- Spring Boot Starter Data JPA

\- Spring Boot Starter Security

\- MySQL Connector

\- JJWT (JSON Web Token)

\- BCrypt Password Encoder



\*\*Security Notice:\*\* Do NOT commit `application.properties` to public repositories as it may contain sensitive credentials. 

This file is ignored by Git via `.gitignore`.



\## Project Structure

notesbook/

├── src/main/java/com/example/notesbook/

│ ├── NotesbookApplication.java # Main application class

│ ├── config/

│ │ └── SecurityConfig.java # Security configuration

│ ├── controller/

│ │ ├── AuthController.java # Authentication endpoints

│ │ ├── JwtAuthFilter.java # JWT filter for requests

│ │ └── NotesController.java # Note CRUD operations

│ ├── entity/

│ │ ├── Note.java # Note entity

│ │ └── User.java # User entity

│ ├── repository/

│ │ ├── NoteRepository.java # Note data access

│ │ └── UserRepository.java # User data access

│ └── security/

│ └── JwtUtil.java # JWT utility methods

├── src/main/resources/

│ ├── application.properties # Application configuration

│ └── static/ # Static frontend files

│ ├── index.html # Login/Register page

│ ├── dashboard.html # Notes dashboard

│ └── js/main.js # Frontend JavaScript

└── pom.xml # Maven dependencies

=======
# Notesbook
Notesbook - Note Taking Application
>>>>>>> 889428747fb68b2a1d43db18695026145895bf51
