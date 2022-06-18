const projectContainer = document.querySelector('[data-projects]');
const newProjectForm = document.querySelector('[data-new-project-form]');
const newProjectInput = document.querySelector('[data-new-project-input]');
const deleteProjectBtn = document.querySelector('[data-delete-project-btn]');
const contentContainer = document.querySelector('[data-content-container]');
const contentTitle = document.querySelector('[data-content-title]');
const tasksContainer = document.querySelector('[data-tasks]');

const LOCAL_STORAGE_PROJECT_KEY = 'task.projects';
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = 'task.selectedProjectId';
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY) || null;

projectContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        console.log(e.target.dataset.projectId);
        selectedProjectId = e.target.dataset.projectId;
        saveAndRender();
    }
})

newProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    const projectName = newProjectInput.value;
    if (projectName == null || projectName === '') return
    const project = createProject(projectName);
    newProjectInput.value = null;
    projects.push(project);
    saveAndRender();
})

deleteProjectBtn.addEventListener('click', e => {
    projects = projects.filter(project => project.id !== selectedProjectId);
    selectedProjectId = null;
    saveAndRender();
})

function createProject(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
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
    } 
    else {
        contentTitle.innerText = selectedProject.name;
    }
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

function clearElement(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

render();