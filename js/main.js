// Declare global variables
const products = [] // This should be populated with actual product data
const cart = {
  items: [],
  addItem: (product, quantity, size) => {
    // Implementation for adding item to cart
    return true // Placeholder return value
  },
  updateQuantity: (id, quantity, size) => {
    // Implementation for updating item quantity in cart
  },
  removeItem: (id, size) => {
    // Implementation for removing item from cart
  },
  clearCart: function () {
    // Implementation for clearing the cart
    this.items = []
  },
  getSubtotal: () => {
    // Implementation for calculating subtotal
    return 0 // Placeholder return value
  },
  getShipping: () => {
    // Implementation for calculating shipping
    return 0 // Placeholder return value
  },
  getTax: () => {
    // Implementation for calculating tax
    return 0 // Placeholder return value
  },
  getGrandTotal: () => {
    // Implementation for calculating grand total
    return 0 // Placeholder return value
  },
}
const bootstrap = window.bootstrap // Assuming Bootstrap is loaded globally

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear()

  // Toggle search input
  const searchToggle = document.querySelector(".search-toggle")
  const searchInput = document.querySelector(".search-input")

  if (searchToggle && searchInput) {
    searchToggle.addEventListener("click", () => {
      searchInput.classList.toggle("d-none")
      searchInput.classList.toggle("active")
      if (!searchInput.classList.contains("d-none")) {
        searchInput.focus()
      }
    })
  }

  // Load featured products on homepage
  const featuredProductsContainer = document.querySelector(".featured-products")
  if (featuredProductsContainer) {
    loadFeaturedProducts()
  }

  // Handle page-specific functionality
  const currentPage = window.location.pathname

  if (currentPage.includes("product.html")) {
    loadProductDetail()
  } else if (currentPage.includes("shop.html")) {
    loadShopProducts()
  } else if (currentPage.includes("category.html")) {
    loadCategoryProducts()
  } else if (currentPage.includes("cart.html")) {
    loadCartPage()
  } else if (currentPage.includes("wishlist.html")) {
    loadWishlistPage()
  }
})

// Load featured products
function loadFeaturedProducts() {
  const featuredProductsContainer = document.querySelector(".featured-products")
  const featuredProducts = products.filter((product) => product.featured)

  featuredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    featuredProductsContainer.appendChild(productCard)
  })
}

// Create product card
function createProductCard(product) {
  const col = document.createElement("div")
  col.className = "col-md-6 col-lg-3"

  const card = document.createElement("div")
  card.className = "card product-card h-100 border-0 shadow-sm"

  // Product image container with image carousel
  const imageContainer = document.createElement("div")
  imageContainer.className = "product-image-container"

  product.images.forEach((image, index) => {
    const img = document.createElement("img")
    img.src = image
    img.alt = product.name
    img.className = `product-image ${index > 0 ? "hidden" : ""}`
    img.dataset.index = index
    imageContainer.appendChild(img)
  })

  // Add image dots for carousel
  if (product.images.length > 1) {
    const dotsContainer = document.createElement("div")
    dotsContainer.className = "product-dots"

    product.images.forEach((_, index) => {
      const dot = document.createElement("span")
      dot.className = `product-dot ${index === 0 ? "active" : ""}`
      dot.dataset.index = index
      dot.addEventListener("click", (e) => {
        e.stopPropagation()
        const productCard = e.target.closest(".product-card")
        const images = productCard.querySelectorAll(".product-image")
        const dots = productCard.querySelectorAll(".product-dot")

        images.forEach((img) => img.classList.add("hidden"))
        dots.forEach((dot) => dot.classList.remove("active"))

        images[index].classList.remove("hidden")
        e.target.classList.add("active")
      })
      dotsContainer.appendChild(dot)
    })

    imageContainer.appendChild(dotsContainer)
  }

  // Add wishlist button
  const wishlistBtn = document.createElement("button")
  wishlistBtn.className = "btn wishlist-btn"
  wishlistBtn.innerHTML = '<i class="far fa-heart"></i>'
  wishlistBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    e.preventDefault()
    toggleWishlist(product)

    // Toggle heart icon
    const icon = e.target.closest("i")
    if (icon) {
      icon.classList.toggle("far")
      icon.classList.toggle("fas")
      icon.classList.toggle("text-danger")
    }
  })
  imageContainer.appendChild(wishlistBtn)

  // Make the image clickable to go to product detail
  const productLink = document.createElement("a")
  productLink.href = `product.html?id=${product.id}`
  productLink.appendChild(imageContainer)

  // Card body
  const cardBody = document.createElement("div")
  cardBody.className = "card-body"

  const category = document.createElement("div")
  category.className = "text-muted small mb-1"
  category.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1)

  const name = document.createElement("h3")
  name.className = "h5 card-title"
  const nameLink = document.createElement("a")
  nameLink.href = `product.html?id=${product.id}`
  nameLink.className = "text-decoration-none text-dark"
  nameLink.textContent = product.name
  name.appendChild(nameLink)

  const description = document.createElement("p")
  description.className = "card-text text-muted small"
  description.textContent = product.description.substring(0, 60) + "..."

  cardBody.appendChild(category)
  cardBody.appendChild(name)
  cardBody.appendChild(description)

  // Card footer
  const cardFooter = document.createElement("div")
  cardFooter.className = "card-footer bg-white border-top-0 d-flex justify-content-between align-items-center"

  const price = document.createElement("div")
  price.className = "fw-bold"
  price.textContent = `$${product.price.toFixed(2)}`

  const addToCartBtn = document.createElement("button")
  addToCartBtn.className = "btn btn-primary btn-sm"
  addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart me-1"></i> Add to Cart'
  addToCartBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Default to first size if available
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null

    if (cart.addItem(product, 1, size)) {
      showToast(`${product.name} added to cart!`)
    }
  })

  cardFooter.appendChild(price)
  cardFooter.appendChild(addToCartBtn)

  // Assemble card
  card.appendChild(productLink)
  card.appendChild(cardBody)
  card.appendChild(cardFooter)
  col.appendChild(card)

  return col
}

