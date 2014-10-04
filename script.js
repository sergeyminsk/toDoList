

var mainDiv = document.getElementById('main');
var mainInput = document.getElementById("mainInput");
var topLeft = document.getElementById('emptyLeft');
mainInput.focus();

/*generate task with text*/
function createMessage(body) {
    var container = document.createElement('div');

    container.innerHTML = '<div class="body"> \
        <div class="tick" status="false"></div> \
        <div class="message">\
        <div class="text">' + body + '</div>\
        </div> \
        <div class="delete"></div> \
  </div>';

    return container.firstChild;
}


mainDiv.onmousedown = function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    /*if click red - delete task*/
    if(target.className == 'delete') {
        removeEl(target.parentNode);
        checkTasks();
        if(checkTasks() == 0){
            topLeft.style.backgroundImage = ''; // if delete all tasks - sign 'select all' is hiding
        }
    }

    /* selecting or deselecting all tasks like done */
    if(target.id == 'emptyLeft'){
        target.getAttribute('is') == 'false' || target.getAttribute('is') == ''
            ? selectAll() | target.setAttribute('is', 'true')
            : unselectAll() | target.setAttribute('is', 'false')
    }

    /*if click - select like done task*/
    if(target.className == 'tick') {

        if(target.getAttribute('status') == 'false' || target.getAttribute('status') == ''){
            target.setAttribute('status', 'true');

            target.style.backgroundImage = "url('done.jpg')";
            var strike = document.createElement('strike');
            target.parentNode.getElementsByClassName('text')[0].insertBefore(strike, target.parentNode.getElementsByClassName('text')[0].firstChild);
            strike.appendChild(strike.nextSibling);

            /*  or this way ???
             var temp = target.parentNode.getElementsByClassName('text')[0].innerHTML;
             target.parentNode.getElementsByClassName('text')[0].innerHTML = '<strike>' + temp + '</strike>';
             */
        }else{
            target.setAttribute('status', 'false');
            target.style.backgroundImage = "url('undone.jpg')";
            var temp = target.parentNode.getElementsByTagName('strike')[0].innerHTML;
            target.parentNode.getElementsByClassName('text')[0].innerHTML = temp;
        }

    }

}

function createTask(e){
    e = e || window.event;

    /* it adds task, only after pushing Enter*/
    if( e.keyCode != 13 || mainInput.value == ''){
        return;
    }


    var messageElem = createMessage(mainInput.value);

    topLeft.style.backgroundImage = "url('selectAll.jpg')"; // to show sign "select all tasks"
    document.getElementById("main").appendChild(messageElem);

    mainInput.value = '';
}


function checkTasks(){
    var allTextsArr = document.getElementsByClassName('text');
    console.log(allTextsArr.length);
    return allTextsArr.length;
}

/* select all tasks */
function selectAll(){
    var allTicksArr = document.getElementsByClassName('tick');
    var allTextsArr = document.getElementsByClassName('text');

    for(var i = 0; i < allTicksArr.length; i++){
        if(allTicksArr[i].getAttribute('status') == 'true'){ // skip task, if already select
            continue;
        }

        var strike = document.createElement('strike');
        allTextsArr[i].insertBefore(strike, allTextsArr[i].firstChild);
        strike.appendChild(strike.nextSibling);

        allTicksArr[i].style.backgroundImage = "url('done.jpg')";
        allTicksArr[i].setAttribute('status', 'true');
    }

}
/* unselect all tasks */
function unselectAll(){
    var allTicksArr = document.getElementsByClassName('tick');
    var allTextsArr = document.getElementsByClassName('text');

    for(var i = 0; i < allTicksArr.length; i++){
        if(allTicksArr[i].getAttribute('status') == 'false'){ // skip task, if already unselect
            continue;
        }

        var temp = allTextsArr[i].parentNode.getElementsByTagName('strike')[0].innerHTML;
        allTextsArr[i].parentNode.getElementsByClassName('text')[0].innerHTML = temp;

        allTicksArr[i].style.backgroundImage = "url('undone.jpg')";
        allTicksArr[i].setAttribute('status', 'false');
    }
}

function removeEl(elem) {
    return elem.parentNode ? elem.parentNode.removeChild(elem) : elem;
}
