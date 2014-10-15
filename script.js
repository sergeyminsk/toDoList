/*   */
var mainInput = $('#mainInput');
var mainWindow = $('#main');
var cookieObj = new CookieObj();
var cookie = new Cookie();
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
//    cookieObj.changeS(clickedIndex, 'undone');
    cookie.changeStatus(clickedIndex, 'undone');

    $(target).attr('class', 'undone');
    return;
});

mainWindow.on('selectstart', function(){return false;});

/*if click - select like done task*/
mainWindow.on('click', '.undone', function(event){
    event = event || window.event;
    var target = event.target || event.srcElement;

    var clickedIndex = $(target).parent().attr('indexNumber');
//    cookieObj.changeS(clickedIndex, 'done');
    cookie.changeStatus(clickedIndex, 'done');

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

//    cookieObj.remove($(target).parent().attr('indexNumber'));
    cookie.remove($(target).parent().attr('indexNumber'));

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
//        cookieObj.changeV(ind, textResult);
        cookie.changeValue(ind, textResult);
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

//    cookieObj.add(indexNumber, mainInput.val(), 'undone');
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
    $('.bodyOfTask').each(function(i, a){
        var index = a.getAttribute('indexNumber');
//        cookieObj.changeS(index, 'done');
    });
}
/* unselect all tasks */
function unselectAll(){
    $('.done').each(function(i, a){
        a.setAttribute('class', 'undone');
    });
    $('.bodyOfTask').each(function(i, a){
        var index = a.getAttribute('indexNumber');
//        cookieObj.changeS(index, 'undone');
    });
}

/* adds/change/remove from cookie */
function Cookie(){
    var count = 0;
    console.log('start');

    if(document.cookie){
        console.log('there is cookie !!!');

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
            messageElem.find('.undone').attr('class', sts);
            indexNumber++;
            $('#main').append(messageElem);
        }

        $('#topLeftNoneTask').attr('id', 'topLeftThereTask');
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
        for(; i <= count; i++){
            $.cookie('O' + i, $.cookie('O' + (i+1)), { expires: 5});
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