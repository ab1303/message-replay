Asp.Net Core React Message Replay POC

===================

## Prerequisites:

- [.NET Core 3.1]
- [Node.js](https://nodejs.org/en/) version 6 (or later)
- Yarn (Package manager for javascript libraries.. optional if you plan to use npm)

## How to run the Utility

- There are two parts to the application FrontEnd and Backend and accordingly two folders are created in the root folder. You will
  need to install to dependencies for each
- Download the zip package or clone this repo
- Install all the dependencies of both (packages)
- Both frontend and backend communicate with each other and hence both must be running at the sametime.

#### FrontEnd Install

    Go to folder FrontEnd

    - Install dependencies
       > yarn (if yarn is already installed, otherwise you might need to install it)

or

       > npm intall

- Run the project
  npm run start
- This should open a url at http://localhost:8080

#### Backend Install

    - Open Visual Studio Solution
    - Install all packages and build solution
    - Run project with "utility" configuration..
    - This should open a url at http://localhost:8081
     > dotnet run

#### Application Setup

    - Application makes the call on the provided app settings which are
    - Application Base Url


## Docker Setup

`docker-compose up --build`