<h1 align=center>💻 Ft_transcendence</h1>
<p align="center">
  <img src="img/transcendence.png?raw=true" alt="Ft_transcendence Project Image"/>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray" alt="DjangoREST"/>
	<img src="https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white" alt="Django"/>
	<img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"/>
	<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
	<img src="https://img.shields.io/badge/Vault-black?style=for-the-badge&logo=Vault" alt="Vault"/>
	<img src="https://img.shields.io/badge/ModSecurity-white?style=for-the-badge" alt="ModSecurity"/>
	<img src="https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
	<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
	<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
	<img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript"/>	
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/17bf9ca0-bb65-4fa5-8804-e756174a285f" alt="Ft_transcendence Project Image"/>
</p>
## About
>This project is about doing something you’ve never done before.
>Remind yourself of the beginning of your journey in computer science.
>Look at you now. Time to shine!

[Subject Ft_transcendence Project 42](en.subject.pdf)

The goal of this project is to develop a website for playing Pong in matches and tournaments.

## Features
- **Description**: A dynamic website that manages users and offers two games: Pong and Flappy Bird.
- **Feature**: 
	- Single Page Application (SPA) architecture.
	- **Backend**: Built with Django.
	- **Frontend**: Utilizes Bootstrap, CSS, HTML, and JavaScript.
	- **Database**: Powered by PostgreSQL.
	- User management or authentication with API42 integration.
	- Games: Pong and Flappy Bird with tournament modes.
	- AI for Pong gameplay.
	- Web Application Firewall (WAF) and Vault for secret management.
	- Two-Factor Authentication (2FA) and JSON Web Tokens (JWT).
	- Backend designed as a microservice.
	- Compatibility with Chrome and Firefox browsers.
- **How to Use**: Run the command `docker compose up --build` to start the server. Then access the website at `https://localhost:8443/`.

## Setup

**Clone the Repository**:

```bash
git clone git@github.com:acardona123/42_ft_transcendence.git
cd 42_ft_transcendence
```

## Usage
1. Copy each `.env.sample` file to create corresponding `.env` files, and fill them with sensitive information.
2. Build and start the server:
	```bash
	docker compose up --build
	```
3. Access the website via `https://localhost:8443/`

## Website Features:

- Games:
	- Play Pong or Flappy Bird in the following modes:
		- Tournament.
		- 1 vs 1.
		- Against AI.
- User Account Management:
	- Register with a username and password.
	- Register using your 42 account.
	- Secure login with Google Two-Factor Authentication.
	- Update your profile information.
- Social Features:
	- View match history and statistics.
	- Add and manage friends.

## Code Structure
![Structure Schema](img/schema.png)

## Overview
### 1. Main menu
![Main_menu_img](https://github.com/user-attachments/assets/ec7f3094-c1e7-4225-951f-8e50cab3a7b9)

### 2. Pong game
![Pong_game_img](https://github.com/user-attachments/assets/99c6cbf0-f376-43bd-84de-4fbfd944bec1)

### 3. Flappy bird duo game
![Flpayy_bird_game_img](https://github.com/user-attachments/assets/bc15f1c3-1b12-438f-800a-3296bfbaa74d)

### 4. Profile
![profile_img](https://github.com/user-attachments/assets/e09566a0-1223-43ea-9acc-870459144856)

### 5. Editing profile
![Edit_profile_img](https://github.com/user-attachments/assets/3fee432a-6e1f-4e3f-ba8c-a063d6437b89)

### 6. Tournaments
![ttournaments_img](https://github.com/user-attachments/assets/b7e46348-33fc-4f76-afdc-af1fd5e4fee3)

### 7. Double factor authentification
![2fa_img](https://github.com/user-attachments/assets/6ea865c9-1b39-4efa-9181-0b2e34cf1967)


