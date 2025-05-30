
function hover(ogham,japanese) {
    document.getElementById('ogham').innerHTML = ogham;
    document.getElementById('japanese').innerHTML = japanese;        
}

function populate(src) {
    if(document.readyState == 'complete') {
    fetch(src)
        .then(res => res.json())
        .then((json) => {
            var gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            for (var i = 0; i < json.length; i++) {
                var is_breaker = Math.random() * 10 < 3;
                if (is_breaker) {
                    var breaker = document.createElement("div");
                    breaker.style.width= (100+(Math.random() * 100))+'px';
                    breaker.style.height= '1px';
                    breaker.style.pointerEvents = 'none';
                    gallery.appendChild(breaker);
                }

                var item;

                if (json[i]?.type === "image") {
                    item = isImage(json[i]);
                }
                if (json[i]?.type === "text") {
                    item = isText(json[i]);
                }
                if (json[i]?.type === "model") {
                    item = isModel(json[i]);
                }

                if (item){
                    gallery.appendChild(item);
                }
            }
            loaded = true;
        }).catch(err => {
            console.error("Error fetching data:", err);
        });
    }
}

function isImage(data, index = 0){
    var image = document.createElement("img");
        image.setAttribute("src", data.src[index]);
        image.setAttribute("alt", data.text[0]);
        image.setAttribute("id", data.text[0]);
        image.onclick = function(e) { fullScreenImage(e.target.src); };
    return image;
}

function isText(data){
    var text = document.createElement("article");
        text.width = "240px";
        text.height = "180px";
        text.innerHTML = data.text[0];

        text.onclick = function(e) { fullScreenText(data); };
    return text;
}

function isModel(data){
    var model = document.createElement("model-viewer");
        model.width = "360px";
        model.height = "240px";
        model.setAttribute("src", data.src[0]);
        model.setAttribute("alt", data.text[0]);
        model.setAttribute("id", data.text[0]);
        model.setAttribute("auto-rotate", true);
        model.setAttribute("rotation-per-second", '5deg');

        model.onclick = function(e) { fullScreenImage(e.target.src); };
    return model;
}

function fullScreenImage(src) {
    var element = "img";
    if (src.includes(".glb")) {
        element = "model-viewer";
    }
    

    var fullScreen = document.createElement("div");
    var fullScreenButton = document.createElement("button");
        fullScreenButton.innerHTML = "x";
        fullScreenButton.onclick = function() { fullScreen.remove(); };
        fullScreen.appendChild(fullScreenButton);

    var fullScreenImage = document.createElement(element);
    fullScreenImage.src = src;
    fullScreenImage.style.minWidth = "60%";
    fullScreenImage.style.minWidth = "60%";
    fullScreenImage.style.maxWidth = "90%";
    fullScreenImage.style.maxHeight = "90%";
    fullScreenImage.style.objectFit = "contain";
    fullScreen.id = "fullscreen";

    if (element === "model-viewer") {
        fullScreenImage.height = "inherit";
        fullScreenImage.width = "inherit";
        fullScreenImage.setAttribute("camera-controls", true);
        fullScreenImage.setAttribute("auto-rotate", true);
        fullScreenImage.setAttribute("rotation-per-second", '5deg');
    }
   
    fullScreen.appendChild(fullScreenImage);
    document.getElementById("nav").appendChild(fullScreen);
    if (element === "img") {
        fullScreen.onclick = function() { fullScreen.remove(); };
    }
}

function fullScreenText(data) {
    var fullScreen = document.createElement("div");
        fullScreen.id = "fullscreen";
    var fullScreenButton = document.createElement("button");
        fullScreenButton.innerHTML = "x";
        fullScreenButton.onclick = function() { fullScreen.remove(); };
        fullScreen.appendChild(fullScreenButton);

    var article = document.createElement("article");
    var title = document.createElement("h1");
        title.innerHTML = data.text[0];
        article.appendChild(title);
        
        if (data.src && data.src.length > 0) {
            var splash = isImage(data);
            article.appendChild(splash);
        }

        for (var i = 1; i < data.text.length; i++) {
            var paragraph = document.createElement("p");
            paragraph.innerHTML = data.text[i];
            article.appendChild(paragraph);

            if (data.src && data.src.length > i) {
                var splash = isImage(data,i);
                article.appendChild(splash);
            }
        }
   
    fullScreen.appendChild(article);
    document.getElementById("nav").appendChild(fullScreen);
}

