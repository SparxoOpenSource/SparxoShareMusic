import q = require("q");
import * as notification from "./notification";
var pomelo = window['pomelo'];

export class Subscription {
    constructor(public owner, public events) {

    }
    callback;
    context;
    then(callback, context?) {
        this.callback = callback || this.callback;
        this.context = context || this.context;
        if (!this.callback) {
            return this;
        }
        this.owner.on(this.events, this.callback, this.context);
        return this;
    }
    on = this.then;
    off() {
        this.owner.off(this.events, this.callback, this.context);
        return this;
    }
}

export class Events {
    private eventSplitter = "/\s+/";
    private callbacks;
    on(events, callback?, context?): any {
        var calls, event, list;

        if (!callback) {
            return new Subscription(this, events);
        } else {
            calls = this.callbacks || (this.callbacks = {});
            events = events.split(this.eventSplitter);

            while (event = events.shift()) {
                list = calls[event] || (calls[event] = []);
                list.push(callback, context);
            }

            return this;
        }

    }

    off(events, callback, context) {
        var event, calls, list, i;

        if (!(calls = this.callbacks)) {
            return this;
        }

        if (!(events || callback || context)) {
            delete this.callbacks;
            return this;
        }

        events = events ? events.split(this.eventSplitter) : Object.keys(calls);

        while (event = events.shift()) {
            if (!(list = calls[event]) || !(callback || context)) {
                delete calls[event];
                continue;
            }

            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    list.splice(i, 2);
                }
            }
        }

        return this;
    }

    trigger(events, ...params) {
        var event, calls, list, i, length, args, all, rest;
        if (!(calls = this.callbacks)) {
            return this;
        }

        rest = [];
        events = events.split(this.eventSplitter);
        for (var param of params) {
            rest.push(param);
        }

        while (event = events.shift()) {
            if (all = calls.all) {
                all = all.slice();
            }

            if (list = calls[event]) {
                list = list.slice();
            }

            if (list) {
                for (i = 0, length = list.length; i < length; i += 2) {
                    list[i].apply(list[i + 1] || this, rest);
                }
            }

            if (all) {
                args = [event].concat(rest);
                for (i = 0, length = all.length; i < length; i += 2) {
                    all[i].apply(all[i + 1] || this, args);
                }
            }
        }

        return this;

    }
    proxy(events) {
        var that = this;
        return (function (arg) {
            that.trigger(events, arg);
        });
    }
}


export class Music extends Events {
    id;
    name = 'name';
    state = 'stop';
    artists = "";
    image = "";
    mp3 = "";
    orderer = "";
    constructor(data) {
        super();
        this.id = data.id;
        this.name = data.name + " - " + data.album;
        this.artists = data.artists.join(',');
        this.image = data.image;
        this.mp3 = data.resourceUrl;
        this.orderer = data.orderer;
    }
    play() {
        this.state = "play";
        this.trigger("music:changed", this);
        PlayerService.trigger("play", this);
    }

    stop() {
        this.state = "stop";
        this.trigger("music:changed", this);
        PlayerService.trigger("stop", this);
    }
}

class PlayerServiceClass extends Events {

    musics: Music[] = [];
    current: Music;
    player: HTMLAudioElement;
    host;
    port;
    isMainPlayer = JSON.parse(localStorage['isMainPlayer'] || "false");
    setIsMainPlayer(isMainPlayer: boolean) {
        this.isMainPlayer = isMainPlayer;
        localStorage['isMainPlayer'] = isMainPlayer;
        if (!this.isMainPlayer) {
            this.player.pause();
        }
    }

    setPlayer(player) {
        var self = this;
        self.player = player;
        self.player.addEventListener("ended", () => {
            self.playNext();
        });
        self.player.addEventListener("error",(e)=>{
            self.playNext();
        });
    }
    pause() {
        this.player.pause();
    }
    playNext() {
        var next: Music;
        if (!this.current) {
            next = this.musics[0];
        }
        else {
            var index = this.musics.indexOf(this.current);
            if (this.musics.length <= index + 1) {
                index = 0;
            } else {
                index += 1;
            }
            next = this.musics[index];
        }

        if (next) {
            this.studioPlayMusic(next.id);
        }
    }

