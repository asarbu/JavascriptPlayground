const $sliderContainer = document.querySelector('.content');
let containerWidth = $sliderContainer.clientWidth;
const $sliderWrapper = document.querySelector('.content');
const lastIndex = $sliderWrapper.children.length + 1;

let mouseDown = false;
let scrolling = undefined;
let startX, startY;
let currentIndex = 1;

let tabs = [];

const setSlide = (index) => {
  currentIndex = +index;
  cuurentIndex = Math.min(currentIndex, lastIndex);
  requestAnimationFrame(() => {
	  $sliderWrapper.style.transition = 'transform 0.25s linear';
	  $sliderWrapper.style.transform = `translateX(${-containerWidth * index}px)`;  
  });
  const $tabs = document.querySelectorAll('.tab');
  
  $tabs.forEach((el, i) => {
    el.classList.remove('active-tab');
  });
  tabs[index-1].classList.add('active-tab');
};


const $main = document.getElementById('main');
const $sidenav_left=document.getElementById("sidenav");
const $sidenav_right=$sidenav_left.cloneNode(true);
$sidenav_left.classList.add("sidenav-left");
$sidenav_right.classList.add("sidenav-right");

const init = () => {
  // appened cloneNodes to the parent element.
  const $clonedFirstChild = $sliderWrapper.firstElementChild.cloneNode(true);
  const $clonedLastChild = $sliderWrapper.lastElementChild.cloneNode(true);
  //TODO: Do this after the user scrolled to the end, so that we also copy the scroll position
  $sliderWrapper.insertBefore($clonedLastChild, $sliderWrapper.firstElementChild);
  $sliderWrapper.appendChild($clonedFirstChild);

  const $slideItems = document.querySelectorAll('.item');
  $slideItems.forEach((el, i) => {
    el.setAttribute('data-item-index', i);
  });
  const $tabLinks = document.querySelectorAll('.tab');
  $tabLinks.forEach((el, i) => {
	  el.addEventListener("click", () => {
        document.body.style.backgroundColor = "rgb(0, 0, 0)";
		setSlide(i+1);
	  });
    tabs.push(el);
  });

  currentIndex = 1;
  
  $sliderWrapper.style.transition = 'transform 0s linear';
  $sliderWrapper.style.transform = `translateX(${-containerWidth * 1}px)`; 
  $sidenav_left.parentNode.appendChild($sidenav_right);
  
  	// Get the modalBackdrop
	var addSpendingBackdrop = document.getElementById("add-spending-backdrop");
	const modal = document.getElementById("add-spending-content");
	// Get the button that opens the modal
	var btn = document.getElementById("showModalRight");
	// When the user clicks the button, open the modal 
	btn.onclick = function() {	  	
	  addSpendingBackdrop.style.visibility= "visible";
	  addSpendingBackdrop.style.opacity= 1;
	  addSpendingBackdrop.style.transition= "opacity 0.2s linear";
	  
	  modal.style.transition = 'transform 0.2s linear';
	  modal.style.transform = `translateY(-100%)`;
	  
	  const descriptionInputField = document.getElementById("description-input-field");
	  descriptionInputField.focus();
	}
	
	// Get the modalBackdrop
	var categoryBackdrop = document.getElementById("category-backdrop");
	const categoryModal = document.getElementById("category-content");
	// Get the button that opens the modal
	var categoryInput = document.getElementById("category-input");
	categoryInput.onclick = function(event) {
		categoryBackdrop.style.visibility= "visible";
		categoryBackdrop.style.opacity= 1;
		categoryBackdrop.style.transition= "opacity 0.2s linear";

		categoryModal.style.transition = 'transform 0.2s linear';
		categoryModal.style.transform = `translateY(-100%)`;
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == addSpendingBackdrop) {
			modal.style.transition = 'transform 0.2s linear';
			modal.style.transform = `translateY(100%)`;

			addSpendingBackdrop.style.visibility= "hidden";
			addSpendingBackdrop.style.opacity= 0;
			addSpendingBackdrop.style.transition= "visibility 0s 0.2s, opacity 0.2s linear";
		} else if(event.target == categoryBackdrop) {
			categoryModal.style.transition = 'transform 0.2s linear';
			categoryModal.style.transform = `translateY(100%)`;

			categoryBackdrop.style.visibility= "hidden";
			categoryBackdrop.style.opacity= 0;
			categoryBackdrop.style.transition= "visibility 0s 0.2s, opacity 0.2s linear";
		}
	}

	let accordion_btns  = document.querySelectorAll('.accordion_container .accordion .header'),
    accordion_bodys = document.querySelectorAll('.accordion_container .accordion .body');

	if(accordion_btns && accordion_bodys)
	{
		accordion_btns = Array.isArray(accordion_btns) ? accordion_btns : Object.values(accordion_btns);
		accordion_btns.forEach(accordion_btn=>{
			accordion_btn.addEventListener('click', function(){
				process_accordion(this);
			});
		});

		function process_accordion(x) {
			set_height_0();

			let next_sibling = x.nextElementSibling;
			if(next_sibling.offsetHeight>0)
			{
				next_sibling.style.height = '0px';
				x.closest('.accordion').classList.remove('active');
			} else {
				next_sibling.style.height = next_sibling.scrollHeight+30+'px';
				x.closest('.accordion').classList.add('active');
			}
		}

		function set_height_0() {
			accordion_bodys = Array.isArray(accordion_bodys) ? accordion_bodys : Object.values(accordion_bodys);
			accordion_bodys.forEach(accordion_body=>{
				accordion_body.style.height = '0px';
				accordion_body.closest('.accordion').classList.remove('active');
			});
		}
	}
};

