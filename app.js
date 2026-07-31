/* ==========================================================================
   AegisMed - Client Application Logic (State & Simulations)
   ========================================================================== */

// 1. Medicine Database
let MEDICINES = [
    {
        id: "med-1",
        name: "Aspirin Cardioprotect",
        category: "Analgesic",
        price: 9.99,
        ingredient: "Acetylsalicylic Acid",
        requiresRx: false,
        description: "Low-dose analgesic commonly used for cardioprotection and inflammation relief."
    },
    {
        id: "med-2",
        name: "Ibuprofen Forte",
        category: "Analgesic",
        price: 8.49,
        ingredient: "Ibuprofen",
        requiresRx: false,
        description: "Non-steroidal anti-inflammatory drug (NSAID) for pain relief, fever reduction, and swelling."
    },
    {
        id: "med-3",
        name: "Amoxicillin Shield",
        category: "Antibiotic",
        price: 24.99,
        ingredient: "Amoxicillin",
        requiresRx: true,
        description: "Broad-spectrum penicillin antibiotic used to treat bacterial infections. Requires prescription validation."
    },
    {
        id: "med-4",
        name: "Atorvastatin Shield",
        category: "Cardiovascular",
        price: 32.50,
        ingredient: "Atorvastatin",
        requiresRx: true,
        description: "Statin medication used to prevent cardiovascular disease and lower cholesterol."
    },
    {
        id: "med-5",
        name: "Warfarin Flow",
        category: "Cardiovascular",
        price: 18.99,
        ingredient: "Warfarin Sodium",
        requiresRx: true,
        description: "Anticoagulant (blood thinner) used to prevent blood clots. Highly interactive ingredient."
    },
    {
        id: "med-6",
        name: "Cetirizine Breeze",
        category: "Antihistamine",
        price: 12.99,
        ingredient: "Cetirizine",
        requiresRx: false,
        description: "Second-generation antihistamine used for the treatment of hay fever, allergies, and hives."
    },
    {
        id: "med-7",
        name: "Vitamin C Spark",
        category: "Supplement",
        price: 7.99,
        ingredient: "Ascorbic Acid",
        requiresRx: false,
        description: "Powerful antioxidant supplement that supports cell protection and immune health."
    },
    {
        id: "med-8",
        name: "Metformin Balance",
        category: "Antidiabetic",
        price: 15.49,
        ingredient: "Metformin",
        requiresRx: true,
        description: "First-line medication for the treatment of type 2 diabetes, helping control blood sugar levels."
    },
    {
        id: "med-9",
        name: "Melatonin Sleep",
        category: "Supplement",
        price: 10.99,
        ingredient: "Melatonin",
        requiresRx: false,
        description: "Hormone supplement that regulates sleep-wake cycles, assisting with jet lag or sleep issues."
    },
    {
        id: "med-10",
        name: "Lisinopril Control",
        category: "Cardiovascular",
        price: 14.25,
        ingredient: "Lisinopril",
        requiresRx: true,
        description: "ACE inhibitor medication used to treat high blood pressure, heart failure, and after heart attacks."
    },
    {
        id: "med-11",
        name: "Paracetamol Extra",
        category: "Analgesic",
        price: 5.99,
        ingredient: "Paracetamol",
        requiresRx: false,
        description: "Effective pain reliever and fever reducer. Suitable for mild to moderate discomfort."
    },
    {
        id: "med-12",
        name: "Omega-3 Pure Health",
        category: "Supplement",
        price: 16.50,
        ingredient: "Fish Oil",
        requiresRx: false,
        description: "Rich source of EPA and DHA fatty acids supporting heart, brain, and joint function."
    }
];

// 2. Drug Incompatibility Matrix
const INCOMPATIBILITY_RULES = [
    {
        ing1: "Acetylsalicylic Acid",
        ing2: "Warfarin Sodium",
        severity: "CRITICAL",
        reason: "Concomitant use of Aspirin and Warfarin significantly increases the risk of severe gastrointestinal and systemic bleeding."
    },
    {
        ing1: "Acetylsalicylic Acid",
        ing2: "Ibuprofen",
        severity: "WARNING",
        reason: "Ibuprofen can block the irreversible cardioprotective antiplatelet effect of Aspirin, rendering Aspirin less effective for heart health."
    },
    {
        ing1: "Ibuprofen",
        ing2: "Warfarin Sodium",
        severity: "CRITICAL",
        reason: "NSAIDs like Ibuprofen increase bleeding risks when combined with anticoagulants, and can damage the stomach lining."
    }
];

// 2a. Localization Definitions
const CURRENCIES = {
    USD: { symbol: "$", rate: 1.0 },
    GBP: { symbol: "£", rate: 0.77 },
    INR: { symbol: "₹", rate: 83.5 },
    EUR: { symbol: "€", rate: 0.92 },
    JPY: { symbol: "¥", rate: 155.0 }
};

const REGIONS = {
    US: { name: "United States", greeting: "Hello! Welcome to AegisMed US.", policy: "Standard FDA safety rules apply.", defaultCurrency: "USD", defaultTimezone: "EST", taxRate: 0.08, taxName: "Est. Sales Tax (8%)" },
    UK: { name: "United Kingdom", greeting: "Hello! Welcome to AegisMed UK.", policy: "NHS compliance rules apply.", defaultCurrency: "GBP", defaultTimezone: "GMT", taxRate: 0.20, taxName: "VAT (20%)" },
    IN: { name: "India", greeting: "Namaste! Welcome to AegisMed India.", policy: "CDSCO drug controls apply.", defaultCurrency: "INR", defaultTimezone: "IST", taxRate: 0.12, taxName: "GST (12%)" },
    DE: { name: "Germany", greeting: "Guten Tag! Willkommen bei AegisMed Deutschland.", policy: "BfArM safety regulations apply.", defaultCurrency: "EUR", defaultTimezone: "CET", taxRate: 0.19, taxName: "VAT (19%)" },
    JP: { name: "Japan", greeting: "Konnichiwa! Welcome to AegisMed Japan.", policy: "PMDA pharmaceutical guidelines apply.", defaultCurrency: "JPY", defaultTimezone: "JST", taxRate: 0.10, taxName: "Consumption Tax (10%)" }
};

const TIMEZONES = {
    UTC: { label: "UTC", offset: 0 },
    EST: { label: "EST", offset: -5 },
    GMT: { label: "GMT", offset: 0 },
    IST: { label: "IST", offset: 5.5 },
    CET: { label: "CET", offset: 1 },
    JST: { label: "JST", offset: 9 }
};

