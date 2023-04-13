const dropButton = document.querySelector('#toggle-button');
const dropContent = document.querySelector('.dropContent');
const body = document.querySelector('body');

dropButton.addEventListener('click', () => {
    console.log('Drop Button Clicked');
    if (dropContent.style.display === 'flex') {
        dropContent.style.display = 'none';
        return;
    } else {
        dropContent.style.display = 'flex';
        return;
    }
})

body.addEventListener('click', (e) => {
    if (e.target.id !== 'toggle-button') {
        dropContent.style.display = 'none';
        return;
    }
})