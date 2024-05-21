// import {format} from 'date-fns';
 import * as css from "./style.css";
 import {createTodo, deleteProject, addToProject, createProject, moveToProject, editTodo, saveToLocal, deleteTodo, lookupTodo} from "./functions.js";


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
function addListener(todoItemNode, displayTodoName, projTitle, i) {
    
    todoItemNode.addEventListener('click', () => {
        // const expandTodo = document.createElement("div");
        // expandTodo.textContent = "Edit";
        console.log(`addEventListener (${todoItemNode}, ${projTitle})`);

        editMode(todoItemNode, displayTodoName, projTitle, i);
       // todoItem.after(expandTodo);
    });
    console.log(todoItemNode);
    return todoItemNode;

}

//Replace the todo in project list with input fields so user can edit
//params: (node containing todo <li>, title of project)
function editMode(todoItemNode, todoName, projTitle, i){
    console.log(`editMode (${todoName.textContent}, ${projTitle}, ${i})`);
    // const foundTodo = lookupTodo(todoName.textContent, projTitle);
    // const index = foundTodo.i;
    const projectList = JSON.parse(localStorage.getItem(projTitle)).slice();

    const list = document.querySelector(".todos");
    const editTodoItem = document.createElement("span");
    const editTitle = document.createElement("INPUT");
    const editDescription = document.createElement("INPUT");
    const editDueDate = document.createElement("INPUT");
    const editPriority = document.createElement("SELECT");
    const editCurrProject = document.createElement("SELECT");
    const saveButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    editTitle.value = todoName.textContent;
    editTitle.setAttribute("type","text");
    editTitle.setAttribute("placeholder","Add Title");
    editTitle.setAttribute("class","titleInput");

    editDescription.value = projectList[i].description;
    editDescription.setAttribute("type","text");
    editDescription.setAttribute("placeholder","Add Description");
    editDescription.setAttribute("class","descInput");
    
    editDueDate.value = projectList[i].dueDate;
    editDueDate.setAttribute("type","text");
    editDueDate.setAttribute("placeholder","Add duedate");
    editDueDate.setAttribute("class","duedateInput");

    
    editPriority.setAttribute("placeholder","Add priority");
    editPriority.setAttribute("class","duedatePriority");
    editPriority.setAttribute("type","select-one");

    let high = document.createElement("option");
    let medium = document.createElement("option");
    let low = document.createElement("option");

    high.textContent = "high";
    medium.textContent = "medium";
    low.textContent = "low";

    editPriority.add(high);
    editPriority.add(medium);
    editPriority.add(low);

    editPriority.value = projectList[i].priority;


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
        let updatedTodo = createTodo(editTitle.value, projTitle, editDescription.value, i, editDueDate.value, editPriority.value);
        let updatedProject = {"title":editCurrProject.value,"list":JSON.parse(localStorage.getItem(editCurrProject.value))};
        
        console.log(`updatedTodo title ${updatedTodo.title} currProjName ${updatedTodo.currProjectName} desc ${updatedTodo.description}`);

        if (editCurrProject.value !== projTitle) moveToProject(updatedTodo, updatedProject);
        else editTodo(updatedTodo);

        displayProj(projTitle);
        
    });

    deleteButton.setAttribute("type","button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener('click', () => {
        let todoToDelete = createTodo('', projTitle, '', i);
        let projectToDeleteFrom = {"title":projTitle, "list":JSON.parse(localStorage.getItem(projTitle))};
        deleteTodo(todoToDelete, projectToDeleteFrom);
        displayProj(projTitle);
    });



    editTodoItem.appendChild(editTitle);
    editTodoItem.appendChild(editDescription);
    editTodoItem.appendChild(editDueDate);
    editTodoItem.appendChild(editPriority);
    editTodoItem.appendChild(editCurrProject);
    editTodoItem.appendChild(saveButton);
    editTodoItem.appendChild(deleteButton);

    const todoListItem = document.createElement('li');
    todoListItem.appendChild(editTodoItem);

    list.replaceChild(todoListItem,todoItemNode);

}

//display a project and all of its todos
//params: project object
function displayProj(projTitle){
    console.log(`i'm in the display Proj function and projTitle is ${projTitle}`);
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
        const displayTodoWithListener = addListener(displayTodo, displayTodoName, projTitle, i);
        list.appendChild(displayTodoWithListener);
    }
    
}

//display list of projects in the sidenav
function displayProjects() {

    const projList = document.querySelector(".projlist");
    projList.innerHTML = '';
    
    Object.keys(localStorage).forEach( (key) => {
        const li = document.createElement("li");
        const p = document.createElement("span");
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        p.textContent = key;
        p.addEventListener('click', () => {
            displayProj(key);
        });

       
        deleteButton.addEventListener('click', () => {
            deleteProject(key);
            displayProj("Inbox");
            displayProjects();
        });

        
        li.appendChild(p);
        if(key !== "Inbox") li.appendChild(deleteButton);
        projList.appendChild(li);
        
    });

}


createProject("Inbox");
listen();
listenForNewProject();

 export {displayProjects};