// 3. Application State
let cart = [];
let currentCategoryFilter = "all";
let searchFilterQuery = "";
let otcOnlyFilter = false;

let selectedRegion = "US";
let selectedCurrency = "USD";
let selectedTimezone = "UTC";
let activeScannerKey = null; // Caches which sample was scanned

let selectedSubdomain = "medstore";
const customDomainSuffix = ".technocons.com";

let hasRxUploaded = false;
let hasTelehealthApproval = false;
let selectedLang = "EN";

// Translation dictionaries
const TRANSLATIONS = {
    EN: {
        storeTab: "AegisMed Store",
        chatTab: "AI Pharmacist",
        scanTab: "Rx Scanner",
        settingsTab: "Settings",
        emptyCart: "Your cart is empty",
        checkoutBtn: "Proceed to Secure Checkout",
        telehealthBtn: "🩺 Consult Doctor for prescription",
        subtotalLabel: "Subtotal:",
        catalogTitle: "AegisMed Global Store",
        catalogDesc: "AI-powered pharmaceutical ordering, automated drug interaction monitoring, and regional compliance checking.",
        settingTitle: "Localization & System Settings",
        settingDesc: "Customize your region, currency preferences, and time zone offsets. These changes will update inventory pricing, chatbot responses, and checkout parameters globally."
    },
    HI: {
        storeTab: "एजिसमेड स्टोर",
        chatTab: "एआई फार्मासिस्ट",
        scanTab: "प्रिस्क्रिप्शन स्कैनर",
        settingsTab: "सेटिंग्स",
        emptyCart: "आपकी कार्ट खाली है",
        checkoutBtn: "सुरक्षित चेकआउट करें",
        telehealthBtn: "🩺 एआई डॉक्टर से परामर्श लें",
        subtotalLabel: "कुल मूल्य:",
        catalogTitle: "एजिसमेड ग्लोबल स्टोर",
        catalogDesc: "एआई-संचालित दवा आदेश, स्वचालित दवा अंतःक्रिया निगरानी, और क्षेत्रीय अनुपालन जांच।",
        settingTitle: "स्थानीयकरण एवं सिस्टम सेटिंग्स",
        settingDesc: "अपने क्षेत्र, मुद्रा प्राथमिकताओं और समय क्षेत्र ऑफसेट को अनुकूलित करें। ये बदलाव विश्व स्तर पर उत्पाद की कीमतों और एआई फार्मासिस्ट को अपडेट करेंगे।"
    },
    DE: {
        storeTab: "AegisMed Shop",
        chatTab: "KI-Apotheker",
        scanTab: "Rezept-Scanner",
        settingsTab: "Einstellungen",
        emptyCart: "Ihr Warenkorb ist leer",
        checkoutBtn: "Sicher zur Kasse gehen",
        telehealthBtn: "🩺 Arzt für Rezept konsultieren",
        subtotalLabel: "Zwischensumme:",
        catalogTitle: "AegisMed Globaler Shop",
        catalogDesc: "KI-gestützte pharmazeutische Bestellung, automatisierte Überwachung von Wechselwirkungen und regionale Compliance-Prüfung.",
        settingTitle: "Lokalisierung & Systemeinstellungen",
        settingDesc: "Passen Sie Region, Währung und Zeitzonen-Offsets an. Diese Änderungen aktualisieren die Preise, Chatbot-Antworten und Checkout-Parameter weltweit."
    },
    JP: {
        storeTab: "イージスメッド店舗",
        chatTab: "AI薬剤師相談",
        scanTab: "処方箋スキャン",
        settingsTab: "環境設定",
        emptyCart: "カートは空です",
        checkoutBtn: "安全なレジに進む",
        telehealthBtn: "🩺 医師による遠隔処方箋発行",
        subtotalLabel: "小計:",
        catalogTitle: "イージスメッド・グローバル",
        catalogDesc: "AI対応の医薬品注文、自動薬物相互作用監視、および地域ごとのコンプライアンスチェック。",
        settingTitle: "地域と言語の設定",
        settingDesc: "地域、通貨、タイムゾーンのオフセットをカスタマイズします。これらの変更により、価格設定、チャットボットの応答、チェックアウトパラメータが更新されます。"
    }
};

const CONTRAINDICATION_RULES = [
    {
        condition: "pregnancy",
        drugId: "m3", // Warfarin Flow
        severity: "CRITICAL",
        message: "❌ Contraindication: **Warfarin Flow** is strictly contraindicated during pregnancy due to high risk of fetal birth defects and internal bleeding. Please consult a doctor immediately."
    },
    {
        condition: "hypertension",
        drugId: "m2", // Ibuprofen Forte
        severity: "WARNING",
        message: "⚠️ Precaution: **Ibuprofen Forte** (NSAID) can increase blood pressure and counteract anti-hypertensive therapies. Monitor blood pressure closely."
    },
    {
        condition: "nsaid-allergy",
        drugId: "m1", // Aspirin Cardioprotect
        severity: "CRITICAL",
        message: "❌ Critical Allergy Warning: Patient has documented NSAID allergy. **Aspirin Cardioprotect** can cause severe anaphylactic responses."
    },
    {
        condition: "nsaid-allergy",
        drugId: "m2", // Ibuprofen Forte
        severity: "CRITICAL",
        message: "❌ Critical Allergy Warning: Patient has documented NSAID allergy. **Ibuprofen Forte** can cause severe asthma triggers or skin rashes."
    },
    {
        condition: "kidney",
        drugId: "m2", // Ibuprofen Forte
        severity: "WARNING",
        message: "⚠️ Precaution: NSAIDs like **Ibuprofen Forte** reduce renal blood flow. Avoid use in moderate-to-severe renal impairment."
    }
];

// Helper function: formats a price based on selected currency
function formatPrice(usdValue) {
    const info = CURRENCIES[selectedCurrency];
    const converted = usdValue * info.rate;
    return `${info.symbol}${converted.toFixed(2)}`;
}

