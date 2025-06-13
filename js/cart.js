// Cart functionality
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || []
    this.updateCartCount()
  }

  // Add item to cart
  addItem(product, quantity = 1, size = null) {
    const existingItemIndex = this.items.findIndex((item) => item.id === product.id && item.size === size)

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      this.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      this.items.push({
        ...product,
        quantity: quantity,
        size: size,
      })
    }

    this.saveCart()
    this.updateCartCount()
    return true
  }

  // Remove item from cart
  removeItem(id, size = null) {
    this.items = this.items.filter((item) => !(item.id === id && item.size === size))
    this.saveCart()
    this.updateCartCount()
  }

  // Update item quantity
  updateQuantity(id, quantity, size = null) {
    const itemIndex = this.items.findIndex((item) => item.id === id && item.size === size)

    if (itemIndex !== -1) {
      this.items[itemIndex].quantity = quantity
      this.saveCart()
      this.updateCartCount()
      return true
    }
    return false
  }

  // Clear cart
  clearCart() {
    this.items = []
    this.saveCart()
    this.updateCartCount()
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  // Get cart subtotal
  getSubtotal() {
    return this.getTotal()
  }

  // Get cart tax
  getTax() {
    return this.getSubtotal() * 0.08 // 8% tax
  }

  // Get shipping cost
  getShipping() {
    return this.items.length > 0 ? 5.99 : 0
  }

  // Get cart grand total
  getGrandTotal() {
    return this.getSubtotal() + this.getTax() + this.getShipping()
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items))
  }

  // Update cart count in UI
  updateCartCount() {
    const cartCount = document.querySelector(".cart-count")
    if (cartCount) {
      const totalItems = this.items.reduce((total, item) => total + item.quantity, 0)
      cartCount.textContent = totalItems
      cartCount.style.display = totalItems > 0 ? "flex" : "none"
    }
  }
}

// Initialize cart
const cart = new ShoppingCart()
