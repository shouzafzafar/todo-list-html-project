/* Date picker */ 
var tagValue = ''
var tagId = ''
jQuery(document).ready(function () {
    jQuery('#datepicker').datepicker({
        format: 'dd-mm-yyyy',
        startDate: '+1d',
        minDate: 0
    });
});
$('.todo-main-section').prepend('<div class="sd-main"><input type="text" placeholder="Search Date" id="search-date"><i class="fa fa-search search-icon"></i></div>')
jQuery('#search-date').datepicker({
  format: 'dd-mm-yyyy',
  startDate: '+1d'
});
$('.search-icon').on('click', () => {
  if ($('#search-date').val() === '') {
    alert('Please pick a date by clicking on search date')
  } else {
    let searchDate = $('#search-date').val()
    updateTaskList(searchDate)
    $('#search-date').val('')                         
  }
})
/* Date picker end */


/* priority Tag selection */

$('.add-task-flag').on('click', () => {
   $('.priority-check-box').css('display','block')
})
$('.close').on('click', () => {
    $('.priority-check-box').css('display','none')
})
$('#high-pri, #low-pri, #med-pri').on('click', function () {

        $('.showTag').remove()
        tagId = $(this).attr('id')
        tagValue = $(this).attr('value')
        $('.pri-tag').append(`<span class="showTag" id="${tagId}">${tagValue}</span>`)
        $('.priority-check-box').css('display','none')
    
 })
/* priority Tag selection End */

/* Add Task */
$('.add-task-btn').on('click', () => {
    if ($('#datepicker').val() !== '' && $('.add-task-input').val() !== '' && $('.showTag').length > 0 ) {
        let taskDate = $('#datepicker').val()
        updateLocalStorage(taskDate)
        updateTaskList(taskDate)
        $('#datepicker').val('')
        $('.showTag').remove()
        $('.add-task-input').val('')
    }
    else {
        alert('Please fill all related fields')
    }
})

function updateLocalStorage (_taskDate) {  //we are updating local storage
    let listText = $('.add-task-input').val()
    let tagText = tagValue
    let pastList = localStorage.getItem('todo_list');
    let myList = [[_taskDate, [tagText, 'Active', listText]]]
    let listDetails = [tagText, 'Active', listText]
    let list =[_taskDate, [tagText, 'Active', listText]]
    let status =''
   if(pastList) {
    console.log('local storage exist')
    let myListData = JSON.parse(localStorage['todo_list'])
    myListData.forEach(key => {
       if (key[0] === _taskDate) {
        key.push(listDetails)
        console.log(myListData)
        window.localStorage.setItem('todo_list', JSON.stringify(myListData))
        status=0
        console.log('status value :' + status)
       }
    })
    if (status === 0) {
     console.log('date is same')
     
    }else {
     console.log('date is not same')
     myListData.push(list)
     console.log(myListData)
     window.localStorage.setItem('todo_list', JSON.stringify(myListData))
    }
    
    }
   else {
     window.localStorage.setItem('todo_list', JSON.stringify(myList))
  }
}

function updateTaskList (date) {  // we are taking data from local storage and displaying it on the page
    $('.completed-task').remove()
    $('.list-item-box').remove()
    $('.note').remove()
    $('.add').remove()
    $('.no-records').remove()
    $('.list-task').removeClass('no-border')
    $('#list-task-show-date').css('display','block')
    $('#list-task-show-date').html(`Date: <span class="main-select-date">${date}</span>`)
    let pastList = localStorage.getItem('todo_list');
   if(pastList) {
      let todoList = JSON.parse(localStorage['todo_list'])
      let result = todoList.filter(key => {
        return key[0] === date && key.length > 1
      })
      if (result.length === 0) {
        $('.list-box').append(`<h5 style="color:white; margin-left: 2px;" class="no-records">No records found for this date</h5>`)
        $('.list-task').css('display','block')
        return false
      }
      let count = result[0].length
      for(i=1; i<count; i++) {
        let listText = result[0][i][2]
        let listTag = result[0][i][0]
        let listStatus = result[0][i][1]
        $('.list-task').css('display','block')
        $('.list-box').append(`<div class='list-item-box'>
                                 <div class="row">
                                   <input type="checkbox" class="list-checkbox" disabled>
                                   <p class="list-text">${listText}</p>
                                   <p class="list-status">${listStatus}</p>
                                   <p class="list-priority">${listTag}</p>
                                 </div>
                               </div>
                            `) 
      }
      $('.list-item-box').each(function () {
        if ($(this).find('.list-status').text() === 'completed') {
              $(this).find('.list-text').css('color','green')
              $(this).find('.list-status').css('display','none')
              $(this).find('.list-priority').replaceWith('<button class="delete-btn"><i class="fa fa-trash"></i></button>') 
              $(this).find('.list-checkbox').replaceWith('<i class="fa fa-check"></i>')
              $(this).find('.list-text').addClass('disable-click')

        }
      })
      $('.delete-btn').click(function () { // when users click on trash icon
        let selectedDate = $('#list-task-show-date').text().split(':')[1].trim()
        let selectedIndex = $('.delete-btn').parent().parent().index()
        console.log(selectedIndex)
        deleteList(selectedDate, selectedIndex)
        updateTaskList(selectedDate)
      })
     }
   else {
     alert('There is nothing in local storage')
    
}
}