// Load product detail page
function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search)
  const productId = Number.parseInt(urlParams.get("id"))

  if (!productId) {
    window.location.href = "shop.html"
    return
  }

  const product = products.find((p) => p.id === productId)

  if (!product) {
    window.location.href = "shop.html"
    return
  }

  // Set page title
  document.title = `${product.name} | ESSENCE`

  // Create product detail HTML
  const productDetailContainer = document.getElementById("product-detail")
  if (!productDetailContainer) return

  productDetailContainer.innerHTML = `
    <div class="row">
      <div class="col-lg-6">
        <div class="product-images">
          <div class="main-image-container mb-3">
            <img src="${product.images[0]}" alt="${product.name}" class="img-fluid rounded product-detail-image" id="main-product-image">
          </div>
          <div class="d-flex gap-2 product-thumbnails">
            ${product.images
              .map(
                (img, index) => `
              <img src="${img}" alt="${product.name} - Image ${index + 1}" 
                class="img-thumbnail product-thumbnail ${index === 0 ? "active" : ""}" 
                style="width: 80px; height: 80px; object-fit: cover;"
                data-index="${index}">
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <h1 class="mb-2">${product.name}</h1>
        <div class="d-flex align-items-center mb-3">
          <div class="star-rating me-2">
            ${generateStarRating(product.rating)}
          </div>
          <span class="text-muted small">${product.rating} (${product.reviewCount} reviews)</span>
        </div>
        <h2 class="h3 mb-3">$${product.price.toFixed(2)}</h2>
        <p class="text-muted mb-4">${product.description}</p>
        
        <div class="mb-4">
          <h3 class="h6 mb-2">Size</h3>
          <div class="d-flex gap-2 size-selector">
            ${product.sizes
              .map(
                (size, index) => `
              <div class="size-btn border rounded px-3 py-2 ${index === 1 ? "active" : ""}" data-size="${size}">
                ${size}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        
        <div class="mb-4">
          <h3 class="h6 mb-2">Quantity</h3>
          <div class="d-flex align-items-center">
            <button class="btn btn-outline-secondary quantity-btn" data-action="decrease">-</button>
            <input type="number" class="form-control mx-2 quantity-input" value="1" min="1" max="${product.stock}">
            <button class="btn btn-outline-secondary quantity-btn" data-action="increase">+</button>
          </div>
          <p class="text-muted small mt-2">${product.stock} items in stock</p>
        </div>
        
        <div class="d-flex gap-2 mb-4">
          <button class="btn btn-primary flex-grow-1 add-to-cart-btn">
            <i class="fas fa-shopping-cart me-2"></i> Add to Cart
          </button>
          <button class="btn btn-outline-secondary wishlist-detail-btn">
            <i class="far fa-heart"></i>
          </button>
          <button class="btn btn-outline-secondary">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
        
        <ul class="nav nav-tabs" id="productTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="details-tab" data-bs-toggle="tab" data-bs-target="#details" type="button" role="tab">Details</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="ingredients-tab" data-bs-toggle="tab" data-bs-target="#ingredients" type="button" role="tab">Ingredients</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">Reviews</button>
          </li>
        </ul>
        <div class="tab-content p-3 border border-top-0 rounded-bottom" id="productTabsContent">
          <div class="tab-pane fade show active" id="details" role="tabpanel">
            <div class="row g-3">
              ${Object.entries(product.details)
                .map(
                  ([key, value]) => `
                <div class="col-6">
                  <p class="mb-1 fw-medium">${formatDetailName(key)}</p>
                  <p class="text-muted small">${value}</p>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          <div class="tab-pane fade" id="ingredients" role="tabpanel">
            <p class="text-muted small">${product.ingredients}</p>
          </div>
          <div class="tab-pane fade" id="reviews" role="tabpanel">
            ${product.reviews
              .map(
                (review) => `
              <div class="mb-4">
                <div class="d-flex justify-content-between mb-1">
                  <h5 class="mb-0">${review.user}</h5>
                  <span class="text-muted small">${review.date}</span>
                </div>
                <div class="star-rating mb-2">
                  ${generateStarRating(review.rating)}
                </div>
                <p class="text-muted small">${review.comment}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `

  // Add event listeners for product detail page
  setupProductDetailEvents(product)
}

// Setup event listeners for product detail page
function setupProductDetailEvents(product) {
  // Thumbnail click
  const thumbnails = document.querySelectorAll(".product-thumbnail")
  const mainImage = document.getElementById("main-product-image")

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      mainImage.src = this.src
      thumbnails.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Size selection
  const sizeButtons = document.querySelectorAll(".size-btn")
  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      sizeButtons.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Quantity buttons
  const quantityInput = document.querySelector(".quantity-input")
  const quantityButtons = document.querySelectorAll(".quantity-btn")

  quantityButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.dataset.action
      const currentValue = Number.parseInt(quantityInput.value)

      if (action === "increase" && currentValue < product.stock) {
        quantityInput.value = currentValue + 1
      } else if (action === "decrease" && currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })
  })

  // Add to cart button
  const addToCartBtn = document.querySelector(".add-to-cart-btn")
  addToCartBtn.addEventListener("click", () => {
    const selectedSize = document.querySelector(".size-btn.active").dataset.size
    const quantity = Number.parseInt(quantityInput.value)

    if (cart.addItem(product, quantity, selectedSize)) {
      showToast(`${product.name} (${selectedSize}) added to cart!`)
    }
  })

  // Wishlist button
  const wishlistBtn = document.querySelector(".wishlist-detail-btn")
  wishlistBtn.addEventListener("click", function () {
    toggleWishlist(product)

    const icon = this.querySelector("i")
    icon.classList.toggle("far")
    icon.classList.toggle("fas")
    icon.classList.toggle("text-danger")

    showToast(
      icon.classList.contains("fas") ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist!`,
    )
  })
}

// Load shop page with all products
function loadShopProducts() {
  const productsContainer = document.getElementById("shop-products")
  if (!productsContainer) return

  // Create filter UI
  const filterContainer = document.getElementById("product-filters")
  if (filterContainer) {
    filterContainer.innerHTML = `
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <h3 class="h5 mb-3">Search</h3>
          <input type="text" class="form-control mb-4" id="product-search" placeholder="Search products...">
          
          <h3 class="h5 mb-3">Category</h3>
          <div class="mb-4">
            <div class="form-check mb-2">
              <input class="form-check-input category-filter" type="radio" name="category" id="category-all" value="all" checked>
              <label class="form-check-label" for="category-all">All Categories</label>
            </div>
            <div class="form-check mb-2">
              <input class="form-check-input category-filter" type="radio" name="category" id="category-women" value="women">
              <label class="form-check-label" for="category-women">Women</label>
            </div>
            <div class="form-check mb-2">
              <input class="form-check-input category-filter" type="radio" name="category" id="category-men" value="men">
              <label class="form-check-label" for="category-men">Men</label>
            </div>
            <div class="form-check">
              <input class="form-check-input category-filter" type="radio" name="category" id="category-unisex" value="unisex">
              <label class="form-check-label" for="category-unisex">Unisex</label>
            </div>
          </div>
          
          <h3 class="h5 mb-3">Price Range</h3>
          <div class="mb-4">
            <div class="d-flex justify-content-between mb-2">
              <span id="price-min">$0</span>
              <span id="price-max">$150</span>
            </div>
            <input type="range" class="form-range" min="0" max="150" step="10" id="price-range">
          </div>
          
          <button class="btn btn-outline-secondary w-100" id="reset-filters">Reset Filters</button>
        </div>
      </div>
    `

    // Add event listeners for filters
    setupFilterEvents()
  }

  // Display all products initially
  displayFilteredProducts(products)
}

// Setup filter events
function setupFilterEvents() {
  const searchInput = document.getElementById("product-search")
  const categoryFilters = document.querySelectorAll(".category-filter")
  const priceRange = document.getElementById("price-range")
  const resetButton = document.getElementById("reset-filters")

  // Function to apply filters
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase()
    const selectedCategory = document.querySelector(".category-filter:checked").value
    const maxPrice = Number.parseInt(priceRange.value)

    const filteredProducts = products.filter((product) => {
      // Filter by search term
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)

      // Filter by category
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

      // Filter by price
      const matchesPrice = product.price <= maxPrice

      return matchesSearch && matchesCategory && matchesPrice
    })

    displayFilteredProducts(filteredProducts)
  }

  // Add event listeners
  searchInput.addEventListener("input", applyFilters)

  categoryFilters.forEach((filter) => {
    filter.addEventListener("change", applyFilters)
  })

  priceRange.addEventListener("input", function () {
    document.getElementById("price-max").textContent = `$${this.value}`
    applyFilters()
  })

  resetButton.addEventListener("click", () => {
    searchInput.value = ""
    document.getElementById("category-all").checked = true
    priceRange.value = 150
    document.getElementById("price-max").textContent = "$150"
    applyFilters()
  })
}

// Display filtered products
function displayFilteredProducts(filteredProducts) {
  const productsContainer = document.getElementById("shop-products")
  const productCount = document.getElementById("product-count")

  if (productCount) {
    productCount.textContent = filteredProducts.length
  }

  productsContainer.innerHTML = ""

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted mb-4">No products match your filters</p>
        <button class="btn btn-outline-primary" id="no-results-reset">Reset Filters</button>
      </div>
    `

    document.getElementById("no-results-reset").addEventListener("click", () => {
      document.getElementById("reset-filters").click()
    })
    return
  }

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productsContainer.appendChild(productCard)
  })
}