// 4. Dom Nodes Caching
const dom = {
    tabs: document.querySelectorAll('.nav-tab'),
    views: document.querySelectorAll('.app-view'),
    productsGrid: document.getElementById('products-grid'),
    searchInput: document.getElementById('search-input'),
    filterCheckboxes: document.querySelectorAll('.filter-checkbox'),
    filterOtc: document.getElementById('filter-otc'),
    catalogCount: document.getElementById('catalog-count-display'),
    
    // Cart Drawer
    btnOpenCart: document.getElementById('btn-open-cart'),
    btnCloseCart: document.getElementById('btn-close-cart'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartBadge: document.getElementById('cart-count'),
    rxWarning: document.getElementById('rx-warning-indicator'),
    btnCheckout: document.getElementById('btn-checkout'),
    
    // Alerts
    alertsContainer: document.getElementById('alerts-container'),
    
    // Chatbot
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    chatSendBtn: document.getElementById('chat-send-btn'),
    suggestBtns: document.querySelectorAll('.suggest-btn'),
    
    // Prescription Scanner
    uploadZone: document.getElementById('upload-zone'),
    fileInput: document.getElementById('file-input'),
    scannerOverlay: document.getElementById('scanner-overlay'),
    sampleRx1: document.getElementById('sample-rx-1'),
    sampleRx2: document.getElementById('sample-rx-2'),
    resultsPlaceholder: document.getElementById('results-placeholder'),
    resultsContent: document.getElementById('results-content'),
    detectedList: document.getElementById('detected-list'),
    detectedWarnings: document.getElementById('detected-warnings'),
    btnAddScanned: document.getElementById('btn-add-scanned'),
    
    // Checkout Modal
    modalCheckoutSuccess: document.getElementById('modal-checkout-success'),
    btnCloseSuccess: document.getElementById('btn-close-success'),
    refNumber: document.getElementById('ref-number'),
    deliveryTime: document.getElementById('delivery-time'),

    // Settings
    selectRegion: document.getElementById('select-region'),
    selectCurrency: document.getElementById('select-currency'),
    selectTimezone: document.getElementById('select-timezone'),
    selectLang: document.getElementById('select-lang'),

    // Subdomain elements
    inputSubdomain: document.getElementById('input-subdomain'),
    subdomainPreviewLink: document.getElementById('subdomain-preview-link'),
    headerSubdomain: document.getElementById('header-subdomain'),
    receiptUrl: document.getElementById('receipt-url'),
    summaryTaxLabel: document.getElementById('summary-tax-label'),
    summaryTax: document.getElementById('summary-tax'),
    summaryTotal: document.getElementById('summary-total'),

    // Telehealth elements
    btnTelehealthTrigger: document.getElementById('btn-telehealth-trigger'),
    modalTelehealth: document.getElementById('modal-telehealth'),
    btnCloseTelehealth: document.getElementById('btn-close-telehealth'),
    telehealthChatPane: document.getElementById('telehealth-chat-pane'),
    telehealthInputRow: document.getElementById('telehealth-input-row'),

    // Patient profile checkboxes
    profileHypertension: document.getElementById('profile-hypertension'),
    profileDiabetes: document.getElementById('profile-diabetes'),
    profileAsthma: document.getElementById('profile-asthma'),
    profilePregnancy: document.getElementById('profile-pregnancy'),
    profileKidney: document.getElementById('profile-kidney'),
    profileNsaidAllergy: document.getElementById('profile-nsaid-allergy'),

    // Merchant inventory elements
    formAddMedicine: document.getElementById('form-add-medicine'),
    addMedName: document.getElementById('add-med-name'),
    addMedIngredient: document.getElementById('add-med-ingredient'),
    addMedPrice: document.getElementById('add-med-price'),
    addMedCategory: document.getElementById('add-med-category'),
    addMedDesc: document.getElementById('add-med-desc'),
    addMedRequiresRx: document.getElementById('add-med-requires-rx'),
    merchantInventoryList: document.getElementById('merchant-inventory-list')
};

// Simulated data for prescription scanner results
const SCANNER_SAMPLES = {
    rx1: {
        patient: "John Doe",
        date: "2026-07-31",
        items: [
            { id: "med-1", qty: 1 }, // Aspirin
            { id: "med-2", qty: 2 }  // Ibuprofen
        ],
        warnings: [
            {
                type: "info",
                msg: "Aspirin & Ibuprofen both detected. This will trigger a drug interaction warning in the cart."
            }
        ]
    },
    rx2: {
        patient: "Jane Smith",
        date: "2026-07-31",
        items: [
            { id: "med-3", qty: 1 }, // Amoxicillin (Rx)
            { id: "med-7", qty: 2 }  // Vitamin C
        ],
        warnings: [
            {
                type: "critical",
                msg: "Contains Amoxicillin Shield, which is a prescription-only drug. Doctor certification confirmed."
            }
        ]
    }
};

let activeScannerOutput = null; // Stores parsed items from prescription scanning

// ==========================================================================
// Views Navigation
// ==========================================================================
dom.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        dom.tabs.forEach(t => t.classList.remove('active'));
        dom.views.forEach(v => v.classList.remove('active'));
        
        tab.classList.add('active');
        const targetView = tab.getAttribute('data-target');
        document.getElementById(targetView).classList.add('active');
    });
});

// ==========================================================================
// Rendering Products Catalog
// ==========================================================================
function renderCatalog() {
    dom.productsGrid.innerHTML = "";
    
    const filtered = MEDICINES.filter(med => {
        // Category check
        const matchCategory = currentCategoryFilter === "all" || med.category === currentCategoryFilter;
        // Search text check
        const matchSearch = med.name.toLowerCase().includes(searchFilterQuery.toLowerCase()) || 
                            med.ingredient.toLowerCase().includes(searchFilterQuery.toLowerCase()) ||
                            med.description.toLowerCase().includes(searchFilterQuery.toLowerCase());
        // OTC filter check
        const matchOtc = !otcOnlyFilter || !med.requiresRx;
        
        return matchCategory && matchSearch && matchOtc;
    });
    
    dom.catalogCount.innerText = `Showing ${filtered.length} products`;
    
    if (filtered.length === 0) {
        dom.productsGrid.innerHTML = `
            <div class="results-placeholder grid-span-full">
                <p>No medicines match your active search or filters.</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(med => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-badge-row">
                <span class="${med.requiresRx ? 'rx-badge' : 'otc-badge'}">${med.requiresRx ? 'Rx Required' : 'OTC'}</span>
                <span class="product-category">${med.category}</span>
            </div>
            <div>
                <h3 class="product-title">${med.name}</h3>
                <div class="product-ingredient">Active: <span>${med.ingredient}</span></div>
            </div>
            <p class="product-description">${med.description}</p>
            <div class="product-footer">
                <span class="product-price">${formatPrice(med.price)}</span>
                <button class="btn-add-cart" onclick="addToCart('${med.id}')">Add to Cart</button>
            </div>
        `;
        dom.productsGrid.appendChild(card);
    });
}

