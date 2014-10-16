/*   */
var mainInput = $('#mainInput');
var mainWindow = $('#main');
var cookie = new Cookie();
var indexNumber = 1;

/*generate task with text*/
function createMessage(text) {
    return $('<div>')
        .addClass('bodyOfTask')
        .data('indexNumber', indexNumber)
        .html('<div class="undone"></div> \
               <div class="message"> \
               <div class="text">' + text + '</div> \
               </div> \
               <div class="delete"></div>');
}

/*if click - select like undone task*/
mainWindow.on('click', '.done', function(){

    var clickedIndex = $(this).parent().data('indexNumber');
    cookie.changeStatus(clickedIndex, 'undone');

    $(this).removeClass('done')
            .addClass('undone');
    return;
});

mainWindow.on('selectstart', function(){return false;});

/*if click - select like done task*/
mainWindow.on('click', '.undone', function(){

    var clickedIndex = $(this).parent().data('indexNumber');
    cookie.changeStatus(clickedIndex, 'done');

    $(this).removeClass('undone')
            .addClass('done');
    return;
});

/* select/unselect all tasks */
mainWindow.on('click', '#topLeftThereTask', function(){

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
mainWindow.on('click', '.delete', function(){
    var thisParent = $(this).parent();
    cookie.remove(thisParent.data('indexNumber'));

    thisParent.remove();

    if(checkTasks() == 0){
        $('#topLeftThereTask').prop('id', 'topLeftNoneTask');
    }
//    $.cookie('O0', null, {expires:0}); //  !!!! ???
    return;
})

/* edit task */
mainWindow.on('dblclick', '.message', function(){
    /* cannot be more then one edit-input */
    if($('#tempInput').size() > 0){
        return;
    }

    var self = $(this);
    var thisParent = self.parent();
    var oldString = self.find('.text').html();
    var tempInput = $('#tempInput');
    var input = $('<input>').prop('id', 'tempInput')
                            .prop('type', 'text')
                            .val( oldString );
    var div = $('<div>').prop('id', 'tempDiv')
                        .html(input);

    /* insert temp block with input in task for editing */
    self.before(div);
    /* focus on temp input */
    input.focus();
    /* to hide Delete button*/
    thisParent.find('.delete').hide();
    /* change to temp attributes */
    thisParent.find('.done').removeClass('done').prop('id', 'tempDoneUndone');
    thisParent.find('.undone').removeClass('undone').prop('id', 'tempDoneUndone');
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
        thisParent.find('.delete').show();
        /* to change temp attributes back*/
        thisParent.find('#tempDoneUndone').addClass('undone').removeAttr('id');
        /* insert edited text to task */
        self.show().find('.text').eq(0).html(textResult);
        /* write changes to cookie */
        var ind = thisParent.data('indexNumber');
//        cookieObj.changeV(ind, textResult);
        cookie.changeValue(ind, textResult);
        /* remove temp block */
        thisParent.find('#tempDiv').remove();
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
        $('#topLeftNoneTask').prop('id', 'topLeftThereTask');
    }

    cookie.add(indexNumber, 'undone', mainInput.val());

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
    for(var i = 1; i <= cookie.count(); i++){
        cookie.changeStatus(i, 'done');
    }
}
/* unselect all tasks */
function unselectAll(){
    $('.done').each(function(i, a){
        a.setAttribute('class', 'undone');
    });
    for(var i = 1; i <= cookie.count(); i++){
        cookie.changeStatus(i, 'undone');
    }
}

/* adds/change/remove from cookie */
function Cookie(){
    var count = 0;

    if(document.cookie){

        while(true){
            if(document.cookie.search('O' + (count + 1)) == -1){
                break;
            }
            count++;
        }
        buildFromCookie();
    }

    function buildFromCookie(){
        for(var i = 1; i <= count; i++){
            var sts = getStatus(i);
            var text = '' + getValue(i);
            var messageElem = createMessage(text);
            messageElem.data('indexNumber', i);
            messageElem.find('.undone').removeClass('undone').addClass(sts);
            indexNumber++;
            $('#main').append(messageElem);
        }

        $('#topLeftNoneTask').prop('id', 'topLeftThereTask');
    }
    function getStatus(index){
        var fromCookie = $.cookie('O' + index);
        return JSON.parse(fromCookie).s;
    }
    function getValue(index){
        var fromCookie = $.cookie('O' + index);
        return JSON.parse(fromCookie).v;
    }
    function rename(index){
        var i = new Number(index);
        var indNum = $('.bodyOfTask');
        for(; i <= count; i++){
            $.cookie('O' + i, $.cookie('O' + (i+1)), { expires: 5});
            indNum.eq(i).data('indexNumber', (i));
        }
        $.cookie('O' + count, null, { expires: 0});
        count--;
    }

    return {
        add: function(index, status, value){
            count++;
            var valInObj = {s: status, v: value};
            $.cookie('O' + index, JSON.stringify(valInObj), { expires: 5});

        },
        changeStatus: function(index, status){
            var fromCookie = $.cookie('O' + index);
            var obj = JSON.parse(fromCookie);
            obj.s = status;
            $.cookie('O' + index, JSON.stringify(obj), { expires: 5});
        },
        changeValue: function(index, value){
            var fromCookie = $.cookie('O' + index);
            var obj = JSON.parse(fromCookie);
            obj.v = value;
            $.cookie('O' + index, JSON.stringify(obj), { expires: 5});
        },
        getStatus: function(index){
            getStatus(index);
        },
        getValue: function(index){
            getValue(index);
        },
        remove: function(index){
            rename(index)
        },
        count: function(){
            return count;
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
