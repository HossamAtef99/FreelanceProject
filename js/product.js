(function () {
  "use strict";

  const API_BASE = "http://localhost:3000";

  const hardcodedProducts = [];

  let products;

  function getProducts() {
    return hardcodedProducts;
  }

  async function getProductsFromApi() {
    if (window.OmarPhone && window.OmarPhone.getProducts) {
      const apiData = await window.OmarPhone.getProducts();
      if (Array.isArray(apiData) && apiData.length) {
        products = apiData;
        return products;
      }
    }
    try {
      const stored = localStorage.getItem("op_admin_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          products = parsed;
          return products;
        }
      }
    } catch (err) { console.warn('localStorage read failed:', err); }
    return getProducts();
  }

  const COLOR_HEX = {
    Titanium: "#8a8d91",
    "Titanium Gray": "#8e8e90",
    "Deep Purple": "#4a1a6b",
    Gold: "#d4af37",
    Black: "#1a1a1a",
    White: "#f0f0f0",
    Pink: "#ffb6c1",
    "Icy Blue": "#a8d8ea",
    Obsidian: "#2d2d2d",
    "Flowy Emerald": "#2e8b57",
    "Phantom Black": "#1a1a2e",
    "Alpine Blue": "#2c3e50",
    "Eternal Green": "#1b4332",
    Midnight: "#191970",
    "Stellar Black": "#0d0d0d",
    "Emerald Green": "#2ecc71",
    Red: "#e74c3c",
    Blue: "#3498db",
    Silver: "#bdc3c7",
    "Space Gray": "#636e72",
    Purple: "#9b59b6",
    Orange: "#e67e22",
    Yellow: "#f1c40f",
    Green: "#27ae60",
    Brown: "#8B4513",
  };

  let currentProduct = null;
  let selectedColor = "";
  let selectedStorage = "";
  let currentTab = "description";

  document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      document.getElementById("pageTitle").textContent = "Product Not Found";
      return;
    }

    let product;
    let source = "fallback";
    try {
      const res = await fetch(API_BASE + "/api/product/" + id + "?t=" + Date.now());
      if (res.ok) {
        product = await res.json();
        source = "API";
      }
    } catch (e) {
      console.warn("Product API fetch failed, using fallback:", e);
    }

    if (!product) {
      const fallbackList = await getProductsFromApi();
      product = fallbackList.find((p) => p.id === id);
    }

    try {
      const allRes = await fetch(API_BASE + "/api/products/all?t=" + Date.now());
      if (allRes.ok) {
        const all = await allRes.json();
        if (Array.isArray(all) && all.length) products = all;
      }
    } catch (e) {
      console.warn("All products API fetch failed, using fallback:", e);
    }
    if (!products) products = await getProductsFromApi();

    const badge = document.getElementById("dataSourceBadge") || (() => {
      const el = document.createElement("div");
      el.id = "dataSourceBadge";
      el.style.cssText = "position:fixed;bottom:10px;right:10px;z-index:9999;padding:4px 10px;border-radius:4px;font:12px monospace;";
      document.body.appendChild(el);
      return el;
    })();
    badge.textContent = source === "API" ? "✓ Data from API" : "⚠ Fallback data";
    badge.style.background = source === "API" ? "#4caf50" : "#ff9800";
    badge.style.color = "#fff";

    if (!product) {
      document.getElementById("pageTitle").textContent = "Product Not Found";
      return;
    }

    currentProduct = product;
    selectedColor =
      (product.colors && product.colors[0]) || product.color || "";
    selectedStorage = product.storage;
    renderProduct(product);
    renderRelatedProducts(product);
    initEvents(product);
  });

  function getColorImages(p, color) {
    const imgs = p.images || (p.colorImages && p.colorImages[color]) || [];
    if (Array.isArray(imgs) && imgs.length && imgs.some(Boolean)) return imgs.filter(Boolean);
    if (p.image) return [p.image];
    return [];
  }

  function renderGallery(images, name) {
    const h = window.OmarPhone ? window.OmarPhone.escapeHtml : (s => s);
    const validImages = images.filter(Boolean);
    if (!validImages.length) {
      document.getElementById("mainImage").src = "";
      document.getElementById("mainImage").alt = h(name);
      document.getElementById("galleryThumbs").innerHTML = '<p style="color:#888;padding:2rem;">No images available</p>';
      return;
    }
    document.getElementById("mainImage").src = validImages[0];
    document.getElementById("mainImage").alt = h(name);
    document.getElementById("mainImage").loading = "lazy";
    const thumbsHtml = validImages
      .map(
        (img, i) => `
      <button class="product-gallery-thumb ${i === 0 ? "active" : ""}" data-src="${img}" aria-label="View image ${i + 1}" aria-pressed="${i === 0 ? 'true' : 'false'}">
        <img src="${img}" alt="${h(name)} view ${i + 1}" loading="lazy">
      </button>
    `,
      )
      .join("");
    document.getElementById("galleryThumbs").innerHTML = thumbsHtml;
  }

  function renderProduct(p) {
    const images = getColorImages(p, selectedColor);
    renderGallery(images, p.name);

    const isPhone = !p.category || p.category === "phones";

    document.getElementById("productBrand").textContent = p.brand || "Premium Accessory";
    document.getElementById("productName").textContent = p.name;
    document.getElementById("breadcrumbProduct").textContent = p.name;
    document.getElementById("pageTitle").textContent = p.name;
    document.getElementById("pageSubtitle").textContent = isPhone
      ? `${p.brand} — ${p.storage} ${p.ram}`
      : `${p.brand || "Premium Accessory"}`;

    const starsHtml = getStars(p.rating || 5);
    document.getElementById("productRating").innerHTML = `
      <div class="product-info-stars">${starsHtml}</div>
      <span class="product-info-review-count">(${p.reviews || 12} reviews)</span>
    `;

    const oldPriceHtml = p.oldPrice
      ? `<span class="product-info-old">EGP ${p.oldPrice.toLocaleString()}</span>`
      : "";
    const discountHtml = p.oldPrice
      ? `<span class="product-info-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>`
      : "";
    document.getElementById("productPrice").innerHTML = `
      <span class="product-info-current">EGP ${p.price.toLocaleString()}</span>
      ${oldPriceHtml}
      ${discountHtml}
    `;

    const descHtml = isPhone
      ? `<p>Experience the pinnacle of mobile technology with the ${p.name}. Featuring a stunning design, blazing-fast performance, and an advanced camera system, this smartphone sets a new standard for what a mobile device can do. Powered by the latest processor and featuring ${p.ram} of RAM, every task feels effortless.</p><p>The ${p.name} comes with ${p.storage} of internal storage, providing ample space for all your apps, photos, and videos. With an all-day battery, stunning display, and the latest software enhancements, this device is built to keep up with your lifestyle. Backed by a ${p.warranty} manufacturer warranty for complete peace of mind.</p>`
      : `<p>Enhance your mobile experience with the ${p.name}. Designed to offer top-notch reliability and performance, this premium accessory integrates seamlessly into your daily life. Crafted from high-grade materials, it is built to last and ensures optimal performance.</p><p>Whether at home, in the office, or on the go, the ${p.name} provides the efficiency and dependability you expect. Backed by a ${p.warranty || "6 Months"} manufacturer warranty for complete peace of mind.</p>`;
    document.getElementById("productDescription").innerHTML = descHtml;

    const descTabHtml = descHtml;
    document.getElementById("tabDescription").innerHTML = descTabHtml;

    const specs = getSpecs(p);
    const specsHtml = `
      <table class="specs-table">
        ${specs.map((s) => `<tr><td>${s.label}</td><td>${s.value}</td></tr>`).join("")}
      </table>
    `;
    document.getElementById("tabSpecifications").innerHTML = specsHtml;

    const reviews = getReviews(p);
    const reviewsHtml = reviews
      .map(
        (r) => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${r.avatar}</div>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-date">${r.date}</div>
          </div>
          <div class="review-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
        </div>
        <p class="review-text">${r.text}</p>
      </div>
    `,
      )
      .join("");
    document.getElementById("tabReviews").innerHTML = reviewsHtml;

    const colorOptions = p.colors || (p.color ? [p.color] : []);
    const colorSelectorWrapper = document.getElementById("colorSelector").parentElement;
    if (colorOptions.length === 0) {
      colorSelectorWrapper.style.display = "none";
    } else {
      colorSelectorWrapper.style.display = "";
      document.getElementById("colorSelector").innerHTML = colorOptions
        .map(
          (c) => `
        <button class="product-info-color ${c === selectedColor ? "active" : ""}" data-color="${c}" style="background: ${COLOR_HEX[c] || "#ccc"}" title="${c}"></button>
      `,
        )
        .join("");
    }

    const storageSelectorWrapper = document.getElementById("storageSelector").parentElement;
    if (!isPhone || !p.storage) {
      storageSelectorWrapper.style.display = "none";
    } else {
      storageSelectorWrapper.style.display = "";
      const storageOptions = ["128GB", "256GB", "512GB", "1TB"];
      document.getElementById("storageSelector").innerHTML = storageOptions
        .map(
          (s) => `
        <button class="product-info-storage-btn ${s === selectedStorage ? "active" : ""}" data-storage="${s}">${s}</button>
      `,
        )
        .join("");
    }

    const metaHtml = `
      <div class="product-info-meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M16 17h-5a2 2 0 0 1-2-2v-2"/><rect x="15" y="7" width="7" height="6" rx="1"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>
        Free Delivery
      </div>
      <div class="product-info-meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        12-Month Warranty
      </div>
      <div class="product-info-meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        100% Original
      </div>
      <div class="product-info-meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Easy Returns
      </div>
    `;
    document.getElementById("productMeta").innerHTML = metaHtml;

    document.querySelector(".product-info-qty input").value = 1;
  }

  function renderRelatedProducts(p) {
    const related = products
      .filter(
        (item) =>
          item.id !== p.id &&
          (item.brand === p.brand || Math.abs(item.price - p.price) < 300),
      )
      .sort((a, b) => b.popular - a.popular)
      .slice(0, 4);

    const container = document.getElementById("relatedProducts");
    container.innerHTML = related
      .map((item) => buildProductCard(item))
      .join("");
  }

  function buildProductCard(p) {
    const stars = "★".repeat(Math.floor(p.rating)) + (p.rating % 1 ? "½" : "");
    const badgeHtml = p.badge
      ? `<div class="product-card-badges"><span class="badge ${getBadgeClass(p.badge)}">${p.badge}</span></div>`
      : "";
    const oldPriceHtml = p.oldPrice
      ? `<span class="product-card-old-price">EGP ${p.oldPrice.toLocaleString()}</span>`
      : "";
    const discountHtml = p.oldPrice
      ? `<span class="product-card-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>`
      : "";
    const stockHtml = p.stock
      ? '<div class="product-card-stock in-stock">In Stock</div>'
      : '<div class="product-card-stock out-of-stock">Out of Stock</div>';

    return `
      <div class="product-card">
        <a href="product-detail.html?id=${p.id}" class="product-card-image">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${badgeHtml}
        </a>
        <div class="product-card-body">
          <div class="product-card-brand">${p.brand}</div>
          <h3 class="product-card-title">${p.name}</h3>
          <div class="product-card-specs">
            <span class="product-card-spec">${p.storage}</span>
            <span class="product-card-spec">${p.ram} RAM</span>

          </div>
          <div class="product-card-rating">
            <div class="product-card-stars">${stars}</div>
            <span class="product-card-reviews">(${p.reviews} reviews)</span>
          </div>
          <div class="product-card-price-row">
            <span class="product-card-price">EGP ${p.price.toLocaleString()}</span>
            ${oldPriceHtml}
            ${discountHtml}
          </div>
          ${stockHtml}
          <a href="product-detail.html?id=${p.id}" class="product-card-add">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            View Details
          </a>
        </div>
      </div>
    `;
  }

  function getBadgeClass(badge) {
    if (badge === "New" || badge === "Premium") return "badge-new";
    if (badge.includes("%") || badge === "Sale") return "badge-sale";
    if (badge === "Best Seller") return "badge-excellent";
    return "badge-new";
  }

  function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  }

  function getSpecs(p) {
    const isPhone = !p.category || p.category === "phones";
    if (!isPhone) {
      return [
        { label: "Category", value: p.category ? (p.category.charAt(0).toUpperCase() + p.category.slice(1)) : "Accessory" },
        { label: "Condition", value: p.condition || "Brand New" },
        { label: "Warranty", value: p.warranty || "6 Months" },
        { label: "Compatibility", value: "Universal" }
      ];
    }

    const cameraMap = {
      Apple: "48MP + 12MP + 12MP",
      Samsung: "200MP + 50MP + 12MP + 10MP",
      Google: "50MP + 48MP + 48MP",
      OnePlus: "50MP + 48MP + 64MP",
      Xiaomi: "50MP + 50MP + 50MP",
      Nothing: "50MP + 50MP",
      Honor: "200MP + 12MP + 50MP",
      Oppo: "50MP + 48MP + 32MP",
    };
    const processorMap = {
      Apple: "A17 Pro",
      Samsung: "Snapdragon 8 Gen 3",
      Google: "Google Tensor G3",
      OnePlus: "Snapdragon 8 Gen 3",
      Xiaomi: "Snapdragon 8 Gen 3",
      Nothing: "Snapdragon 8+ Gen 1",
      Honor: "Snapdragon 8 Gen 2",
      Oppo: "MediaTek Dimensity 9200",
    };
    const displayMap = {
      Apple: '6.7" Super Retina XDR OLED',
      Samsung: '6.8" Dynamic AMOLED 2X',
      Google: '6.7" LTPO OLED',
      OnePlus: '6.82" LTPO AMOLED',
      Xiaomi: '6.73" LTPO AMOLED',
      Nothing: '6.7" LTPO OLED',
      Honor: '6.78" OLED',
      Oppo: '6.8" AMOLED',
    };
    const batteryMap = {
      Apple: "4422 mAh",
      Samsung: "5000 mAh",
      Google: "5050 mAh",
      OnePlus: "5400 mAh",
      Xiaomi: "5000 mAh",
      Nothing: "4700 mAh",
      Honor: "5000 mAh",
      Oppo: "4300 mAh",
    };
    const osMap = {
      Apple: "iOS 17",
      Samsung: "One UI 6.1 (Android 14)",
      Google: "Android 14",
      OnePlus: "OxygenOS 14 (Android 14)",
      Xiaomi: "HyperOS (Android 14)",
      Nothing: "Nothing OS 2.5 (Android 14)",
      Honor: "MagicOS 8.0 (Android 14)",
      Oppo: "ColorOS 14 (Android 14)",
    };

    return [
      { label: "Display", value: displayMap[p.brand] || '6.7" AMOLED' },
      { label: "Processor", value: processorMap[p.brand] || "Octa-core" },
      { label: "RAM", value: p.ram },
      { label: "Storage", value: p.storage },
      { label: "Camera", value: cameraMap[p.brand] || "50MP + 12MP" },
      { label: "Battery", value: batteryMap[p.brand] || "5000 mAh" },
      { label: "Operating System", value: osMap[p.brand] || "Android 14" },
      { label: "Condition", value: "Brand New" },
      { label: "Warranty", value: p.warranty },
      { label: "Battery Health", value: "100%" },
    ];
  }

  function getReviews(p) {
    const isPhone = !p.category || p.category === "phones";
    return [
      {
        avatar: "AH",
        name: "Ahmed Hassan",
        date: "March 15, 2026",
        stars: 5,
        text: isPhone
          ? `Absolutely love my ${p.name}! The camera quality is outstanding and the battery life easily lasts me a full day of heavy use. The delivery was incredibly fast and the phone was well-packaged. Highly recommend Omar Phone for anyone looking for premium devices at the best prices.`
          : `Absolutely love this ${p.name}! It works perfectly and is made of high quality materials. Highly recommend Omar Phone for their excellent service.`,
      },
      {
        avatar: "SN",
        name: "Sara Nasser",
        date: "February 28, 2026",
        stars: 5,
        text: isPhone
          ? `This is my third phone from Omar Phone and they never disappoint. The ${p.name} feels premium in hand, the display is gorgeous, and performance is buttery smooth. The 12-month warranty gives great peace of mind. Will definitely be coming back for more.`
          : `Great value for money. The ${p.name} feels very durable and premium. Excellent buying experience.`,
      },
    ];
  }

  function initEvents(p) {
    const galleryThumbs = document.getElementById("galleryThumbs");
    if (galleryThumbs) {
      galleryThumbs.addEventListener("click", (e) => {
        const thumb = e.target.closest(".product-gallery-thumb");
        if (!thumb) return;
        document
          .querySelectorAll(".product-gallery-thumb")
          .forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        document.getElementById("mainImage").src = thumb.dataset.src;
      });
    }

    const colorSelector = document.getElementById("colorSelector");
    if (colorSelector) {
      colorSelector.addEventListener("click", (e) => {
        const swatch = e.target.closest(".product-info-color");
        if (!swatch) return;
        document
          .querySelectorAll(".product-info-color")
          .forEach((s) => s.classList.remove("active"));
        swatch.classList.add("active");
        selectedColor = swatch.dataset.color;
        const colorImages = getColorImages(p, selectedColor);
        renderGallery(colorImages, p.name);
      });
    }

    const storageSelector = document.getElementById("storageSelector");
    if (storageSelector) {
      storageSelector.addEventListener("click", (e) => {
        const btn = e.target.closest(".product-info-storage-btn");
        if (!btn) return;
        document
          .querySelectorAll(".product-info-storage-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedStorage = btn.dataset.storage;
      });
    }

    const qtySelector = document.getElementById("qtySelector");
    if (qtySelector) {
      qtySelector.addEventListener("click", (e) => {
        const input = qtySelector.querySelector("input");
        const minus = e.target.closest(".qty-minus");
        const plus = e.target.closest(".qty-plus");
        let val = parseInt(input.value, 10) || 1;
        if (minus && val > 1) input.value = val - 1;
        if (plus && val < 99) input.value = val + 1;
      });

      qtySelector
        .querySelector("input")
        .addEventListener("change", function () {
          let val = parseInt(this.value, 10);
          if (isNaN(val) || val < 1) this.value = 1;
          if (val > 99) this.value = 99;
        });
    }

    const tabsNav = document.querySelector(".tabs-nav");
    if (tabsNav) {
      tabsNav.addEventListener("click", (e) => {
        const btn = e.target.closest(".tabs-nav-btn");
        if (!btn) return;
        const tab = btn.dataset.tab;
        document
          .querySelectorAll(".tabs-nav-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document
          .querySelectorAll(".tab-panel")
          .forEach((p) => p.classList.remove("active"));
        document
          .getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`)
          .classList.add("active");
        currentTab = tab;
      });
    }

    const addBtn = document.getElementById("addToCartBtn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        if (!window.OmarPhone) return;
        const qtyInput = document.querySelector(".product-info-qty input");
        const quantity = parseInt(qtyInput ? qtyInput.value : 1, 10);
        const product = {
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price,
          storage: selectedStorage,
          color: selectedColor,
          quantity,
        };
        window.OmarPhone.addToCart(product);
      });
    }

    const wishBtn = document.getElementById("wishlistBtn");
    if (wishBtn) {
      const isLoved = window.OmarPhone && window.OmarPhone.isInWishlist(p.id);
      if (isLoved) {
        wishBtn.querySelector("svg").setAttribute("fill", "currentColor");
      }

      wishBtn.addEventListener("click", () => {
        if (!window.OmarPhone) return;
        const product = {
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price,
          storage: selectedStorage,
          color: selectedColor,
        };
        const added = window.OmarPhone.toggleWishlist(product);
        const svg = wishBtn.querySelector("svg");
        svg.setAttribute("fill", added ? "currentColor" : "none");
      });
    }
  }
})();
