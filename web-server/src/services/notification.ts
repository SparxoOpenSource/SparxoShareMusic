

export function checkPermission() {
    if(window.Notification){
        if(Notification.permission=="default"){
            Notification.requestPermission();
        }
    }
}
export function show(body,title="通知",icon="images/music_beamed.png") {
    console.log(body);
    return new Notification(title,{body:body,icon:icon});
}