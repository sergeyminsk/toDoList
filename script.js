/*   */
var mainInput = $('#mainInput');
var mainWindow = $('#main');
var cookieObj = new CookieObj();
var indexNumber = 1;

/*generate task with text*/
function createMessage(text) {
    return $('<div>')
        .attr('class', 'bodyOfTask')
        .attr('indexNumber', indexNumber)
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

    var clickedIndex = $(target).parent().attr('indexNumber');
    cookieObj.changeS(clickedIndex, 'undone');

    $(target).attr('class', 'undone');
    return;
});

mainWindow.on('selectstart', function(){return false;});

/*if click - select like done task*/
mainWindow.on('click', '.undone', function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    var clickedIndex = $(target).parent().attr('indexNumber');
    cookieObj.changeS(clickedIndex, 'done');

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

    cookieObj.remove($(target).parent().attr('indexNumber'));

    $(target).parent().remove();

    if(checkTasks() == 0){
        $('#topLeftThereTask').attr('id', 'topLeftNoneTask');
    }
    return;
})

/* edit task */
mainWindow.on('dblclick', '.message', function(){
    /* cannot be more then one edit-input */
    if($('#tempInput').size() > 0){
        return;
    }

    var self = $(this);
    var oldString = self.find('.text').html();
    var tempInput = $('#tempInput');
    var input = $('<input>').attr('id', 'tempInput')
                            .attr('type', 'text')
                            .val( oldString );
    var div = $('<div>').attr('id', 'tempDiv')
                        .html(input);

    /* insert temp block with input in task for editing */
    self.before(div);
    /* focus on temp input */
    input.focus();
    /* to hide Delete button*/
    self.parent().find('.delete').hide();
    /* change to temp attributes */
    self.parent().find('.done').attr('class', '').attr('id', 'tempDoneUndone');
    self.parent().find('.undone').attr('class', '').attr('id', 'tempDoneUndone');
    /* to hide message block*/
    self.hide();

    /* if click to other elements */
    $('#tempInput').on('blur', function(){
        backToFirstState();
        return;
    });

    /* if press Enter */
    $('#tempInput').on('keydown', function(e){
        e = e || window.event;

        if( e.keyCode != 13){
            return;
        }

        backToFirstState();
        return;
    });

    function backToFirstState(){
        var textResult;

        /* if empty string - set old value back */
        if(input.val() == ''){
            textResult = oldString;
        }else{
            textResult = input.val();
        }
        /* to show Delete button*/
        self.parent().find('.delete').show();
        /* to change temp attributes back*/
        self.parent().find('#tempDoneUndone').attr('class', 'undone').attr('id', '');
        /* insert edited text to task */
        self.show().find('.text').eq(0).html(textResult);
        /* write changes to cookie */
        var ind = self.parent().attr('indexNumber');
        cookieObj.changeV(ind, textResult);
        /* remove temp block */
        self.parent().find('#tempDiv').remove();
    }
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

    cookieObj.add(indexNumber, mainInput.val(), 'undone');

    var messageElem = createMessage(mainInput.val());
    indexNumber++;

    $('#main').append(messageElem);

    mainInput.val('');
});

function checkTasks(){
    return $('.text').size();
}

/* select all tasks */
function selectAll(){
    $('.undone').each(function(i, a){
        a.setAttribute('class', 'done');
    });
    $('.bodyOfTask').each(function(i, a){
        var index = a.getAttribute('indexNumber');
        cookieObj.changeS(index, 'done');
    });
}
/* unselect all tasks */
function unselectAll(){
    $('.done').each(function(i, a){
        a.setAttribute('class', 'undone');
    });
    $('.bodyOfTask').each(function(i, a){
        var index = a.getAttribute('indexNumber');
        cookieObj.changeS(index, 'undone');
    });
}

/* adds/change/remove from cookie */
function CookieObj(){
    var count = 1;
    return {
        add: function(index, value, status){
            $.cookie("v" + +index, value, { expires: 5});
            $.cookie("s" + +index, status, { expires: 5});
            count++;
        },
        changeV: function(index, value){
            $.cookie("v" + index, value, { expires: 5});
        },
        changeS: function(index, status){
            $.cookie("s" + index, status, { expires: 5});
        },
        remove: function(index){
            $.cookie('v' + +index, null, { expires: 0});
            $.cookie('s' + +index, null, { expires: 0});
        }
    }
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
})(0);

if(document.cookie){
    console.log('there is cookie !!!');
    buildFromCookie();
}


function buildFromCookie(){

    for(var i = 0; i < 20; i++){
        if(getCookie('v' + i)){
            var sts = getCookie('s' + i)
            var text = '' + getCookie('v' + i);
            var messageElem = createMessage(text);
            messageElem.find('.undone').attr('class', sts);
            indexNumber++;
            $('#main').append(messageElem);
        }
    }

    $('#topLeftNoneTask').attr('id', 'topLeftThereTask');
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
