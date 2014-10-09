/*   */
var mainInput = $('#mainInput');

/*generate task with text*/
function createMessage(body) {
    return $('<div>').attr('class', 'body').html('<div class="undone"></div> \
        <div class="message">\
        <div class="text">' + body + '</div>\
        </div> \
        <div class="delete"></div>');
}


$('#main').on('click', function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    /*if click red - delete task*/
    if($(target).attr('class') == 'delete') {
        $(target).parent().remove();

        if(checkTasks() == 0){
            $('#topLeftThereTask').attr('id', 'topLeftNoneTask');
        }
        return;
    }

    /*if click - select like done task*/
    if($(target).attr('class') == 'undone') {
        $(target).attr('class', 'done');
        return;
    }
    if($(target).attr('class') == 'done'){
        $(target).attr('class', 'undone');
        return;
    }


    if($(target).attr('id') == 'topLeftThereTask'){
        var undone = $('.undone');
        var done = $('.done');

        if((done.size() + undone.size()) == done.size()){
            unselectAll();
            return;
        }
        if(undone.size() > 0){
            selectAll();
            return;
        }
        if(done.size() == 0){
            selectAll();
            return;
        }

        return;
    }
})

function createTask(e){
    e = e || window.event;

    /* it adds task, only after pushing Enter*/
    if( e.keyCode != 13 || mainInput.val() == ''){
        return;
    }

    if(checkTasks() == 0){
        $('#topLeftNoneTask').attr('id', 'topLeftThereTask');
    }

    var messageElem = createMessage(mainInput.val());

    $('#main').append(messageElem);

    mainInput.val('');
}


function checkTasks(){
    return $('.text').size();
}

/* select all tasks */
function selectAll(){
    $('.undone').each(function(i, a){
        a.className = 'done';
    });
}
/* unselect all tasks */
function unselectAll(){
    $('.done').each(function(i, a){
        a.className = 'undone';
    });
}

