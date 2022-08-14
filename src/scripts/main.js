'use strict';

// write code here
let id = 0;

// create a form
const body = document.querySelector('body');
const form = document.createElement('form');
const names = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const selections = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco'];
const inputs = names.map(inpName => inpName.toLocaleLowerCase());

form.className = 'new-employee-form';
body.append(form);

inputs.forEach((element, i) => {
  const label = document.createElement('label');

  if (element !== 'office') {
    const input = document.createElement('input');

    label.innerText = names[i];
    input.name = element;

    if (element === 'name' || element === 'position') {
      input.type = 'text';
    } else {
      input.type = 'number';
    }

    label.append(input);
    form.append(label);
  } else {
    const select = document.createElement('select');

    label.innerText = names[i];
    select.name = element;

    selections.forEach(selector => {
      const option = document.createElement('option');

      option.value = selector;
      option.innerText = selector;
      select.append(option);
    });
    label.append(select);
    form.append(label);
  }
});

const button = document.createElement('button');

button.innerText = 'Save to table';
form.append(button);

// data extraction to an object
const headers = document.querySelector('thead').querySelectorAll('th');
const headersNames = [...headers].map((item) =>
  (item.innerText.toLocaleLowerCase()));
const fields = document.querySelector('tbody').querySelectorAll('tr');
const fieldsContent = [...fields].map((item) => {
  const field = [...item.querySelectorAll('td')].map((itemF) =>
    (itemF.innerText));

  return field;
});
const data = [];

fieldsContent.forEach(employee => {
  const obj = {};

  employee.forEach((element, index) => {
    obj[headersNames[index]] = element;
  });
  obj['id'] = id;
  id++;
  data.push(obj);
});
changeTable();

// add new employee to data and table
function addEmployee(employee) {
  const newData = { ...employee };
  const formatedSalary = newData.salary.toString().split('');

  for (let i = formatedSalary.length - 3; i > 0; i = i - 3) {
    formatedSalary.splice(i, 0, ',');
  }
  newData.salary = '$' + formatedSalary.join('');
  newData['id'] = id;
  id++;
  data.push(newData);
  sortTable('name', sortASC);
  changeTable();
}

// sort method
let lastClick = '';
let sortASC = true;

function sortTable(column, sortM) {
  if (column === 'age') {
    data.sort(function(a, b) {
      if (sortM) {
        return a[column] - b[column];
      }

      return b[column] - a[column];
    });
  }

  if (column === 'salary') {
    data.sort(function(a, b) {
      if (sortM) {
        return parseInt(a[column].slice(1)) - parseInt(b[column].slice(1));
      }

      return parseInt(b[column].slice(1)) - parseInt(a[column].slice(1));
    });
  }

  if (column === 'name' || column === 'position' || column === 'office') {
    data.sort(function(a, b) {
      const nameA = a[column].toUpperCase();
      const nameB = b[column].toUpperCase();

      if (sortM) {
        if (nameA < nameB) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }
      }

      if (nameA < nameB) {
        return 1;
      }

      if (nameA > nameB) {
        return -1;
      }

      // names must be equal
      return 0;
    });
  }

  return data;
};

// form entry validation
function validation(employee) {
  const result = {
    status: 'success',
    message: 'New amployee has been added',
  };

  // 1 - all fields are filled
  for (const field in employee) {
    if (!employee[field]) {
      result.status = 'error';
      result.message = 'All fields should be filled';

      return result;
    }
  };

  // 2 - name is longer than 4 chars
  if (employee.name) {
    if (employee.name.length < 5) {
      result.status = 'error';
      result.message = 'Name should be longer than 4 chars';

      return result;
    }
  }

  // 3 - age validation
  if (employee.age) {
    if (employee.age < 18 || employee.age > 90) {
      result.status = 'error';
      result.message = 'Age value should not be less than 18 or more than 90';

      return result;
    }
  }

  return result;
}

//
const pushNotification = (posTop, posRight, settings) => {
  const block = document.createElement('div');
  const bTitle = document.createElement('h2');
  const descrip = document.createElement('p');

  block.className = 'notification ' + settings.status;
  // block.className = settings.status;
  bTitle.className = 'title';
  bTitle.textContent = settings.status;
  descrip.textContent = settings.message;
  block.append(bTitle);
  block.append(descrip);

  block.style.right = posRight + 'px';
  block.style.top = posTop + 'px';

  document.body.append(block);
  setTimeout(() => block.remove(), 5000);
};

