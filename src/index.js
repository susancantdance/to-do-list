// import {format} from 'date-fns';
import * as css from "./style.css";
import {createTodo, addToProject, createProject, moveToProject, editTodo, saveToLocal, deleteTodo, lookupTodo} from "./functions.js";


//Listen for new todos in a given project
//params: project object
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

//Listen for new projects
function listenForNewProject() {
    const addProjButton = document.querySelector(".addprojectbutt");
    const addProjInput = document.querySelector("#projectname");

    addProjButton.addEventListener('click', () => {
        createProject(addProjInput.value);
        addProjInput.value = '';
    });
}

//Add a listener for each todo listed under a project
//params: (node containing todo <li>, title of project)
function addListener(todoItemNode, projTitle) {
    //const list = document.querySelector(".todos");
    todoItemNode.addEventListener('click', () => {
        // const expandTodo = document.createElement("div");
        // expandTodo.textContent = "Edit";
        editMode(todoItemNode, projTitle);
       // todoItem.after(expandTodo);
    });
    console.log(todoItemNode);
    return todoItemNode;

}

//Replace the todo in project list with input fields so user can edit
//params: (node containing todo <li>, title of project)
function editMode(todoItemNode, projTitle){

    const foundTodo = lookupTodo(todoItemNode.textContent, projTitle);
    const index = foundTodo.i;
    var option = document.createElement("option");
    

    const list = document.querySelector(".todos");
    const editTodoItem = document.createElement("span");
    const editTitle = document.createElement("INPUT");
    const editDescription = document.createElement("INPUT");
    const editCurrProject = document.createElement("SELECT");
    const saveButton = document.createElement("button");

    editTitle.value = todoItemNode.textContent;
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

    editCurrProject.value = projTitle;

    saveButton.setAttribute("type","button");
    saveButton.textContent = "Save";
    saveButton.addEventListener('click', () => {

        let updatedTodo = createTodo(editTitle.value, projTitle, editDescription.value);
        let updatedProject = {"title":editCurrProject.value,"list":JSON.parse(localStorage.getItem(editCurrProject.value))};
        
        if (editCurrProject.value !== projTitle) moveToProject(updatedTodo, updatedProject);
        else editTodo(updatedTodo);
        
    });


    editTodoItem.appendChild(editTitle);
    editTodoItem.appendChild(editDescription);
    editTodoItem.appendChild(editCurrProject);
    editTodoItem.appendChild(saveButton);


    list.replaceChild(editTodoItem,todoItemNode);

}

//display a project and all of its todos
//params: project object
function displayProj(project){

    document.querySelector(".projnamespan").textContent = "";
    document.querySelector(".projnamespan").textContent = project.title;

    document.querySelector(".todos").textContent = "";
    const list = document.querySelector(".todos");

    for(let i = 0; i<project.list.length; i++){
        const displayTodoName = document.createElement("li");
        displayTodoName.textContent = project.list[i].title;
        const displayTodoWithListener = addListener(displayTodoName, project.title);
        list.appendChild(displayTodoWithListener);
        console.log(project.list[i].title);
    }
    
}

//display list of projects in the sidenav
function displayProjects() {

    const projList = document.querySelector(".projlist");
    projList.innerHTML = '';
    
    Object.keys(localStorage).forEach( (key) => {
        const p = document.createElement("li");
        p.textContent = key;
        projList.appendChild(p);
    });
}



listen(createProject("Inbox"));
listenForNewProject();