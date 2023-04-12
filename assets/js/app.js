const dropButton = document.querySelector('#toggle-button');
const dropContent = document.querySelector('.dropContent');

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