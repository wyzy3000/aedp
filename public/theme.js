(function () {
    var s = localStorage.getItem('theme');
    var p = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (s === 'dark' || (!s && p) || s === null) {
        document.documentElement.classList.add('dark');
    }
})();
