//dependencies
const fs = require('fs');
const inquirer = require('inquirer');
const open = require(`open`)

//team roles
const Manager = require('./lib/manager');
const Engineer = require('./lib/engineer');
const Intern = require('./lib/intern');

const generateHTML = require('./src/generateHTML');
const teamArr = [];

const createManager = () => {
    return inquirer.prompt([
    {
        type: 'input',
        message: 'Please enter the team manager’s name.',
        name: 'name',
        validate: (input) => {
            if (input) {
              return true;
            } else {
              console.log("Please enter the team manager’s name!");
              return false;
            }
          },
    },
    {
        type: `input`,
        message: `Please provide the team manager’s employee id.`,
        name: `id`,
        validate: (Input) => {
            if (Input) {
              return true;
            } else {
              console.log("Please provide the team manager’s employee id!");
              return false;
            }
          },
    },
    {
      type: `input`,
      message: `Please provide the team manager’s email address.`,
      name: `email`,
      validate: (Input) => {
          if (Input) {
            return true;
          } else {
            console.log("Please provide the team manager’s email address!");
            return false;
          }
        },
  },
  {
    type: `input`,
    message: `Please provide the team manager’s office number.`,
    name: `officeNumber`,
    validate: (Input) => {
        if (Input) {
          return true;
        } else {
          console.log("Please provide the team manager’s office number!");
          return false;
        }
      },
  },
    ])
    .then(managerInput => {
      const { name, id, email, officeNumber } = managerInput;
      const manager = new Manager (name, id, email, officeNumber);
      teamArr.push(manager);
      console.log(manager);
    })
};

const addEmployee = () => {
  return inquirer.prompt ([
        {
            type: 'list',
            name: 'role',
            message: "Please choose your employee's role",
            choices: ['Engineer', 'Intern']
        },
        {
            type: 'input',
            name: 'name',
            message: "What's the name of the employee?", 
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log ("Please enter the employee's name!");
                    return false; 
                }
            }
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the employee's ID.",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                console.log ("Please enter an employee's ID!");
                    return false; 
                }
           }
        },
        {
            type: 'input',
            name: 'email',
            message: "Please enter the employee's email.",
            validate: emailInput => {
                if (emailInput) {
                    return true;
                } else {
                    console.log ('Please enter an email!')
                    return false; 
                }
            }
        },
        {
            type: 'input',
            name: 'github',
            message: "Please enter the employee's github username.",
            when: (input) => input.role === "Engineer",
            validate: nameInput => {
                if (nameInput ) {
                    return true;
                } else {
                    console.log ("Please enter the employee's github username!")
                }
            }
        },
        {
            type: 'input',
            name: 'school',
            message: "Please enter the name of the intern's school",
            when: (input) => input.role === "Intern",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log ("Please enter the name of the intern's school!")
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmAddEmployee',
            message: 'Would you like to add more team members?',
            default: false
        }
    ])
    .then(employeeData => {
        // data for employee types 

        let { name, id, email, role, github, school, confirmAddEmployee } = employeeData; 
        let employee; 

        if (role === "Engineer") {
            employee = new Engineer (name, id, email, github);

            console.log(employee);

        } else if (role === "Intern") {
            employee = new Intern (name, id, email, school);

            console.log(employee);
        }

        teamArr.push(employee); 

        if (confirmAddEmployee) {
            return addEmployee(teamArr); 
        } else {
            return teamArr;
        }
    })
}

const writeFile = data => {
  fs.writeFile(`./dist/index.html`, data, err => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Team profiles page has successfully been generated")
      open(`./dist/index.html`);
    }
  })
}
 
createManager()
  .then(addEmployee)
  .then(teamArr => {
    return generateHTML(teamArr);
  })
  .then(pageHTML => {
    return writeFile(pageHTML);
  })
  .catch(err => {
 console.log(err);
  });
