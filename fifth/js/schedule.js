$(function(){
    var is_mobile = ((/Mobile|iPhone|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera) ? true : false);
    
    var ps1 = null;
    var ps2 = null;

    if (!is_mobile) {
        ps1 = new PerfectScrollbar('main', {
            wheelSpeed: 0.4,
            wheelPropagation: true,
            minScrollbarLength: 20
        });
        ps2 = new PerfectScrollbar('.ps', {
            wheelSpeed: 0.4,
            wheelPropagation: true,
            minScrollbarLength: 20
        });
    }

    (Resize = function(){
        $('header').outerWidth($(window).innerWidth() / $('body').css('zoom'));
        $('main').height(($(window).outerHeight(true)/ $('body').css('zoom') - $('footer').innerHeight() - $('header').innerHeight()) / 0.75);
        $('main').width(($(window).outerWidth(true)) * 1/0.75 / $('body').css('zoom'));
        if(ps1 != null)
            ps1.update();
        if(ps2 != null)
            ps2.update();
    })();
    $(window).resize(Resize);
    $(window).on("orientationchange", Resize);

    $(".ps__thumb-y").css({"background": "linear-gradient(to bottom, #fba6a2 0%, #fb7fa4 100%)"});
    $(".ps__thumb-x").css({"background": "linear-gradient(to right, #fba6a2 0%, #fb7fa4 100%)"});
    
    $('.access .button').click(function(){
        $(this).hide();
        $(this).siblings('div:not(.invisible)').show();
    });
    $('.access input').focus(function(){
        $(this).select();
    });
    var shifted = false;
    $(document).on('keyup keydown', function(e){shifted = e.shiftKey});
    $('.colorbubble').hover(function(){
        var selector = 'table td>div'+$(this).data(!shifted||typeof($(this).data('shift-selector')) == 'undefined'?'selector':'shift-selector');
        if(!shifted)
            $(selector).finish();
        $(selector).fadeTo(300, .3);
    }, function(){
        // if(!shifted)
        // 	$('table td>div').finish();
        $('table td>div').fadeTo(300, 1);
    });
    Date.prototype.getWeek = function() {
        var o = new Date(this.getFullYear(),0,1);
        var t = new Date(this.getFullYear(),this.getMonth(),this.getDate());
        var d = ((t - o +1)/86400000);
        return Math.ceil(d/7);
    };

    GetSelectorData = function(minutes){
        var couple_num = "";

        var schedule = [8*60+30];
        for (let i = 1; i < 6*2; i++) {
            if(i % 2 == 0)
                schedule.push(schedule[i-1] + 20);
            else
                schedule.push(schedule[i-1] + 90);
        }

        if(minutes >= schedule[0] && minutes <= schedule[1])
            couple_num = "first";
        else if(minutes >= schedule[2] && minutes <= schedule[3])
            couple_num = "second";
        else if(minutes >= schedule[4] && minutes <= schedule[5])
            couple_num = "third";
        else if(minutes >= schedule[6] && minutes <= schedule[7])
            couple_num = "fourth";
        else if(minutes >= schedule[8] && minutes <= schedule[9])
            couple_num = "fifth";
        else if(minutes >= schedule[10] && minutes <= schedule[11])
            couple_num = "sixth";

        var weekday = "";
        switch(new Date().getDay()){
            case 1:
                weekday = "mon";
                break;
            case 2:
                weekday = "tue";
                break;
            case 3:
                weekday = "wed";
                break;
            case 4:
                weekday = "thu";
                break;
            case 5:
                weekday = "fri";
                break;
        }
        
        return {couple_num: couple_num, weekday: weekday};
    };

    GetWeekType = function(week) {
        return week % 2 == 0;
    }

    BuildSelector = function(couple_num, weekday, week) {
        return 'table tr.'+couple_num+' td.'+weekday+'>div:'+(GetWeekType(week)?"first":"last")+'-of-type';
    }

    UpdateTime = function(){
        var week = new Date().getWeek();

        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();

        minutes = hours*60 + minutes;
        
        $('table td>div').removeClass('blue');

        var selector = null;
        var sliced = 0;
        do {
            if(minutes < 8*60+30)
                break;

            var d = GetSelectorData(minutes);
            couple_num = d.couple_num;
            weekday = d.weekday;

            if(couple_num == '' || weekday == '')
                break;

            var selector = BuildSelector(couple_num, weekday, week);
            minutes -= 110;

            sliced++;

        } while (!$(selector).children().length);

        $('.colorbubble.denum_s, .colorbubble.num_s').removeClass('blue');
        $('.colorbubble.'+(GetWeekType(week)?'':'de')+'num_s').addClass('blue');

        $('.parallel').addClass((GetWeekType(week)?'':'de')+'num_s');
        $('.group-marker').each(function(){
            var num = $(this).attr('group-num'), denum = $(this).attr('group-denum');
            $(this).html(GetWeekType(week) ? num : denum);
        });

        if(sliced == 1 || (sliced > 1 && ($(selector).parent().hasClass('long-2') || $(selector).parent().hasClass('long-3'))))
            $(selector).addClass('blue');
    };
    UpdateTime();
    setInterval(UpdateTime, 100*60*10);

    $('.overlay > *:not(.close)').click(function(e) {
        e.stopPropagation();
    });
    $('.overlay').click(function() {
        $(this).fadeOut(200);
    });
});