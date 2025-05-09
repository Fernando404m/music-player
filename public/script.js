/* audio */

const audio = new Audio()

var musicas = [
    {id: 1, tempo: 174, img: "img/RWBY.png", title: "Mirror mirror", src: "musicas/Mirror Mirror (White Trailer) (feat. Casey Lee Williams).mp3"},
    {id: 2, tempo: 343, img: "img/nier.png", title: "The weight of the world", src: "musicas/NieR_  Automata OST-The Weight of the World ENG Lyrics.mp3"},
    {id: 3, tempo: 224, img: "img/RWBY-neo.png", title: "One thing", src: "musicas/One Thing (feat. Casey Lee Williams) by Jeff Williams with Lyrics.mp3"},
    {id: 4, tempo: 192, img: "img/RWBY.png", title: "Red like roses", src: "musicas/Red Like Roses (Red Trailer) (feat. Casey Lee Williams).mp3"},
    {id: 5, tempo: 188, img: "img/RWBY.png", title: "This will be the day", src: "musicas/This Will Be the Day (feat. Casey Lee Williams).mp3"},
    {id: 6, tempo: 204, img: "img/RWBYv2.png", title: "Time to say goodbye", src: "musicas/Time to Say Goodbye.mp3"}
]

var musicas_online = []

function getSearch(event) {
    if (event.key == "Enter") {
        const API_KEY = 'AIzaSyB3SXkyNg4tuyOkz0zqCWvW8l7_2XiOT3Q';
        const searchTerm ="music " + document.getElementById("search_bar").value;
        document.getElementById("search_list").innerHTML = ""
        musicas_online = []

        fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&q=${searchTerm}&maxResults=8&type=video`)
            .then(response => response.json())
            .then(data => {
                data.items.forEach(item => {
                    if (item.snippet.title.length > 14) {
                        var titulo = item.snippet.title.slice(0, 18) + "..."
                    } else {
                        var titulo = item.snippet.title
                    }
                    
                    var search_item = {id: item.id.videoId, img: item.snippet.thumbnails.default.url, imgHigh: item.snippet.thumbnails.high.url, title: titulo}
                    musicas_online.push(search_item)
                    
                    var search_music = document.createElement("div")
                    search_music.innerHTML = `<img src="${search_item.img}"><h1>${search_item.title}</h1><button onclick="tryMusic('${search_item.id}')" class="material-symbols-outlined play">play_arrow</button>`
                    document.getElementById("search_list").appendChild(search_music)
                });
            })
                .catch(error => {
                    console.error('Ocorreu um erro ao pesquisar vídeos:', error);
            });
    }
}

var player
function playYtMusic(id) {
    player = new YT.Player('yt_player', {
        height: '0',
        width: '0',
        videoId: id,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'quality': 'small',
            'origin': 'https://music-player-0.web.app' //http://192.168.15.7:8080 & https://music-player-0.web.app
        },
        events: {
            'onReady': function(event) {
                event.target.playVideo()
            }
        }
    });
    document.getElementById("playpause").innerText = "pause"
}

function tryMusic(id) {
    if (audio) {
        audio.pause()
    }
    if (player) {
        player.destroy()
        player = null // a variavel ainda mantinha um valor mesmo apos o destroy
    }
    musicas_online.forEach(musica => {
        if (musica.id == id) {
            document.getElementById("img-atual").style.backgroundImage = `url("${musica.imgHigh}")`
        }
    })
    playYtMusic(id)
}

audio.addEventListener("play", () => {
    if (player) {
        player.destroy()
        player = null
    }
})

function placeMusic() {
    musicas.forEach(musica => {
        var newMusic = document.createElement("div")
        newMusic.innerHTML = `<h1>${musica.title}</h1><button onclick="chooseMusic(${musica.id})" class="material-symbols-outlined play">play_arrow</button>`
        document.getElementById("container-musicas").appendChild(newMusic)
    })
    document.getElementById("ordem").disabled = false
}
window.addEventListener("DOMContentLoaded", () => {
    placeMusic()
})

function timer(tempo, id) {
    var stoId
    function contagem() {
        if (!audio.paused && tempo > 0 && audio.id == id) {
            tempo--
            stoId = setTimeout(contagem, 1000)
        }else if (audio.paused) {
            stoId = setTimeout(contagem, 1000)
        }else if (tempo <= 0) {
            skip("proxima")
        }else if (audio.id != id) {
            clearTimeout(stoId)
        }
    }
    contagem()
}

var atual
function chooseMusic(id) {
    
    if (player) {
        player.destroy()
        player = null
    }

    musicas.forEach(musica => {
        if (musica.id == id) {
            atual = musicas.find(musica => musica.id == id)
            audio.src = musica.src
            audio.id = id
            audio.play()
            timer(musica.tempo, id)
            document.getElementById("img-atual").style.backgroundImage = `url(${musica.img})`
        }
    })
    document.getElementById("playpause").innerText = "pause"
}

function skip(dir) {
    var pos = musicas.indexOf(atual)
    if (dir == "proxima") {
        atual = musicas[pos + 1]
        if (atual != null) {
            var musica = musicas[pos + 1]
            audio.src = musica.src
            audio.id = musica.id
            audio.play()
            timer(musica.tempo, musica.id)
            document.getElementById("img-atual").style.backgroundImage = `url(${musica.img})`
        } else {
            atual = musicas[pos]
        }
    } else {
        atual = musicas[pos - 1]
        if (atual != null) {
            var musica = musicas[pos - 1]
            audio.src = musica.src
            audio.id = musica.id
            audio.play()
            timer(musica.tempo, musica.id)
            document.getElementById("img-atual").style.backgroundImage = `url(${musica.img})`
        } else {
            atual = musicas[pos]
        }
    }
}

function playPause() {

    let playBtn = document.getElementById("playpause")

    if (player) {
        if (player.getPlayerState() == 1) {
            player.pauseVideo()
            playBtn.innerText = "play_arrow"
        } else if (player.getPlayerState() == 2) {
            player.playVideo()
            playBtn.innerText = "pause"
        }
    } else {
        if (atual && !audio.paused) {
            audio.pause()
            playBtn.innerText = "play_arrow"
        } else if (atual && audio.paused) {
            audio.play()
            playBtn.innerText = "pause"
        }
    }
}

function ordem() {
    document.getElementById("ordem").disabled = true
    function shuffle() {
        if (atual == null) {
            musicas.sort(() => Math.random() - 0.5)
        }else {
            temp = musicas[musicas.indexOf(atual)]
            musicas.splice(musicas.indexOf(atual), 1)
            musicas.sort(() => Math.random() - 0.5)
            musicas.unshift(temp)
        }
    }
    shuffle()
    musicas.forEach(() => {
        document.getElementById("container-musicas").removeChild(document.getElementById("container-musicas").firstChild)
    })
    setTimeout(placeMusic, 200)
}


/* outras funções */

function openMenu() {
    var burg = document.getElementById("menuburg")
    var menu = document.getElementById("menu")
    if (burg.style.right == "unset") {
        menu.style.transform = "unset"
        burg.style.right = "8px"
        burg.style.left = "unset"
    } else {
        menu.style.transform = "translateX(-322px)"
        burg.style.right = "unset"
        burg.style.left = "8px"
    }
}