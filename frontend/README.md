<!-- @format -->

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

No AI tools were used for code snippets -- However ChatGPT has been used for consultation on project structure and certain node packages such as 'node-localstorage'.

# NOTE -- For this project to work correctly, you need to make sure you have a .env file containing the REACT_APP_API_URL in the root folder of the frontend project

frontend/.env === REACT_APP_API_URL=http://localhost:4000

## How to start the frontend app

Navigate to the frontend project directory in your terminal.

Start by installing the necessary node modules through the terminal command.

### `npm i`

The following script:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Frontend Functionality

The frontend tooling is based on the simple UI library 'Material UI'.

#### Fetch all users

By default, all employees currently stored in the database (backend localstorage) will be presented on the initial render of the app.

By pressing the 'Search' button without any search arguments provided in the search field, you will refetch all available employees.

#### Search for a specific user

- Using the search bar, you are able to input a single string consisting of search arguments.
- Once you are satisfied with your input, you may press the 'Search' button to filter the presented employees in the directory.
- The search functionality will match to any of the employees data fields, meaning that you are free to search 'id', 'name', 'surname', or 'email'.

#### Add Employee

- Press the 'Add Employee' button to toggle the 'Add New Employee Screen'
- Fill in all of the provided input fields
- When you are satisfied with your input, press the 'Add' button to send a POST request to add the employee to the database.

#### Delete Employee(s)

- Select one or more employees which you wish to remove from the database.
- Press the 'Delete Selected' button.
- Confirm that you wish to delete the selected users.
