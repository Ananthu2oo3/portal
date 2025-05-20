const typewriterTexts = ['Customer Login', 'Vendor Login', 'Employee Login'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriterEffect() {
  const element = document.querySelector('.typewriter');
  if (!element) return;

  const currentText = typewriterTexts[textIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  element.innerHTML = currentText.substring(0, charIndex) + '<span class="cursor">|</span>';

  if (!isDeleting && charIndex === currentText.length) {
    setTimeout(() => {
      isDeleting = true;
      typeWriterEffect();
    }, 1000);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % typewriterTexts.length;
  }

  const speed = isDeleting ? 50 : 100;
  setTimeout(typeWriterEffect, speed);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeWriterEffect, 500);
});
