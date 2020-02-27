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
        if(!shifted) {
            $(selector).finish();
        }

        $('table td>div:not('+($(this).data(!shifted||typeof($(this).data('shift-selector')) == 'undefined'?'selector':'shift-selector'))+')').fadeTo(300, 1);
        $(selector).fadeTo(300, .25);

        SetParallel($(this).data('weektype') != "denum");
    }, function(){
        // if(!shifted)
        // 	$('table td>div').finish();

        var week = new Date().getWeek();

        NormalizeOpacity(week);
        SetParallel(GetWeekType(week));
    });

    Date.prototype.getWeek = function() {
        
        /* Standalone realizations */
        // var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        // var dayNum = d.getUTCDay() || 7;
        // d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        // var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        // return Math.ceil((((d - yearStart) / 86400000) + 1)/7)

        /* Date.format lib */
        return (new Date()).format('W');

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

    BuildSelector = function(couple_num, weekday, week, long_num = false) {
        return 'table tr.'+couple_num+' td.'+weekday+(long_num ? '.long-'+long_num : '')+'>div:'+(GetWeekType(week)?"first":"last")+'-of-type';
    }

    FadeOutAll = function() {
        $('table td>div').fadeTo(300, 1);
    }

    NormalizeOpacity = function(week) {
        $('.'+(GetWeekType(week)?'':'de')+'num').fadeTo(300, 1);
        $('.'+(!GetWeekType(week)?'':'de')+'num:not(.' +(GetWeekType(week)?'':'de')+'num)').fadeTo(300, .36);
    }

    SetParallel = function(weektype) {
        $('.parallel').removeClass('num_s').removeClass('denum_s');
        $('.parallel').addClass((weektype?'':'de')+'num_s');

        $('.group-marker').each(function(){
            var num = $(this).attr('group-num'), denum = $(this).attr('group-denum');
            $(this).html(weektype ? num : denum);
        });
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

            var selector = BuildSelector(couple_num, weekday, week, sliced >= 1 ? sliced+1 : false);

            minutes -= 110;

            sliced++;

        } while (!$(selector).children().length);

        if(selector != undefined)
            $(selector).addClass('blue');

        $('.colorbubble.denum_s, .colorbubble.num_s').removeClass('blue');
        $('.colorbubble.'+(GetWeekType(week)?'':'de')+'num_s').addClass('blue');
        
        NormalizeOpacity(week);

        SetParallel(GetWeekType(week));
    };
    UpdateTime();
    setInterval(UpdateTime, 100*60*10);

    $('.overlay').click(function(e) {
        if ($(e.target).parents('.modal').length || $(e.target).hasClass('modal')) {
            return;
        }
        $(this).fadeOut(200);
    });

    $(document).on('click', '.page-navigator', function(e) {
        e.preventDefault();
        
        var self = $(this);
        var book = self.parents('.book');
        book.find('.page:not([data-page-id="' + self.data('target') + '"])').removeClass('active');
        book.find('.page[data-page-id="' + self.data('target') + '"]').addClass('active');
    });
    
    $(document).on('click', '.toggle-data', function() {
        var self = $(this);
        var text = self.html();
        self.html(self.data('toggle-text'));
        self.data('toggle-text', text);
    });

    $(document).on('submit', '.js-generator-form', function(e) {
        e.preventDefault();
        var self = $(this);

        $.ajax({
            url: 'generator/generate.php',
            data: self.serialize(),
            success: function(data) {
                data = JSON.parse(data);
                var link = $('.generator-success').removeClass('d-none').find('.js-link');
                link.html(data.loadname);
                link.attr('download', data.loadname);
                link.attr('href', data.file);
            }
        });
    });
   
    $(document).on('click', '.js-theme-changer', function(e) {
        $('body').toggleClass('darktheme');
        
        Cookies.set('darktheme', $('body').hasClass('darktheme'));
    });
});