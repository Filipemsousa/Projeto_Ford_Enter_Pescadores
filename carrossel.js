const elemSlides = document.querySelector(".slides");
const elemBotaoEsquerdo = document.querySelector(".esquerda");
const elemBotaoDireito = document.querySelector(".direita");
const elemImagens = document.querySelectorAll(".slides img");

const tamanhoLista = elemImagens.length -1;

let index = 0;


elemBotaoEsquerdo.addEventListener('click',() =>{ 
    index--;
    if(index < 0) index = tamanhoLista;
    atualizarCarrossel();
    
});

elemBotaoDireito.addEventListener('click',() =>{ 
    incrementarIndex();
    atualizarCarrossel();
    
});

const incrementarIndex = () =>{
    index--;
    if(index < 0) index = tamanhoLista;
}

const atualizarCarrossel = () => {
    elemSlides.style.transform = `translateX(-${index*100}%)`;
}

setInterval(() =>{
    incrementarIndex();
atualizarCarrossel()},3000);
