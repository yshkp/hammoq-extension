export const DEBUG = true;
export const LP_DOMAIN = 'app.listperfectly.com';
export const shops = {
  listperfectly: {
    regExp: /^https:\/\/app\.listperfectly\.com\/list-an-item/,
    productItemRegExp: /app\.listperfectly\.com\/product\/.+/,
    link: `https://${LP_DOMAIN}/list-an-item/`,
    listRegExp: /^nonexisting$/,
    name: 'List Perfectly',
    hrefFromId: id => id, //not used
  },
  grailed: {
    regExp: /^https:\/\/www\.grailed\.com\/(sell|listings\/\d+)/,
    link: 'https://www.grailed.com/sell',
    listRegExp: /^https:\/\/www\.grailed\.com\/users\/myitems/,
    name: 'Grailed',
    lpFields: {checkbox: '[name="input_539.8"]', id: '[name="input_839"]'},
    hrefFromId: id => `https://www.grailed.com/listings/${id}`,
  },
  mercari: {
    regExp: /^https:\/\/[^.]*\.?mercari\.com\/sell/,
    link: 'https://www.mercari.com/sell/',
    listRegExp: /^https:\/\/www\.mercari\.com\/mypage\/listings\/listing/,
    name: 'Mercari',
    lpFields: {checkbox: '[name="input_539.5"]', id: '[name="input_621"]'},
    hrefFromId: id => `https://www.mercari.com/sell/edit/${id}/`
  },
  poshmark: {
    regExp: /^https:\/\/[^.]*\.?poshmark\.com\/(edit-listing|create-listing)/,
    link: 'https://poshmark.com/create-listing',
    listRegExp: /^https:\/\/poshmark\.com\/closet\/.+/,
    name: 'Poshmark',
    lpFields: {checkbox: '[name="input_539.4"]', id: '[name="input_620"]'},
    hrefFromId: id => `https://poshmark.com/edit-listing/${id}`,
  },
  ebay: {
    regExp: /^https:\/\/bulksell\.ebay\.com\/ws\/eBayISAPI\.dll/,
    link: 'https://bulksell.ebay.com/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem',
    listRegExp: /^https:\/\/www\.ebay\.com\/sh\/lst\/active/,
    name: 'eBay',
    lpFields: {checkbox: '[name="input_539.2"]', id: '[name="input_618"]'},
    hrefFromId: id => `https://offer.ebay.com/ws/eBayISAPI.dll?`
      + `VerifyStop&ssPageName=STRK:MESE:ENDI&item=${id}`
  },
  etsy: {
    regExp: /^https:\/\/[^.]*\.?etsy\.com.+?listings\/(ca\/)?(create|state:draft|[\d\/]+copy)/,
    link: 'https://www.etsy.com/your/listings/create?ref=listings_manager_prototype&from_page=/your/listings',
    listRegExp: /^https:\/\/www\.etsy\.com\/your\/shops\/.+?\/tools\/listings/,
    name: 'Etsy',
    lpFields: {checkbox: '[name="input_539.3"]', id: '[name="input_619"]'},
    hrefFromId: id => `https://www.etsy.com/listing/${id}`,
  },
  tradesy: {
    regExp: /^https:\/\/[^.]*\.tradesy\.com\/(sell|edit-item)/,
    link: 'https://www.tradesy.com/sell/',
    listRegExp: /^https:\/\/www\.tradesy\.com\/closet\/.+/,
    name: 'Tradesy',
    lpFields: {checkbox: '[name="input_539.6"]', id: '[name="input_833"]'},
    hrefFromId: id => `https://www.tradesy.com/`, //see usages
  },
  facebook: {
    regExp: /^https:\/\/www\.facebook\.com\/marketplace\/([\d\s]+)?/,
    link: 'https://facebook.com/marketplace',
    listRegExp: /^https:\/\/facebook\.com\/marketplace\/selling/,
    name: 'Facebook',
    lpFields: {checkbox: '[name="input_539.9"]', id: '[name="input_840"]'},
    hrefFromId: id => `https://www.facebook.com/marketplace/item/${id}/`,
  },
  depop: {
    regExp: /^https:\/\/www\.depop\.com\/products\/create\/?$/,
    link: 'https://www.depop.com/products/create',
    listRegExp: /^https:\/\/www\.depop\.com\/[^\/]+\/?$/,
    name: 'Depop',
    lpFields: {checkbox: '[name="input_539.11"]', id: '[name="input_841"]'},
    hrefFromId: id => `https://www.depop.com/products/${id}`,
  }
};

