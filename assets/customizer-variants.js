class ArtworkTemplate extends HTMLElement {
  constructor() {
    super();
    window.premiumImageMap = new Map([
      ['name', []],
      ['date', []],
    ])
    this.variants   = this.reform();
    this.appendChild(this.build());

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  reform() {
    const map       = new Map();
    const variants  = window.customizerVariants
    if (!variants) return map

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      // extend is each variant data
      const extend = new Map([
        ['id',      variant.extend['id']],
        ['image',   variant.extend['image']],
        ['option',  variant.extend['option']],
        ['title',   variant.extend['title']],
      ])

      if (variant['extend'] && variant['extend'].hasOwnProperty('dimage')) {
        extend.set('dimage', variant.extend['dimage'])
      }

      if (variant.hasOwnProperty('name_foil')) {
        // console.log('has name', variant['name_foil'])
        if (window.premiumImageMap.get('name').length < 1) window.premiumImageMap.set('name', variant['name_foil'])
        extend.set('name_foil', variant['name_foil'])
      }
      if (variant.hasOwnProperty('date_foil')) {
        // console.log('has date', variant['date_foil'])
        if (window.premiumImageMap.get('date').length < 1) window.premiumImageMap.set('date', variant['date_foil'])
        extend.set('date_foil', variant['date_foil'])
      }

      // const tempTitle = variant['title'].toLowerCase();
      const title = variant['key'] === 'premium' ? 'Premium Foil Template' : 'Digital Print Template';
      const data = new Map([
        ['key',       variant['key']],
        ['price',     (variant['price'] / 100).toFixed(2)],
        ['title',     title],
        ['available', variant['available']],
        ['extend',    []]
      ]);

      if (!map.has(variant['key'])) {
        data.get('extend').push(extend);
        map.set(variant['key'], data)
      } else {
        map.get(variant['key']).set('price', data.get('price'))
        map.get(variant['key']).get('extend').push(extend);
      }
    }

    console.log('map', map)
    return map
  }

  build() {
    const fragment = document.createDocumentFragment()
    const array = Array.from(this.variants.values());
    
    const lw  = this.create_el('div', 'jtzuya-templates__tab jtzuya-templates__tab--left');   // left wrapper
    const p   = this.create_el('p', 'jtzuya-templates__tab-title', 'CHOOSE YOUR LABEL TYPE');
    const li  = this.create_el('div', 'jtzuya-templates__tab-label-types') // label items
    lw.appendChild(p)

    const rw  = this.create_el('div', 'jtzuya-templates__tab jtzuya-templates__tab--right');  // right wrapper

    array.forEach((data, idx) => {
      const key         = data.get('key');
      const price       = data.get('price');
      const title       = data.get('title');
      // const available   = dataMap.get('available');

      li.appendChild(this.left(idx, title, key, price)) // left content
      rw.appendChild(this.right(key, data, price))  // right content
    });


    const vt    = this.create_el('div', 'jtzuya-templates__tab-template-view') // view template

    const frcel = rw.firstElementChild.querySelector('.jtzuya-templates__tab-selection')
    const vp    = this.create_el('p')
    vp.textContent = frcel.getAttribute('data-option') // view paragraph
    const vi    = this.create_el('img') 
    vi.setAttribute('src', frcel.getAttribute('data-img'))// view image
    vi.setAttribute('alt', frcel.getAttribute('data-option'))// view image
    
    vt.appendChild(vp)
    vt.appendChild(vi)
    rw.appendChild(vt)

    // append all elements
    lw.appendChild(li)
    fragment.appendChild(lw)
    fragment.appendChild(rw)

    return fragment
  }

  create_el(tag, classList = null, content = null) {
    const el = document.createElement(tag)
    if (classList)  el.classList = classList
    if (content)    el.textContent = content
    return el
  }

  left(idx, title, key, price) {
    const fragment = document.createDocumentFragment();

    const input = this.create_el('input')
    input.setAttribute('type', 'radio')
    input.setAttribute('name', 'template_selection')
    input.setAttribute('data-price', price)
    input.setAttribute('id', `template_selection_${key.toLowerCase()}`)
    input.setAttribute('data-product-type', key)
    input.setAttribute('hidden', true)
    input.setAttribute('aria-hidden', true)
    if (idx === 0) input.setAttribute('checked', true)


    const div = this.create_el('div', 'jtzuya-templates__tab-label-type');
    div.setAttribute('data-template-selection', key)

    const label = this.create_el('label');
    label.setAttribute('for', `template_selection_${key}`)

    const p1 = this.create_el('p', 'font-sub-2', title)
    const p2 = this.create_el('p', 'font-sub-2', `$${price}`)

    div.appendChild(label)
    div.appendChild(p1)
    div.appendChild(p2)

    this.appendChild(input)
    fragment.appendChild(div)

    input.addEventListener('change', this.handleInputChange)
    return fragment
  }

  right(key, data, price) {
    const fragment = document.createDocumentFragment()
    const wrapper  = this.create_el('div', `jtzuya-templates__tab-selections jtzuya-templates__tab-selections--${key}`)
    const extend   = data.get('extend')

    extend.forEach((i, idx) => {
      const title     = i.get('title')
      const image     = i.get('image')
      const id        = i.get('id')
      const option    = i.get('option')
      
      const classList = idx === 0 ? 'jtzuya-templates__tab-selection jtzuya-template__tab-selection--active' : 'jtzuya-templates__tab-selection'
      const label     = this.create_el('span', classList, title)
      label.setAttribute('data-img', image)
      label.setAttribute('data-option', option)
      label.setAttribute('data-product-id', id)
      label.setAttribute('data-price', price)
      label.setAttribute('data-product-type', key)

      if (i.has('dimage')) {
        const dimage = i.get('dimage')
        label.setAttribute('data-dimage', dimage)
      }

      if (i.has('name_foil')) {
        const nameFoils = i.get('name_foil')
        if (nameFoils.length > 0) {
          label.setAttribute('data-personalize-default-name-foil', nameFoils[0])
          label.setAttribute('data-personalize-name-foils', nameFoils.join(','))
        }
      }

      if (i.has('date_foil')) {
        const dateFoils = i.get('date_foil')
        if (dateFoils.length > 0) {
          label.setAttribute('data-personalize-default-date-foil', dateFoils[0])
          label.setAttribute('data-personalize-date-foils', dateFoils.join(','))
        }
      }

      label.addEventListener('click', this.handleInputChange)
      wrapper.appendChild(label)
    })

    fragment.appendChild(wrapper)
    return fragment
  }

  handleInputChange(e) {
    const el    = e.target
    const type  = el.getAttribute('data-product-type')

    const selector = `.jtzuya-templates__tab-selections.jtzuya-templates__tab-selections--${type} .jtzuya-templates__tab-selection.jtzuya-templates__tab-selection--active`;
    const activeLabel = document.querySelector(selector)

    // console.log('el web component', element)
    console.log('activeLabel web component', activeLabel)

    if (!activeLabel) {
      console.log('active label not found', activeLabel)
      return
    }

    const mockupWrapper = document.querySelector('#mockupBox .imgcontainer')

    if (!mockupWrapper) {
      console.log('mockwrapper not found', mockupWrapper)
      return
    }

    // TODO: fix class naming
    if (type === 'premium') {
      const dates         = activeLabel.getAttribute('data-personalize-date-foils')
      const defaultDate   = activeLabel.getAttribute('data-personalize-default-date-foil')
      const names         = activeLabel.getAttribute('data-personalize-name-foils')
      const defaultName   = activeLabel.getAttribute('data-personalize-default-name-foil')

      if (dates) window.premiumImageMap.set('date', dates.split(','));
      if (names) window.premiumImageMap.set('name', names.split(','))

      if (defaultDate && defaultName) personalizeImageFoilChangeHandler({name: defaultName, date: defaultDate})
      mockupWrapper.style.setProperty('--digital-layer', 'url("")')
      mockupWrapper.style.setProperty('--date-layer', `url('${defaultDate}')`)
      mockupWrapper.style.setProperty('--name-layer', `url('${defaultName}')`)

    } else {
      // hide foils
      const img = activeLabel.getAttribute('data-dimage')
      mockupWrapper.style.setProperty('--digital-layer', `url('${img}')`)
      mockupWrapper.style.setProperty('--name-layer', 'url("")')
      mockupWrapper.style.setProperty('--date-layer', 'url("")')
    }

    console.log('current map', window.premiumImageMap)
  }
}

customElements.define('artwork-template', ArtworkTemplate)