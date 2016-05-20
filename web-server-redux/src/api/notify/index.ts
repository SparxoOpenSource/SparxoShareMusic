
declare var Notification: any;

export function checkPermission() {
    if (Notification) {
        if (Notification.permission == "default") {
            Notification.requestPermission();
        }
    }
}
var messages = [];
var started=false;
export function show(body, title = "通知", icon = "") {
    if (Notification) {
        messages.push({
            title: title,
            body: body,
            icon: icon
        });
        !started&&start();
        started=true;
    }
}
var notifys = [];
function start() {
    setInterval(function () {
        if (messages.length > 0) {
            if (notifys.length > 0) {
                notifys.shift().close();
            }
            var s = messages.shift();
            notifys.push(new Notification(s.title, { body: s.body, icon: s.icon }));
        }
    }, 2000);
}