// Load category page
function loadCategoryProducts() {
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category")

  if (!category || !["women", "men", "unisex"].includes(category)) {
    window.location.href = "shop.html"
    return
  }

  // Update category title and description
  const categoryTitle = document.getElementById("category-title")
  const categoryDescription = document.getElementById("category-description")
  const categoryImage = document.getElementById("category-banner")

  if (categoryTitle && categoryDescription && categoryImage) {
    const categoryInfo = {
      women: {
        title: "Women's Fragrances",
        description: "Discover our collection of elegant and captivating scents designed for her",
        image: "https://placehold.co/1200x400?text=Women's+Fragrances",
      },
      men: {
        title: "Men's Fragrances",
        description: "Explore our range of bold and sophisticated scents crafted for him",
        image: "https://placehold.co/1200x400?text=Men's+Fragrances",
      },
      unisex: {
        title: "Unisex Fragrances",
        description: "Experience our versatile scents that transcend traditional boundaries",
        image: "https://placehold.co/1200x400?text=Unisex+Fragrances",
      },
    }

    categoryTitle.textContent = categoryInfo[category].title
    categoryDescription.textContent = categoryInfo[category].description
    categoryImage.src = categoryInfo[category].image

    // Set page title
    document.title = `${categoryInfo[category].title} | ESSENCE`
  }

  // Filter products by category
  const categoryProducts = products.filter((product) => product.category === category)

  // Display products
  const productsContainer = document.getElementById("category-products")
  const productCount = document.getElementById("category-product-count")

  if (productCount) {
    productCount.textContent = categoryProducts.length
  }

  if (productsContainer) {
    productsContainer.innerHTML = ""

    categoryProducts.forEach((product) => {
      const productCard = createProductCard(product)
      productsContainer.appendChild(productCard)
    })
  }
}