/* update list status */ 
$('body').on('click', '.list-text', function () {
    let selectedDate = $('#list-task-show-date').text().split(':')[1].trim()
    let selectedIndex = $('.list-text').index(this)
    console.log(selectedIndex)
    console.log(selectedDate)
    updateListStatus(selectedDate,selectedIndex)
    updateTaskList(selectedDate)
})

function updateListStatus (date,index) { // we are updating status of the list in local storage
  index++
  let myListData = JSON.parse(localStorage['todo_list'])
    myListData.forEach(key => {
       if (key[0]=== date) {
        key[index][1] = 'completed'
       }
    })
    window.localStorage.setItem('todo_list', JSON.stringify(myListData))

}
/* update list status end */ 



/* Delete list value */
function deleteList (date, listIndex) {  // deleting values in local storage
  listIndex++
  let myListData = JSON.parse(localStorage['todo_list'])
    myListData.forEach(key => {
       if (key[0]=== date) {
         key.splice(listIndex,1)/*del*/
       }
    })
    window.localStorage.setItem('todo_list', JSON.stringify(myListData))
}
/* Delete list value end */



/* completed tab task */ 
$('.vertical-menu a:nth-child(3)').click(function () {
  let result = []
  $('.list-item-box').remove()
  $('.completed-task').remove()
  $('.note').remove()
  $('.add').remove()
  $('.no-records').remove()
  $('.list-task').removeClass('no-border')
  $('#list-task-show-date').css('display','none')
  
  let pastList = localStorage.getItem('todo_list');
  if (pastList) {
    let myListData = JSON.parse(localStorage['todo_list'])
    myListData.forEach(key => {
      let data = key.length
      for (let i=1; i<data; i++) {
        key[i][1] === 'completed' && result.push(key[i])
      }
    })
    console.log(result)
    $('.list-task').css('display','block')
    if (result.length === 0) {
      $('.list-box').append(`<h5 style="color:white; margin-left: 4px;" class="no-records">No records found</h5>`)
      $('.date-row').prepend('<h3 class="completed-task" style="color: white; margin-left: 5px;">Completed Task List</h3>')
      return false
    }
    result.map(value => {/*hr value pe funk chalaega*/
      $('.list-box').append(`<div class='list-item-box'>
                                   <div class="row">
                                     <input type="checkbox" class="list-checkbox" disabled>
                                     <p class="list-text disable-click">${value[2]}</p>
                                     <p class="list-status">${value[1]}</p>
                                     <p class="list-priority">${value[0]}</p>
                                   </div>
                                 </div>
                              `) 
    })
    $('.date-row').prepend('<h3 class="completed-task" style="color: white; margin-left: 5px;">Completed Task List</h3>')
  } else {
    alert('No Data Available')
  }
})



/* Backlog logic */ 

$('.vertical-menu a:nth-child(4)').click(function () {
  let result = []
  $('.list-task').removeClass('no-border')
  $('.note').remove()
  $('.add').remove()
  $('.list-item-box').remove()
  $('.completed-task').remove()
  $('.no-records').remove()
  $('#list-task-show-date').css('display','none')
  $('.date-row').prepend('<h3 class="completed-task" style="color: white; margin-left: 5px;">Backlog Task List</h3>')
  let pastList = localStorage.getItem('todo_list');
  if (pastList) {
    let myListData = JSON.parse(localStorage['todo_list'])
    myListData.forEach(key => {
      let data = key.length
      for (let i=1; i<data; i++) {
        key[i][1] === 'Active' && result.push(key[i])
      }
    })
    console.log(result)
    $('.list-task').css('display','block')
    if (result.length === 0) {
      $('.list-box').append(`<h5 style="color:white; margin-left: 4px;" class="no-records">No records found</h5>`)
      return false
    }
    result.map(value => {
      $('.list-box').append(`<div class='list-item-box'>
                                   <div class="row">
                                     <input type="checkbox" class="list-checkbox" disabled>
                                     <p class="list-text disable-click">${value[2]}</p>
                                     <p class="list-status">${value[1]}</p>
                                     <p class="list-priority">${value[0]}</p>
                                   </div>
                                 </div>
                              `) 
    })
  } else {
    alert('No Data Available')
  }
})


