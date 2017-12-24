
//Ten sam skrypt tylko ze z kometarzami
//Tak zeby sie pozniej nie pogubic co i jak.

const $playButton = $('.play');
const $fourByFourButton = $('.options1');
const $sixBySixButton = $('.options2');
const $eightByEightButton = $('.options3');
const $allButtons = $('.bar');
const $table = $(".tg-yw4l");
const NUMBER_OF_TILES = 64;

let tileList = [];
const path = "res/";
for (let i = 0; i < NUMBER_OF_TILES ; i++)
        tileList.push(path + i +".png");

function randomize(sizeToRandom) {
    return (Math.floor(Math.random() * sizeToRandom));
}

class Tiles {

    constructor() {
        this.tilesMapArray = [];
        this.logicMap = [];
        this.size = 0;
    }

    initializeSize(size) {
        $playButton.off("click");
        this.size = size;
        let map1 = new Map();
        let map2 = new Map();
        let tilesMapArray1 = [];
        let tilesMapArray2 = [];

        //tworzenie dwoch map pomocniczych map1 i map2, losowanie obrazka i przypisanie do map,
        //dzieki czeku kazda obrazek w kazdej z map ma ten sam klucz
        for (let i = 0; i < (this.size * this.size) / 2; i++) {
            map1.set(i, tileList[i]);//[8,16,32] elementow
            map2.set(i, tileList[i]);//[8,16,32] elementow
        }

        //tworzenie tablicy tablic [K,V] do pozniejszego losowego przypisania ich do pol w DOM
        //taka tablica ma [16, 32, 64] elementy
        tilesMapArray1 = Array.from(map1);
        tilesMapArray2 = Array.from(map2);
        tilesMapArray1.forEach((item) => {
            this.tilesMapArray.push.call(this.tilesMapArray, item);
        });
        tilesMapArray2.forEach((item) => {
            this.tilesMapArray.push.call(this.tilesMapArray, item);
        });

        for (let i = 0; i < size * size; i++) {
            this.logicMap[i] = false;
        }
    }
}


class Playground extends Tiles {
    constructor(){
        super();
        this.nodes = [];
        this.$wellDomElements = $table.children();
    }
    createRandomTileNodes() {
        let tempArray = [];

        //zmienianie uporzadkowanej tablicy kart w losową
        for (let i = 0; i < this.size * this.size; i++){
            let randomized = randomize(this.tilesMapArray.length);
            tempArray.push(this.tilesMapArray[randomized]);
            this.tilesMapArray.splice(randomized,1);
        }
        //przypisanie nowej tablicy do starej
        this.tilesMapArray = tempArray;

        //tworzenie nodow ze stworzonej losowej tablicy
        this.tilesMapArray.forEach((item)=>{
            //console.log(item[1]);
            //tworzenie nowego noda <img>
            let node = document.createElement("img");
            //let attribute = document.createAttribute("src");

            //wpsisanie adresu obrazka do atrybutu src
            node.setAttribute("src",item[1]);
            //console.log(node);
            this.nodes.push(node);
        });

        //jQuery aktywacja przycisku play
        $playButton.on("click", function(){
            //wylaczenie wszystkich przyciskow
            $fourByFourButton.off("click");
            $sixBySixButton.off("click");
            $eightByEightButton.off("click");
            $playButton.off("click").css("opacity","")
                    .hover(function(){$(this).css("opacity","")},function(){$(this).css("opacity","")});
            initializeGame();
        }).hover(function(){$(this).css("opacity","1")},function(){$(this).css("opacity","0.4")});

    }

}

class Game extends Playground{
    constructor(){
        super();
        this.pairFlag = false;
        this.pair = [];
        this.htmlNode = [];
        this.pairFound = false;
        this.cardsLeft = 0;
    }

