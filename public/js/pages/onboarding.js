export function init() {
  const onboarding1 = document.querySelector("#onboarding-1");
  const onboarding2 = document.getElementById("onboarding-2");
  const onboarding3 = document.querySelector("#onboarding-3");
  const nextBtn = document.querySelector("#onboarding-3 button");
  const sliderDot = document.querySelector("#slider-dot");

  setTimeout(() => {
    onboarding1.style.right = "80vw";
    onboarding1.style.opacity = 0;
    onboarding2.style.left = 0;
    onboarding2.style.right = 0;
    onboarding2.style.opacity = 100;
  }, 1000);

  onboarding2.addEventListener("click", () => {
    onboarding2.style.opacity = 0;
    onboarding2.style.right = "100vw";
    onboarding2.style.left = "-100vw";
    onboarding3.style.opacity = 100;
    onboarding3.style.left = 0;
    onboarding3.style.right = 0;
  });

  nextBtn.addEventListener("click", function () {
    if (this.dataset.slide < 3) {
      const prevSlider = document.querySelector(`#onboarding-3 div:nth-child(${this.dataset.slide})`);
      const nextSlider = document.querySelector(`#onboarding-3 div:nth-child(${++this.dataset.slide})`); // this will select next slide and also increases dataset.slide by one :)

      prevSlider.style.left = "-100%";
      prevSlider.style.right = "100%";
      nextSlider.style.left = 0;
      nextSlider.style.right = 0;

      sliderDot.style.width = "92px";
      setTimeout(() => {
        sliderDot.style.left = `${52 * (this.dataset.slide - 1)}px`;
        sliderDot.style.width = "40px";
      }, 250);

      if (this.dataset.slide == 3) {
        this.textContent = "Get Started";
      }
    }
  });
}
