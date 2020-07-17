function clickImage(event){
window.globals.getImageName(event.target.id);
}

async function sampleFunction() {
    let response = await fetch("https://picsum.photos/v2/list");
    let jsonData
    
    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        jsonData = await response.json();
    } else {
        alert("HTTP-Error: " + response.status);
    }
    var parent = document.getElementById('left-col')
    for (var i = 0; i <= 11; i++) {
        img = new Image();
        img.src = jsonData[i]["download_url"] || '';
        // img.class = "thumnail"
        img.classList.add("thumnail");
        img.id=jsonData[i]["download_url"]
        // img.styles.width = "20%"
        parent.appendChild(img);
        image=document.getElementById(jsonData[i]["download_url"])
        image.addEventListener("click",clickImage)
    }
}

