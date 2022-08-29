const getEntries = () => {
    const dataProxy = document.querySelector('#dataProxy');
    const entries = JSON.parse(dataProxy.dataset.entries);
    return entries?entries:undefined;
}

const inpMediaType = document.querySelector('#format');
inpMediaType.addEventListener('change', (e) => { 
    // console.log(e.target.value); 
    console.log(getEntries());
});