// Global scope hook so inline onclick handler works
window.addToCart = function(id) {
    const existing = cart.find(item => item.product.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        const med = MEDICINES.find(m => m.id === id);
        cart.push({ product: med, quantity: 1 });
    }
    renderCart();
    checkInteractions();
    openCartDrawer();
};

// ==========================================================================
// Catalog Filters Event Listeners
// ==========================================================================
dom.searchInput.addEventListener('input', (e) => {
    searchFilterQuery = e.target.value;
    renderCatalog();
});

dom.filterCheckboxes.forEach(filter => {
    filter.addEventListener('click', (e) => {
        dom.filterCheckboxes.forEach(f => f.classList.remove('active-filter'));
        filter.classList.add('active-filter');
        currentCategoryFilter = filter.getAttribute('data-category');
        renderCatalog();
    });
});

dom.filterOtc.addEventListener('change', (e) => {
    otcOnlyFilter = e.target.checked;
    renderCatalog();
});

// ==========================================================================
// Shopping Cart Logic
// ==========================================================================
function openCartDrawer() {
    dom.cartDrawer.classList.add('open');
    dom.cartBackdrop.classList.add('open');
}

function closeCartDrawer() {
    dom.cartDrawer.classList.remove('open');
    dom.cartBackdrop.classList.remove('open');
}

dom.btnOpenCart.addEventListener('click', openCartDrawer);
dom.btnCloseCart.addEventListener('click', closeCartDrawer);
dom.cartBackdrop.addEventListener('click', closeCartDrawer);

function renderCart() {
    dom.cartItemsContainer.innerHTML = "";
    
    let totalItems = 0;
    let subtotal = 0;
    let containsRx = false;
    
    if (cart.length === 0) {
        dom.cartItemsContainer.innerHTML = `
            <div class="cart-empty-state">
                <svg viewBox="0 0 24 24" class="empty-cart-icon"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/></svg>
                <p>${TRANSLATIONS[selectedLang].emptyCart}</p>
            </div>
        `;
        dom.cartSubtotal.innerText = formatPrice(0);
        dom.cartBadge.innerText = "0";
        dom.rxWarning.style.display = "none";
        dom.btnTelehealthTrigger.style.display = "none";
        dom.btnCheckout.disabled = true;
        return;
    }
    
    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.product.price * item.quantity;
        if (item.product.requiresRx) {
            containsRx = true;
        }
        
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.product.name}</span>
                ${item.product.requiresRx ? '<span class="cart-item-req-rx">⚠️ Rx Required</span>' : ''}
                <span class="cart-item-price">${formatPrice(item.product.price)}</span>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="btn-qty" onclick="changeQty('${item.product.id}', -1)">-</button>
                    <span class="item-qty-val">${item.quantity}</span>
                    <button class="btn-qty" onclick="changeQty('${item.product.id}', 1)">+</button>
                </div>
                <button class="btn-remove-item" onclick="removeCartItem('${item.product.id}')">Remove</button>
            </div>
        `;
        dom.cartItemsContainer.appendChild(itemRow);
    });
    
    dom.cartSubtotal.innerText = formatPrice(subtotal);
    dom.cartBadge.innerText = totalItems;
    
    // Check if we have a critical warning from contraindications or drug interactions
    const hasCriticalWarning = document.querySelector('.interaction-alert[data-severity="CRITICAL"]');
    
    if (containsRx) {
        dom.rxWarning.style.display = "flex";
        
        if (hasRxUploaded || hasTelehealthApproval) {
            dom.rxWarning.querySelector('.warning-pill').innerText = "Rx Approved";
            dom.rxWarning.querySelector('.warning-pill').style.background = "var(--primary)";
            dom.rxWarning.querySelector('.warning-pill').style.boxShadow = "0 0 8px var(--primary-glow)";
            dom.rxWarning.querySelector('.warning-text').innerText = hasTelehealthApproval ? "Approved by Dr. Aegis MD" : "Prescription verified successfully";
            
            dom.btnTelehealthTrigger.style.display = "none";
            dom.btnCheckout.disabled = !!hasCriticalWarning;
        } else {
            dom.rxWarning.querySelector('.warning-pill').innerText = "Rx Required";
            dom.rxWarning.querySelector('.warning-pill').style.background = "#e11d48";
            dom.rxWarning.querySelector('.warning-pill').style.boxShadow = "none";
            dom.rxWarning.querySelector('.warning-text').innerText = "Requires verified doctor prescription";
            
            dom.btnTelehealthTrigger.style.display = "block";
            dom.btnCheckout.disabled = true; // Block because no Rx verified!
        }
    } else {
        dom.rxWarning.style.display = "none";
        dom.btnTelehealthTrigger.style.display = "none";
        dom.btnCheckout.disabled = !!hasCriticalWarning;
    }
}

window.changeQty = function(id, delta) {
    const item = cart.find(item => item.product.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(c => c.product.id !== id);
        }
    }
    renderCart();
    checkInteractions();
};

window.removeCartItem = function(id) {
    cart = cart.filter(item => item.product.id !== id);
    renderCart();
    checkInteractions();
};

// ==========================================================================
// Drug-Drug Interaction Safety Engine
// ==========================================================================
function checkInteractions() {
    dom.alertsContainer.innerHTML = "";
    
    let hasCritical = false;
    
    // Check patient contraindications first (can be triggered even with single item in cart)
    let activeConditions = [];
    if (dom.profileHypertension && dom.profileHypertension.checked) activeConditions.push("hypertension");
    if (dom.profileDiabetes && dom.profileDiabetes.checked) activeConditions.push("diabetes");
    if (dom.profileAsthma && dom.profileAsthma.checked) activeConditions.push("asthma");
    if (dom.profilePregnancy && dom.profilePregnancy.checked) activeConditions.push("pregnancy");
    if (dom.profileKidney && dom.profileKidney.checked) activeConditions.push("kidney");
    if (dom.profileNsaidAllergy && dom.profileNsaidAllergy.checked) activeConditions.push("nsaid-allergy");

    cart.forEach(item => {
        CONTRAINDICATION_RULES.forEach(rule => {
            if (activeConditions.includes(rule.condition) && item.product.id === rule.drugId) {
                const alertBox = document.createElement('div');
                alertBox.className = 'interaction-alert';
                alertBox.setAttribute('data-severity', rule.severity);
                
                if (rule.severity === "CRITICAL") {
                    hasCritical = true;
                }
                
                alertBox.innerHTML = `
                    <div class="alert-message">
                        <svg viewBox="0 0 24 24" style="fill: ${rule.severity === 'CRITICAL' ? '#e11d48' : '#eab308'}; width: 24px; height: 24px; flex-shrink: 0;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        <div>
                            <strong>[${rule.severity}] Patient Safety Contraindication:</strong>
                            <p style="font-size: 0.85rem; margin-top: 0.25rem;">${rule.message}</p>
                        </div>
                    </div>
                    <button class="btn-dismiss-alert" onclick="this.parentElement.remove()">✕</button>
                `;
                dom.alertsContainer.appendChild(alertBox);
            }
        });
    });

    // Check drug-drug interaction warnings (requires at least 2 items)
    if (cart.length >= 2) {
        const activeIngredients = cart.map(item => item.product.ingredient);
        INCOMPATIBILITY_RULES.forEach(rule => {
            if (activeIngredients.includes(rule.ing1) && activeIngredients.includes(rule.ing2)) {
                const alertBox = document.createElement('div');
                alertBox.className = 'interaction-alert';
                alertBox.setAttribute('data-severity', rule.severity);
                
                if (rule.severity === "CRITICAL") {
                    hasCritical = true;
                }
                
                alertBox.innerHTML = `
                    <div class="alert-message">
                        <svg viewBox="0 0 24 24" style="fill: ${rule.severity === 'CRITICAL' ? '#e11d48' : '#eab308'}; width: 24px; height: 24px; flex-shrink: 0;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        <div>
                            <strong>[${rule.severity}] Drug-Drug Interaction Warning:</strong>
                            <p style="font-size: 0.85rem; margin-top: 0.25rem;">${rule.reason}</p>
                        </div>
                    </div>
                    <button class="btn-dismiss-alert" onclick="this.parentElement.remove()">✕</button>
                `;
                dom.alertsContainer.appendChild(alertBox);
            }
        });
    }
    
    // Disable/Enable checkout button based on critical safety alerts
    // But double check if contains prescription drugs and lacks verification!
    let containsRx = cart.some(item => item.product.requiresRx);
    const hasUnverifiedRx = containsRx && !hasRxUploaded && !hasTelehealthApproval;
    
    dom.btnCheckout.disabled = hasCritical || hasUnverifiedRx;
}

// ==========================================================================
// AI Pharmacist Consultant Chatbot
// ==========================================================================
function addChatMessage(content, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    // Convert markdownbold in message to HTML
    const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    msg.innerHTML = `
        <div class="message-content">${formattedContent}</div>
        <span class="message-time">Just now</span>
    `;
    
    dom.chatMessages.appendChild(msg);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message ai-message'
    indicator.id = 'chat-typing-indicator';
    indicator.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>
    `;
    dom.chatMessages.appendChild(indicator);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
}

