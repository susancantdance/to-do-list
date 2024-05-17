// import {format} from 'date-fns';
import * as css from "./style.css";
//import {addTodo, createTodo, createProject, moveToProject, saveToLocal} from "./functions.js";

function listen(project){
    const addButton = document.querySelector(".addtodo");
    const inputBox = document.querySelector("#name");
    console.log(project.title);
    addButton.addEventListener('click', () => {
       //addTodo(inputBox.value, currProjectName);
        addToProject(createTodo(inputBox.value),project);
        inputBox.value = '';
        displayProj(project);
    });
}

function listenForNewProject() {
    const addProjButton = document.querySelector(".addprojectbutt");
    const addProjInput = document.querySelector("#projectname");

    addProjButton.addEventListener('click', () => {
        createProject(addProjInput.value);
        addProjInput.value = '';
    });
}

function addListener(todoItemNode, projName) {
    //const list = document.querySelector(".todos");
    todoItemNode.addEventListener('click', () => {
        // const expandTodo = document.createElement("div");
        // expandTodo.textContent = "Edit";
        editMode(todoItemNode, projName);
       // todoItem.after(expandTodo);
    });
    console.log(todoItemNode);
    return todoItemNode;

}


function editMode(todoItem, projName){

    const foundTodo = lookupTodo(todoItem.textContent, projName);
    const index = foundTodo.i;
    var option = document.createElement("option");
    

    const list = document.querySelector(".todos");
    const editTodoItem = document.createElement("span");
    const editTitle = document.createElement("INPUT");
    const editDescription = document.createElement("INPUT");
    const editCurrProject = document.createElement("SELECT");
    const saveButton = document.createElement("button");

    editTitle.value = todoItem.textContent;
    editTitle.setAttribute("type","text");
    editTitle.setAttribute("placeholder","Add Title");
    editTitle.setAttribute("class","titleInput");

    editDescription.value = foundTodo.searchTodos[index].description;
    editDescription.setAttribute("type","text");
    editDescription.setAttribute("placeholder","Add Description");
    editDescription.setAttribute("class","descInput");

    editCurrProject.setAttribute("type","select-one");
    
    Object.keys(localStorage).forEach( (key) => {

        let option = document.createElement("option");
        option.textContent = key;
        editCurrProject.add(option);
    })

    editCurrProject.value = projName;

    saveButton.setAttribute("type","button");
    saveButton.textContent = "Save";
    saveButton.addEventListener('click', () => {
        editTodo("title",editTitle.value,todoItem.textContent,projName);
        editTodo("description",editDescription.value,todoItem.textContent,projName);
        
        if(editCurrProject.value !== projName) {
            let lookup = lookupTodo(todoItem.textContent,projName);
            let newProject = {"title":editCurrProject.value,"list":JSON.parse(localStorage.getItem(editCurrProject.value))};
            console.log(`the todo we're moving is ${lookup.searchTodos[lookup.i].title}`);
            moveToProject(lookup.searchTodos[lookup.i],newProject);
        }
    });


    editTodoItem.appendChild(editTitle);
    editTodoItem.appendChild(editDescription);
    editTodoItem.appendChild(editCurrProject);
    editTodoItem.appendChild(saveButton);


    list.replaceChild(editTodoItem,todoItem);

}

function displayProj(proj){

    document.querySelector(".projnamespan").textContent = "";
    document.querySelector(".projnamespan").textContent = proj.title;

    document.querySelector(".todos").textContent = "";
    const list = document.querySelector(".todos");

    for(let i = 0; i<proj.list.length; i++){
        const displayTodoName = document.createElement("li");
        displayTodoName.textContent = proj.list[i].title;
        const displayTodoWithListener = addListener(displayTodoName, proj.title);
        list.appendChild(displayTodoWithListener);
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
    });
}


function createTodo(name, project, desc = '', due = '') {
    let title = name;
    let description = desc;
    let dueDate = due;
    let currProjectName = project;
    return {title, currProjectName, description, dueDate};
}

function deleteTodo(todo,proj){
    //console.log(`In DeleteTodo and project title is ${proj.title} and todo is ${todo.title}`);
    //console.log(JSON.parse(localStorage.getItem(proj.title)));
    let searchResults = lookupTodo(todo.title, proj.title);
    searchResults.searchTodos.splice(searchResults.i,1);
    proj.list = searchResults.searchTodos.slice();
    saveToLocal(proj);

    
}

function lookupTodo(todoTitle, projTitle){
    console.log('In the lookupTodo function');
    let searchTodos = JSON.parse(localStorage.getItem(projTitle)).slice();
    for(let i=0; i< searchTodos.length; i++){
        if(searchTodos[i].title == todoTitle){
            console.log(`we have located the todo item which is ${searchTodos[i].title}`);
            let foundTodo = searchTodos[i];
            return { searchTodos, i };
        }
    }
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
    todo.currProjectName = proj.title;
    proj.list.push(todo);
    console.log(`I added ${todo.title} to ${proj.title}`);
    saveToLocal(proj);
}

function moveToProject(todo,newProj) {
    let oldProject = {'title':todo.currProjectName,'list':JSON.parse(localStorage.getItem(todo.currProjectName))};
    console.log(`I'm about to delete from oldproject ${oldProject.title}`);
    addToProject(todo,newProj);
    deleteTodo(todo,oldProject);
  

}

function saveToLocal(proj){
    console.log(`In the SavetoLocal Function and project title is ${proj.title} and list is ${proj.list}`);
    localStorage.setItem(proj.title, JSON.stringify(proj.list));
}

function editTodo(attribute, newValue, todoName, projName){
    let searchResults = lookupTodo(todoName, projName);
    switch (attribute) {
        case "title":
            searchResults.searchTodos[searchResults.i].title = newValue;
            break;
        case "description":
            searchResults.searchTodos[searchResults.i].description = newValue;
            break;
        case "currProjName":
            searchResults.searchTodos[searchResults.i].currProjectName = newValue;
            break;
    }

    let newList = searchResults.searchTodos.slice();
    saveToLocal({"title":projName, "list":newList});
}

listen(createProject("Inbox"));
listenForNewProject();