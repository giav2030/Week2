let audioCtx;
let buffer;
let source;

const play = document.getElementById("play");
const stop = document.getElementById("stop");

const playbackControl = document.getElementById("playback-rate-control");
const playbackValue = document.getElementById("playback-rate-value");

//values
const volValue = document.querySelector("#volValue");
const panValue = document.querySelector("#panValue");
const volInput = document.querySelector("#volume");
const panInput = document.querySelector("#panner");

volValue.textContent = volInput.value;
panValue.textContent = panInput.value;

volInput.addEventListener("input", (play) => {
    volValue.textContent = play.target.value;
});

panInput.addEventListener("input", (play) => {
    panValue.textContent = play.target.value;
});

async function loadAudio() {
    try {
        //load audio file
        const response = await fetch("media/On The Eve - The Grey Room _ Density & Time.mp3");
        //decode it
        buffer = await audioCtx.decodeAudioData(await response.arrayBuffer());
    } catch (err) {
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
}

play.addEventListener("click", async () => {
    if(!audioCtx){
        audioCtx = new AudioContext();
        await loadAudio();
    }
    //gain node, volume
    const gainNode = audioCtx.createGain();
    //volume control
    const volumeControl = document.querySelector("#volume");

    //panner options    
    const pannerOptions = {pan: 0};
    const panner = new StereoPannerNode(audioCtx, pannerOptions);
    //panner control
    const pannerControl = document.querySelector("#panner");
    source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode).connect(panner).connect(audioCtx.destination);
    source.loop = true;
    source.playbackRate.value = playbackControl.value;
    source.start();
    play.disabled = true;
    stop.disabled = false;
    playbackControl.disabled = false;

    volumeControl.addEventListener("input", () => {
    gainNode.gain.value = volumeControl.value;
    });

    pannerControl.addEventListener("input", () => {
    panner.pan.value = pannerControl.value;
    });
});

stop.addEventListener("click", () => {
    source.stop();
    play.disabled = false;
    stop.disabled = true;
    playbackControl.disabled = true;
});

playbackControl.oninput = () => {
    source.playbackRate.value = playbackControl.value;
    playbackValue.textContent = playbackControl.value;
};