function getPharmacistResponse(input) {
    const text = input.toLowerCase();
    
    // Check keyword maps
    if (text.includes("ibuprofen") && text.includes("paracetamol")) {
        return "Combining **Ibuprofen Forte** (NSAID) and **Paracetamol Extra** (analgesic) is generally **safe** for short-term pain relief as they work through different mechanisms. However, be cautious not to exceed the maximum daily doses of either medication (4,000mg for Paracetamol, 1,200mg-2,400mg for Ibuprofen).";
    }
    if (text.includes("ibuprofen") && text.includes("aspirin")) {
        return "⚠️ **Caution:** Combining **Ibuprofen** and **Aspirin** is **not recommended** without speaking to a cardiologist. Ibuprofen can bind to the same platelets as Aspirin and block its irreversible cardioprotective effect. Additionally, it increases the risk of stomach ulcers.";
    }
    if (text.includes("warfarin") && text.includes("aspirin")) {
        return "❌ **Critical Warning:** Combining **Warfarin Flow** and **Aspirin Cardioprotect** is highly dangerous and increases bleeding risks significantly. The antiplatelet action of Aspirin combined with the anticoagulant effect of Warfarin makes bleeding events much more likely. If prescribed, require strict clinical monitoring.";
    }
    if (text.includes("side effect") || text.includes("sideeffects")) {
        if (text.includes("atorvastatin")) {
            return "Common side effects of **Atorvastatin Shield** include **muscle pain (myalgia)**, headache, mild nausea, and flatulence. If you experience severe, unexplained muscle weakness or dark-colored urine, seek immediate medical attention.";
        }
        if (text.includes("amoxicillin")) {
            return "Common side effects of **Amoxicillin Shield** include **nausea, diarrhea, vomiting, and skin rashes**. Always finish the complete course of antibiotics, even if symptoms improve early, to prevent bacterial resistance.";
        }
        return "Most medications carry minor side effects. Common ones include mild nausea, drowsiness, or stomach irritation. Please specify which drug you'd like to check side effects for (e.g. *Atorvastatin*, *Amoxicillin*, *Metformin*).";
    }
    if (text.includes("prescription") || text.includes("rx")) {
        return "The following medications in our catalog **require a valid doctor's prescription**: \n1. **Amoxicillin Shield** (Antibiotic)\n2. **Atorvastatin Shield** (Cardiovascular)\n3. **Warfarin Flow** (Blood Thinner)\n4. **Metformin Balance** (Antidiabetic)\n5. **Lisinopril Control** (Blood Pressure)\n\nYou can use our **Prescription Scanner** tool to upload your Rx card, and our agent will automatically validate and attach it to your order.";
    }
    if (text.includes("dosage") || text.includes("dose")) {
        if (text.includes("paracetamol")) {
            return "The standard dosage of **Paracetamol Extra** for adults is **500mg to 1,000mg** every 4 to 6 hours as needed. **Do not exceed 4,000mg (4 grams) in any 24-hour period** to prevent severe liver damage.";
        }
        if (text.includes("ibuprofen")) {
            return "The typical dosage of **Ibuprofen Forte** for adults is **200mg to 400mg** every 4 to 6 hours. Do not exceed **1,200mg per day** unless prescribed by a doctor.";
        }
    }
    if (text.includes("supplement") || text.includes("memory")) {
        return "For cognitive health and memory boost, we suggest **Omega-3 Pure Health** (containing essential fatty acids EPA and DHA). **Vitamin C Spark** is also excellent for overall neurological support against oxidative stress.";
    }
    
    if (text.includes("subdomain") || text.includes("store url") || text.includes("domain") || text.includes("link") || text.includes("website")) {
        return `Your AegisMed storefront is configured on custom domain: **https://${selectedSubdomain}${customDomainSuffix}**. You can share this URL with patients to host catalogs or submit digital prescriptions.`;
    }

    // Generic responses
    return "Thank you for asking. To assist you accurately, please mention specific drug names (e.g., *Aspirin*, *Ibuprofen*, *Amoxicillin*, *Warfarin*) or specify what symptoms you are hoping to manage. Always remember to seek professional clinical advice for critical concerns.";
}

