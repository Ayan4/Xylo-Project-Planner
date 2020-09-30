class AddProject{
    constructor(){
        this.validation();
    }

    validation(){
        const submitBtn = document.querySelector('.submit');
        const warning = document.querySelector('.warning');
        const title = document.querySelector('.title');
        const description = document.querySelector('.description');
        this.moreInfo = document.querySelector('.moreInfoInput');

        // ID Generator
        let count = 0;

        submitBtn.addEventListener('click', () =>{

            if(title.value.length > 0 && description.value.length > 0){
                this.id = count;
                count++;

                if(this.moreInfo.value.length > 0){
                    this.moreInfo = this.moreInfo;
                }else{
                    this.moreInfo.value = 'No Information Available';
                }

                this.enterProject(this.id, title.value, description.value, this.moreInfo.value);
                title.value = '';
                description.value = '';
                this.moreInfo.value = '';
            }else{
                warning.style.display = 'block'
                setTimeout(() =>{
                    warning.style.display = 'none'
                }, 3000)
            }
        });
    }

    enterProject(id, title, description, moreInfo){
        const li = document.createElement('li');
        li.id = `p${id}`;
        li.classList.add('card');
        li.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <p class='moreInfo'>${moreInfo}</p>
        <button class="alt">More Info</button>
        <button class='act-btn'>Finish</button>
        <img src="./carbon_delete.svg" alt="delete" class='delete'>
        `
        const ul = document.querySelector('#active-projects ul');
        ul.append(li);

        const activeProjects = new ProjectList('active');
        const finishedProjects = new ProjectList('finished');
        activeProjects.setSwitchHandlerFunction(finishedProjects.addProject.bind(finishedProjects));
        finishedProjects.setSwitchHandlerFunction(activeProjects.addProject.bind(activeProjects));
        activeProjects.deleteProject();
        finishedProjects.deleteProject();
    }
}

class DOMHelper{
    static clearEventListener(element){
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveElement(elementID, newDestinationSelector){
        const element = document.getElementById(elementID);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
    }
}

class Tooltip{
    constructor(closeTooltipFunction, title){
        this.closeTooltipHandler = closeTooltipFunction;
        this.title = title
    }

    hasActiveTooltip = false;

    attach(title, moreInfo){
        const toolTipElement = document.createElement('div');
        toolTipElement.classList.add('moreInfo-card');
        toolTipElement.innerHTML = 
        `<h3>${title}</h3>
            <p>${moreInfo}</p>`;
        toolTipElement.addEventListener('click', this.closeTooltip.bind(this));
        this.element = toolTipElement;
        document.body.append(toolTipElement);
    }

    closeTooltip(){
        this.element.remove();
        this.closeTooltipHandler();
    }
}

class ProjectItem{
    constructor(id, updateProjectListFunction, type){
        this.updateProjectListHandler = updateProjectListFunction;
        this.id = id;
        this.connectSwitchBtn(type);
        this.connectMoreInfoBtn();
    }

    showMoreInfoHandler(title, moreInfo){
        if(this.hasActiveTooltip){
            return;
        }
        const tooltip = new Tooltip(() =>{
            this.hasActiveTooltip = false;
        });

        tooltip.attach(title, moreInfo);
        this.hasActiveTooltip = true;
    }

    connectMoreInfoBtn(){
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', (event) =>{
            const btn = event.currentTarget;
            const title = btn.parentElement.firstElementChild.textContent;
            const moreInfo = btn.parentElement.children[2].textContent;

            this.showMoreInfoHandler(title, moreInfo);
        });
    }

    connectSwitchBtn(type){
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListener(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate'
        switchBtn.addEventListener('click', this.updateProjectListHandler.bind(null, this.id));
    }
    
    update(updateProjectListFunction, type){
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectSwitchBtn(type);
    }
}

class ProjectList{
    projects = [];
    constructor(type){
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for(const i of prjItems){
            this.projects.push(new ProjectItem(i.id, this.switchProject.bind(this), this.type));
        }
    }
    
    setSwitchHandlerFunction(switchHandlerFunction){
        this.switchHandler = switchHandlerFunction;
    }
    
    addProject(project){
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
    }

    switchProject(projectId){
        this.switchHandler(this.projects.find(p => p.id === projectId));
        this.projects = this.projects.filter(p => p.id !== projectId);
    }


    deleteProject(){
        const deleteBtn = document.querySelectorAll('.delete');            
        deleteBtn.forEach(i =>{
            i.addEventListener('click', ()=>{
                const projectId = i.parentElement.id;
                this.projects = this.projects.filter(i => i.id !== projectId);
                i.parentElement.remove();
            });
        })
    }
}

class TextSlide{
    constructor(){
        this.titleSlide();
        this.descriptionSlide();
        this.moreInfoSlide();
    }

    titleSlide(){
        const input = document.querySelector('.title');
        const label = document.querySelector('.title-label');

        window.addEventListener('click', (event) => {
            if(event.target === input || input.value.length > 0){
                label.style.top = '17px';
            }else{
                label.style.top = '41px';
            }
        });
    }

    descriptionSlide(){
        const input = document.querySelector('.description');
        const label = document.querySelector('.description-label');

        window.addEventListener('click', (event) => {
            if(event.target === input || input.value.length > 0){
                label.style.top = '105px';
            }else{
                label.style.top = '130px';
            }
        });
    }

    moreInfoSlide(){
        const input = document.querySelector('.moreInfoInput');
        const label = document.querySelector('.moreinfo-label');

        window.addEventListener('click', (event) => {
            if(event.target === input || input.value.length > 0){
                label.style.top = '195px';
            }else{
                label.style.top = '220px';
            }
        });
    }
}


class App{
    static init() {
        const addproject = new AddProject();

        const activeProjectsList = new ProjectList('active');
        const finishedProjectsList = new ProjectList('finished');
        activeProjectsList.setSwitchHandlerFunction(finishedProjectsList.addProject.bind(finishedProjectsList));
        finishedProjectsList.setSwitchHandlerFunction(activeProjectsList.addProject.bind(activeProjectsList));
        activeProjectsList.deleteProject();
        finishedProjectsList.deleteProject();

        const titleSlide = new TextSlide();
    }
}

App.init(); 
