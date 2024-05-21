 import {displayProjects} from "./index.js";

//create a new todo object
//params: (title of todo,current project name, description, duedate)
function createTodo(title, currProjectName, description = '', index = 0, dueDate = 'mm/dd/yy', priority = 'medium') {
    
    return {title, currProjectName, description, index, dueDate, priority};
}

//remove a todo object from a project object
//params: (todo object, project object)
function deleteTodo(todo,project){
    //console.log(`In DeleteTodo and project title is ${proj.title} and todo is ${todo.title}`);
    //console.log(JSON.parse(localStorage.getItem(proj.title)));
    // let searchResults = lookupTodo(todo.title, project.title);
    // searchResults.searchTodos.splice(searchResults.i,1);
    // project.list = searchResults.searchTodos.slice();
    project.list.splice(todo.index,1);
    saveToLocal(project);

}

function deleteProject(projTitle) {
    localStorage.removeItem(projTitle);
}

//Find a specific todo in the project object list to manipulate further
//params: (todo title, project title)
//returns: a new object that has the list & the index of todo in question (DO I NEED TO RETURN THE LIST?)
function lookupTodo(todoTitle, projTitle){
    console.log(`In the lookupTodo function (${todoTitle}, ${projTitle}`);
    let searchTodos = JSON.parse(localStorage.getItem(projTitle)).slice();
    console.log(`searchTodos.length is ${searchTodos} and is an Array? ${Array.isArray(searchTodos)}`);
    
    for(let i = 0; i < searchTodos.length; i++){
        console.log('in the for loop');
        console.log(`searchTodos[i] is ${searchTodos[i].title} and length is ${searchTodos.length} and todoTitle is ${todoTitle}`);
        if(searchTodos[i].title == todoTitle){
            console.log(`we have located the todo item which is ${searchTodos[i].title}`);
            let foundTodo = searchTodos[i];
            return { searchTodos, i };
        }
    }
}

//Create a new project object
//params: (project name)
//returns: a new project
function createProject(projName) {
    let title = projName;
    let list = [];
    console.log(`I created a project named ${projName}`);
    saveToLocal({title, list});
    displayProjects();
    return {title, list};
}

//Add a todo to a project
//params: (todo object, project object)
function addToProject(todo,proj){
    proj.list = JSON.parse(localStorage.getItem(proj.title)).slice();
    todo.currProjectName = proj.title;
    todo.index = proj.list.length; 
    proj.list.push(todo);
    console.log(`I added ${todo.title} to ${proj.title} the index is ${todo.index} and title in array is ${proj.list[todo.index].title}`);
    saveToLocal(proj);
}

//Move a todo from one project to another; delete the todo from old project, add the todo to new project
//params: (todo object, to-move-to project object)
function moveToProject(todo,newProject) {
    let oldProject = {'title':todo.currProjectName,'list':JSON.parse(localStorage.getItem(todo.currProjectName))};
    console.log(`I'm about to delete from oldproject ${oldProject.title}`);
    deleteTodo(todo,oldProject);
    addToProject(todo,newProject);
  
}

//Save a project to localStorage
//params: project object
function saveToLocal(project){
    console.log(`In the SavetoLocal Function and project title is ${project.title} and list is ${project.list}`);
    localStorage.setItem(project.title, JSON.stringify(project.list));
}


//Edits todo and saves to local
//params: todo object
function editTodo(todo) {
    console.log(`editTodo (${todo.title},${todo.currProjectName},${todo.description},${todo.index})`);
    // let results = lookupTodo(todo.title, todo.currProjectName);
    // let newList = results.searchTodos.slice();
    let newList = JSON.parse(localStorage.getItem(todo.currProjectName)).slice();
    let i = todo.index;
    newList[i].title = todo.title;
    newList[i].description = todo.description;
    newList[i].dueDate = todo.dueDate;
    newList[i].priority = todo.priority;
    newList[i].currProjectName = todo.currProjectName;

    let updatedProject = {"title":todo.currProjectName,"list":newList};
    saveToLocal(updatedProject);
}

export {
    createTodo,
    editTodo,
    lookupTodo,
    deleteTodo,
    createProject,
    addToProject,
    moveToProject,
    saveToLocal,
    deleteProject
};