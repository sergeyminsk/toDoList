var mainInput = document.getElementById("mainInput");
mainInput.focus();

/*generate task with text*/
function createMessage(body) {
    var container = document.createElement('div');

    container.innerHTML = '<div class="body"> \
        <div class="tick"></div> \
        <div class="message">\
        <div class="text">' + body + '</div>\
        </div> \
        <div class="delete"></div> \
  </div>';

    return container.firstChild;
}


var mainDiv = document.getElementById('main');


mainDiv.onmousedown = function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    /*if click red - delete task*/
    if(target.className == 'delete') {
        target.parentNode.style.display = 'none';
    }

    /*if click green - select like done task*/
    if(target.className == 'tick') {

        if(target.style.backgroundColor == 'green' || target.style.backgroundColor == ''){
            target.style.backgroundColor = 'greenyellow';

            var strike = document.createElement('strike');
            target.parentNode.getElementsByClassName('text')[0].insertBefore(strike, target.parentNode.getElementsByClassName('text')[0].firstChild);
            strike.appendChild(strike.nextSibling);

            /*
             var temp = target.parentNode.getElementsByClassName('text')[0].innerHTML;
             target.parentNode.getElementsByClassName('text')[0].innerHTML = '<strike>' + temp + '</strike>';
             */
        }else{
            target.style.backgroundColor = 'green';

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