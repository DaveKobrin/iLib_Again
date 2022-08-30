const getEntries = () => {
    const dataProxy = document.querySelector('#dataProxy');
    const entries = JSON.parse(dataProxy.dataset.entries);
    return entries?entries:undefined;
}

const format = document.querySelector('#filter');
format.addEventListener('click', (e) => { 
    const filter = {};
    filter.format = document.querySelector('#format').value;
    filter.creator_name = document.querySelector('#creator_name').value;
    filter.location = document.querySelector('#location').value;
    filter.tags = document.querySelector('#tags').value;
    
    console.log({filter}); 
    // console.log(e.target.value);

    const entries = getEntries();
    console.log(entries);
    const mainSection = document.querySelector('#mainSection')
    const container = document.createElement('div');
    container.classList = 'row row-cols-1 row-cols-md-3 g-4';
    let html = '';
    for(const entry of entries) {
        console.log(`tags: ${entry.tags}    target: ${e.target.value}`);
        if ((filter.format       === 'All' || filter.format       === entry.format) && 
            (filter.creator_name === 'All' || filter.creator_name === entry.creator_name) &&
            (filter.location     === 'All' || filter.location     === entry.location) &&
            (filter.tags         === 'All' || entry.tags.includes(filter.tags))) {

            html += `
            <div class="col">
                <div class="card" style="max-width: 18em; min-width: 10em">
                    <img class="card-img-top" src="${entry.cover_img}" alt="${entry.cover_alt}">
                    <div class="card-body">
                        <h3 class="card-title">
                            <a href="/media/${entry._id}">${entry.title}</a>
                        </h3>
                    </div>
                    <div class="card-footer">
                        <a class="card-link" href="/media/${entry._id}/edit">Edit</a>
                        <form action="/media/${entry._id}?_method=DELETE" method="POST">
                            <input type="submit" value="Delete"/>
                        </form>
                    </div>
                </div>
            </div>`;
        }
    }
    container.innerHTML = html;
    mainSection.innerHTML = '';
    mainSection.appendChild(container); 
    console.log({html});
});
