// import {format} from 'date-fns';
// import * as css from "./style.css";
//import {addTodo, createTodo, createProject, moveToProject, saveToLocal} from "./functions.js";

function listen(project){
    const addButton = document.querySelector("button");
    const inputBox = document.querySelector("#name");
    console.log(project.title);
    addButton.addEventListener('click', () => {
       //addTodo(inputBox.value, projectName);
        addToProject(createTodo(inputBox.value),project);
        displayProj(project);
    });
}
 

function displayProj(proj){

    document.querySelector("div.projname").textContent = "";
    document.querySelector("div.projname").textContent = proj.title;

    document.querySelector("div.todos").textContent = "";
    const div = document.querySelector("div.todos");

    for(let i = 0; i<proj.list.length; i++){
        const displayTodoName = document.createElement("p");
        displayTodoName.textContent = proj.list[i].title;
        div.appendChild(displayTodoName);
        console.log(proj.list[i].title);
    }
    
}


function displayProjects() {

    const projList = document.querySelector(".projlist");
    projList.innerHTML = '';
    
    Object.keys(localStorage).forEach( (key) => {
        const p = document.createElement("li");
        p.textContent = key;
        projList.appendChild(p);
    })
}

// function addTodo(todoName, projName){
//     console.log(`projName is ${projName}`);
//     let myTodo = createTodo(todoName);
//     const myProject = {"title":projName, "list":JSON.parse(localStorage.getItem(projName))};
//     moveToProject(myTodo,myProject);
//     saveToLocal(myProject);
//     displayProj(myProject);

// }

function createTodo(name, project, desc = '', due = '') {
    let title = name;
    let description = desc;
    let dueDate = due;
    let projectName = project;
    return {title, projectName, description, dueDate};
}

function deleteTodo(todo,proj){
    console.log(`project title is ${proj.title} and todo is ${todo.title}`);
    console.log(JSON.parse(localStorage.getItem(proj.title)));
    let todoList = JSON.parse(localStorage.getItem(proj.title));

    for(let i=0; i< todoList.length; i++){
        if(todoList[i].title == todo.title){
            console.log("we have fart and fart!!!");
            todoList.splice(i,1);
        }
    }
    proj.list = todoList;
    saveToLocal(proj);
    
}

function createProject(projName) {
    let title = projName;
    let list = [];
    console.log(`I created a project named ${projName}`);
    saveToLocal({title, list});
    displayProjects();
    return {title, list};
}

function addToProject(todo,proj){
    todo.projectName = proj.title;
    proj.list.push(todo);
    console.log(`I added ${todo.title} to ${proj.title}`);
    saveToLocal(proj);
}

function moveToProject(todo,proj) {
    let oldProject = {'title':todo.projectName,'list':JSON.parse(localStorage.getItem(todo.projectName))};
    console.log(`I'm about to delete from oldproject ${oldProject.title}`);
    deleteTodo(todo,oldProject);
    addToProject(todo,proj);

}

function saveToLocal(proj){
    console.log(`SavetoLocal Function and project title is ${proj.title} and list is ${proj.list}`);
    localStorage.setItem(proj.title, JSON.stringify(proj.list));
}

listen(createProject("Inbox"));