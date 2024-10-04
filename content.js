let lastScrollTop = 0;
let lastScrollLeft = 0;
let totalDelta = 0;

function getScrollPosition() {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
    };
}

function handleScroll() {
    let { x: scrollLeft, y: scrollTop } = getScrollPosition();
    let deltaY = Math.abs(scrollTop - lastScrollTop);
    let deltaX = Math.abs(scrollLeft - lastScrollLeft);
    let delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // Use Pythagorean theorem for diagonal scrolling
    totalDelta += delta;
    lastScrollTop = scrollTop;
    lastScrollLeft = scrollLeft;
}

// Use both scroll and touchmove events
window.addEventListener('scroll', handleScroll, { passive: true });
document.addEventListener('touchmove', handleScroll, { passive: true });

// Use MutationObserver to detect changes in the DOM that might indicate scrolling
const observer = new MutationObserver(handleScroll);
observer.observe(document.body, { childList: true, subtree: true });

setInterval(function () {
    if (totalDelta > 0) {
        chrome.storage.local.get(['totalScroll'], function (result) {
            let total = result.totalScroll || 0;
            total += totalDelta;
            chrome.storage.local.set({'totalScroll': total});
            totalDelta = 0;
        });
    }
}, 50);


