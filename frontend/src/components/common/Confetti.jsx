import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  try {
    // School pride colors: Deep Navy #1F4E5F, Teal #2C6E8F, Gold #F4B942, Emerald #10B981
    const colors = ['#1F4E5F', '#2C6E8F', '#F4B942', '#10B981', '#EFA92E'];

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: colors,
      ticks: 200,
      gravity: 1.1,
      scalar: 0.9,
      disableForReducedMotion: true
    });

    // Secondary burst for extra joy
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    }, 200);
  } catch (err) {
    console.warn('Confetti could not be fired', err);
  }
};
