(function () {
  let listArray = [];
  let keyList = '';

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let timeout = null;
    let millisec = 300;

    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите наименование нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('disabled', 'true');
    button.textContent = 'Добавить дело';

    button.disabled = true;

    input.addEventListener('input', function() {
      if (input.value != "") {
        clearTimeout(timeout);
        button.disabled = false;
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function() {button.disabled = true;}, millisec);
      }
    })

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
    item.textContent = obj.name;

    if (obj.done) item.classList.add('list-group-item-success');

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    item.id = obj.id;

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (const item of listArray) {
        if (item.id == obj.id) {
          item.done = !item.done;
        }
      }
      saveList(listArray, keyList);
    });
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();

        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) {
            listArray.splice(i, 1);
          }
        }

        saveList(listArray, keyList);
      }
    })

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max=item.id
    }

    return max+1;
  }

  function saveList(arr, key) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function createTodoApp(container, title = 'Список дел', staticTodoObj, keyStorage) {
    document.getElementById(container);

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    keyList = keyStorage;

    let localData = localStorage.getItem(keyList);
    if (localData !== null && localData !== '') {
      listArray = JSON.parse(localData)
    } else {
      listArray = staticTodoObj;
      saveList(listArray, keyList);
    }

    for (const item of listArray) {
      let todoItem = createTodoItem(item);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      let newTodo = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false
      }

      let todoItem = createTodoItem(newTodo);
      listArray.push(newTodo);

      todoList.append(todoItem.item);
      saveList(listArray, keyList);

      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
