console.log('Welcome to My Awesome Project!');

document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    h1.addEventListener('click', () => {
        alert('Thanks for visiting!');
    });
});