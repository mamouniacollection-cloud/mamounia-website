/* Mamounia product list. These are the defaults; the admin's Website design tab can replace them
   (names, prices, colors, photos, badges, sold out) without editing this file.
   price: set a number (e.g. 89) to show it and let the cart total work.
   colors: add the colors you stock, e.g. ["White","Navy"]; leave [] to hide the color picker.
   season: "summer" | "winter" | "all"   fabric: one of the keys in FABRICS below. */
var PRODUCTS = {
  men: [
    {id:"m1",  name:"Premium Striped Djellaba",        cat:"djellaba", season:"all",    fabric:"striped",   note:"Hand-stitched banda trim", price:null, colors:[]},
    {id:"m2",  name:"Summer Gabardine Djellaba",       cat:"djellaba", season:"summer", fabric:"gabardine", price:null, colors:[]},
    {id:"m3",  name:"Thick Sousdi Djellaba",           cat:"djellaba", season:"all",    fabric:"sousdi",    price:null, colors:[]},
    {id:"m4",  name:"Light Sousdi Djellaba",           cat:"djellaba", season:"all",    fabric:"sousdi",    price:null, colors:[]},
    {id:"m5",  name:"Gabardine Jabador",               cat:"jabador",  season:"all",    fabric:"gabardine", price:null, colors:[]},
    {id:"m6",  name:"Gabardine Gandoura",              cat:"gandoura", season:"summer", fabric:"gabardine", price:null, colors:[]},
    {id:"m7",  name:"Designed Gabardine Gandoura",     cat:"gandoura", season:"summer", fabric:"gabardine", price:null, colors:[]},
    {id:"m8",  name:"Jim Gandoura",                    cat:"gandoura", season:"summer", fabric:"jim",       price:null, colors:[]},
    {id:"m9",  name:"Linen Gandoura",                  cat:"gandoura", season:"summer", fabric:"linen",     price:null, colors:[]},
    {id:"m10", name:"Light Melifa Djellaba",           cat:"djellaba", season:"winter", fabric:"melifa",    price:null, colors:[]},
    {id:"m11", name:"Thick Melifa Djellaba",           cat:"djellaba", season:"winter", fabric:"melifa",    price:null, colors:[]},
    {id:"m12", name:"Bouclette Djellaba",              cat:"djellaba", season:"winter", fabric:"bouclette", price:null, colors:[]},
    {id:"m13", name:"Bouclette Djellaba Jacket",       cat:"jacket",   season:"winter", fabric:"bouclette", price:null, colors:[]}
  ],
  women: [
    {id:"w1",  name:"Faux Suede Djellaba",             cat:"djellaba", season:"winter", fabric:"suede",     price:null, colors:[]},
    {id:"w2",  name:"Crepe Summer Djellaba",           cat:"djellaba", season:"summer", fabric:"crepe",     price:null, colors:[]},
    {id:"w3",  name:"Light Melifa Djellaba",           cat:"djellaba", season:"all",    fabric:"melifa",    price:null, colors:[]},
    {id:"w4",  name:"Thick Melifa Djellaba",           cat:"djellaba", season:"winter", fabric:"melifa",    price:null, colors:[]},
    {id:"w5",  name:"Crepe Kaftan",                    cat:"kaftan",   season:"all",    fabric:"crepe",     price:null, colors:[]},
    {id:"w6",  name:"Mobra Kaftan",                    cat:"kaftan",   season:"winter", fabric:"mobra",     price:null, colors:[]},
    {id:"w7",  name:"Crepe Two-Piece Kimono",          cat:"kimono",   season:"all",    fabric:"crepe",     price:null, colors:[]},
    {id:"w8",  name:"Mobra Two-Piece Kimono",          cat:"kimono",   season:"all",    fabric:"mobra",     price:null, colors:[]},
    {id:"w9",  name:"Simple Crepe Abaya",              cat:"abaya",    season:"all",    fabric:"crepe",     price:null, colors:[]},
    {id:"w10", name:"Premium Crepe Abaya",             cat:"abaya",    season:"all",    fabric:"crepe",     price:null, colors:[]},
    {id:"w11", name:"Women's Jabador",                 cat:"jabador",  season:"all",    fabric:"",          price:null, colors:[]}
  ]
};
var CATS = {
  men: {djellaba:"Djellaba", gandoura:"Gandoura", jabador:"Jabador", jacket:"Djellaba Jacket"},
  women: {djellaba:"Djellaba", kaftan:"Kaftan", kimono:"Two-Piece Kimono", abaya:"Abaya", jabador:"Jabador"}
};
// Fabric names and a one-line note shown on the product page (leave note empty if unsure)
var FABRICS = {
  gabardine: {name:"Gabardine", note:"A smooth, sturdy woven fabric that holds its shape and resists wrinkles."},
  sousdi:    {name:"Sousdi",    note:"A traditional Moroccan striped weave."},
  striped:   {name:"Striped",   note:"A striped Moroccan weave."},
  jim:       {name:"Jim",       note:""},
  linen:     {name:"Linen",     note:"Light and breathable, made for hot days."},
  melifa:    {name:"Melifa",    note:"A soft, durable classic djellaba fabric with a matte finish."},
  bouclette: {name:"Bouclette", note:"A textured, looped fabric that keeps you warm."},
  suede:     {name:"Faux suede", note:"Soft, brushed suede feel without real leather."},
  crepe:     {name:"Crepe",     note:"Light with a fluid drape that moves well."},
  mobra:     {name:"Mobra",     note:""}
};
var SEASONS = {summer:"Summer", winter:"Winter", all:"All seasons"};
// A photo id from the admin, or a full image address
window.MM_IMG = window.MM_IMG || function(id){ return id; };