    gamePlay(){
        //jQery - podstawienie nodow do odpowiednich well`i - dzieci w tabeli
        this.gameSize = this.size * this.size;
        for (let i = 0 ; i < this.gameSize  ; i++ ){
            let element = this.$wellDomElements[i];
            $(element).css("opacity","1").append(this.nodes[i]);
            let addedNode = $(element).children().get();
            $(addedNode).on("click", nodeClick).css("opacity","0").attr("id",i);
        }
        this.cardsLeft = this.gameSize;
    }
    checkPair(){
        //jezeli nie ma pelnej tablicy par (2 elementy) to wychodzimy ze sprawdzania
        while (this.pair.length < 2) {
            this.pairHasTwoItems = false;
            return false;
        }
        //jesli jest para to spradzane sa node`y czy są takie same (po kluczu) z tablicy tablic[K,V]
        let pairIDtheSame = !(this.pair[0][0] != this.pair[1][0]);

        //dodatkowo bool ustawiane na false jezeli kliknieto jeszcze raz ten same element
        //zabezpieczenie przed sprytnimi uzytkownikami
        while ((pairIDtheSame) && ($(this.htmlNode[0]).attr("id") === $(this.htmlNode[1]).attr("id"))){
                    this.pair.pop();
                    this.htmlNode.pop();
                    return false;
        }
        //czyli para ma 2 itemy i nie jest to jeden item klikniety dwa razy
        this.pairHasTwoItems = true;
        //czyszczenie tablicy tablic[K,V] po wszystkim - nie bedzie juz potrzebna w tym momencie
        this.pair = [];
        return pairIDtheSame;
    }
    addNodeToPairAndCheck(node, clickedNode){
            //po kliknieciu node przekazywany jest do tablicy par i odpalana jest funkcja spradzajaca pare
            this.pair.push(node);
            this.htmlNode.push(clickedNode);
            this.pairFound = this.checkPair();
            //wyjscie kiedy nie ma pary (dwoch odkrytych kart
            while (!this.pairHasTwoItems) return;

            //odpalenie funkcji CSS kiedy para jest
            while (!this.pairFound){
                //odpalenie funkcji CSS kiedy nie ma pary
                this.cssWhenNotFound();
                this.htmlNode=[];
                this.pairFlag = false;
                return;
            }
            this.cssWhenFound();
            this.updateAndCheckLogicMap();
            this.htmlNode=[];
    }
    cssWhenFound(){
            $(this.htmlNode[0]).off("click");
            $(this.htmlNode[1]).off("click");
            $(this.htmlNode[0]).animate({
                opacity : 0,
            }, 250, this.animation);
            $(this.htmlNode[1]).animate({
                opacity : 0,
            }, 250, this.animation);

    }
    cssWhenNotFound(){

                window.setTimeout(1000, ()=>{})
                $(this.htmlNode[0]).animate({
                    opacity: 0,
                },1000);
                $(this.htmlNode[1]).animate({
                    opacity: 0,
                },1000);
    }

    animation(){
            $(this).attr("src","res/success64.png");
            $(this).css("opacity","0");
            $(this).animate({
                opacity:1,
            }, 250)
        }

    updateAndCheckLogicMap() {
        this.logicMap[$(this.htmlNode[0]).attr("id")] = true;
        this.logicMap[$(this.htmlNode[1]).attr("id")] = true;
        this.cardsLeft -= 2;
        while (this.cardsLeft > 0) {
            return;
        }
        window.setTimeout(function () {
            if (confirm("Gra skonczona - przeladuj strone")) location.reload();
        }, 500);
        }

}

let game = new Game();

function initializeSize(size) {
    game = new Game();
    game.initializeSize(size);
    game.createRandomTileNodes();
}

function initializeGame(){
    game.gamePlay();
}

$fourByFourButton.on("click", onClick16);
$sixBySixButton.on("click", onClick36);
$eightByEightButton.on("click", onClick64);

function onClick16(){
    clearButtonsCSS();
    initializeSize(4);
    $fourByFourButton.css("opacity","1").css("background-color","#66c2ff");
}
function onClick36(){
    clearButtonsCSS();
    initializeSize(6);
    $sixBySixButton.css("opacity","1").css("background-color","#66c2ff");
}
function onClick64() {
    clearButtonsCSS();
    initializeSize(8);
    $eightByEightButton.css("opacity","1").css("background-color","#66c2ff");
}
function clearButtonsCSS() {
    $allButtons.css("opacity","")
}

function nodeClick(){
    let clickedNode = $(event.target);
    $(clickedNode).css("opacity","1");
    let nodeIndex = clickedNode.attr("id");
    game.addNodeToPairAndCheck(game.tilesMapArray[nodeIndex], $(clickedNode));
}
