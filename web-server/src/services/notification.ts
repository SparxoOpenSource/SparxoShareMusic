

export function checkPermission() {
    if(window.Notification){
        if(Notification.permission=="default"){
            Notification.requestPermission();
        }
    }
}
var current;
export function show(body,title="通知",icon="images/music_beamed.png") {
    if(window.Notification){
        if(current){
            current.close();
        }
        current= new Notification(title,{body:body,icon:icon});
    }
}