// script.js
document.addEventListener('DOMContentLoaded', () => {
    const slots = document.querySelectorAll('.slot');

    slots.forEach(slot => {
        slot.addEventListener('click', () => {
            const slotNumber = slot.getAttribute('data-slot');
            alert(`你点击了槽位 ${slotNumber}`);
        });
    });
});