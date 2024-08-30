const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
};

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
};

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({ id }) => id !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks);

    const listItem = document.getElementById(`task-${taskId}`);
    if (listItem) {
        listItem.remove();
    }

    updateProgressDisplay();
};

const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage();
    const tasksToRemove = tasks
        .filter(({ checked }) => checked)
        .map(({ id }) => id);

    const updatedTasks = tasks.filter(({ checked }) => !checked);
    setTasksInLocalStorage(updatedTasks);

    tasksToRemove.forEach(taskId => {
        const listItem = document.getElementById(`task-${taskId}`);
        if (listItem) {
            listItem.remove();
        }
    });

    updateProgressDisplay();
};

const onCheckboxClick = (event) => {
    const [id] = event.target.id.split('-');
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task => 
        parseInt(task.id) === parseInt(id) 
        ? { ...task, checked: event.target.checked } 
        : task
    );

    setTasksInLocalStorage(updatedTasks);
    updateProgressDisplay();
};

const getCheckboxInput = ({ id, description, checked }) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;
    checkbox.addEventListener('change', onCheckboxClick);

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;

    label.textContent = description;
    label.htmlFor = checkboxId;

    wrapper.className = 'checkbox-label-container';
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
};

const getNewTaskId = () => {    
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
};

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value; 
    const id = getNewTaskId();
    return { id, description, checked: false };
};

const getCreatedTaskInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTaskData(event))
    }, 3000); 
});

const createTask = async (event) => {
    event.preventDefault();
    const saveButton = document.getElementById('save-task');
    saveButton.setAttribute('disabled', true); 

    const newTaskData = await getCreatedTaskInfo(event);
    const tasks = getTasksFromLocalStorage();

    tasks.push(newTaskData);
    setTasksInLocalStorage(tasks);

    const checkbox = getCheckboxInput(newTaskData);
    const listItem = createTaskListItem(newTaskData, checkbox);

    const list = document.getElementById('todo-list');
    list.appendChild(listItem);

    document.getElementById('description').value = '';
    saveButton.removeAttribute('disabled'); 

    updateProgressDisplay();
};

const createTaskListItem = (task, checkbox) => {
    const listItem = document.createElement('li');
    listItem.id = `task-${task.id}`;

    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'x';
    removeTaskButton.ariaLabel = 'Remover Tarefa';

    removeTaskButton.onclick = () => removeTask(task.id);

    listItem.appendChild(checkbox);
    listItem.appendChild(removeTaskButton);
    return listItem;
};

const updateProgressDisplay = () => {
    const tasks = getTasksFromLocalStorage();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.checked).length;
    
    const progressDisplay = document.getElementById('progress-display');
    progressDisplay.textContent = `${completedTasks}/${totalTasks} tarefas concluídas`;
};

window.onload = function () {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    const tasks = getTasksFromLocalStorage();
    const list = document.getElementById('todo-list');

    tasks.forEach(task => {
        const checkbox = getCheckboxInput(task);
        const toDo = createTaskListItem(task, checkbox);

        list.appendChild(toDo);
    });

    const removeDoneButton = document.getElementById('remove-done-tasks');
    removeDoneButton.addEventListener('click', removeDoneTasks);

    updateProgressDisplay();
};
