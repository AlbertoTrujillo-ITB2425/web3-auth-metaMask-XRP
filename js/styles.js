// Visual Effects for Buttons and Inputs
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.transform = "scale(1.05)";
        button.style.transition = "transform 0.2s ease-in-out";
    });
    button.addEventListener('mouseout', () => {
        button.style.transform = "scale(1)";
    });
});

document.querySelectorAll('.input').forEach(input => {
    input.addEventListener('focus', () => {
        input.style.borderColor = "#00B8D4";
    });
    input.addEventListener('blur', () => {
        input.style.borderColor = "#444";
    });
});
