// how to store todos... in a file (todos.json)

// what operations do you need to perform
// 1. add
// 2. remove
// 3. update
// 4. show all the todos
// 5. Mark sometodo as completed or incomplete

const fs = require('fs')
const path = require('path')
const chalk = require('chalk');

const { Command } = require('commander');
const program  = new Command()

const filePath = path.join(__dirname, 'todos.json')



program
  .name('todo-cli')
  .description('A CLI based todo list')
  .version('0.8.0');

program
  .command('add')
  .description('Adds a todo')
  .argument('<string>', 'todo to add')
  .action(function(str){
    add(str);
  });

program.command('list')
  .description('Displays a list of all Todos')
  .action(function(){
    list()
  });

program.command('delete')
  .description('Deletes a todo at a specified index')
  .argument('<integer>', "index of todo to be deleted")
  .action(function(num){
    remove(num);
  })

program.command('update')
  .description('Updates a todo at a specified index')
  .argument('<integer>', "index of todo to be updated")
  .argument('<string>', "new todo")
  .action(function(num, todo){
    update(todo, num)
  })

program.command('done')
  .description('Marks a todo as complete')
  .argument('<integer>', "index of todo to be marked as complete")
  .action(function(num){
    done(num);
  })

program.command('undone')
  .description('Marks a todo as incomplete')
  .argument('<integer>', "index of todo to be marked as incomplete")
  .action(function(num){
    undone(num);
  })

program.parse();




function readTodos(){
    if(fs.existsSync(filePath)){        
        const data = fs.readFileSync(filePath, 'utf-8');
        const todos = JSON.parse(data);
        return todos    
    }
    else{
        return console.log(chalk.bold.red("todos.json doesn't exist"));
    }
}

function writeTodos(todos){
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));   
    // console.log(readTodos());
     
}


function add(todo) {
    if(todo.length === 0){
        console.log(chalk.bold.red(`Todo not specified.`));
        return;
    }
    const todos = readTodos();
    todos.todoList.push({task: todo, completed: false});
    writeTodos(todos);    
    console.log(chalk.bold.green(`Added todo: ${todo}`));
    
}

function list(){
    const todos = readTodos();
    if (todos.todoList.length === 0){
        console.log(chalk.bold.red('No todos found.'));
        return;
    }
    todos.todoList.forEach((todo, index) => {
        const status = todo.completed ? '[x]' : '[]';
        console.log(chalk.bold.yellow(`${index + 1}. ${status} ${todo.task}`));
        
    });
}


function remove(index){
    const todos = readTodos();
    if (index < 1 || index > todos.todoList.length){
        console.log(chalk.bold.red("Invalid index"));
        return;
    }
    const removed = todos.todoList.splice(index-1, 1);
    writeTodos(todos);
    console.log(chalk.bold.red(`Removed todo: ${removed[0].task}`));
    
}

function update(newTodo, index){      ///// classic error fix
    if(newTodo.length === 0){
        console.log(chalk.bold.red(`Updated Todo not specified.`));
        return;
    }
    const todos = readTodos();
    if (index < 1 || index > todos.length){
        console.log(chalk.bold.red("Invalid index"));
        return;       
    }

    todos.todoList[index - 1].task = newTodo;
    
    writeTodos(todos);
    console.log(chalk.bold.green(`Todo at ${index} updated to ${newTodo}`));    
}

function done(index){
    const todos = readTodos();
    if (index < 1 || index > todos.length){
        console.log(chalk.bold.red('Invalid index'));
        return;
    }
    todos.todoList[index-1].completed = true;
    writeTodos(todos);
    console.log(chalk.bold.green(`Marked todo ${index} as done`));
}

function undone(index){
    const todos = readTodos();
    if (index < 1 || index > todos.length){
        console.log(chalk.bold.red('Invalid index'));
        return;
    }
    todos.todoList[index-1].completed = false;
    writeTodos(todos);
    console.log(chalk.bold.green(`Marked todo ${index} as not done`));
}