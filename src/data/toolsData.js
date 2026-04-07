export const TOOLS_ALL = [
  // PDF
  {
    id: "merge",
    title: "Merge PDF",
    desc: "Combine multiple PDFs into one file",
    icon: "bi-file-earmark-plus",
    cat: "pdf",
  },
  {
    id: "split",
    title: "Split PDF",
    desc: "Split PDF into page ranges",
    icon: "bi-scissors",
    cat: "pdf",
  },
  {
    id: "compress",
    title: "Compress PDF",
    desc: "Reduce PDF size (client-side heuristic)",
    icon: "bi-file-earmark-zip",
    cat: "pdf",
  },

  {
    id: "img2pdf",
    title: "Image → PDF",
    desc: "Convert images to a single PDF",
    icon: "bi-filetype-pdf",
    cat: "image",
  },

  // Images
  {
    id: "imgcompress",
    title: "Image Compressor",
    desc: "Compress JPG/PNG using canvas",
    icon: "bi-image",
    cat: "image",
  },
  {
    id: "imgresize",
    title: "Image Resizer",
    desc: "Resize images using canvas",
    icon: "bi-aspect-ratio",
    cat: "image",
  },
  {
    id: "imgcrop",
    title: "Image Cropper",
    desc: "Crop an image to custom size",
    icon: "bi-crop",
    cat: "image",
  },
  {
    id: "imgflip",
    title: "Image Flipper",
    desc: "Flip image horizontally/vertically",
    icon: "bi-arrow-left-right",
    cat: "image",
  },

  {
    id: "imgformat",
    title: "Format Converter",
    desc: "Convert JPG ↔ PNG ↔ WebP",
    icon: "bi-arrow-repeat",
    cat: "image",
  },
  {
    id: "texteditor",
    title: "Text Editor",
    desc: "Simple text editor with download",
    icon: "bi-pencil-square",
    cat: "text",
  },
  {
    id: "textformatter",
    title: "Text Formatter",
    desc: "Format text cases and spaces",
    icon: "bi-fonts",
    cat: "text",
  },

  {
    id: "text2pdf",
    title: "Text → PDF",
    desc: "Create PDF from typed text",
    icon: "bi-filetype-pdf",
    cat: "text",
  },

  // Dev
  {
    id: "qrcode",
    title: "QR Code Generator",
    desc: "Generate and download QR codes",
    icon: "bi-qr-code",
    cat: "dev",
  },

  {
    id: "jsonformat",
    title: "JSON Formatter",
    desc: "Format and Validate JSON",
    icon: "bi-braces",
    cat: "dev",
  },

  // General
  {
    id: "counter",
    title: "Counter",
    desc: "Simple increment / decrement counter",
    icon: "bi-123",
    cat: "general",
  },
  {
    id: "countdown",
    title: "Countdown",
    desc: "Countdown timer",
    icon: "bi-hourglass-split",
    cat: "general",
  },
  {
    id: "stopwatch",
    title: "Stopwatch",
    desc: "Start/stop/reset stopwatch",
    icon: "bi-stopwatch",
    cat: "general",
  },
  {
    id: "roman",
    title: "Number → Roman",
    desc: "Convert numbers to Roman numerals",
    icon: "bi-123",
    cat: "general",
  },

  // Calculators
  {
    id: "sackadainterest",
    title: "Sackada Interest",
    desc: "Calculate Sackada interest (₹ per hundred)",
    icon: "bi-calculator-fill",
    cat: "calc",
  },
  {
    id: "calc",
    title: "Calculator",
    desc: "Simple calculator",
    icon: "bi-calculator",
    cat: "calc",
  },
  {
    id: "agecalc",
    title: "Age Calculator",
    desc: "Calculate age from DOB",
    icon: "bi-person",
    cat: "calc",
  },
  {
    id: "percent",
    title: "Percentage Calculator",
    desc: "Find percent, increase/decrease",
    icon: "bi-percent",
    cat: "calc",
  },
  {
    id: "simpleinterest",
    title: "Simple Interest",
    desc: "Calculate simple interest",
    icon: "bi-cash-coin",
    cat: "calc",
  },
  {
    id: "compoundinterest",
    title: "Compound Interest",
    desc: "Calculate compound interest",
    icon: "bi-graph-up-arrow",
    cat: "calc",
  },
  {
    id: "emi",
    title: "EMI Calculator",
    desc: "Calculate monthly loan EMI",
    icon: "bi-bank",
    cat: "calc",
  },

  // Unit Converters
  {
    id: "currency",
    title: "Currency Converter",
    desc: "Offline demo rates (editable)",
    icon: "bi-currency-exchange",
    cat: "convert",
  },
  {
    id: "weight",
    title: "Weight Converter",
    desc: "Convert weight/mass units",
    icon: "bi-speedometer2",
    cat: "convert",
  },
  {
    id: "temperature",
    title: "Temperature Converter",
    desc: "Celsius ↔ Fahrenheit ↔ Kelvin",
    icon: "bi-thermometer-half",
    cat: "convert",
  },
  {
    id: "energy",
    title: "Energy Converter",
    desc: "Joule ↔ Calorie ↔ kWh",
    icon: "bi-lightning-charge",
    cat: "convert",
  },
  {
    id: "area",
    title: "Area Converter",
    desc: "m² ↔ ft² ↔ acre ↔ hectare",
    icon: "bi-bounding-box",
    cat: "convert",
  },
  {
    id: "length",
    title: "Length Converter",
    desc: "m ↔ km ↔ mile ↔ ft ↔ in",
    icon: "bi-rulers",
    cat: "convert",
  },
  {
    id: "volume",
    title: "Volume Converter",
    desc: "L ↔ mL ↔ gal ↔ qt",
    icon: "bi-droplet",
    cat: "convert",
  },
  {
    id: "voltage",
    title: "Voltage Converter",
    desc: "Convert between kV, V, mV, µV, nV",
    icon: "bi-lightning",
    cat: "convert",
  },
  {
    id: "speed",
    title: "Speed Converter",
    desc: "m/s ↔ km/h ↔ mph ↔ kt",
    icon: "bi-speedometer",
    cat: "convert",
  },

  // Health
  {
    id: "bmi",
    title: "BMI Calculator",
    desc: "Body Mass Index",
    icon: "bi-heart-pulse",
    cat: "health",
  },
  {
    id: "water",
    title: "Water Intake",
    desc: "Daily water need estimate",
    icon: "bi-droplet",
    cat: "health",
  },
  {
    id: "ideal",
    title: "Ideal Weight",
    desc: "Devine/Robinson formulas",
    icon: "bi-person-arms-up",
    cat: "health",
  },
  {
    id: "bmr",
    title: "BMR Calculator",
    desc: "Mifflin–St Jeor",
    icon: "bi-fire",
    cat: "health",
  },
];

export const TOOL_CATEGORIES = {
  pdf: { name: "PDF Tools", icon: "bi-file-earmark", color: "bg-red-600" },
  image: { name: "Image Tools", icon: "bi-image", color: "bg-blue-600" },
  text: { name: "Text Tools", icon: "bi-filetype-txt", color: "bg-green-600" },
  dev: { name: "Developer Tools", icon: "bi-code-slash", color: "bg-purple-600" },
  general: { name: "General Tools", icon: "bi-tools", color: "bg-gray-600" },
  calc: { name: "Calculators", icon: "bi-calculator", color: "bg-orange-600" },
  convert: { name: "Unit Converters", icon: "bi-arrow-left-right", color: "bg-cyan-600" },
  health: { name: "Health Tools", icon: "bi-heart-pulse", color: "bg-pink-600" },
};
