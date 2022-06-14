const projectContainer = document.querySelector('[data-projects]');

const projects = ['Test 1', 'Test 2']

function render() {
    clearElement(projectContainer);
    projects.forEach(project => {
        const projectListItem = document.createElement("li");
        projectListItem.classList.add("project-name");
        projectListItem.innerText = project;
        projectContainer.append(projectListItem);
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

render();