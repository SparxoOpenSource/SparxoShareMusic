
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
        this.trigger("stateChange", true);
        PlayerService.trigger("play", this);
    }

    stop() {
        this.state = "stop";
        this.trigger("stateChange", false);
        PlayerService.trigger("stop", this);
    }
}

class PlayerServiceClass extends Events {

    musics: Music[] = [];
    current: Music;
    player: HTMLAudioElement;
    host;
    port;
    isMainPlayer = JSON.parse(localStorage['isMainPlayer'] || "true");
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
        return new Promise((resolve, reject) => {
            var route = 'gate.gateHandler.queryEntry';
            pomelo.init({
                host: '192.168.31.125',  
                port: 3014,
                log: true
            }, () => {
                pomelo.request(route, {uid: uid }, function (data) {
                    pomelo.disconnect();
                    if (data.code === 500) {
                        reject("There is no server to log in, please wait.");
                        return;
                    }
                    self.host = data.host;
                    self.port = data.port;
                    resolve();
                });
            });

        });

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
        pomelo.init({
            host: self.host,
            port: self.port,
            log: false
        }, (data) => {
            pomelo.on('onMusicAdd', function (data) {
                var music = new Music(data);
                self.musics.push(music);
                self.trigger("list.changed", self.musics);
            });
            pomelo.on('onMusicRemove', function (data) {
                var music = self.getMusic(data.id);
                if (music) {
                    self.musics.splice(self.musics.indexOf(music), 1);
                    self.trigger("list.changed", self.musics);
                }
            });
            pomelo.on('onMusicPlay', function (data) {
                var music = self.getMusic(data.id);
                if (self.current) {
                    self.current.stop();
                }
                music.play();
                self.current = music;
                self.trigger("play.changed", music);
                if (self.isMainPlayer) {
                    self.player.pause();
                    self.player.src = music.mp3;
                    self.player.play();
                }
            });
            pomelo.on('onUserLeave', function (data) {
                console.log(data);
            });

            self.studioEnter(localStorage['username']);
        });
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
            self.studioEnterSence();
        });
    }
    studioEnterSence() {
        var self = this;
        var route = "studio.studioHandler.enterStudio";
        pomelo.request(route, {}, function (data) {
            self.studioGetPlayerMusicList();
        });
    }
    studioAddMusic(url, callback) {
        var route = "studio.studioHandler.addMusic";
        pomelo.request(route, { url: url }, function (data) {
            callback();
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
            console.log(data);
        });
    }
    studioUserIsExisted(userName) {
        var route = "connector.entryHandler.isUserExisted";
        return new Promise((resolve, reject) => {
            pomelo.request(route, {
                userName: userName
            }, function (data) {
                if (data) {
                    resolve();
                }
            });
        });
    }
}

export var PlayerService = new PlayerServiceClass(); 