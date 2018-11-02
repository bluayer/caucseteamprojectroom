Date.prototype.addHours = function(h){
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}
function postUrl(url, params){
    var method = "post";
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", url);
    for(var key in params){
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type","hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}
function numEvents(date)
{
    totalEvents = $('#calendar').fullCalendar('clientEvents').length;
    var count = 0;
    for (i=0;i<totalEvents;i++){
        var event = $("#calendar").fullCalendar("clientEvents")[i];
        var starttime =new Date(event.start).getTime();
        var endtime = new Date(event.end).getTime();
        if (starttime<= date.getTime() && endtime > date.getTime()) {
            count++;
        }
    }
    return count;
}

$(document).ready(function() {
    $.get("/events").done(function(data) {
        $("#calendar").fullCalendar({
            defaultView: "agendaWeek",
            minTime: "09:00:00",
            maxTime: "21:00:00",
            nowIndicator: true,
            now: new Date(),
            selectable: true,
            header: { right: "today prev next, agendaWeek", left: ""},
            events: data,
            eventAfterRender: function(event, element, view) {
                var width = $(element).width();
                var numevent = numEvents(new Date(event.start));
                if(numevent==1) width = (width/2);
                $(element).css('width', width+'px');
            },
            eventClick: function(calEvent, jsEvent, view) {
                var password = prompt("본인확인 비밀번호를 적어주세요(평소에 쓰는 비밀번호 기재 금지)");
                var params = {
                    password: password,
                    start: calEvent.start,
                    end: calEvent.end
                }
                postUrl("/delete", params);
            }
        });
    });
    $("#dialog").dialog({
        modal: true,
        autoOpen:false,
        title: "예약 신청",
        resizable:true
    });
    $("#reservation").click(function () {
        $("#dialog").dialog("open");
    });
    $("#ok").click(function() {
        var owner = $("#owner")[0].value;
        var phone = $("#phone")[0].value;
        var title = $("#title")[0].value;
        var password = $("#password")[0].value;
        var date = $("#date")[0].value;
        var starttime = $("#start_time")[0].value;
        var endtime = $("#end_time")[0].value;
        var params = {
            owner: owner,
            phone: phone,
            title: title,
            password: password,
            start: (new Date(date+"T"+starttime+":00Z")).addHours(0),
            end:(new Date(date+"T"+endtime+":00Z")).addHours(0)
        };
        postUrl("/events", params);
    });
    $("#cancel").click(function (){
        $("#dialog").dialog("close");
    });
    $("#date").value=(new Date()).toISOSTRING().substr(0,10);
});