export const listPerfectlyFields = { //fields in /copied-listings
  '834': 'title',
  '505': 'description',
  '213': 'size',
  '206': 'brand',
  '209': 'color',
  '82': 'material',
  '210': 'pattern',
  '36': 'season',
  '43': 'care',
  '205': 'style',
  '211': 'madeIn',
  '17': 'condition',
  '453': 'keywords',
  '531': 'shippingSize',
  '532': 'shippingSize',
  '533': 'shippingSize',
  '1': 'SKU',
  '704': 'UPC',
  '2': 'weight',
  '22': 'price',
  '104': 'MSRP',
  '837': 'zip'
};

export const states = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
};

export const CONTENT_SCRIPTS = [
  {
    regExp: [/^([^.]+\.)?listperfectly\.com/],
    path: 'listperfectly/lp.js'
  },
  {
    regExp: [/^bulksell\.ebay\.com/],
    path: 'ebay/v1/item.js',
  },
  {
    regExp: [/^bulkedit\.ebay\.com/],
    path: 'ebay/v1/bulkedit.js'
  },
  {
    regExp: [/^www\.picupload\.ebay\.com/],
    path: 'ebay/v1/picupload.js',
  },
  {
    regExp: [/^([^.]+\.)?ebay.com\/ws\/eBayISAPI\.dll.*/],
    path: 'ebay/v1/eBayISAPI.js'
  },
  {
    regExp: [
      /^www\.ebay\.com\/sh\/lst\/active.*/,
      /^k2b-bulk.ebay.com\/ws.+/
    ],
    path: 'ebay/v1/listings.js'
  },
  {
    regExp: [/^(www\.)?ebay\.com\/mys/],
    path: 'ebay/v2/listings.js',
  },
  {
    regExp: [/^(www\.)?ebay\.com\/sl\/list\/v2/],
    path: 'ebay/v2/item.js',
  },
  {
    regExp: [/^www\.mercari\.com.*/],
    path: 'mercari/item.js'
  },
  {
    regExp: [/^www\.mercari\.com\/mypage\/listings/],
    path: 'mercari/listings.js'
  },
  {
    regExp: [
      /^poshmark\.com\/create-listing/,
      /^poshmark\.com\/edit-listing.*/
    ],
    path: 'poshmark/item.js'
  },
  {
    regExp: [/^poshmark\.com\/closet.*/],
    path: 'poshmark/listings.js'
  },
  {
    regExp: [/^poshmark\.com\/feed/],
    path: 'poshmark/feed.js'
  },
  {
    regExp: [
      /^www\.etsy\.com\/(ca\/)?your\/shops\/.+?\/tools\/listings.*/,
      /^www\.etsy\.com\/listing.*/
    ],
    path: 'etsy/item.js'
  },
  {
    regExp: [/^www\.etsy\.com\/your\/shops\/.+?\/tools.+/],
    path: 'etsy/listings.js'
  },
  {
    regExp: [
      /^www\.tradesy.com\/sell.*/,
      /^www\.tradesy\.com\/edit-item/
    ],
    path: 'tradesy/item.js'
  },
  {
    regExp: [/^www\.tradesy\.com\/i\/.*/],
    path: 'tradesy/afterUpdate.js'
  },
  {
    regExp: [/^www\.tradesy\.com\/closet\//],
    path: 'tradesy/listings.js'
  },
  {
    regExp: [/^www\.tradesy\.com\/?$/],
    path: 'tradesy/main.js'
  },
  {
    regExp: [
      /^www\.grailed\.com\/sell$/,
      /^www\.grailed\.com\/listings\/.+/
    ],
    path: 'grailed/item.js'
  },
  {
    regExp: [/^www\.grailed\.com\/users\/myitems$/],
    path: 'grailed/listings.js'
  },
  {
    regExp: [/^www\.facebook\.com\/marketplace.*/],
    path: 'facebook/item.js'
  },
  {
    regExp: [/^www\.facebook\.com\/marketplace\/selling/],
    path: 'facebook/listings.js'
  },
  {
    regExp: [/^www\.depop\.com/],
    path: 'depop/item.js'
  },
  {
    regExp: [/^www\.depop\.com/],
    path: 'depop/listings.js'
  },
  {
    regExp: [/^app\.size\.ly/],
    path: 'sizely/sizely.js'
  }
];