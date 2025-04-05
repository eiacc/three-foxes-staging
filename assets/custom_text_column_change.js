(() => {
  window.addEventListener("DOMContentLoaded", init)

  function textPlaceholder(text) {
    const div = document.createElement('div')
    div.classList = "featured-grid--item--text"

    div.innerHTML = `<h3 class="featured-grid--item--title" data-item="block-heading">${text}</h3>`
    return div
  }

  function imgPlaceholder(src, alt = "") {
    const div = document.createElement('div')
    div.classList = "featured-grid--item--image"
    div.setAttribute('data-item', 'image')
    div.setAttribute('data-transition-item', '')
    div.setAttribute('data-transition-type', 'zoom-in')
    div.setAttribute('data-transition-trigger', 'hover')

    if (!src || src === '') {
      div.innerHTML = `
        <placeholder-root class="placeholder--root" data-background="" data-display-type="aspect-ratio" data-mobile-display-type="aspect-ratio" data-overlay-style="" data-mobile-overlay-style="" data-parallax="" data-full-width="false" data-transition-item="viewport" data-transition-type="stroke" style="--aspect-ratio:1.45;--mobile-aspect-ratio:1.45;" data-transition-active="true" data-transition-finished="true">
          <div class="placeholder--container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 525.5 525.5"><path d="M324.5 212.7H203c-1.6 0-2.8 1.3-2.8 2.8V308c0 1.6 1.3 2.8 2.8 2.8h121.6c1.6 0 2.8-1.3 2.8-2.8v-92.5c0-1.6-1.3-2.8-2.9-2.8zm1.1 95.3c0 .6-.5 1.1-1.1 1.1H203c-.6 0-1.1-.5-1.1-1.1v-92.5c0-.6.5-1.1 1.1-1.1h121.6c.6 0 1.1.5 1.1 1.1V308z" style="stroke-dasharray: 881; stroke-dashoffset: 881;"></path><path d="M210.4 299.5H240v.1s.1 0 .2-.1h75.2v-76.2h-105v76.2zm1.8-7.2l20-20c1.6-1.6 3.8-2.5 6.1-2.5s4.5.9 6.1 2.5l1.5 1.5 16.8 16.8c-12.9 3.3-20.7 6.3-22.8 7.2h-27.7v-5.5zm101.5-10.1c-20.1 1.7-36.7 4.8-49.1 7.9l-16.9-16.9 26.3-26.3c1.6-1.6 3.8-2.5 6.1-2.5s4.5.9 6.1 2.5l27.5 27.5v7.8zm-68.9 15.5c9.7-3.5 33.9-10.9 68.9-13.8v13.8h-68.9zm68.9-72.7v46.8l-26.2-26.2c-1.9-1.9-4.5-3-7.3-3s-5.4 1.1-7.3 3l-26.3 26.3-.9-.9c-1.9-1.9-4.5-3-7.3-3s-5.4 1.1-7.3 3l-18.8 18.8V225h101.4z" style="stroke-dasharray: 1160; stroke-dashoffset: 1160;"></path><path d="M232.8 254c4.6 0 8.3-3.7 8.3-8.3s-3.7-8.3-8.3-8.3-8.3 3.7-8.3 8.3 3.7 8.3 8.3 8.3zm0-14.9c3.6 0 6.6 2.9 6.6 6.6s-2.9 6.6-6.6 6.6-6.6-2.9-6.6-6.6 3-6.6 6.6-6.6z" style="stroke-dasharray: 94; stroke-dashoffset: 94;"></path></svg></div>
        </placeholder-root>
      `
    } else {
      div.innerHTML = `
        <img loading="lazy" src="${src}" width="100%" height="100%" class="" alt="${alt}">
      `
    }
    return div
  }

  function init() {
    const radios = document.querySelectorAll('[data-variant-radio]')
    // console.log('radios', radios)
    if (radios.length < 1) return

    const el = document.querySelector('.featured-grid--root')
    // console.log('el', el)
    if (!el) return

    const headingElement = el.querySelector('.featured-grid--heading')
    const headingOrignal = headingElement.textContent // preserve original title

    const itemsElements   = el.querySelectorAll('.featured-grid--item')
    // console.log('itemsElements', itemsElements)
    if (itemsElements.length < 1) return
  
    const dataset = []; // length of all variant options
    radios.forEach((radio, index) => {
      extractData(radio)
      if (index === 0) updateHTML(index)
      radio.addEventListener('change', changeHandler)
    })

    function changeHandler(e) {
      const index = e.target.getAttribute('data-variant-radio')
      updateHTML(index)
    }
  
    function extractData(element) {
      const temp = new Map([
        ['heading', ''],
        ['images', []], // array length = 3
        ['titles', []], // array length = 3
      ])
  
      const heading = element.getAttribute('value');
      if (heading && heading !== "") temp.set('heading', heading)
  
      const index       = element.getAttribute('data-variant-radio')
  
      // console.log('element', element)
      const metafields  = element.parentElement.previousElementSibling
      // console.log('meta', metafields)
      const imageFields = metafields.querySelector('[data-metafields-images]')
      // console.log('imageFields', imageFields)
      const titleFields = metafields.querySelector('[data-metafields-titles]')
      // console.log('titleFields', titleFields)

      if (imageFields) {
        let _temp = imageFields.textContent.split('%2C');
        // console.log('inner image', _temp)
        let arr   = ['', '', '']
        _temp.forEach(item => {
          if (item && item !== "") {
            const obj = item.split(':::')
            const idx = (obj[0] * 1) - 1
            arr[idx] = obj[1]
          }
        })
        temp.set('images', arr)
      }
  
      if (titleFields) {
        let _temp = titleFields.textContent.split('%2C');
        // console.log('inner title', _temp)
        let arr   = ['', '', '']
        _temp.forEach(item => {
          if (item && item !== "") {
            const obj = item.split(':::')
            const idx = (obj[0] * 1) - 1
            arr[idx] = obj[1]
          }
        })
        temp.set('titles', arr)
      }

      dataset[index] = temp
    }

    function updateHTML(index) {
      // console.log('run')
      const data = dataset[index]

      // console.log('dataset', dataset)
      // console.log('data', data)

      if (headingElement.textContent !== headingOrignal + ' — ' + data.get('heading')) {
        headingElement.textContent = headingOrignal + ' — ' + data.get('heading')
      }

      const images = data.get('images');
      const titles = data.get('titles');

      // console.log('images', images)
      // console.log('titles', titles)

      itemsElements.forEach((item, idx) => {
        // console.log('idx', idx)
        const container = item.querySelector('.featured-grid--item--container')
        container.innerHTML = "";

        const title = titles[idx];
        const img   = images[idx];

        if (img === '') {
          container.appendChild(imgPlaceholder())
        } else {
          container.appendChild(imgPlaceholder(img))
        }

        container.appendChild(textPlaceholder(title))
        console.warn('=========================')
      })
    }
  }
})();