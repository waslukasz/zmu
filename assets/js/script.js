document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 800,
    once: false,
    offset: 50,
  });

  const stickyNav = document.getElementById("stickyNav");
  window.addEventListener("scroll", function () {
    if (window.scrollY > window.innerHeight * 0.9) {
      stickyNav.classList.add("visible");
    } else {
      stickyNav.classList.remove("visible");
    }
  });

  const carousel = document.querySelector(".carousel");
  const lightboxOverlay = document.getElementById("lightboxOverlay");

  let stopAutoPlay = () => {};
  let startAutoPlay = () => {};
  let currentIndex = 0;
  let isLightboxTransitioning = false;

  if (carousel) {
    const slides = document.querySelector(".carousel-slides");
    const carouselSlides = document.querySelectorAll(".carousel-slide");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("carouselDots");

    const totalSlides = carouselSlides.length;
    let autoPlayInterval;

    carouselSlides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      dot.setAttribute("data-index", index);
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".carousel-dot");
    function updateDots() {
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[currentIndex].classList.add("active");
    }
    function updateSlidePosition() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }
    function goToNextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlidePosition();
    }
    function goToPrevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlidePosition();
    }
    startAutoPlay = function () {
      clearInterval(autoPlayInterval);
      if (lightboxOverlay && !lightboxOverlay.classList.contains("active")) {
        autoPlayInterval = setInterval(goToNextSlide, 5000);
      }
    };
    stopAutoPlay = function () {
      clearInterval(autoPlayInterval);
    };
    nextBtn.addEventListener("click", () => {
      goToNextSlide();
      startAutoPlay();
    });
    prevBtn.addEventListener("click", () => {
      goToPrevSlide();
      startAutoPlay();
    });
    dotsContainer.addEventListener("click", (e) => {
      if (e.target.matches(".carousel-dot")) {
        currentIndex = parseInt(e.target.getAttribute("data-index"));
        updateSlidePosition();
        startAutoPlay();
      }
    });
    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);
    const carouselObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      },
      { threshold: 0.5 }
    );
    carouselObserver.observe(carousel);
    updateDots();
  }

  if (lightboxOverlay) {
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const clickableSlides = document.querySelectorAll(".carousel-slide");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    function changeImage(direction) {
      if (isLightboxTransitioning) return;
      isLightboxTransitioning = true;

      const totalSlides = clickableSlides.length;
      lightboxImage.classList.add("lightbox-image--out");

      setTimeout(() => {
        if (direction === "next") {
          currentIndex = (currentIndex + 1) % totalSlides;
        } else {
          currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        }
        const newSrc = clickableSlides[currentIndex].querySelector("img").src;
        lightboxImage.src = newSrc;

        updateSlidePosition();

        lightboxImage.classList.remove("lightbox-image--out");
      }, 200);

      setTimeout(() => {
        isLightboxTransitioning = false;
      }, 400);
    }

    function openLightbox(index) {
      currentIndex = index;
      stopAutoPlay();
      const imgSrc = clickableSlides[index].querySelector("img").src;
      lightboxImage.src = imgSrc;
      lightboxOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lightboxOverlay.classList.remove("active");
      document.body.style.overflow = "";
      startAutoPlay();
    }
    clickableSlides.forEach((slide, index) => {
      slide.addEventListener("click", function () {
        if (window.innerWidth < 1000) return;
        const imgElement = this.querySelector("img");
        if (imgElement.naturalWidth > imgElement.clientWidth * 1.05) {
          openLightbox(index);
        }
      });
    });
    window.addEventListener("resize", () => {
      if (
        lightboxOverlay.classList.contains("active") &&
        window.innerWidth < 1000
      ) {
        closeLightbox();
      }
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxImage.addEventListener("click", closeLightbox);
    lightboxOverlay.addEventListener("click", (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
    lightboxPrev.addEventListener("click", () => changeImage("prev"));
    lightboxNext.addEventListener("click", () => changeImage("next"));

    document.addEventListener("keydown", (e) => {
      if (lightboxOverlay.classList.contains("active")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") changeImage("next");
        if (e.key === "ArrowLeft") changeImage("prev");
      }
    });
  }
});