/* ALl list Logic */
$('.vertical-menu a:nth-child(1)').click(function () {
  let result = []
  $('.list-task').removeClass('no-border')
  $('.list-item-box').remove()
  $('.completed-task').remove()
  $('.note').remove()
  $('.add').remove()
  $('.no-records').remove()
  $('#list-task-show-date').css('display','none')
  $('.date-row').prepend('<h3 class="completed-task" style="color: white; margin-left: 5px;">All Task List</h3>')
  let pastList = localStorage.getItem('todo_list');
  if (pastList) {
    let myListData = JSON.parse(localStorage['todo_list'])
    myListData.forEach(key => {
      let data = key.length
      for (let i=1; i<data; i++) {
       result.push(key[i])
      }
    })
    console.log(result)
    $('.list-task').css('display','block')
    if (result.length === 0) {
      $('.list-box').append(`<h5 style="color:white; margin-left: 4px;" class="no-records">No records found</h5>`)
      return false
    }
    result.map(value => {
      $('.list-box').append(`<div class='list-item-box'>
                                   <div class="row">
                                     <input type="checkbox" class="list-checkbox" disabled>
                                     <p class="list-text disable-click">${value[2]}</p>
                                     <p class="list-status">${value[1]}</p>
                                     <p class="list-priority">${value[0]}</p>
                                   </div>
                                 </div>
                              `) 
    })
  } else {
    alert('No Data Available')
  }
})


$('.vertical-menu a:nth-child(2)').click(function () { 
  $('.list-item-box').remove()
  $('.completed-task').remove()
  $('.no-records').remove()
  $('.note').remove()
  $('.add').remove()
  $('#list-task-show-date').css('display','none')
  $('.list-task').addClass('no-border')
})

$('.vertical-menu a:nth-child(5)').click(function () { 
  $('.list-task').removeClass('no-border')
  $('.list-item-box').remove()
  $('.completed-task').remove()
  $('.no-records').remove()
  $('#add').remove()
  $('#list-task-show-date').css('display','none')
  let Password = prompt("Please enter your Password");
  if (Password === '12345') {
    $('.list-box').append('<button class="add" id="add" value="Add note"><i class="fa fa-plus"></i></button>')
    $('.list-task').css('display','block')
    $('#add').on('click', () => {
      addNewNote()
    }) 
    personal()
  } else {
    alert('Your Password is not correct. PLease try again')
  }
})


/* My personal notes */
function personal() {
  const notes = JSON.parse(localStorage.getItem('notes'))  
//   if(notes) {  
//     notes.forEach(note => addNewNote(note))  
//   }  
//   else {
//   alert('no notes')
// }

}

function addNewNote(text ='') {  
  const note = document.createElement('div')  
  note.classList.add('note')  
  note.innerHTML = `  
  <div class="tools">  
    <button class="edit"><i class="fa fa-edit"></i></button>  
    <button class="delete"><i class="fa fa-trash"></i></button>  
  </div>  
  <div class="main ${text ? "" : "hidden"}"></div>  
  <textarea class="${text ? "hidden" : ""}"></textarea>  
  `  
  const editBtn = note.querySelector('.edit')  
  const deleteBtn = note.querySelector('.delete')  
  const main = note.querySelector('.main')  
  const textArea = note.querySelector('textarea')  
  textArea.value = text  
  main.innerHTML = marked(text)  
  deleteBtn.addEventListener('click', () => {  
    note.remove()  
    updateLS()  
  })  
  editBtn.addEventListener('click', () => {  
    main.classList.toggle('hidden')  
    textArea.classList.toggle('hidden')  
  })  
  textArea.addEventListener('input', (e) => {  
    const { value } = e.target  
    main.innerHTML = marked(value)  
    updateLS()  
  })  
  document.body.appendChild(note)  
}  

function updateLS() {  
  const notesText = document.querySelectorAll('textarea')  
  const notes = []  
  notesText.forEach(note => notes.push(note.value))  
  localStorage.setItem('notes', JSON.stringify(notes))  
}  
 












 

 






