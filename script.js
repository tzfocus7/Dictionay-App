const wrapper = document.querySelector(".wrapper");
const searchInput = wrapper.querySelector("input");
const infoText = wrapper.querySelector(".info-text");
const synonyms = wrapper.querySelector(".synonyms .list");
const volumeIcon = wrapper.querySelector(".word i");
const closeIcon = wrapper.querySelector(".search span");
let audio;


//data function
function data(result, word){
    if (result.title){ //if api returns the message of can't find word
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Try searching for another word.`;
    } else {
        wrapper.classList.add("active");

        //lets pass the particular response data to a particular html element
        let definitions = result[0].meanings[0].definitions[0];
        let phonetics = `${result[0].meanings[0].partOfSpeech} ${result[0].phonetics[0].text}`;

        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        audio = new Audio(result[0].phonetics[0].audio);

        if (result[0].phonetics[0].audio == ""){
            volumeIcon.style.display = "none";
        } else {
            volumeIcon.style.display = "block";
        }

        if (result[0].phonetics[0].text == undefined){
            document.querySelector(".word span").style.display = "none";
        } else {
            document.querySelector(".word span").style.display = "block";
        }

        if(definitions.example == undefined){
            document.querySelector(".example").style.display = "none";
        } else {
            document.querySelector(".example").style.display = "block";
        }

        if (result[0].meanings[0].synonyms[0] == undefined){ //if there is no synonyms, then hide the synonyms div
            synonyms.parentElement.style.display = "none";
        } else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (i = 0; i < 5; i++){
                let tag = `<span onclick=search("${result[0].meanings[0].synonyms[i]}")>${result[0].meanings[0].synonyms[i]},</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }

        console.log(result)
    }
   
}
//search function
function search(word){
    searchInput.value = word;
    fetchApi(word);
    wrapper.classList.remove("active");
}
//fetch Api function
function fetchApi(word){
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(res => res.json()).then(result => {
        data(result, word)
    })
    wrapper.classList.remove("active");
}

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value){
        fetchApi(e.target.value);
    }
   
})

volumeIcon.addEventListener("click", () => {
    audio.play();
});

closeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML = "Type a word and press enter to get meaning, example, pronunciation, and synonyms."
})