import { useEffect, useMemo, useState } from 'react'
import './App.css'

const initialProducts = [
  {
    id: 1,
    name: 'Blazer Minimal',
    category: 'Essenciais',
    price: 289,
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    description: 'Um blazer de linhas marcantes para deixar a produção pronta em poucos minutos.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Bege'],
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: 'Vestido Atelier',
    category: 'Feminino',
    price: 349,
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    description: 'Leve e fácil de combinar, do passeio ao jantar.',
    sizes: ['P', 'M', 'G'],
    colors: ['Champagne', 'Preto'],
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: 'Jaqueta Street',
    category: 'Outerwear',
    price: 399,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'Uma camada extra para os dias mais frescos e as mudanças de estação.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Cinza', 'Preto'],
    inStock: true,
    featured: false,
  },
  {
    id: 4,
    name: 'Camiseta Archive',
    category: 'Básicas',
    price: 119,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    description: 'Aquela camiseta que combina com jeans, alfaiataria e quase tudo no armário.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Branco', 'Offwhite'],
    inStock: true,
    featured: false,
  },
  {
    id: 5,
    name: 'Calça Tailored',
    category: 'Calças',
    price: 219,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
    description: 'Corte alinhado para compor looks de trabalho ou produções mais casuais.',
    sizes: ['P', 'M', 'G'],
    colors: ['Khaki', 'Preto'],
    inStock: true,
    featured: true,
  },
  {
    id: 6,
    name: 'Bolsa Midi',
    category: 'Acessórios',
    price: 169,
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    description: 'Tamanho versátil para acompanhar a rotina sem perder o estilo.',
    sizes: ['Único'],
    colors: ['Caramelo', 'Preto'],
    inStock: true,
    featured: false,
  },
]

const refreshedDescriptions = {
  1: ['Blazer estruturado com corte clean e acabamento premium.', 'Um blazer de linhas marcantes para deixar a produção pronta em poucos minutos.'],
  2: ['Modelagem fluida para composição elegante do dia a dia.', 'Leve e fácil de combinar, do passeio ao jantar.'],
  3: ['Jaqueta leve para transição de estação e uso diário.', 'Uma camada extra para os dias mais frescos e as mudanças de estação.'],
  4: ['Malha premium com caimento leve e visual urbano.', 'Aquela camiseta que combina com jeans, alfaiataria e quase tudo no armário.'],
  5: ['Silhueta moderna com corte longo e conforto no dia a dia.', 'Corte alinhado para compor looks de trabalho ou produções mais casuais.'],
  6: ['Bolsa versátil, com organização interna e acabamento premium.', 'Tamanho versátil para acompanhar a rotina sem perder o estilo.'],
}

const defaultTheme = {
  name: 'Luxe',
  primary: '#1f2937',
  secondary: '#d97706',
  accent: '#f5d0a9',
  background: '#f9f5f3',
  surface: '#ffffff',
  text: '#1b1b1b',
  muted: '#6b7280',
}

const STORAGE_KEYS = {
  products: 'zoo-roupas-products',
  cart: 'zoo-roupas-cart',
  favorites: 'zoo-roupas-favorites',
  theme: 'zoo-roupas-theme',
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function getBrandMonogram(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'LO'
}

const whatsappNumber = '5581989769880'
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'zoo2026'
const wallpaperStorageKey = 'zoo-roupas-wallpaper'
const confirmedSalesStorageKey = 'zoo-roupas-confirmed-sales'
const companyStorageKey = 'zoo-roupas-company'
const brandImageStorageKey = 'zoo-roupas-brand-image'
const socialStorageKey = 'zoo-roupas-social-links'
const socialNetworks = [
  { key: 'instagram', label: 'Instagram', domain: 'instagram.com' },
  { key: 'facebook', label: 'Facebook', domain: 'facebook.com' },
  { key: 'tiktok', label: 'TikTok', domain: 'tiktok.com' },
  { key: 'youtube', label: 'YouTube', domain: 'youtube.com' },
]

function readSocialLinks() {
  let saved
  try {
    saved = JSON.parse(localStorage.getItem(socialStorageKey) || '{}')
  } catch {
    return {}
  }
  return socialNetworks.reduce((links, network) => {
    const value = saved[network.key]
    if (typeof value !== 'string' || !value.trim()) return links
    try {
      const url = new URL(value)
      const host = url.hostname.toLowerCase()
      if (url.protocol === 'https:' && (host === network.domain || host.endsWith(`.${network.domain}`))) {
        links[network.key] = url.href
      }
    } catch {
      return links
    }
    return links
  }, {})
}

function getProductImages(product) {
  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : [product.image]
  return images.map((image) => safeUploadedImage(image) || safeImageUrl(image)).filter(Boolean)
}

function normalizeProducts(products) {
  return products.map((product) => {
    const images = getProductImages(product)
    const refreshedDescription = refreshedDescriptions[product.id]
    const description = refreshedDescription && product.description === refreshedDescription[0]
      ? refreshedDescription[1]
      : product.description
    return { ...product, description, image: images[0] || '', images }
  })
}

function optimizeBrandImage(file, maxDimension = 512) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return Promise.reject(new Error('Escolha uma imagem JPG, PNG ou WebP.'))
  }
  if (file.size > 10 * 1024 * 1024) {
    return Promise.reject(new Error('A imagem deve ter no máximo 10 MB.'))
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      if (image.naturalWidth * image.naturalHeight > 40000000) {
        reject(new Error('A resolução da imagem é muito alta. Escolha uma imagem menor.'))
        return
      }
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.naturalWidth * scale)
      canvas.height = Math.round(image.naturalHeight * scale)
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('Não foi possível processar essa imagem.'))
        return
      }
      try {
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const optimizedImage = canvas.toDataURL('image/webp', 0.78)
        if (optimizedImage.length > 1500000) {
          reject(new Error('A imagem otimizada ficou muito grande. Escolha um arquivo menor.'))
          return
        }
        resolve(optimizedImage)
      } catch {
        reject(new Error('Não foi possível processar essa imagem.'))
      }
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Não foi possível abrir essa imagem.'))
    }
    image.src = objectUrl
  })
}

function safeImageUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

function safeUploadedImage(value) {
  return /^data:image\/webp;base64,[A-Za-z0-9+/]+=*$/.test(value) ? value : ''
}

function createWhatsAppUrl(product, options = {}) {
  const selectedOptions = [options.size, options.color].filter(Boolean).join(' / ')
  const message = [
    'Olá! Gostaria de finalizar a compra deste item:',
    `• Produto: ${product.name}`,
    `• Valor: ${currency.format(product.price)}`,
    `• Opções selecionadas: ${selectedOptions || 'Não se aplica'}`,
    '',
    'Por favor, me informe os próximos passos para o pagamento e entrega!',
  ].join('\n')
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

function App() {
  const [loadingPhase, setLoadingPhase] = useState(() => (
    window.location.pathname.replace(/\/+$/, '') === '/admin' ? 'hidden' : 'loading'
  ))
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.products)
    return normalizeProducts(saved ? JSON.parse(saved) : initialProducts)
  })
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.cart)
    return saved ? JSON.parse(saved) : []
  })
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.favorites)
    return saved ? JSON.parse(saved) : []
  })
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.theme)
    return saved ? JSON.parse(saved) : defaultTheme
  })
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('zoo-roupas-dark-mode') === 'true')
  const [wallpaper, setWallpaper] = useState(() => {
    const saved = localStorage.getItem(wallpaperStorageKey) || ''
    return safeImageUrl(saved) || safeUploadedImage(saved)
  })
  const [selectedVariants, setSelectedVariants] = useState({})
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [identityMessage, setIdentityMessage] = useState('')
  const [company, setCompany] = useState(() => localStorage.getItem(companyStorageKey) || 'Moda Atelier')
  const [companyInput, setCompanyInput] = useState(() => localStorage.getItem(companyStorageKey) || 'Moda Atelier')
  const [socialLinks, setSocialLinks] = useState(readSocialLinks)
  const [socialDraft, setSocialDraft] = useState(readSocialLinks)
  const [socialMessage, setSocialMessage] = useState('')
  const [gallerySelection, setGallerySelection] = useState({})
  const [shoppingScreen, setShoppingScreen] = useState('catalog')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [brandImage, setBrandImage] = useState(() => localStorage.getItem(brandImageStorageKey) || '')
  const [imageUploadMessage, setImageUploadMessage] = useState('')
  const [confirmedSales, setConfirmedSales] = useState(() => {
    const saved = Number(localStorage.getItem(confirmedSalesStorageKey) || 0)
    return Number.isSafeInteger(saved) && saved >= 0 ? saved : 0
  })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tudo')
  const [sizeFilter, setSizeFilter] = useState('Todas')
  const [priceFilter, setPriceFilter] = useState(500)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    category: 'Essenciais',
    price: '',
    images: [],
    description: '',
    sizes: 'P, M, G',
    colors: 'Preto, Branco',
    inStock: true,
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (loadingPhase !== 'loading') return undefined
    const loadingDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 1050
    const timer = window.setTimeout(() => setLoadingPhase('leaving'), loadingDuration)
    return () => window.clearTimeout(timer)
  }, [loadingPhase])

  useEffect(() => {
    if (loadingPhase !== 'leaving') return undefined
    const timer = window.setTimeout(() => setLoadingPhase('hidden'), 320)
    return () => window.clearTimeout(timer)
  }, [loadingPhase])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    localStorage.setItem('zoo-roupas-dark-mode', String(darkMode))
  }, [darkMode])

  const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin'
  const activeTheme = darkMode
    ? {
        ...theme,
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        muted: '#cbd5e1',
      }
    : theme
  const shellStyle = {
    '--primary': activeTheme.primary,
    '--secondary': activeTheme.secondary,
    '--accent': activeTheme.accent,
    '--background': activeTheme.background,
    '--surface': activeTheme.surface,
    '--text': activeTheme.text,
    '--muted': activeTheme.muted,
    '--wallpaper': wallpaper ? `url("${wallpaper}")` : 'none',
    '--page-overlay': wallpaper
      ? darkMode
        ? 'rgba(17, 24, 39, 0.74)'
        : 'rgba(249, 245, 243, 0.68)'
      : 'transparent',
  }

  const categories = useMemo(
    () => ['Tudo', ...new Set(products.map((product) => product.category))],
    [products],
  )

  const sizeOptions = useMemo(
    () => ['Todas', ...new Set(products.flatMap((product) => product.sizes))],
    [products],
  )

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesText = `${product.name} ${product.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory = category === 'Tudo' || product.category === category
      const matchesSize = sizeFilter === 'Todas' || product.sizes.includes(sizeFilter)
      const matchesPrice = product.price <= priceFilter
      const matchesStock = !onlyInStock || product.inStock
      return matchesText && matchesCategory && matchesSize && matchesPrice && matchesStock
    })
  }, [products, search, category, sizeFilter, priceFilter, onlyInStock])

  const cartItems = useMemo(
    () =>
      cart.map((item) => {
        const product = products.find((entry) => entry.id === item.id)
        return product ? { ...item, product } : null
      }),
    [cart, products],
  )

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item) return sum
    return sum + item.product.price * item.quantity
  }, 0)

  const total = subtotal

  function showProduct(product) {
    setSelectedProductId(product.id)
    setShoppingScreen('product')
  }

  function addToCart(product, size = product.sizes[0], color = product.colors[0]) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id && item.size === size && (item.color || '') === color,
      )

      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.size === size && (item.color || '') === color
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { id: product.id, size, color, quantity: 1 }]
    })
  }

  function changeQty(id, size, delta, color = '') {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id && item.size === size && (item.color || '') === color
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function toggleFavorite(productId) {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  }

  function openWhatsApp(product) {
    const options = selectedVariants[product.id] || {
      size: product.sizes[0],
      color: product.colors[0],
    }
    window.open(createWhatsAppUrl(product, options), '_blank', 'noopener,noreferrer')
  }

  function updateVariant(productId, key, value, product) {
    setSelectedVariants((current) => ({
      ...current,
      [productId]: {
        size: current[productId]?.size || product.sizes[0],
        color: current[productId]?.color || product.colors[0],
        [key]: value,
      },
    }))
  }

  function removeWallpaper() {
    try {
      localStorage.removeItem(wallpaperStorageKey)
      setWallpaper('')
      setImageUploadMessage('')
      setCheckoutMessage('Imagem de fundo removida.')
    } catch {
      setImageUploadMessage('Não foi possível remover a imagem de fundo.')
    }
  }

  async function handleProductImageUpload(event) {
    const input = event.currentTarget
    const files = Array.from(input.files || [])
    if (!files.length) return
    try {
      const availableSlots = Math.max(0, 5 - form.images.length)
      if (availableSlots === 0) {
        setImageUploadMessage('Cada produto pode ter até 5 fotos. Remova uma foto antes de adicionar outras.')
        return
      }
      const images = await Promise.all(files.slice(0, availableSlots).map((file) => optimizeBrandImage(file, 1200)))
      setForm((current) => ({ ...current, images: [...current.images, ...images] }))
      setImageUploadMessage(files.length > availableSlots
        ? `${images.length} foto(s) carregada(s). O limite é de 5 por produto.`
        : `${images.length} foto(s) carregada(s).`)
    } catch (error) {
      setImageUploadMessage(error instanceof Error ? error.message : 'Não foi possível carregar a foto do produto.')
    } finally {
      input.value = ''
    }
  }

  async function handleWallpaperUpload(event) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    try {
      const image = await optimizeBrandImage(file, 1600)
      localStorage.setItem(wallpaperStorageKey, image)
      setWallpaper(image)
      setImageUploadMessage('Imagem de fundo carregada e aplicada.')
    } catch (error) {
      setImageUploadMessage(error instanceof Error ? error.message : 'Não foi possível carregar a imagem de fundo.')
    } finally {
      input.value = ''
    }
  }

  function handleAdminLogin(event) {
    event.preventDefault()
    const submittedPassword = new FormData(event.currentTarget).get('password')
    if (submittedPassword !== adminPassword) {
      setAdminError('Senha incorreta.')
      return
    }
    setAdminAuthenticated(true)
    setAdminError('')
  }

  function handleAdminLogout() {
    setAdminAuthenticated(false)
  }

  function saveStoreIdentity() {
    const name = companyInput.trim()
    if (!name) {
      setIdentityMessage('Informe o nome da loja.')
      return
    }
    try {
      localStorage.setItem(companyStorageKey, name)
      setCompany(name)
      setIdentityMessage('Identidade da loja salva.')
    } catch {
      setIdentityMessage('Não foi possível salvar. Libere espaço no armazenamento do navegador e tente novamente.')
    }
  }

  function saveSocialLinks() {
    const nextLinks = {}
    for (const network of socialNetworks) {
      const value = socialDraft[network.key]?.trim()
      if (!value) continue
      let url
      try {
        url = new URL(value)
      } catch {
        setSocialMessage(`Informe um link válido para ${network.label}.`)
        return
      }
      const host = url.hostname.toLowerCase()
      if (url.protocol !== 'https:' || (host !== network.domain && !host.endsWith(`.${network.domain}`))) {
        setSocialMessage(`Use um link HTTPS válido do ${network.label}.`)
        return
      }
      nextLinks[network.key] = url.href
    }
    try {
      localStorage.setItem(socialStorageKey, JSON.stringify(nextLinks))
      setSocialLinks(nextLinks)
      setSocialMessage('Redes sociais salvas.')
    } catch {
      setSocialMessage('Não foi possível salvar. Libere espaço no armazenamento do navegador e tente novamente.')
    }
  }

  async function handleBrandImageUpload(event) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    try {
      const image = await optimizeBrandImage(file)
      localStorage.setItem(brandImageStorageKey, image)
      setBrandImage(image)
      setIdentityMessage('Foto da loja atualizada.')
    } catch (error) {
      setIdentityMessage(error instanceof Error ? error.message : 'Não foi possível salvar a foto da loja.')
    } finally {
      input.value = ''
    }
  }

  function removeBrandImage() {
    try {
      localStorage.removeItem(brandImageStorageKey)
      setBrandImage('')
      setIdentityMessage('Foto da loja removida.')
    } catch {
      setIdentityMessage('Não foi possível remover a foto da loja.')
    }
  }

  function recordConfirmedSale() {
    const updatedSales = confirmedSales + 1
    try {
      localStorage.setItem(confirmedSalesStorageKey, String(updatedSales))
      setConfirmedSales(updatedSales)
      setCheckoutMessage('Venda confirmada registrada.')
    } catch {
      setCheckoutMessage('Não foi possível registrar a venda. Verifique o espaço disponível no navegador.')
    }
  }

  function submitProduct(event) {
    event.preventDefault()

    const parsedPrice = Number(form.price)
    if (!form.name || !form.description || !form.category || !parsedPrice || !form.images.length) {
      setCheckoutMessage('Preencha os dados do produto e envie uma foto pelo computador.')
      return
    }

    const normalized = {
      id: editingId ?? Date.now(),
      name: form.name,
      category: form.category,
      price: parsedPrice,
      image: form.images[0],
      images: form.images,
      description: form.description,
      sizes: form.sizes.split(',').map((size) => size.trim()).filter(Boolean),
      colors: form.colors.split(',').map((color) => color.trim()).filter(Boolean),
      inStock: form.inStock,
      featured: false,
    }

    const updatedProducts = editingId
      ? products.map((product) => product.id === editingId ? normalized : product)
      : [normalized, ...products]
    try {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(updatedProducts))
    } catch {
      setImageUploadMessage('Não foi possível salvar. Remova algumas imagens ou use arquivos menores para liberar espaço no navegador.')
      return
    }
    setProducts(updatedProducts)

    setForm({
      name: '',
      category: 'Essenciais',
      price: '',
      images: [],
      description: '',
      sizes: 'P, M, G',
      colors: 'Preto, Branco',
      inStock: true,
    })
    setEditingId(null)
    setCheckoutMessage(
      editingId ? 'Produto atualizado no catálogo.' : 'Produto adicionado ao catálogo.',
    )
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      images: getProductImages(product),
      description: product.description,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      inStock: product.inStock,
    })
  }

  function deleteProduct(id) {
    const updatedProducts = products.filter((product) => product.id !== id)
    try {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(updatedProducts))
    } catch {
      setImageUploadMessage('Não foi possível salvar. Remova algumas imagens ou use arquivos menores para liberar espaço no navegador.')
      return
    }
    setProducts(updatedProducts)
    setCart((current) => current.filter((item) => item.id !== id))
    setFavorites((current) => current.filter((item) => item !== id))
  }

  function applyThemePreset(name) {
    const presets = {
      Luxe: {
        name: 'Luxe',
        primary: '#1f2937',
        secondary: '#d97706',
        accent: '#f5d0a9',
        background: '#f9f5f3',
        surface: '#ffffff',
        text: '#1b1b1b',
        muted: '#6b7280',
      },
      Escuro: {
        name: 'Escuro',
        primary: '#111827',
        secondary: '#fb7185',
        accent: '#fca5a5',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        muted: '#d1d5db',
      },
      Minimalista: {
        name: 'Minimalista',
        primary: '#0f172a',
        secondary: '#64748b',
        accent: '#e2e8f0',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#0f172a',
        muted: '#475569',
      },
    }

    setTheme(presets[name])
  }

  function exportTheme() {
    const payload = JSON.stringify(theme, null, 2)
    navigator.clipboard
      ?.writeText(payload)
      .then(() => setCheckoutMessage('Tema exportado para a área de transferência.'))
      .catch(() => setCheckoutMessage('Tema pronto para exportação: ' + payload))
  }

  function handleCheckout() {
    if (!cartItems.length) {
      setCheckoutMessage('Seu carrinho está vazio.')
      return
    }

    const message = `Pedido demonstrativo pronto para ${cartItems.length} item(ns), total estimado de ${currency.format(total)}.`
    setCheckoutMessage(message)
    setCart([])
  }

  if (isAdminRoute) {
    return (
      <div className={`shop-shell admin-shell${darkMode ? ' dark-mode' : ''}`} style={shellStyle}>
        <main className="admin-page">
          <a className="admin-back-link" href="/">← Voltar à loja</a>
          {!adminAuthenticated ? (
            <section className="admin-login-card">
              <p className="eyebrow">Área restrita</p>
              <h1>Acesso administrativo</h1>
              <p>Senha demo: <strong>zoo2026</strong>. Se configurou outra senha em <code>.env.local</code>, use a senha personalizada.</p>
              <form className="product-form" onSubmit={handleAdminLogin}>
                <label htmlFor="admin-password">Senha</label>
                <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
                <button className="primary-btn full" type="submit">Entrar</button>
                {adminError && <p className="form-message" role="alert">{adminError}</p>}
              </form>
            </section>
          ) : (
            <>
              <header className="admin-heading">
                <div>
                  <p className="eyebrow">Área restrita · demonstração</p>
                  <h1>Gerenciar produtos</h1>
                </div>
                <button type="button" className="secondary-btn" onClick={handleAdminLogout}>Sair</button>
              </header>
              <section className="card-grid admin-content">
                <section className="info-card sales-counter">
                  <p className="eyebrow">Vendas confirmadas</p>
                  <h2>{confirmedSales}</h2>
                  <p>Registre uma venda depois de confirmar o pagamento pelo WhatsApp.</p>
                  <button className="primary-btn small" type="button" onClick={recordConfirmedSale}>Registrar venda confirmada</button>
                </section>
                <section className="info-card store-identity-panel">
                  <h2>Identidade da loja</h2>
                  <label>Nome da loja<input value={companyInput} onChange={(event) => setCompanyInput(event.target.value)} maxLength={60} /></label>
                  <div className="brand-identity-preview">
                    {brandImage ? <img src={brandImage} alt="Prévia da foto da loja" /> : <span>Z</span>}
                    <label>Enviar foto da loja
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleBrandImageUpload} />
                    </label>
                  </div>
                  <div className="theme-actions">
                    <button className="primary-btn small" type="button" onClick={saveStoreIdentity}>Salvar identidade</button>
                    {brandImage && <button className="secondary-btn small" type="button" onClick={removeBrandImage}>Remover foto</button>}
                  </div>
                  <p className="form-hint">JPG, PNG ou WebP · até 10 MB. A imagem é otimizada e salva neste navegador.</p>
                  {identityMessage && <p className="form-message" role="status">{identityMessage}</p>}
                </section>
                <section className="info-card social-admin-panel">
                  <h2>Redes sociais</h2>
                  <p className="form-hint">Adicione os links HTTPS dos perfis da loja. Eles aparecem no rodapé da vitrine.</p>
                  <div className="product-form">
                    {socialNetworks.map((network) => (
                      <label key={network.key} htmlFor={`social-${network.key}`}>{network.label}
                        <input id={`social-${network.key}`} type="url" inputMode="url" placeholder={`https://${network.domain}/...`} value={socialDraft[network.key] || ''} onChange={(event) => setSocialDraft((current) => ({ ...current, [network.key]: event.target.value }))} />
                      </label>
                    ))}
                    <button type="button" className="primary-btn full" onClick={saveSocialLinks}>Salvar redes sociais</button>
                  </div>
                  {socialMessage && <p className="form-message" role="status">{socialMessage}</p>}
                </section>
                <div className="info-card">
                  <h3>{editingId ? 'Editar produto' : 'Adicionar produto'}</h3>
                  <form className="product-form" onSubmit={submitProduct}>
                    <label>Nome<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
                    <label>Categoria<input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
                    <label>Preço<input required type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
                    <label>Fotos do produto (até 5; selecione várias de uma vez)<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleProductImageUpload} /></label>
                    {form.images.length > 0 && <div className="admin-image-previews">{form.images.map((image, index) => (
                      <div key={`${index}-${image.slice(-24)}`}>
                        <img className="image-upload-preview" src={image} alt={`Prévia ${index + 1} da foto do produto`} />
                        <button type="button" className="secondary-btn small danger" onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))}>Remover foto {index + 1}</button>
                      </div>
                    ))}</div>}
                    {imageUploadMessage && <p className="form-message" role="status">{imageUploadMessage}</p>}
                    <label>Descrição<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
                    <label>Tamanhos<input value={form.sizes} onChange={(event) => setForm({ ...form, sizes: event.target.value })} /></label>
                    <label>Cores<input value={form.colors} onChange={(event) => setForm({ ...form, colors: event.target.value })} /></label>
                    <label className="checkbox-wrap"><input type="checkbox" checked={form.inStock} onChange={() => setForm({ ...form, inStock: !form.inStock })} /> Disponível</label>
                    <button className="primary-btn full" type="submit">{editingId ? 'Salvar alterações' : 'Adicionar produto'}</button>
                    {checkoutMessage && <p className="form-message" role="status">{checkoutMessage}</p>}
                  </form>
                </div>
                <section className="admin-table">
                  <h2>Produtos cadastrados</h2>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Ações</th></tr></thead>
                      <tbody>{products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>{currency.format(product.price)}</td>
                          <td className="table-actions">
                            <button type="button" className="secondary-btn small" onClick={() => handleEdit(product)}>Editar</button>
                            <button type="button" className="secondary-btn small danger" onClick={() => deleteProduct(product.id)}>Excluir</button>
                          </td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </section>
              </section>
              <p className="admin-notice">Painel demonstrativo local. Não representa uma área protegida para produção.</p>
            </>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className={`shop-shell${darkMode ? ' dark-mode' : ''}${shoppingScreen !== 'catalog' ? ' shopping-screen-active' : ''}`} style={shellStyle} aria-busy={loadingPhase !== 'hidden'}>
      {loadingPhase !== 'hidden' && (
        <div className={`store-loader${loadingPhase === 'leaving' ? ' is-leaving' : ''}`} role="status" aria-live="polite">
          <div className="store-loader-content">
            <div className="store-loader-mark">{brandImage ? <img src={brandImage} alt="" /> : getBrandMonogram(company)}</div>
            <p className="store-loader-label">{company}</p>
            <h1>Seu próximo look começa aqui.</h1>
            <p className="store-loader-caption">Estamos preparando a vitrine.</p>
            <div className="store-loader-track"><span /></div>
          </div>
        </div>
      )}
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">{brandImage ? <img src={brandImage} alt="" /> : getBrandMonogram(company)}</div>
          <div>
            <p className="eyebrow">{getBrandMonogram(company)}</p>
            <strong>{company}</strong>
          </div>
        </div>
        <nav className="main-nav">
          <a href="#catalogo">Produtos</a>
        </nav>
        <div className="header-actions">
          <a className="admin-entry-link" href="/admin">Área da equipe</a>
          <button type="button" className="theme-toggle" onClick={() => setDarkMode((value) => !value)} aria-pressed={darkMode}>
            {darkMode ? '☀️ Claro' : '🌙 Escuro'}
          </button>
          <button type="button" className="cart-pill" onClick={() => setShoppingScreen('cart')}>Carrinho • {cart.reduce((sum, item) => sum + item.quantity, 0)}</button>
          {Object.keys(socialLinks).length > 0 && (
            <nav className="social-header-links" aria-label="Redes sociais da loja">
              {socialNetworks.filter((network) => socialLinks[network.key]).map((network) => (
                <a key={network.key} href={socialLinks[network.key]} target="_blank" rel="noopener noreferrer">{network.label}</a>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="page">
        <section className="hero-panel" id="inicio">
          <div className="hero-copy">
            <span className="pill">Novidades da estação</span>
            <h1>Vista-se para o que vem por aí.</h1>
            <p>
              Peças versáteis para acompanhar seus planos, do primeiro compromisso do dia ao último.
            </p>
            <div className="hero-actions">
              <a href="#catalogo" className="primary-btn">Explorar coleção</a>
              <button type="button" className="secondary-btn" onClick={() => setCategory('Tudo')}>
                Ver tudo
              </button>
            </div>
            <ul className="stats">
              <li><strong>{confirmedSales}</strong><span>vendas confirmadas</span></li>
              <li><strong>48h</strong><span>entrega express</span></li>
            </ul>
          </div>
          <div className="hero-visual">
            <div className="visual-card large"></div>
            <div className="visual-card small"></div>
          </div>
        </section>

        <section className="toolbar">
          <div className="search-box">
            <label htmlFor="search">Buscar</label>
            <input
              id="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Camisa, blazer, vestido..."
            />
          </div>

          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)}>
            {sizeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <label className="range-wrap">
            <span>Até {currency.format(priceFilter)}</span>
            <input
              type="range"
              min="80"
              max="500"
              step="10"
              value={priceFilter}
              onChange={(event) => setPriceFilter(Number(event.target.value))}
            />
          </label>

          <label className="checkbox-wrap">
            <input type="checkbox" checked={onlyInStock} onChange={() => setOnlyInStock((value) => !value)} />
            <span>Disponível</span>
          </label>
        </section>

        <section className="content-grid" id="catalogo">
          <div className="catalog-area">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Catálogo</p>
                <h2>Peças em destaque</h2>
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <button
                    type="button"
                    className={`favorite ${favorites.includes(product.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(product.id)}
                    aria-label="Adicionar aos favoritos"
                  >
                    ♥
                  </button>
                  <button type="button" className="product-image-action" onClick={() => showProduct(product)} aria-label={`Ver detalhes de ${product.name}`}>
                    <img src={getProductImages(product)[gallerySelection[product.id] || 0] || product.image} alt={product.name} loading="lazy" />
                  </button>
                  {getProductImages(product).length > 1 && <div className="product-thumbnails" aria-label={`Fotos de ${product.name}`}>
                    {getProductImages(product).map((image, index) => (
                      <button key={`${product.id}-${index}`} type="button" className={gallerySelection[product.id] === index ? 'active' : ''} onClick={() => setGallerySelection((current) => ({ ...current, [product.id]: index }))} aria-label={`Ver foto ${index + 1} de ${product.name}`} aria-pressed={gallerySelection[product.id] === index}>
                        <img src={image} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>}
                  <div className="product-info">
                    <div className="product-header">
                      <span>{product.category}</span>
                      <strong>{currency.format(product.price)}</strong>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="meta-row">
                      <div className="chip-group">
                        {product.sizes.map((size) => (
                          <span key={size} className="chip">{size}</span>
                        ))}
                      </div>
                      <span className={`stock ${product.inStock ? 'good' : 'warn'}`}>
                        {product.inStock ? 'Em estoque' : 'Sem estoque'}
                      </span>
                    </div>
                    <div className="variant-selectors">
                      <label>Tamanho
                        <select value={selectedVariants[product.id]?.size || product.sizes[0]} onChange={(event) => updateVariant(product.id, 'size', event.target.value, product)}>
                          {product.sizes.map((size) => <option key={size}>{size}</option>)}
                        </select>
                      </label>
                      <label>Cor
                        <select value={selectedVariants[product.id]?.color || product.colors[0]} onChange={(event) => updateVariant(product.id, 'color', event.target.value, product)}>
                          {product.colors.map((color) => <option key={color}>{color}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="card-actions">
                      <button type="button" className="primary-btn small" onClick={() => showProduct(product)}>Ver produto</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="cart-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Carrinho</p>
                <h3>Seu pedido</h3>
              </div>
              <span>{cartItems.length} itens</span>
            </div>

            {cartItems.length === 0 ? (
              <p className="empty-state">Seu carrinho ainda está vazio.</p>
            ) : (
              <div className="cart-list">
                {cartItems.map((item) => (
                  item && (
                    <div key={`${item.id}-${item.size}`} className="cart-item">
                      <div>
                        <strong>{item.product.name}</strong>
                        <span>{item.size}</span>
                      </div>
                      <div className="qty-controls">
                        <button type="button" onClick={() => changeQty(item.id, item.size, -1, item.color || '')}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => changeQty(item.id, item.size, 1, item.color || '')}>+</button>
                      </div>
                      <strong>{currency.format(item.product.price * item.quantity)}</strong>
                    </div>
                  )
                ))}
              </div>
            )}

            <div className="summary-box">
              <div>
                <span>Subtotal</span>
                <strong>{currency.format(subtotal)}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{currency.format(total)}</strong>
              </div>
            </div>

            <button type="button" className="primary-btn full" onClick={handleCheckout}>
              Finalizar compra
            </button>
            {checkoutMessage && <p className="checkout-note">{checkoutMessage}</p>}
          </aside>
        </section>

        <section className="card-grid">
          <div className="info-card" id="customizer">
            <p className="eyebrow">Personalização</p>
            <h3>Temas</h3>
            <div className="theme-actions">
              <button type="button" className="secondary-btn small" onClick={() => applyThemePreset('Luxe')}>Luxe</button>
              <button type="button" className="secondary-btn small" onClick={() => applyThemePreset('Escuro')}>Escuro</button>
              <button type="button" className="secondary-btn small" onClick={() => applyThemePreset('Minimalista')}>Minimalista</button>
            </div>
            <div className="color-inputs">
              <label><span>Primária</span><input type="color" value={theme.primary} onChange={(e) => setTheme((current) => ({ ...current, primary: e.target.value }))} /></label>
              <label><span>Secundária</span><input type="color" value={theme.secondary} onChange={(e) => setTheme((current) => ({ ...current, secondary: e.target.value }))} /></label>
              <label><span>Fundo</span><input type="color" value={theme.background} onChange={(e) => setTheme((current) => ({ ...current, background: e.target.value }))} /></label>
            </div>
            <label className="wallpaper-field">Imagem de fundo (envie do computador)
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleWallpaperUpload} />
            </label>
            {imageUploadMessage && <p className="form-message" role="status">{imageUploadMessage}</p>}
            <div className="theme-actions">
              <button type="button" className="secondary-btn small" onClick={removeWallpaper}>Remover imagem</button>
            </div>
            <button type="button" className="primary-btn small" onClick={exportTheme}>Exportar tema</button>
          </div>
        </section>
      </main>
      {shoppingScreen !== 'catalog' && (
        <section className="shopping-screen" aria-label={shoppingScreen === 'product' ? 'Detalhes do produto' : 'Carrinho'}>
          <header className="shopping-screen-header">
            <button type="button" className="secondary-btn" onClick={() => setShoppingScreen('catalog')}>← Voltar aos produtos</button>
            <strong>{shoppingScreen === 'product' ? 'Detalhes do produto' : 'Seu carrinho'}</strong>
            {shoppingScreen === 'product' && <button type="button" className="secondary-btn" onClick={() => setShoppingScreen('cart')}>Carrinho ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>}
          </header>
          {shoppingScreen === 'product' && products.filter((product) => product.id === selectedProductId).map((product) => {
            const variants = selectedVariants[product.id] || { size: product.sizes[0], color: product.colors[0] }
            return <article key={product.id} className="product-detail-screen">
              <div>
                <img className="product-detail-image" src={getProductImages(product)[gallerySelection[product.id] || 0] || product.image} alt={product.name} />
                {getProductImages(product).length > 1 && <div className="product-thumbnails">
                  {getProductImages(product).map((image, index) => (
                    <button key={`${product.id}-${index}`} type="button" className={gallerySelection[product.id] === index ? 'active' : ''} onClick={() => setGallerySelection((current) => ({ ...current, [product.id]: index }))} aria-label={`Ver foto ${index + 1} de ${product.name}`} aria-pressed={gallerySelection[product.id] === index}><img src={image} alt="" /></button>
                  ))}
                </div>}
              </div>
              <div className="product-detail-copy">
                <p className="eyebrow">{product.category}</p>
                <h1>{product.name}</h1>
                <strong className="product-detail-price">{currency.format(product.price)}</strong>
                <p>{product.description}</p>
                <p className={`stock ${product.inStock ? 'good' : 'warn'}`}>{product.inStock ? 'Em estoque' : 'Sem estoque'}</p>
                <div className="variant-selectors">
                  <label>Tamanho
                    <select value={variants.size} onChange={(event) => updateVariant(product.id, 'size', event.target.value, product)}>{product.sizes.map((size) => <option key={size}>{size}</option>)}</select>
                  </label>
                  <label>Cor
                    <select value={variants.color} onChange={(event) => updateVariant(product.id, 'color', event.target.value, product)}>{product.colors.map((color) => <option key={color}>{color}</option>)}</select>
                  </label>
                </div>
                <button type="button" className="primary-btn full" disabled={!product.inStock} onClick={() => { addToCart(product, variants.size, variants.color); setShoppingScreen('cart') }}>Adicionar ao carrinho</button>
                <button type="button" className="secondary-btn full" onClick={() => openWhatsApp(product)}>Comprar pelo WhatsApp</button>
              </div>
            </article>
          })}
          {shoppingScreen === 'cart' && <section className="shopping-cart-screen">
            <h1>Seu carrinho</h1>
            {cartItems.filter(Boolean).length === 0 ? <p className="empty-state">Seu carrinho está vazio.</p> : cartItems.map((item) => item && (
              <div key={`${item.id}-${item.size}-${item.color || ''}`} className="cart-item">
                <div><strong>{item.product.name}</strong><span>{item.size}{item.color ? ` · ${item.color}` : ''}</span></div>
                <div className="qty-controls"><button type="button" aria-label={`Diminuir quantidade de ${item.product.name}`} onClick={() => changeQty(item.id, item.size, -1, item.color || '')}>-</button><span>{item.quantity}</span><button type="button" aria-label={`Aumentar quantidade de ${item.product.name}`} onClick={() => changeQty(item.id, item.size, 1, item.color || '')}>+</button></div>
                <strong>{currency.format(item.product.price * item.quantity)}</strong>
              </div>
            ))}
            <div className="summary-box"><div><span>Subtotal</span><strong>{currency.format(subtotal)}</strong></div><div><span>Total</span><strong>{currency.format(total)}</strong></div></div>
            <button type="button" className="primary-btn full" onClick={handleCheckout}>Finalizar compra</button>
            {checkoutMessage && <p className="checkout-note" role="status">{checkoutMessage}</p>}
          </section>}
        </section>
      )}
      {Object.keys(socialLinks).length > 0 && (
        <footer className="social-footer">
          <strong>Siga {company}</strong>
          <nav aria-label="Redes sociais da loja">
            {socialNetworks.filter((network) => socialLinks[network.key]).map((network) => (
              <a key={network.key} href={socialLinks[network.key]} target="_blank" rel="noopener noreferrer">{network.label}</a>
            ))}
          </nav>
        </footer>
      )}
    </div>
  )
}

export default App
