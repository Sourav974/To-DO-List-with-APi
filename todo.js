let tasks = [];
const tasksList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const tasksCounter = document.getElementById('tasks-counter');

console.log('Working');

async function fetchTodos(){
    // fetch('https://jsonplaceholder.typicode.com/todos')
    //     .then(function (response){
            
    //         return response.json();
    //     }).then(function (data){
            
    //         tasks = data.slice(0, 10);
    //         renderList();
    //     })
    //     .catch(function (error){
    //         console.log('error', error);
    //     })

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        tasks = data.slice(0, 10);
        renderList();
    }catch (error){
        console.log(error)
    
    }
}


function addTaskToDOM(task){
    const li = document.createElement('li');
    li.innerHTML = `

        <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
        <label for="${task.id}">${task.title}</label>
        <img src="https://img.icons8.com/color-glass/344/filled-trash.png" class="delete" data-id="${task.id}"/>


        `;

    tasksList.append(li);
}

function renderList () {
    tasksList.innerHTML = '';
    for (let i = 0; i < tasks.length; i++){
        addTaskToDOM(tasks[i]);
    }

    tasksCounter.innerHTML = tasks.length;
}

function toggleTask(taskId) {

    const task = tasks.filter(function(task){

        return task.id === Number(taskId);
    });

    if (task.length > 0){
        const currentTask = task[0];

        currentTask.completed = !currentTask.completed;
        renderList();
        showNotification('Task toggled Successfully');
        return;
    }

    showNotification('Could not toggled the task');

    
}

function deleteTask (taskId) {
    const newTasks = tasks.filter(function(task){
        return task.id !== Number(taskId);
    });

    tasks = newTasks;
    renderList();
    showNotification('Task deleted successfully');
}

function addTask (task) {
    if (task){

        fetch('https://jsonplaceholder.typicode.com/todos', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',

            },
            body:JSON.stringify(task),
        }).then(function (response){
            return response.json();  
        }).then(function (data){
            console.log(data);
            tasks.push(task);
            renderList();
            showNotification('Task added Successfully');
        }).catch(function (error){
            console.log('error', error)
        })
        // tasks.push(task);
        // renderList();
        // showNotification('Task added Successfully');
        // return;
    }

    showNotification('task cannot be added');
}

function showNotification(text) {
    alert(text);
}

function handleInputKeypress(e){
    if (e.key === 'Enter'){
        const text = e.target.value;
        console.log('title',text);

        if (!text){
            showNotification('Task title cannot be empty');
            return;
        }

        const task = {
            title: text,
            id:Date.now(),
            completed: false

        }

        e.target.value = '';
        addTask(task);

    }
}

function handleClickListener(e){
    const target = e.target;
    
    if (target.className === 'delete'){
        const taskId = target.dataset.id;
        deleteTask(taskId);
        return;

    }else if (target.className === 'custom-checkbox'){
        const taskId = target.id;
        toggleTask(taskId);
        return;
    }
}

function initializeApp(){
    fetchTodos();
    addTaskInput.addEventListener('keyup', handleInputKeypress);
    document.addEventListener('click', handleClickListener);

}

initializeApp();
