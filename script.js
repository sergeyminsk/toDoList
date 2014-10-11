/*   */
var mainInput = $('#mainInput');
var mainWindow = $('#main');

/*generate task with text*/
function createMessage(text) {
    return $('<div>')
        .attr('class', 'body')
        .html('<div class="undone"></div> \
               <div class="message"> \
               <div class="text">' + text + '</div> \
               </div> \
               <div class="delete"></div>');
}

/*if click - select like undone task*/
mainWindow.on('click', '.done', function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    $(target).attr('class', 'undone');
    return;
});

mainWindow.on('selectstart', function(){return false;});

/*if click - select like done task*/
mainWindow.on('click', '.undone', function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    $(target).attr('class', 'done');
    return;
});

/* select/unselect all tasks */
mainWindow.on('click', '#topLeftThereTask', function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

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
});

/*if click red - delete task*/
mainWindow.on('click', '.delete', function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    $(target).parent().remove();

    if(checkTasks() == 0){
        $('#topLeftThereTask').attr('id', 'topLeftNoneTask');
    }
    return;
})

mainWindow.on('dblclick', '.message', function(){
    var input = $('<input>').attr('id', 'extraInput')
                            .attr('type', 'text')
                            .val($(this).find('.text').html());
    var div = $('<div>').attr('id', 'tempDiv')
                        .html(input);

    $(this).before(div);
    $(this).parent().find('.delete').hide();
    $(this).hide();

});

/* adds the task */
mainInput.on('keydown', function(e){
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
});

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
/* emulator of input */
(function(count){
    if(count == 0){return;}
    var e = jQuery.Event("keydown", { keyCode: 13 });

    for(var i = 0; i < count; i++){
        if(i%3 == 0){
            mainInput.val(new Date()%10000000000000000);
            mainInput.trigger(e);
            continue;
        }
        mainInput.val(new Date());
        mainInput.trigger(e);
    }
    var undone = $('.undone');
    undone.eq(new Date()%count).click();
    undone.eq(new Date()%count).click();
})(3);