function handleUserMessage() {
    const input = dom.chatInput.value.trim();
    if (!input) return;
    
    addChatMessage(input, true);
    dom.chatInput.value = "";
    
    showTypingIndicator();
    
    // Simulated pharmacist response delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = getPharmacistResponse(input);
        addChatMessage(response, false);
    }, 1000);
}

dom.chatSendBtn.addEventListener('click', handleUserMessage);
dom.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserMessage();
    }
});

dom.suggestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        dom.chatInput.value = query;
        handleUserMessage();
    });
});

// ==========================================================================
// Prescription Scanner Simulation
// ==========================================================================
function simulateScanner(sampleKey) {
    // Reset scanner UI
    dom.resultsPlaceholder.style.display = "none";
    dom.resultsContent.style.display = "none";
    dom.scannerOverlay.style.display = "flex";
    
    const statuses = [
        "Aligning image perspective...",
        "Applying OCR text extraction layers...",
        "Identifying medication names and doses...",
        "Validating doctor electronic signature...",
        "Generating structured results..."
    ];
    
    let step = 0;
    const interval = setInterval(() => {
        if (step < statuses.length) {
            document.querySelector('.scan-status-text').innerText = statuses[step];
            step++;
        } else {
            clearInterval(interval);
            dom.scannerOverlay.style.display = "none";
            displayScannerResults(sampleKey);
        }
    }, 450);
}

function displayScannerResults(sampleKey) {
    const data = SCANNER_SAMPLES[sampleKey];
    activeScannerOutput = data;
    activeScannerKey = sampleKey;
    
    dom.resultsPlaceholder.style.display = "none";
    dom.resultsContent.style.display = "block";
    
    const formattedDate = getLocalizedDateTime(data.date, selectedTimezone);
    
    // Setup metadata
    dom.resultsContent.querySelector('.patient-info').innerHTML = `
        <div><strong>Patient Name:</strong> ${data.patient}</div>
        <div><strong>Rx Date:</strong> ${formattedDate}</div>
    `;
    
    // Setup list
    dom.detectedList.innerHTML = "";
    data.items.forEach(item => {
        const med = MEDICINES.find(m => m.id === item.id);
        const li = document.createElement('li');
        li.className = 'detected-list-item';
        li.innerHTML = `
            <div class="detected-item-details">
                <span class="detected-item-name">${med.name}</span>
                <span class="detected-item-dosage">${med.ingredient} - Dosage: Standard</span>
            </div>
            <span class="detected-item-qty">Qty: ${item.qty}</span>
        `;
        dom.detectedList.appendChild(li);
    });
    
    // Setup warnings
    dom.detectedWarnings.innerHTML = "";
    data.warnings.forEach(warn => {
        const div = document.createElement('div');
        div.className = `scanned-warning ${warn.type}`;
        div.innerHTML = `
            <span>${warn.type === 'critical' ? '🛡️' : '⚠️'}</span>
            <div>${warn.msg}</div>
        `;
        dom.detectedWarnings.appendChild(div);
    });
}

dom.sampleRx1.addEventListener('click', () => simulateScanner('rx1'));
dom.sampleRx2.addEventListener('click', () => simulateScanner('rx2'));

// Drag and drop event handlers
dom.uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.uploadZone.style.borderColor = "var(--primary)";
    dom.uploadZone.style.background = "rgba(16, 185, 129, 0.02)";
});

dom.uploadZone.addEventListener('dragleave', () => {
    dom.uploadZone.style.borderColor = "rgba(255, 255, 255, 0.15)";
    dom.uploadZone.style.background = "var(--bg-surface)";
});

dom.uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.uploadZone.style.borderColor = "rgba(255, 255, 255, 0.15)";
    dom.uploadZone.style.background = "var(--bg-surface)";
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        // Trigger simulated scan using Sample Rx 2 as standard file upload handler fallback
        simulateScanner('rx2');
    }
});

dom.uploadZone.addEventListener('click', () => {
    dom.fileInput.click();
});

dom.fileInput.addEventListener('change', () => {
    if (dom.fileInput.files.length > 0) {
        simulateScanner('rx2');
    }
});

dom.btnAddScanned.addEventListener('click', () => {
    if (!activeScannerOutput) return;
    
    activeScannerOutput.items.forEach(item => {
        const med = MEDICINES.find(m => m.id === item.id);
        const existing = cart.find(c => c.product.id === item.id);
        if (existing) {
            existing.quantity += item.qty;
        } else {
            cart.push({ product: med, quantity: item.qty });
        }
    });
    
    renderCart();
    checkInteractions();
    openCartDrawer();
    
    // Switch view back to store
    dom.tabs[0].click();
});

// ==========================================================================
// Checkout / Modal Execution Flow
// ==========================================================================
dom.btnCheckout.addEventListener('click', () => {
    // Generate a random order reference code
    const rand = Math.floor(100000 + Math.random() * 900000);
    dom.refNumber.innerText = `#AG-${rand}`;
    
    // Set localized delivery time
    dom.deliveryTime.innerText = getCheckoutDeliveryEstimate();
    
    // Update digital receipt URL
    const receiptLink = `https://${selectedSubdomain}${customDomainSuffix}/orders/${rand}`;
    dom.receiptUrl.innerText = receiptLink;
    dom.receiptUrl.href = receiptLink;
    
    // Calculate localized tax values
    const reg = REGIONS[selectedRegion];
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.product.price * item.quantity;
    });
    
    const taxAmount = subtotal * reg.taxRate;
    const finalAmount = subtotal + taxAmount;
    
    dom.summaryTaxLabel.innerText = reg.taxName;
    dom.summaryTax.innerText = formatPrice(taxAmount);
    dom.summaryTotal.innerText = formatPrice(finalAmount);
    
    // Display Modal
    dom.modalCheckoutSuccess.classList.add('open');
    closeCartDrawer();
});

