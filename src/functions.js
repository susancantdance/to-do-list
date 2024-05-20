//create a new todo object
//params: (title of todo,current project name, description, duedate)
function createTodo(title, currProjectName, description = '', dueDate = '') {
 
    return {title, currProjectName, description, dueDate};
}

//remove a todo object from a project object
//params: (todo object, project object)
function deleteTodo(todo,project){
    //console.log(`In DeleteTodo and project title is ${proj.title} and todo is ${todo.title}`);
    //console.log(JSON.parse(localStorage.getItem(proj.title)));
    let searchResults = lookupTodo(todo.title, project.title);
    searchResults.searchTodos.splice(searchResults.i,1);
    project.list = searchResults.searchTodos.slice();
    saveToLocal(project);

}

//Find a specific todo in the project object list to manipulate further
//params: (todo title, project title)
//returns: a new object that has the list & the index of todo in question (DO I NEED TO RETURN THE LIST?)
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
    todo.currProjectName = proj.title;
    proj.list.push(todo);
    console.log(`I added ${todo.title} to ${proj.title}`);
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

//Edits the todo and saves it to local
//parmas: attribute to update, value to assign to attribute, name of todo, name of project
// function editTodo(attribute, newValue, todoName, projName){
//     let searchResults = lookupTodo(todoName, projName);
//     switch (attribute) {
//         case "title":
//             searchResults.searchTodos[searchResults.i].title = newValue;
//             break;
//         case "description":
//             searchResults.searchTodos[searchResults.i].description = newValue;
//             break;
//         case "currProjName":
//             searchResults.searchTodos[searchResults.i].currProjectName = newValue;
//             break;
//     }

//     let newList = searchResults.searchTodos.slice();
//     saveToLocal({"title":projName, "list":newList});
// }

function editTodo(todo) {
    let results = lookupTodo(todo.title, todo.currProjName);
    let newList = results.searchTodos.splice();
    let i = results.i;
    newList[i].title = todo.title;
    newList[i].description = todo.description;
    newList[i].currProjName = todo.currProjName;

    let updatedProject = {"title":todo.currProjName,"list":newList};
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
    saveToLocal
};