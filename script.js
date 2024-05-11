/* audio */

const audio = new Audio()

var musicas = [
    {id: 1, img: "img/RWBY.png", title: "Mirror mirror", src: "musicas/Mirror Mirror (White Trailer) (feat. Casey Lee Williams).mp3"},
    {id: 2, img: "img/nier.png", title: "The weight of the world", src: "musicas/NieR_  Automata OST-The Weight of the World ENG Lyrics.mp3"},
    {id: 3, img: "img/RWBY-neo.png", title: "One thing", src: "musicas/One Thing (feat. Casey Lee Williams) by Jeff Williams with Lyrics.mp3"},
    {id: 4, img: "img/RWBY.png", title: "Red like roses", src: "musicas/Red Like Roses (Red Trailer) (feat. Casey Lee Williams).mp3"},
    {id: 5, img: "img/RWBY.png", title: "This will be the day", src: "musicas/This Will Be the Day (feat. Casey Lee Williams).mp3"},
    {id: 6, img: "img/RWBYv2.png", title: "Time to say goodbye", src: "musicas/Time to Say Goodbye.mp3"}
]

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

var atual
function chooseMusic(id) {
    musicas.forEach(musica => {
        if (musica.id == id) {
            atual = musicas.find(musica => musica.id == id)
            audio.src = musica.src
            audio.play()
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
            audio.play()
            document.getElementById("img-atual").style.backgroundImage = `url(${musica.img})`
        } else {
            atual = musicas[pos]
        }
    } else {
        atual = musicas[pos - 1]
        if (atual != null) {
            var musica = musicas[pos - 1]
            audio.src = musica.src
            audio.play()
            document.getElementById("img-atual").style.backgroundImage = `url(${musica.img})`
        } else {
            atual = musicas[pos]
        }
    }
}

function playPause() {
    if (atual && !audio.paused) {
        audio.pause()
        document.getElementById("playpause").innerText = "play_arrow"
    } else if (atual && audio.paused) {
        audio.play()
        document.getElementById("playpause").innerText = "pause"
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