// ==========================================================================
// Settings Interaction Event Listeners & Helpers
// ==========================================================================
dom.selectRegion.addEventListener('change', (e) => {
    selectedRegion = e.target.value;
    
    // Auto-synchronize Currency and Time Zone based on selected region
    const regInfo = REGIONS[selectedRegion];
    if (regInfo.defaultCurrency) {
        selectedCurrency = regInfo.defaultCurrency;
        dom.selectCurrency.value = selectedCurrency;
    }
    if (regInfo.defaultTimezone) {
        selectedTimezone = regInfo.defaultTimezone;
        dom.selectTimezone.value = selectedTimezone;
    }
    
    // Trigger updates across product shelf and cart
    renderCatalog();
    renderCart();
    if (activeScannerOutput) {
        displayScannerResults(activeScannerKey);
    }
    
    updateAIPharmacistGreeting(true);
});

dom.selectCurrency.addEventListener('change', (e) => {
    selectedCurrency = e.target.value;
    renderCatalog();
    renderCart();
});

dom.selectTimezone.addEventListener('change', (e) => {
    selectedTimezone = e.target.value;
    // If activeScannerOutput exists, refresh display with adjusted timezone date
    if (activeScannerOutput) {
        displayScannerResults(activeScannerKey);
    }
});

function getLocalizedDateTime(utcDateString, timezoneKey) {
    const tz = TIMEZONES[timezoneKey];
    // Create base UTC date (assume prescription date is mid-day UTC for simplicity)
    const baseDate = new Date(utcDateString + "T12:00:00Z");
    
    // Apply offset
    const offsetMs = tz.offset * 60 * 60 * 1000;
    const localizedDate = new Date(baseDate.getTime() + offsetMs);
    
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = localizedDate.getUTCFullYear();
    const mm = pad(localizedDate.getUTCMonth() + 1);
    const dd = pad(localizedDate.getUTCDate());
    const hh = pad(localizedDate.getUTCHours());
    const min = pad(localizedDate.getUTCMinutes());
    
    return `${yyyy}-${mm}-${dd} ${hh}:${min} (${tz.label})`;
}

function getCheckoutDeliveryEstimate() {
    const tz = TIMEZONES[selectedTimezone];
    const nowUtc = new Date();
    
    // Apply offset
    const offsetMs = tz.offset * 60 * 60 * 1000;
    // Delivery is in 2 hours
    const deliveryUtcPlus2 = new Date(nowUtc.getTime() + offsetMs + (2 * 60 * 60 * 1000));
    
    const pad = (n) => String(n).padStart(2, '0');
    const hh = pad(deliveryUtcPlus2.getUTCHours());
    const min = pad(deliveryUtcPlus2.getUTCMinutes());
    
    return `Today by ${hh}:${min} ${tz.label} (Within 2 hrs)`;
}

function updateAIPharmacistGreeting(isManualChange = false) {
    const regInfo = REGIONS[selectedRegion];
    const greetingMessage = `${regInfo.greeting} I am **Dr. Aegis**, your AI Pharmacist. How can I help you today? You can ask me about medication dosages, side effects, drug-drug compatibility, or generic alternatives. \n\n*Note: ${regInfo.policy}*`;
    
    // Reset first chatbot bubble with new localized greeting
    const chatContainer = dom.chatMessages;
    if (chatContainer && chatContainer.firstElementChild) {
        const firstMsgContent = chatContainer.firstElementChild.querySelector('.message-content');
        if (firstMsgContent) {
            firstMsgContent.innerHTML = greetingMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        }
    }
    
    if (isManualChange) {
        addChatMessage(`System Alert: Region switched to **${regInfo.name}**. AI Pharmacist guidelines updated.`, false);
    }
}

dom.btnCloseSuccess.addEventListener('click', () => {
    // Reset Cart and verification statuses
    cart = [];
    hasRxUploaded = false;
    hasTelehealthApproval = false;
    renderCart();
    checkInteractions();
    dom.modalCheckoutSuccess.classList.remove('open');
});

// ==========================================================================
// Subdomain Interaction Event Listener
// ==========================================================================
dom.inputSubdomain.addEventListener('input', (e) => {
    // Sanitize input: lowercase, alphanumeric and hyphens only
    let val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    selectedSubdomain = val;
    e.target.value = selectedSubdomain;
    
    // Update UI elements
    const fullUrl = `https://${selectedSubdomain || 'medstore'}${customDomainSuffix}`;
    dom.headerSubdomain.innerText = `${selectedSubdomain || 'medstore'}${customDomainSuffix}`;
    dom.subdomainPreviewLink.innerText = fullUrl;
    dom.subdomainPreviewLink.href = fullUrl;
});

// ==========================================================================
// Telehealth & Language Event Listeners
// ==========================================================================
dom.btnTelehealthTrigger.addEventListener('click', () => {
    dom.modalTelehealth.classList.add('open');
    startTelehealthConsultation();
});

dom.btnCloseTelehealth.addEventListener('click', () => {
    dom.modalTelehealth.classList.remove('open');
});

dom.selectLang.addEventListener('change', (e) => {
    updateAppLanguage(e.target.value);
});

// Patient profile checkboxes change listeners
const checkboxes = [
    dom.profileHypertension,
    dom.profileDiabetes,
    dom.profileAsthma,
    dom.profilePregnancy,
    dom.profileKidney,
    dom.profileNsaidAllergy
];
checkboxes.forEach(cb => {
    if (cb) {
        cb.addEventListener('change', () => {
            checkInteractions();
        });
    }
});

// Add CNAME prescription loading verification flag
dom.btnAddScanned.addEventListener('click', () => {
    hasRxUploaded = true;
});

