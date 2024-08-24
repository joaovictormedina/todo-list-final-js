let tasks = [
    {id: 1, description: 'comprar pão', checked: false },
    {id: 2, description: 'passear com o cachorro', checked: false },
    {id: 3, description: 'fazer o almoço', checked: false },
];

const getCheckboxInput = ({id, description, checked }) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;

    label.textContent = description;
    label.htmlFor = checkboxId;

    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
}

const getNewTaskId = () => {    
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value; 
    const id = getNewTaskId();
    return {id, description, checked: false};
}

const createTask = (event) => {
    event.preventDefault();
    const newTaskData = getNewTaskData(event);

    tasks.push(newTaskData); 

    const checkbox = getCheckboxInput(newTaskData);
    const listItem = createTaskListItem(newTaskData, checkbox);

    const list = document.getElementById('todo-list'); 
    list.appendChild(listItem);
}

const createTaskListItem = (task, checkbox) => {
    const listItem = document.createElement('li');
    listItem.appendChild(checkbox);
    return listItem;
}

window.onload = function () {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    const list = document.getElementById('todo-list');

    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        const toDo = createTaskListItem(task, checkbox);

        list.appendChild(toDo);
    });
}
