

var mainDiv = document.getElementById('main');
var mainInput = document.getElementById("mainInput");
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
        target.parentNode.style.display = 'none';
    }





    if(target.className == 'emptyLeft'){
        target.getAttribute('is') == 'false' || target.getAttribute('is') == ''
            ? selectAll() | target.setAttribute('is', 'true')
            : unselectAll() | target.setAttribute('is', 'false')

    }






    /*if click green - select like done task*/
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

    document.getElementById("main").appendChild(messageElem);
    mainInput.value = '';
}

function selectAll(){
    var allTicksArr = document.getElementsByClassName('tick');
    var allTextsArr = document.getElementsByClassName('text');

    for(var i = 0; i < allTicksArr.length; i++){
        if(allTicksArr[i].getAttribute('status') == 'true'){
            continue;
        }
        console.log(allTicksArr[i].getAttribute('status'));

        var strike = document.createElement('strike');
        allTextsArr[i].insertBefore(strike, allTextsArr[i].firstChild);
        strike.appendChild(strike.nextSibling);

        allTicksArr[i].style.backgroundImage = "url('done.jpg')";
        allTicksArr[i].setAttribute('status', 'true');
    }

}

function unselectAll(){
    var allTicksArr = document.getElementsByClassName('tick');
    var allTextsArr = document.getElementsByClassName('text');

    for(var i = 0; i < allTicksArr.length; i++){
        if(allTicksArr[i].getAttribute('status') == 'false'){
            continue;
        }


        var temp = allTextsArr[i].parentNode.getElementsByTagName('strike')[0].innerHTML;
        allTextsArr[i].parentNode.getElementsByClassName('text')[0].innerHTML = temp;

        allTicksArr[i].style.backgroundImage = "url('undone.jpg')";
        allTicksArr[i].setAttribute('status', 'false');
    }
}