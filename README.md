# RunnerBay

# Group 2 Project - Jose Guerrero, Julian A Legere, Jesus Alberto Pinales, Bianca L Perez

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of Node.js and npm
- You have installed Git

### Hot Fix
If having issues running web application

1. Once in cd runner-bay, remove the last package-lock.json

2. npm install again

Web app should run now.


### Installation

1. Open your terminal. 

2. Clone the repository:
    ```bash
    git clone https://github.com/jguerrero104/runner-bay.git
    ```
**Make sure to clone the repository in a directory that you will remember.**

3. Navigate to the project directory:
    ```bash
    cd runner-bay
    ```

4. Install the dependencies:
    ```bash
    npm install
    ```

5. Starting the Frontend
    ```bash
    npm start
    ```

6. Navigate to the Server directory:
   ```bash
   cd runner-bay/server
   ```

7. Install server dependices
   ```bash
   npm install
    ```

8. Start the Backend Server: Return to the root directory and start the server:
   
   cd..
   ```bash
   runner-bay> node server/
   
   Expected output:
   
   Connected to MySQL database
   Server running on port 3001
   ```

9. Go back to frontend browser
   

## Making Changes

1. Create a new branch:
    ```bash
    git checkout -b branch-name
    ```
    Replace `branch-name` with a name that describes the changes you're about to make.

2. Make your changes.

3. Stage your changes:
    ```bash
    git add .
    ```

4. Commit your changes:
    ```bash
    git commit -m "commit message"
    ```
    Replace `commit message` with a brief message about the changes you've made.

5. Push your changes to GitHub:
    ```bash
    git push origin branch-name
    ```
    Replace `branch-name` with the name of your branch.

6. Open a pull request on GitHub.
    - Go to the repository on GitHub.
    - Click on the 'Pull requests' tab.
    - Click on the 'New pull request' button.
    - In the 'base' dropdown, select the branch you want to merge your changes into. This is the `master` branch.
    - In the 'compare' dropdown, select the branch that contains the changes you've made.
    - Click on the 'Create pull request' button.
    - Add a title and description for the pull request, then click on 'Create pull request' again.


