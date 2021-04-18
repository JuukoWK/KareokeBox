///  Variable Declaration ///

const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
const audio = document.getElementById('audioElement')


/// api URL ///
const apiURL = 'https://api.lyrics.ovh';

/// adding event listener in form

form.addEventListener('submit', e=> {
    e.preventDefault();
    searchValue = search.value.trim()


    // Check if Search is empty//
    if(!searchValue)
        alert("There is nothing to search")
    else
        searchSong(searchValue)
    
})


//function to search song //
async function searchSong(searchValue){

    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`)
    const data = await searchResult.json();
    showData(data)
}

//display final result in DOM - takes results from api and makes them readable//
function showData(data){
  
    result.innerHTML = `
    <ul class="song-list">
      ${data.data
        .map(song=> `<li>
                    <div>
                        <strong>${song.artist.name}</strong> -${song.title} 
                    </div>
                    <span data-artist="${song.artist.name}" data-songtitle="${song.title}" data-audiofile="${song.preview}"> Play </span>
                </li>`
        )
        .join('')}
    </ul>
  `;
}


//event listener in get lyrics button
result.addEventListener('click', e=>{
    const clickedElement = e.target;

    //checking clicked elemet is button or not
    if (clickedElement.tagName === 'SPAN'){
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        const audioFile = clickedElement.getAttribute('data-audiofile');
        
        getLyrics(artist, songTitle ,audioFile)
        
    }
})

// Get lyrics for song
async function getLyrics(artist, songTitle ,audioFile) {
   
    let res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    if(res.status === 200){
        var data = await res.json();

// Regular expressions replaced with break at end of line//

        var lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    
        <p>${lyrics}</p>`;
        
        // Create Audio player with audio file(link) from api//
        audio.innerHTML  = `<audio controls currentTime>< <source src="${audioFile}" /></audio>`;
    }else
        audio.innerHTML = `<p>No lyrics</p>`;
}
    

// load video player - consideration for further design, make it a video call function//
var video = document.querySelector("#videoElement");
    const constraints = {
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440
        },
      }
    };

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err0r) {
          
        });
    }
    
    function stop(e) {
      var stream = video.srcObject;
      var tracks = stream.getTracks();

      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
      }

      video.srcObject = null;
    }