    init(uid) {
        var self = this;
        var d = q.defer();

        //return new Promise((resolve, reject) => {
        var route = 'gate.gateHandler.queryEntry';
        pomelo.init({
            host: '52.193.35.178',
            port: 3014,
            log: true
        }, () => {
            pomelo.request(route, { userName: uid }, function (data) {
                pomelo.disconnect();
                if (data.code === 500) {
                    d.reject("There is no server to log in, please wait.");
                    return;
                }
                self.host = data.host;
                self.port = data.port;
                d.resolve();
            });
        });

        //});     
        return d.promise


    }
    getMusic(id) {
        for (var item of this.musics) {
            if (item.id == id) {
                return item;
            }
        }
    }
    studio() {
        var self = this;
        var d = q.defer();

        //return new Promise((resolve, reject) => {
        pomelo.init({
            host: self.host,
            port: self.port,
            reconnect:true,
            maxReconnectAttempts:20,
            log: false
        }, (data) => {
            d.resolve();
        });
        //});
        return d.promise;

    }
    studioEnter(userName) {
        var self = this;
        var route = "connector.entryHandler.enter";
        pomelo.request(route, {
            userName: userName
        }, function (data) {
            if (data.code === 500) {
                return;
            }
            pomelo.on('onMusicAdd', function (data) {
                var music=self.getMusic(data.id)
                if(!music){
                    music=new Music(data);               
                    self.musics.push(music);
                    self.trigger("list.changed", self.musics);                
                    notification.show(data.orderer+"添加了音乐"+data.name,undefined,data.image);
                }
                else{
                    music.name = data.name + " - " + data.album;
                    music.artists = data.artists.join(',');
                    music.image = data.image;
                    music.mp3 = data.resourceUrl;
                    music.orderer = data.orderer;
                    music.trigger("music:changed",music);
                    notification.show(data.orderer+"替换了音乐"+data.name,undefined,data.image);
                }
            });
            pomelo.on('onMusicRemove', function (data) {
                var music = self.getMusic(data.id);
                if (music) {
                    self.musics.splice(self.musics.indexOf(music), 1);
                    self.trigger("list.changed", self.musics);
                    notification.show("某人删除了音乐"+music.name);
                }
            });
            pomelo.on('onMusicPlay', function (data) {                    
                self.playMusic(data.id);
            });
            pomelo.on('onUserLeave', function (data) {              
                notification.show(data.userName+"退出");
            });
            self.studioEnterSence();
        });
    }

    playMusic(id) {
        var self = this;
        if(self.current&&self.current.id==id){
            return;
        }
        var music = self.getMusic(id);       
        if (self.current) {
            self.current.stop();
        }
        music.play();
        self.current = music;
        self.trigger("play.changed", music);        
        if(music.mp3==null){
            self.playNext();
            //notification.show(music.name+",已跳过","无法播放",music.image); 
            return ;
        }        
        notification.show(music.name,"正在播放",music.image);      
        if (self.isMainPlayer) {
            self.player.pause();
            self.player.src = music.mp3;
            self.player.play();
        }
    }
    studioEnterSence() {
        var self = this;
        var route = "studio.studioHandler.enterStudio";
        pomelo.request(route, {}, function (data) {
            self.studioGetPlayerMusicList();
        });
    }
    studioAddMusic(url, callback) {
        var self = this;
        var route = "studio.studioHandler.addMusic";
        pomelo.request(route, { url: url }, function (data) {
            if (!self.getMusic(data.id)) {
                callback();
            } else {
                alert("已经存在");
            }
        });
    }
    studioRemoveMusic(id) {
        var route = "studio.studioHandler.removeMusic";
        pomelo.request(route, { id: id }, function (data) {
            console.log("remove", data.name);
        });
    }
    studioPlayMusic(id) {
        var route = "studio.studioHandler.playMusic";
        if(this.current&&this.current.id==id){
            return;
        }
        console.log("点击播放"+id);
        pomelo.request(route, { id: id }, function (data) {
            console.log("play", data.name);
        });
    }
    studioGetPlayerMusicList() {
        var self = this;
        var route = "studio.studioHandler.getPlayerMusicList";
        pomelo.request(route, {}, function (data) {
            if (data.code !== 500) {
                for (var item of data.playerMusicList) {
                    self.musics.push(new Music(item));
                }
                self.trigger("list.changed", self.musics);
            }
            if (data.playingSong) {
                self.playMusic(data.playingSong.id);
            }
            console.log(data);
        });
    }
    studioUserIsExisted(userName) {
        var route = "connector.entryHandler.isUserExisted";
        var d = q.defer();

        //return new Promise((resolve, reject) => {
        pomelo.request(route, {
            userName: userName
        }, function (data) {
            if (data.code != 500 && !data.isExisted) {
                d.resolve();
            } else {
                pomelo.disconnect();
                d.reject("用户名已经存在")
            }
        });
        return d.promise;
        //});
    }
}

export var PlayerService = new PlayerServiceClass(); 