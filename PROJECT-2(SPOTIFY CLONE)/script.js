console.log(`Let's write Javascript`);
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                      <div class="info">
                        <div>${song.replaceAll("%20", " ")} </div>
                        <div>Swastik</div>
                      </div>
                      <div class="playnow">
                        <img src="Play.svg" alt="">
                      </div> </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
       e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
       })
    // console.log(e.getElementsByTagName("div")[0]);
    // console.log(e.querySelector(".info"));
    })

    return songs;
}

const playMusic= (track,pause=false) =>{
    // let audio = new Audio("/songs/" + track)
    if (!pause) {
        currentsong.play();
        play.src = "Pause.svg";
    }
    currentsong.src = `/${currFolder}/`+ track
    
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"

}
async function displayAlbum() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardcontainer = document.querySelector(".cardcontainer")
  console.log(cardcontainer);
  
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0]
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card cursor">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                >
                  <!-- Green background circle -->
                  <circle cx="24" cy="24" r="24" fill="#1cd760" />

                  <!-- Black icon path scaled and centered -->
                  <g transform="translate(12,12) scale(1.01)">
                    <path
                      d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                      fill="black"
                    />
                  </g>
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpeg"
                alt=""
              />
              <h3>${response.title}</h3>
              <p>${response.description}</p>
            </div>`
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    })
  })
}

async function main() {

   await getSongs("songs/ncs");
  playMusic(songs[0],true)
//   console.log(songs);

  displayAlbum()

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src = "Pause.svg"
        }
        else{
            currentsong.pause();
            play.src = "Play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
      const leftPanel = document.querySelector(".left");
      if (leftPanel.style.left === "0px" || leftPanel.style.left === "0%") {
        leftPanel.style.left = "-100%";
      } else {
        leftPanel.style.left = "0";
      }
    });
    
    Previous.addEventListener("click", ()=>{
      console.log("Prevoius click")
      console.log(currentsong);
      let index = songs.indexOf(currentsong.src.split("/").splice(-1)[0])
      if ((index-1)>= 0) {
        playMusic(songs[index-1])
      }
      
    })
    Next.addEventListener("click", ()=>{
      console.log("Next click")
      let index = songs.indexOf(currentsong.src.split("/").splice(-1)[0])
      if ((index+1)<songs.length) {
        playMusic(songs[index+1]) 
      }
    })
    
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/ 100")
      currentsong.volume = parseInt(e.target.value) / 100
      if (currentsong.volume >0){
          document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
      }
  })

  document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("Sound.svg")){
        e.target.src = e.target.src.replace("Sound.svg", "mute.svg")
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "Sound.svg")
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})


}

main();
