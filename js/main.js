

const scroller = scrollama();
// const scrolly = scrollama()
function handleStepEnter(response){
    if(response.direction === 'down'){
        response.element.style.opacity = 1
    }
    else if(response.direction === 'up'){
        response.element.style.opacity = 0
    }
}
function handleStepExit(response){
    if(response.direction === 'up'){
        response.element.style.opacity = 0
    }
    else{
        response.element.style.opacity = 1
    }
}

function init(){
scroller
    .setup({
        step: '.step',
        debug: true,
        offset: 0.5,
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);
    window.addEventListener("resize", scroller.resize);
}
init();