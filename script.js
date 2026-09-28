const audioContext = new AudioContext;

//get audio element
const audioElement = document.querySelector("audio");

//pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);

//gain node, volume
const gainNode = audioContext.createGain();
//volume control
const volumeControl = document.querySelector("#volume");

//panner options
const pannerOptions = {pan: 0};
const panner = new StereoPannerNode(audioContext, pannerOptions);
//panner control
const pannerControl = document.querySelector("#panner");




track.connect(gainNode).connect(panner).connect(audioContext.destination);

//select our play button
const playButton = document.querySelector("button");

playButton.addEventListener("click", async () => {
  //check if context is in suspended state (autoplay policy)
  if(audioContext.state === "suspended"){
    audioContext.resume();
  }

  //play or pause track depending on state
  if(playButton.dataset.playing === "false"){
    audioElement.play();
    playButton.dataset.playing = "true";
  } else if (playButton.dataset.playing === "true"){
    audioElement.pause();
    playButton.dataset.playing = "false";
  }
});

audioElement.addEventListener("ended", () => {
  playButton.dataset.playing = "false";
});

volumeControl.addEventListener("input", () => {
  gainNode.gain.value = volumeControl.value;
});

pannerControl.addEventListener("input", () => {
  panner.pan.value = pannerControl.value;
});