// Translation runtime application
function updateAppLanguage(langKey) {
    selectedLang = langKey;
    const t = TRANSLATIONS[selectedLang];
    
    // Navigation Tabs
    const tabs = dom.tabs;
    if (tabs.length >= 4) {
        tabs[0].querySelector('span').innerText = t.storeTab;
        tabs[1].querySelector('span').innerText = t.chatTab;
        tabs[2].querySelector('span').innerText = t.scanTab;
        tabs[3].querySelector('span').innerText = t.settingsTab;
    }
    
    // Catalog description
    const catTitle = document.querySelector('.catalog-title');
    if (catTitle) catTitle.innerText = t.catalogTitle;
    const catDesc = document.querySelector('.catalog-desc');
    if (catDesc) catDesc.innerText = t.catalogDesc;
    
    // Settings description
    const setTitle = document.querySelector('.settings-title');
    if (setTitle) setTitle.innerText = t.settingTitle;
    const setDesc = document.querySelector('.settings-desc');
    if (setDesc) setDesc.innerText = t.settingDesc;
    
    // Checkout trigger button
    if (dom.btnCheckout) {
        dom.btnCheckout.innerText = t.checkoutBtn;
    }
    if (dom.btnTelehealthTrigger) {
        dom.btnTelehealthTrigger.innerText = t.telehealthBtn;
    }
    
    // Subtotal label
    const subtotalText = document.querySelector('.cart-summary-line span:first-child');
    if (subtotalText) {
        subtotalText.innerText = t.subtotalLabel;
    }
    
    // Update pharmacist greeting
    updateAIPharmacistGreeting(false);
}

// Telehealth Consultation Dialogue Engine
function startTelehealthConsultation() {
    const chatPane = dom.telehealthChatPane;
    chatPane.innerHTML = "";
    
    addTelehealthMessage("Doctor", "Hello, I am Dr. Aegis MD. I see you are requesting prescription medications. Before I can approve the prescription, please tell me: what primary symptoms are you seeking to manage?");
    
    const options = [
        { text: "Bacterial Infection / Fever", nextStep: 1 },
        { text: "Cardiovascular Health / High Cholesterol", nextStep: 2 },
        { text: "Mild pain or other symptoms", nextStep: 3 }
    ];
    
    renderTelehealthOptions(options);
}

function addTelehealthMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `telehealth-msg ${sender === 'Doctor' ? 'telehealth-msg-doctor' : 'telehealth-msg-patient'}`;
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    dom.telehealthChatPane.appendChild(msg);
    dom.telehealthChatPane.scrollTop = dom.telehealthChatPane.scrollHeight;
}

function renderTelehealthOptions(options) {
    const row = dom.telehealthInputRow;
    row.innerHTML = "";
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "telehealth-option-btn";
        btn.innerText = opt.text;
        btn.onclick = () => {
            if (opt.action) {
                opt.action();
            } else {
                handleTelehealthChoice(opt);
            }
        };
        row.appendChild(btn);
    });
}

function handleTelehealthChoice(opt) {
    addTelehealthMessage("Patient", opt.text);
    dom.telehealthInputRow.innerHTML = "";
    
    setTimeout(() => {
        if (opt.nextStep === 1) {
            addTelehealthMessage("Doctor", "Understood. For active bacterial infections, I am approving your antibiotic prescription (Amoxicillin). Please take the full course as directed.");
        } else if (opt.nextStep === 2) {
            addTelehealthMessage("Doctor", "I see. For managing lipid control and cardiovascular safety, I am approving your Atorvastatin card. Make sure to check muscle parameters yearly.");
        } else {
            addTelehealthMessage("Doctor", "I've reviewed your request. Based on your symptom profile, I have approved the required prescription clearance for your selected medicines.");
        }
        
        setTimeout(() => {
            addTelehealthMessage("Doctor", "Digital prescription certificate signed and attached. You can now proceed to checkout.");
            
            renderTelehealthOptions([
                {
                    text: "Apply Prescription & Return",
                    action: () => {
                        hasTelehealthApproval = true;
                        dom.modalTelehealth.classList.remove('open');
                        renderCart();
                        checkInteractions();
                    }
                }
            ]);
        }, 1000);
    }, 1000);
}

// ==========================================================================
// Merchant Inventory Manager Logic
// ==========================================================================
function renderMerchantInventory() {
    const list = dom.merchantInventoryList;
    if (!list) return;
    
    list.innerHTML = "";
    
    MEDICINES.forEach(med => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
        tr.innerHTML = `
            <td style="padding: 0.75rem 0.5rem; font-weight: 600;">${med.name}</td>
            <td style="padding: 0.75rem 0.5rem; text-transform: capitalize;">${med.category}</td>
            <td style="padding: 0.75rem 0.5rem;">$${med.price.toFixed(2)}</td>
            <td style="padding: 0.75rem 0.5rem;">${med.requiresRx ? "🔴 Yes" : "🟢 No"}</td>
            <td style="padding: 0.75rem 0.5rem; text-align: right;">
                <button class="btn-delete-med" onclick="deleteMedication('${med.id}')">Remove</button>
            </td>
        `;
        list.appendChild(tr);
    });
}

window.deleteMedication = function(id) {
    // Delete item from array
    MEDICINES = MEDICINES.filter(m => m.id !== id);
    
    // Also remove from active shopping cart if present
    cart = cart.filter(c => c.product.id !== id);
    
    // Refresh displays
    renderCatalog();
    renderCart();
    checkInteractions();
    renderMerchantInventory();
    
    addChatMessage(`System Alert: Medication removed from database catalog.`, false);
};

if (dom.formAddMedicine) {
    dom.formAddMedicine.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newMed = {
            id: `med-${MEDICINES.length + 1}_${Math.floor(Math.random() * 1000)}`,
            name: dom.addMedName.value.trim(),
            ingredient: dom.addMedIngredient.value.trim(),
            price: parseFloat(dom.addMedPrice.value),
            category: dom.addMedCategory.value,
            requiresRx: dom.addMedRequiresRx.checked,
            description: dom.addMedDesc.value.trim()
        };
        
        // Push to array
        MEDICINES.push(newMed);
        
        // Reset form inputs
        dom.formAddMedicine.reset();
        
        // Refresh displays
        renderCatalog();
        renderMerchantInventory();
        
        // Prompt system alert
        addChatMessage(`System Alert: **${newMed.name}** has been successfully added to the active inventory catalog under Category: **${newMed.category}**.`, false);
        
        // Alert notification
        alert(`Success: "${newMed.name}" added to global catalog registry.`);
    });
}

// ==========================================================================
// App Initialization
// ==========================================================================
renderCatalog();
renderCart();
updateAIPharmacistGreeting(false);
renderMerchantInventory();

// Initialize subdomain display values
dom.headerSubdomain.innerText = `${selectedSubdomain}${customDomainSuffix}`;
dom.subdomainPreviewLink.innerText = `https://${selectedSubdomain}${customDomainSuffix}`;
dom.subdomainPreviewLink.href = `https://${selectedSubdomain}${customDomainSuffix}`;