const refresh = () => {
	containerWidth = $sliderContainer.clientWidth;
	setSlide(currentIndex);
};

const startSlider = (e) => {
  mouseDown = true;

  // check desktop or mobile
  startX = e.clientX ? e.clientX : e.touches[0].screenX;
  startY = e.clientY ? e.clientY : e.touches[0].screenY;
  
  $sliderWrapper.removeEventListener('touchmove', startSlider);
  $sliderContainer.addEventListener(e.clientX ? 'mousemove' : 'touchmove', moveSlider, {
    passive: true,
  });
};

const moveSlider = (e) => {
  if (!mouseDown) return;

  let currentX = e.clientX || e.touches[0].screenX;
  let currentY = e.clientY || e.touches[0].screenY;
  requestAnimationFrame(() => {
	  if(!scrolling) {
		//Check scroll direction
		if(Math.abs(currentY - startY) > 10) { //Vertical
			//Needed to avoid glitches in horizontal scrolling
			scrolling = "vertical";
			//Reset horizontal scroll to zero, by resetting the slide index
			setSlide(currentIndex);
			return;
		} else if(Math.abs(currentX - startX) > 10) { //Horizontal
			scrolling = "horizontal";
			return;
		}
	  }
	  
	  //Allow horizontal scroll even if no scroll is present.
	  //Vertical is allowed by default.
	  if(scrolling === undefined || scrolling === "horizontal") {
		  $sliderWrapper.style.transition = 'transform 0s linear';	  
		  $sliderWrapper.style.transform = `translateX(${
			currentX - startX - containerWidth * currentIndex
		  }px)`;
	  }
  });
};

const endSlider = (e) => {
  if (!mouseDown || !e) return;
  
  mouseDown = false;
  if(scrolling === "horizontal") {
	  let x = e.clientX;
	  //x evaluates to 0 if you drag left to the end of the body)
	  if(!x && e.changedTouches) {
		  x = e.changedTouches[0].screenX;
	  }
	  
	  const dist = x - startX || 0;

	  if (dist > 50 && currentIndex > 1) currentIndex--;
	  else if (dist < -50 && currentIndex < lastIndex -1) currentIndex++;
	  setSlide(currentIndex);
  }
  $sliderWrapper.addEventListener('touchmove', startSlider, { passive: true });
  scrolling = undefined;
};

let navOpen = false;

function openNav(ev) {
	const side = ev.target.dataset.side;
  if(side === "left") {
	  if(navOpen === "left") {
		  closeNav();
		  return;
	  }

	  $sidenav_right.classList.remove("sidenav-open");
	  $sidenav_left.classList.add("sidenav-open");
	  $main.classList.remove("main-shift-right");
	  $main.classList.add("main-shift-left");
	  
	  navOpen = "left";
  }
  else if(side === "right") {	  
	  if(navOpen === "right") {
		  closeNav();
		  return;
	  }
	  
	  $sidenav_left.classList.remove("sidenav-open");
	  $sidenav_right.classList.add("sidenav-open");
	  $main.classList.remove("main-shift-left");
	  $main.classList.add("main-shift-right");
	  
	  navOpen = "right";
  }
  
  $main.addEventListener("transitionend", function transitioned() {
	  $main.removeEventListener('transitionend', transitioned);
	  refresh();
	});
}

function closeNav() {
  $sidenav_left.classList.remove("sidenav-open");
  $sidenav_right.classList.remove("sidenav-open");
  $main.classList.remove("main-shift-left");
  $main.classList.remove("main-shift-right");
  
  navOpen = undefined;
  $main.addEventListener("transitionend", function transitioned() {
	  $main.removeEventListener('transitionend', transitioned);
	  refresh();
  });
}

// * when mousedown or touchstart
$sliderWrapper.addEventListener('mousedown', startSlider);
$sliderWrapper.addEventListener('touchmove', startSlider, { passive: true });
document.querySelectorAll('.nav-trigger').forEach((el) => el.addEventListener("click", openNav));

// * when mouseup or touchend
window.addEventListener('mouseup', endSlider);
window.addEventListener('touchend', endSlider);
window.addEventListener('resize', refresh, true);
init();

//Modal idea https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal_bottom