// change table content according to sort
function changeTable() {
  const tableOld = document.querySelector('tbody');
  const table = document.createElement('tbody');

  for (let i = 0; i < data.length; i++) {
    const row = document.createElement('tr');

    for (const item of headersNames) {
      const cell = document.createElement('td');

      cell.textContent = data[i][item];
      cell.className = data[i]['id'];
      cell.setAttribute('data-row', item);
      row.append(cell);
    }
    table.append(row);
  }
  tableOld.replaceWith(table);
}

// click on headers
document.addEventListener('click', e => {
  if (e.target.tagName === 'TH') {
    const sortBy = e.target.innerText.toLocaleLowerCase();

    if (sortBy === lastClick) {
      sortASC = !sortASC;
    } else {
      sortASC = true;
    }
    lastClick = sortBy;

    // eslint-disable-next-line no-console
    console.log(sortBy, sortASC); // you can remove it
    sortTable(sortBy, sortASC);
    changeTable();

    // eslint-disable-next-line no-console
    console.log(data); // you can remove it
  }
});

// click on row
document.addEventListener('click', e => {
  const table = document.querySelector('table');
  const item = e.target;
  const activeRow = table.querySelector('.active');

  if (item.tagName !== 'TD' || !table.contains(item)) {
    return;
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }
  item.parentElement.classList.add('active');
  // eslint-disable-next-line no-console
  console.log(item.parentElement); // you can remove it
});

// click on button
const newEmployeeForm = document.querySelector('form');

newEmployeeForm.addEventListener('submit', e => {
  e.preventDefault();

  const newData = new FormData(newEmployeeForm);
  const newEmployee = Object.fromEntries(newData.entries());
  const validator = validation(newEmployee);

  pushNotification(590, 10, validator);

  if (validator.status === 'success') {
    addEmployee(newEmployee);
  }

  // eslint-disable-next-line no-console
  console.log(newEmployee); // you can remove it
});

// double click on cell

document.addEventListener('dblclick', e => {
  const cells = document.querySelector('tbody');
  const cell = e.target;

  if (cell.tagName !== 'TD' || !cells.contains(cell)) {
    return;
  }
  e.preventDefault();

  const defaultVal = cell.innerText;
  const clickedId = cell.classList[0];

  const cellForm = document.createElement('form');
  const label = document.createElement('label');
  const input = document.createElement('input');
  // const selector = document.createElement('select');

  cellForm.append(label);

  if (cell.dataset.row === 'age' || cell.dataset.row === 'salary') {
    input.type = 'number';
    input.value = cell.innerText;
    input.name = cell.dataset.row;
    cell.innerText = '';
    label.append(input);
    cell.append(cellForm);
    input.focus();
  } else {
    input.type = 'text';
    input.value = cell.innerText;
    input.name = cell.dataset.row;
    cell.innerText = '';
    label.append(input);
    cell.append(cellForm);
    input.focus();
  }

  /* else if (cell.dataset.row === 'office') {
    selector.name = cell.dataset.row;

    selections.forEach(value => {
      const option = document.createElement('option');

      option.value = value;
      option.innerText = value;
      selector.append(option);
    });
    label.append(selector);
    cell.append(cellForm);
    selector.focus();
  } */

  cellForm.addEventListener('submit', eSub => {
    eSub.preventDefault();
    input.blur();
  /*
    const newData = new FormData(cellForm);
    const inCell = Object.fromEntries(newData.entries());
    const validator = validation(inCell);

    if (validator.status === 'success') {
      // changeEmployee(inCell);

      const foundIndex = data.findIndex(element => {
        return (parseInt(element['id']) === parseInt(clickedId));
      });

      // eslint-disable-next-line no-console
      console.log(foundIndex); // you can remove it

      data[foundIndex][cell.dataset.row] = inCell[cell.dataset.row];
      cell.innerText = inCell[input.name];
      cellForm.remove();
    } else {
      cell.innerText = defaultVal;
      cellForm.remove();
    } */
  });

  input.onblur = function() {
    const inCell = {};

    inCell[input.name] = input.value;

    const validator = validation(inCell);

    if (validator.status === 'success') {
      // changeEmployee(inCell);

      const foundIndex = data.findIndex(element => {
        return (parseInt(element['id']) === parseInt(clickedId));
      });

      // eslint-disable-next-line no-console
      console.log(foundIndex); // you can remove it

      data[foundIndex][cell.dataset.row] = inCell[input.name];
      cell.innerText = inCell[input.name];
      cellForm.remove();
    } else {
      cell.innerText = defaultVal;
      cellForm.remove();
    }
  };
});

// // // //

// eslint-disable-next-line no-console
console.log(headersNames); // you can remove it
// eslint-disable-next-line no-console
console.log(data); // you can remove it
