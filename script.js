const projectContainer = document.querySelector('[data-projects]');
const newProjectForm = document.querySelector('[data-new-project-form]')
const newProjectInput = document.querySelector('[data-new-project-input]')

const LOCAL_STORAGE_PROJECT_KEY = 'task.projects';
const projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

newProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    const projectName = newProjectInput.value;
    if (projectName == null || projectName === '') return
    const project = createProject(projectName);
    newProjectInput.value = null;
    projects.push(project);
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
}

function render() {
    clearElement(projectContainer);
    projects.forEach(project => {
        const projectElement = document.createElement("li");
        projectElement.dataset.listId = project.id;
        projectElement.classList.add("project-name");
        projectElement.innerText = project.name;
        projectContainer.append(projectElement);
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

render();