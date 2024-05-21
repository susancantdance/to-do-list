// import {format} from 'date-fns';
 import * as css from "./style.css";
 import {createTodo, addToProject, createProject, moveToProject, editTodo, saveToLocal, deleteTodo, lookupTodo} from "./functions.js";


//Listen for new todos in a given project
//params: project object

function listen(){
    const addButton = document.querySelector(".addtodo");
    const inputBox = document.querySelector("#name");

    addButton.addEventListener('click', () => {
        const projectTitle = document.querySelector(".projnamespan");
        console.log(`listen function ${projectTitle.textContent}`);
        const project = {"title":projectTitle.textContent, "list":JSON.parse(localStorage.getItem(projectTitle.textContent)).slice()};
        addToProject(createTodo(inputBox.value),project);
        inputBox.value = '';
        displayProj(project.title);
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
function addListener(todoItemNode, displayTodoName, projTitle) {
    
    todoItemNode.addEventListener('click', () => {
        // const expandTodo = document.createElement("div");
        // expandTodo.textContent = "Edit";
        console.log(`addEventListener (${todoItemNode}, ${projTitle})`);

        editMode(todoItemNode, displayTodoName, projTitle);
       // todoItem.after(expandTodo);
    });
    console.log(todoItemNode);
    return todoItemNode;

}

//Replace the todo in project list with input fields so user can edit
//params: (node containing todo <li>, title of project)
function editMode(todoItemNode, todoName, projTitle){
    console.log(`editMode (${todoName.textContent}, ${projTitle})`);
    const foundTodo = lookupTodo(todoName.textContent, projTitle);
    const index = foundTodo.i;

    const list = document.querySelector(".todos");
    const editTodoItem = document.createElement("span");
    const editTitle = document.createElement("INPUT");
    const editDescription = document.createElement("INPUT");
    const editCurrProject = document.createElement("SELECT");
    const saveButton = document.createElement("button");

    editTitle.value = todoName.textContent;
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
        console.log(`now we create a todo using these params (${editTitle.value} ${projTitle} ${editDescription.value})`);
        let updatedTodo = createTodo(editTitle.value, projTitle, editDescription.value);
        let updatedProject = {"title":editCurrProject.value,"list":JSON.parse(localStorage.getItem(editCurrProject.value))};
        
        console.log(`updatedTodo title ${updatedTodo.title} currProjName ${updatedTodo.currProjectName} desc ${updatedTodo.description}`);

        if (editCurrProject.value !== projTitle) moveToProject(updatedTodo, updatedProject);
        else editTodo(updatedTodo);

        displayProj(projTitle);
        
    });


    editTodoItem.appendChild(editTitle);
    editTodoItem.appendChild(editDescription);
    editTodoItem.appendChild(editCurrProject);
    editTodoItem.appendChild(saveButton);

    const todoListItem = document.createElement('li');
    todoListItem.appendChild(editTodoItem);

    list.replaceChild(todoListItem,todoItemNode);

}

//display a project and all of its todos
//params: project object
function displayProj(projTitle){

    let projList = JSON.parse(localStorage.getItem(projTitle)).slice();

    document.querySelector(".projnamespan").textContent = "";
    document.querySelector(".projnamespan").textContent = projTitle;
    document.querySelector(".todos").textContent = "";
    const list = document.querySelector(".todos");

    for(let i = 0; i<projList.length; i++){
        const displayTodo = document.createElement("li");
        
        const displayTodoName = document.createElement("span");
        const displayTodoDesc = document.createElement("span");
        const displayColon = document.createElement("span");
        displayTodoName.textContent = projList[i].title;
        displayTodoDesc.textContent = projList[i].description;
        displayColon.textContent = ": ";
        displayTodo.appendChild(displayTodoName);
        displayTodo.appendChild(displayColon);
        displayTodo.appendChild(displayTodoDesc);
        const displayTodoWithListener = addListener(displayTodo, displayTodoName, projTitle);
        list.appendChild(displayTodoWithListener);
    }
    
}

//display list of projects in the sidenav
function displayProjects() {

    const projList = document.querySelector(".projlist");
    projList.innerHTML = '';
    
    Object.keys(localStorage).forEach( (key) => {
        const p = document.createElement("li");
        p.textContent = key;
        p.addEventListener('click', () => {
            displayProj(key);
        });
        projList.appendChild(p);
    });

}


createProject("Inbox");
listen();
listenForNewProject();

 export {displayProjects};