// Load cart page
function loadCartPage() {
  const cartContainer = document.getElementById("cart-items")
  const cartSummary = document.getElementById("cart-summary")

  if (!cartContainer || !cartSummary) return

  if (cart.items.length === 0) {
    document.getElementById("cart-container").innerHTML = `
      <div class="text-center py-5">
        <h2 class="mb-4">Your Cart is Empty</h2>
        <p class="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `
    return
  }

  // Render cart items
  cartContainer.innerHTML = ""

  cart.items.forEach((item) => {
    const cartItemRow = document.createElement("div")
    cartItemRow.className = "card mb-3"
    cartItemRow.innerHTML = `
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-2 mb-3 mb-md-0">
            <img src="${item.images[0]}" alt="${item.name}" class="img-fluid rounded">
          </div>
          <div class="col-md-4 mb-3 mb-md-0">
            <h5><a href="product.html?id=${item.id}" class="text-decoration-none">${item.name}</a></h5>
            <p class="text-muted small mb-0">
              ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              ${item.size ? `<span class="ms-2">Size: ${item.size}</span>` : ""}
            </p>
          </div>
          <div class="col-md-2 mb-3 mb-md-0 text-md-center">
            <span class="d-md-none">Price: </span>
            <span>$${item.price.toFixed(2)}</span>
          </div>
          <div class="col-md-2 mb-3 mb-md-0">
            <div class="d-flex align-items-center justify-content-md-center">
              <button class="btn btn-outline-secondary btn-sm cart-quantity-btn" data-action="decrease" data-id="${item.id}" data-size="${item.size || ""}">-</button>
              <input type="number" class="form-control form-control-sm mx-2 quantity-input" value="${item.quantity}" min="1" style="width: 50px;" data-id="${item.id}" data-size="${item.size || ""}">
              <button class="btn btn-outline-secondary btn-sm cart-quantity-btn" data-action="increase" data-id="${item.id}" data-size="${item.size || ""}">+</button>
            </div>
          </div>
          <div class="col-md-1 mb-3 mb-md-0 text-md-center">
            <span class="d-md-none">Total: </span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <div class="col-md-1 text-end">
            <button class="btn btn-outline-danger btn-sm remove-cart-item" data-id="${item.id}" data-size="${item.size || ""}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `

    cartContainer.appendChild(cartItemRow)
  })

  // Render cart summary
  cartSummary.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title h5 mb-4">Order Summary</h3>
        <div class="d-flex justify-content-between mb-2">
          <span>Subtotal</span>
          <span>$${cart.getSubtotal().toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Shipping</span>
          <span>$${cart.getShipping().toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Tax</span>
          <span>$${cart.getTax().toFixed(2)}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between mb-4">
          <span class="fw-bold">Total</span>
          <span class="fw-bold">$${cart.getGrandTotal().toFixed(2)}</span>
        </div>
        <div class="mb-3">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Promo code">
            <button class="btn btn-outline-secondary" type="button">Apply</button>
          </div>
        </div>
        <a href="checkout.html" class="btn btn-primary w-100">
          Proceed to Checkout <i class="fas fa-arrow-right ms-2"></i>
        </a>
      </div>
    </div>
  `

  // Add event listeners for cart actions
  setupCartEvents()
}

// Setup cart events
function setupCartEvents() {
  // Quantity buttons
  const quantityButtons = document.querySelectorAll(".cart-quantity-btn")
  quantityButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.dataset.action
      const id = Number.parseInt(this.dataset.id)
      const size = this.dataset.size
      const input = document.querySelector(`.quantity-input[data-id="${id}"][data-size="${size}"]`)
      const currentValue = Number.parseInt(input.value)

      if (action === "increase") {
        input.value = currentValue + 1
        cart.updateQuantity(id, currentValue + 1, size)
      } else if (action === "decrease" && currentValue > 1) {
        input.value = currentValue - 1
        cart.updateQuantity(id, currentValue - 1, size)
      }

      // Reload cart page to update totals
      loadCartPage()
    })
  })

  // Quantity input change
  const quantityInputs = document.querySelectorAll(".quantity-input")
  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const id = Number.parseInt(this.dataset.id)
      const size = this.dataset.size
      const newValue = Number.parseInt(this.value)

      if (newValue < 1) {
        this.value = 1
        cart.updateQuantity(id, 1, size)
      } else {
        cart.updateQuantity(id, newValue, size)
      }

      // Reload cart page to update totals
      loadCartPage()
    })
  })

  // Remove item buttons
  const removeButtons = document.querySelectorAll(".remove-cart-item")
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number.parseInt(this.dataset.id)
      const size = this.dataset.size

      cart.removeItem(id, size)

      // Reload cart page
      loadCartPage()
      showToast("Item removed from cart")
    })
  })

  // Clear cart button
  const clearCartBtn = document.getElementById("clear-cart")
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        cart.clearCart()
        loadCartPage()
        showToast("Cart cleared")
      }
    })
  }
}

// Load wishlist page
function loadWishlistPage() {
  const wishlistContainer = document.getElementById("wishlist-items")
  if (!wishlistContainer) return

  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `
      <div class="text-center py-5">
        <h2 class="mb-4">Your Wishlist is Empty</h2>
        <p class="text-muted mb-4">Looks like you haven't added any items to your wishlist yet.</p>
        <a href="shop.html" class="btn btn-primary">Explore Products</a>
      </div>
    `
    return
  }

  // Render wishlist items
  wishlistContainer.innerHTML = ""

  wishlist.forEach((productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const wishlistItem = document.createElement("div")
    wishlistItem.className = "card mb-3"
    wishlistItem.innerHTML = `
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-2 mb-3 mb-md-0">
            <img src="${product.images[0]}" alt="${product.name}" class="img-fluid rounded">
          </div>
          <div class="col-md-4 mb-3 mb-md-0">
            <h5><a href="product.html?id=${product.id}" class="text-decoration-none">${product.name}</a></h5>
            <p class="text-muted small mb-0">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
          </div>
          <div class="col-md-2 mb-3 mb-md-0 text-md-center">
            <span>$${product.price.toFixed(2)}</span>
          </div>
          <div class="col-md-4 text-end">
            <button class="btn btn-primary btn-sm me-2 add-to-cart-from-wishlist" data-id="${product.id}">
              <i class="fas fa-shopping-cart me-1"></i> Add to Cart
            </button>
            <button class="btn btn-outline-danger btn-sm remove-wishlist-item" data-id="${product.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `

    wishlistContainer.appendChild(wishlistItem)
  })

  // Add event listeners for wishlist actions
  setupWishlistEvents()
}

