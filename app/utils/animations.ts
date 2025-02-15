import { gsap } from 'gsap';

export const initNavAnimations = () => {
  // Navbar animations
  gsap.from('.nav-container', {
    y: -100,
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out'
  });

  gsap.from('.search-container', {
    width: 0,
    opacity: 0,
    duration: 1.2,
    delay: 0.5,
    ease: 'power2.inOut'
  });

  gsap.from('.nav-items', {
    opacity: 0,
    x: 20,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.8,
    ease: 'power2.out'
  });
};

export const initSidebarAnimations = () => {
  gsap.from('.sidebar-container', {
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out'
  });

  gsap.from('.sidebar-logo', {
    y: -20,
    opacity: 0,
    duration: 1,
    delay: 0.6,
    ease: 'power2.out'
  });

  gsap.from('.nav-group', {
    x: -20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.3,
    delay: 1,
    ease: 'power2.out'
  });
};
