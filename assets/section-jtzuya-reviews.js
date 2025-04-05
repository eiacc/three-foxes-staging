window.addEventListener('DOMContentLoaded', () => {
  const targetNode = document.body; // Observe changes in the entire body (or refine this)
  const observerConfig = { childList: true, subtree: true };

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          // ✅ Check if the injected element is from Stamped.io
          if (node.classList.contains("stamped-container")) {
            // console.log("Stamped.io widget injected:", node);

            // 🔥 Modify elements dynamically if needed
            customizeStampedWidget(node);
          }
        }
      });
    });
  });

  function customizeStampedWidget(widget) {
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      #stamped-main-widget {
        margin-bottom: 0!important;
      }

      .stamped-header {
        position: relative;
      }
      .summary-overview {
        margin: 0!important;
      }
      .stamped-review-header-starratings {
        display: block!important;
      }
      .stamped-review-header-title {
        text-transform: uppercase;
        margin: 0!important;
      }
      .stamped-content {
        display: none;
      }

      button[data-review-state] {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: grid;
        place-items: center;
        border-radius: 100%;
        border: 1px solid black;

        height: 35px;
        width: 35px;
      }

      button[data-review-state] svg {
        pointer-events: none;
      }

      button[data-review-state="false"] svg.icon--minus {
        display: none;
      }

      button[data-review-state="false"] svg.icon--plus {
        display: block;
      }

      button[data-review-state="true"] svg.icon--minus {
        display: block;
      }

      button[data-review-state="true"] svg.icon--plus {
        display: none;
      }
    `;

    const btn = document.createElement('button')
    btn.setAttribute('data-review-state', false) // close = false, open true
    btn.innerHTML = `
      <svg class="icon--root icon--plus" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 5.714H5.714V10H4.286V5.714H0V4.286h4.286V0h1.428v4.286H10z" fill="#000" fill-rule="nonzero" />
      </svg>
      <svg class="icon--root icon--minus" width="10" height="2" viewBox="0 0 10 2" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1.714H0V.286h10z" fill="#000" fill-rule="nonzero" />
      </svg>
    `

    const contents = widget.querySelector('.stamped-content')
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const el = e.target
      const state = JSON.parse(el.getAttribute('data-review-state'));
      if (!state) {
        contents.style.display = 'block'
        el.setAttribute('data-review-state', true)
      } else {
        contents.style.display = 'none'
        el.setAttribute('data-review-state', false)
      }
    })

    widget.querySelector('.summary-overview').appendChild(btn);
    widget.appendChild(styleTag);
  }

  observer.observe(targetNode, observerConfig);
})