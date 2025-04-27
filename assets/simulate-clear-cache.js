window.onload = function () {
  console.log('simulate')
  const sessionKey = 'hardReloadDone';
  const url = new URL(window.location.href);

  // Already reloaded once?
  if (sessionStorage.getItem(sessionKey)) {
    if (url.searchParams.has('reload')) {
      url.searchParams.delete('reload');
      history.replaceState(null, '', url.pathname + url.hash);
    }
    return;
  }

  // First time: force reload with cache busting
  if (!url.searchParams.has('reload')) {
    url.searchParams.set('reload', Date.now());
    sessionStorage.setItem(sessionKey, 'true');
    window.location.replace(url.toString());
  } else {
    // After reload: clean URL and mark done
    url.searchParams.delete('reload');
    history.replaceState(null, '', url.pathname + url.hash);
    sessionStorage.setItem(sessionKey, 'true');
  }
};
