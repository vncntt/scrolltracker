document.addEventListener('DOMContentLoaded', function () {
    let dpi = 258; // Default DPI

    function updateDistance(totalPixels) {
        var inches = totalPixels / dpi;
        var meters = inches * 0.0254;
        var metersRounded = meters.toFixed(2);
        document.getElementById('distance').textContent = metersRounded + ' meters';
    }

    // Load saved DPI or use default
    chrome.storage.local.get(['dpi'], function (result) {
        if (result.dpi) {
            dpi = result.dpi;
            document.getElementById('dpi').value = dpi;
        }
        // Initial display of the total distance scrolled
        chrome.storage.local.get(['totalScroll'], function (result) {
            var totalPixels = result.totalScroll || 0;
            updateDistance(totalPixels);
        });
    });

    // Listen for changes in storage to update the distance in real-time
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (areaName === 'local' && changes.totalScroll) {
            var totalPixels = changes.totalScroll.newValue || 0;
            updateDistance(totalPixels);
        }
    });

    // Update DPI when button is clicked
    document.getElementById('updateDpi').addEventListener('click', function() {
        let newDpi = parseInt(document.getElementById('dpi').value);
        if (newDpi && newDpi > 0) {
            dpi = newDpi;
            chrome.storage.local.set({dpi: dpi}, function() {
                chrome.storage.local.get(['totalScroll'], function (result) {
                    var totalPixels = result.totalScroll || 0;
                    updateDistance(totalPixels);
                });
            });
        }
    });
});

