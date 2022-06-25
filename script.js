const projectContainer = document.querySelector('[data-projects]');
const taskContainer = document.querySelector('[data-tasks]');
const newProjectForm = document.querySelector('[data-new-project-form]');
const newProjectInput = document.querySelector('[data-new-project-input]');
const deleteProjectBtn = document.querySelector('[data-delete-project-btn]');
const removeCompletedTasksBtn = document.querySelector('[data-remove-completed-tasks-btn]');
const contentContainer = document.querySelector('[data-content-container]');
const contentTitle = document.querySelector('[data-content-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const taskCreatorElement = document.querySelector('[data-task-creator]')
const homeTemplate = document.getElementById('home-template');
const homeLink = document.querySelector('[data-home-link]');
const clearAllBtn = document.querySelector('[data-clear-all-btn]')

const LOCAL_STORAGE_PROJECT_KEY = 'task.projects';
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = 'task.selectedProjectId';
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY) || null;

projectContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedProjectId = e.target.dataset.projectId;
        saveAndRender();
    }
})

homeLink.addEventListener('click', () => {
    selectedProjectId = null;
    saveAndRender();
})

taskContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const taskId = e.target.id;
        const selectedProject = projects.find(project => project.id === selectedProjectId);
        selectedProject.tasks.forEach(task => {
            if (task.id == taskId) {
                task.complete = (task.complete) ? false : true;
            }
        })
        save()
    }
})

newProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    const projectName = newProjectInput.value;
    if (projectName == null || projectName === '') return
    const project = createProject(projectName);
    newProjectInput.value = null;
    projects.push(project);
    selectedProjectId = project.id;
    saveAndRender();
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    if (taskName == null || taskName === '') return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    selectedProject.tasks.push(task);
    saveAndRender();
})

deleteProjectBtn.addEventListener('click', () => {
    projects = projects.filter(project => project.id !== selectedProjectId);
    selectedProjectId = null;
    saveAndRender();
})

removeCompletedTasksBtn.addEventListener('click', () => {
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    selectedProject.tasks = selectedProject.tasks.filter(task => task.complete == false)
    saveAndRender();
})

clearAllBtn.addEventListener('click', () => {
    projects = [];
    selectedProjectId = null;
    saveAndRender();
})

function createProject(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false}
}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY, selectedProjectId);
}

function render() {
    clearElement(projectContainer);
    renderProjects();

    const selectedProject = projects.find(project => project.id === selectedProjectId) || null;
    if (selectedProject == null) {
        contentTitle.innerText = 'Home';
        clearElement(tasksContainer);
        renderHome();
    } 
    else {
        contentTitle.innerText = selectedProject.name;
        clearElement(tasksContainer);
        renderTasks(selectedProject);
    }
}

function renderTasks(selectedProject) {
    selectedProject.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    })
    taskCreatorElement.style.display = 'initial';
}

function renderProjects() {
    projects.forEach(project => {
        const projectElement = document.createElement("li");
        projectElement.dataset.projectId = project.id;
        projectElement.classList.add("project-name");
        projectElement.innerText = project.name;
        if (project.id === selectedProjectId) projectElement.classList.add('active-project');
        projectContainer.append(projectElement);
    })  
}

function renderHome() {
    taskCreatorElement.style.display = 'none';

    let time = new Date().getHours();
    
    const homeElement = document.importNode(homeTemplate.content, true);
    const todaysDate = homeElement.querySelector('[data-date]');
    todaysDate.innerText = new Date().toLocaleDateString();
    const greeting = homeElement.querySelector('[data-greeting]');
    greeting.innerText = getGreeting(time);

    taskCount = getTaskCount();
    const taskCountElement = homeElement.querySelector('[data-task-count]');
    if (taskCount === 1) {
        taskCountElement.innerText = `You have ${taskCount} task waiting for you.`
    } else {
        taskCountElement.innerText = `You have ${taskCount} tasks waiting for you.`
    }

    tasksContainer.appendChild(homeElement);
}

function getGreeting(time) {
    if (time >= 4 && time <= 11) {
        return "Good morning."
    } else if (time >= 12 && time <= 17) {
        return "Good afternoon."
    } else {
        return "Good evening."
    }
}

function getTaskCount() {
    let taskCount = 0;
    projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.complete == false) taskCount += 1;
        })
    })
    return taskCount;
}

function clearElement(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

render();