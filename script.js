/*   */
var mainDiv = $('#main');//document.getElementById('main');
var mainInput = document.getElementById("mainInput");

/*generate task with text*/
function createMessage(body) {
    var container = document.createElement('div');

    container.innerHTML = '<div class="body"> \
        <div class="undone"></div> \
        <div class="message">\
        <div class="text">' + body + '</div>\
        </div> \
        <div class="delete"></div> \
  </div>';

    return container.firstChild;
}


mainDiv.on('click', function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    /*if click red - delete task*/
    if(target.className == 'delete') {
        removeEl(target.parentNode); // .remove()

        if(checkTasks() == 0){
            document.getElementById('topLeftThereTask').id = 'topLeftNoneTask';
        }
        return;
    }

    /*if click - select like done task*/
    if(target.className == 'undone') {
        target.className = 'done';
        return;
    }
    if(target.className == 'done'){
        target.className = 'undone';
        return;
    }


    if(target.id == 'topLeftThereTask'){
        var undone = document.getElementsByClassName('undone');
        var done = document.getElementsByClassName('done');

        if((done.length + undone.length) == done.length){
            unselectAll();
            return;
        }
        if(undone.length > 0){
            selectAll();
        }
        if(done.length == 0){
            selectAll();
        }

        return;
    }
})

function createTask(e){
    e = e || window.event;

    /* it adds task, only after pushing Enter*/
    if( e.keyCode != 13 || mainInput.value == ''){
        return;
    }

    if(checkTasks() == 0){
        document.getElementById('topLeftNoneTask').id = 'topLeftThereTask';
    }

    var messageElem = createMessage(mainInput.value);

    document.getElementById("main").appendChild(messageElem);

    mainInput.value = '';
}


function checkTasks(){
    var allTextsArr = document.getElementsByClassName('text');
    return allTextsArr.length;
}

/* select all tasks */
function selectAll(){
    var allUndoneArr = document.getElementsByClassName('undone');

    for(var i = allUndoneArr.length - 1; i >= 0; i--){ // $('li a').each(function(i, a) { alert( i + ": " + a.href); });
        allUndoneArr[0].className = 'done';
    }
}
/* unselect all tasks */
function unselectAll(){
    var allUndoneArr = document.getElementsByClassName('done');

    for(var i = allUndoneArr.length - 1; i >= 0; i--){ //$('li a').each(function(i, a) { alert( i + ": " + a.href); });
        allUndoneArr[0].className = 'undone';
    }
}

function removeEl(elem) {
    return elem.parentNode ? elem.parentNode.removeChild(elem) : elem;
}
