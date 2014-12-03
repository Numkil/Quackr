var error = "";
var info  = "";

function log( msg ){
    dolog = true;
    if (dolog){
        console.log(msg);
    }
}

function render(template, args) {
    var source;
    var template;
    var path = 'js/templates/' +  template + '.html';

    if (! args){
        args = {};
    }
    args["msgerror"] = error;
    args["msginfo"]  = info;
    args["profile"]  = app.userProfile;

    if (!app.userProfile){
        renderPartial('guestmenu', {});
    } else {
        renderPartial('menu', {});
    }

    renderPartial('messages', args);

    $.ajax({
        url: path,
        cache: true,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            $('#maincontainer').html(template(args)).trigger('create');
        }
    });
    
    loading("hide");
    error = "";
    info = "";
}

function renderPartial(name, args){
    var path = 'js/templates/partials/' +  name + '.html';
    $.ajax({
        async: false,
        url: path,
        cache: true,
        success: function (data) {
            source = data;
            Handlebars.registerPartial(name, source);
            log('Partial ' + name + ' rendered');
        }
    });
}

function redirect(location){
    loading("show");
    history.pushState("", document.title, window.location.pathname);    
    if (location.charAt(0) != '#'){
        location = '#' + location;
    }
	app.route(location);
}

function loading(showOrHide) {
    setTimeout(function(){
        $.mobile.loading(showOrHide);
    }, 1); 
}

function setErrorMessage(msg){
    error = msg;
}
function setInfoMessage(msg){
    info = msg;
}

function goToScreen() {
    if (window.location.hash){
        window.history.back();//edirect(window.location.hash.substring(1));
    } else {
        redirect('overview');
    }
}

function createProgressBar(id, progress){
    var element = $('#' + id);
    if (element){
        // Create the progressbar element
        element.attr({'name':'slider','id':'slider-' + id,'data-highlight':'true','min':'0','max':'100','value':progress,'type':'range'}).trigger('create').slider({
            create: function( event, ui ) {
                $(this).parent().find('input').hide();
                $(this).parent().find('input').css('margin-left','-9999px'); // Fix for some FF versions
                $(this).parent().find('.ui-slider-track').css('margin','0 15px 0 15px');
                $(this).parent().find('.ui-slider-handle').hide();
            }
        }).slider("refresh");
        log('progressbar:');
        log(element);  
        
        // Gradually fill the progressbar
        var i = 1;
        var interval = setInterval(function(){
            progressBar.setValue('#slider-' + id,i);
            if(i >= progress) {
                clearInterval(interval);
            }
            i++;
        }, 6);
    } else {
        log('Could not find progressbar ' + id);
    }  
}

var progressBar = {
    setValue:function(id, value) {
        $(id).val(value);
        $(id).slider("refresh");
    }
}