// Setup wishlist events
function setupWishlistEvents() {
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-from-wishlist")
  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.id)
      const product = products.find((p) => p.id === productId)

      if (product) {
        // Default to first size if available
        const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null

        if (cart.addItem(product, 1, size)) {
          showToast(`${product.name} added to cart!`)
        }
      }
    })
  })

  // Remove from wishlist buttons
  const removeButtons = document.querySelectorAll(".remove-wishlist-item")
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.id)
      removeFromWishlist(productId)
      loadWishlistPage()
      showToast("Item removed from wishlist")
    })
  })

  // Clear wishlist button
  const clearWishlistBtn = document.getElementById("clear-wishlist")
  if (clearWishlistBtn) {
    clearWishlistBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your wishlist?")) {
        localStorage.setItem("wishlist", JSON.stringify([]))
        loadWishlistPage()
        showToast("Wishlist cleared")
      }
    })
  }
}

// Toggle wishlist
function toggleWishlist(product) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
  const index = wishlist.indexOf(product.id)

  if (index === -1) {
    // Add to wishlist
    wishlist.push(product.id)
    showToast(`${product.name} added to wishlist!`)
  } else {
    // Remove from wishlist
    removeFromWishlist(product.id)
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist))
}

// Remove from wishlist
function removeFromWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
  const index = wishlist.indexOf(productId)

  if (index !== -1) {
    wishlist.splice(index, 1)
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }
}

// Generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  let starsHtml = ""

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>'
  }

  // Half star
  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>'
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>'
  }

  return starsHtml
}

// Format detail name
function formatDetailName(name) {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Show toast notification
function showToast(message) {
  // Check if toast container exists, if not create it
  let toastContainer = document.querySelector(".toast-container")

  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3"
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toastId = "toast-" + Date.now()
  const toastEl = document.createElement("div")
  toastEl.className = "toast"
  toastEl.id = toastId
  toastEl.setAttribute("role", "alert")
  toastEl.setAttribute("aria-live", "assertive")
  toastEl.setAttribute("aria-atomic", "true")

  toastEl.innerHTML = `
    <div class="toast-header">
      <strong class="me-auto">ESSENCE</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `

  toastContainer.appendChild(toastEl)

  // Initialize and show toast
  const toast = new bootstrap.Toast(toastEl, {
    autohide: true,
    delay: 3000,
  })

  toast.show()

  // Remove toast element after it's hidden
  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.remove()
  })
}
