/**
 * Comprehensive International Currencies & Country Calling Codes Dataset
 * Conforming to ISO 4217, ISO 3166-1 alpha-2, and ITU-T E.164 international dialing standards.
 */

export const ZERO_DECIMAL_CURRENCIES = new Set([
  'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga',
  'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'
]);

/**
 * Global ISO Currencies supported by International Payment Gateways (Stripe, etc.)
 */
export const CURRENCIES = Object.freeze([
  // Major Global Currencies
  { code: 'usd', symbol: '$', name: 'US Dollar', countryCode: 'US', dialCode: '+1', flag: '🇺🇸', isZeroDecimal: false },
  { code: 'eur', symbol: '€', name: 'Euro', countryCode: 'DE', dialCode: '+49', flag: '🇪🇺', isZeroDecimal: false },
  { code: 'gbp', symbol: '£', name: 'British Pound', countryCode: 'GB', dialCode: '+44', flag: '🇬🇧', isZeroDecimal: false },
  { code: 'cad', symbol: 'CA$', name: 'Canadian Dollar', countryCode: 'CA', dialCode: '+1', flag: '🇨🇦', isZeroDecimal: false },
  { code: 'aud', symbol: 'A$', name: 'Australian Dollar', countryCode: 'AU', dialCode: '+61', flag: '🇦🇺', isZeroDecimal: false },
  { code: 'jpy', symbol: '¥', name: 'Japanese Yen', countryCode: 'JP', dialCode: '+81', flag: '🇯🇵', isZeroDecimal: true },
  { code: 'inr', symbol: '₹', name: 'Indian Rupee', countryCode: 'IN', dialCode: '+91', flag: '🇮🇳', isZeroDecimal: false },
  { code: 'chf', symbol: 'CHF', name: 'Swiss Franc', countryCode: 'CH', dialCode: '+41', flag: '🇨🇭', isZeroDecimal: false },
  { code: 'cny', symbol: '¥', name: 'Chinese Yuan', countryCode: 'CN', dialCode: '+86', flag: '🇨🇳', isZeroDecimal: false },
  { code: 'sgd', symbol: 'S$', name: 'Singapore Dollar', countryCode: 'SG', dialCode: '+65', flag: '🇸🇬', isZeroDecimal: false },
  { code: 'hkd', symbol: 'HK$', name: 'Hong Kong Dollar', countryCode: 'HK', dialCode: '+852', flag: '🇭🇰', isZeroDecimal: false },
  { code: 'nzd', symbol: 'NZ$', name: 'New Zealand Dollar', countryCode: 'NZ', dialCode: '+64', flag: '🇳🇿', isZeroDecimal: false },
  { code: 'sek', symbol: 'kr', name: 'Swedish Krona', countryCode: 'SE', dialCode: '+46', flag: '🇸🇪', isZeroDecimal: false },
  { code: 'nok', symbol: 'kr', name: 'Norwegian Krone', countryCode: 'NO', dialCode: '+47', flag: '🇳🇴', isZeroDecimal: false },
  { code: 'dkk', symbol: 'kr', name: 'Danish Krone', countryCode: 'DK', dialCode: '+45', flag: '🇩🇰', isZeroDecimal: false },
  { code: 'pln', symbol: 'zł', name: 'Polish Zloty', countryCode: 'PL', dialCode: '+48', flag: '🇵🇱', isZeroDecimal: false },
  { code: 'mxn', symbol: 'MX$', name: 'Mexican Peso', countryCode: 'MX', dialCode: '+52', flag: '🇲🇽', isZeroDecimal: false },
  { code: 'brl', symbol: 'R$', name: 'Brazilian Real', countryCode: 'BR', dialCode: '+55', flag: '🇧🇷', isZeroDecimal: false },
  { code: 'zar', symbol: 'R', name: 'South African Rand', countryCode: 'ZA', dialCode: '+27', flag: '🇿🇦', isZeroDecimal: false },
  { code: 'krw', symbol: '₩', name: 'South Korean Won', countryCode: 'KR', dialCode: '+82', flag: '🇰🇷', isZeroDecimal: true },
  
  // Middle East & North Africa
  { code: 'aed', symbol: 'AED', name: 'UAE Dirham', countryCode: 'AE', dialCode: '+971', flag: '🇦🇪', isZeroDecimal: false },
  { code: 'sar', symbol: 'SAR', name: 'Saudi Riyal', countryCode: 'SA', dialCode: '+966', flag: '🇸🇦', isZeroDecimal: false },
  { code: 'qar', symbol: 'QAR', name: 'Qatari Riyal', countryCode: 'QA', dialCode: '+974', flag: '🇶🇦', isZeroDecimal: false },
  { code: 'kwd', symbol: 'KWD', name: 'Kuwaiti Dinar', countryCode: 'KW', dialCode: '+965', flag: '🇰🇼', isZeroDecimal: false },
  { code: 'bhd', symbol: 'BHD', name: 'Bahraini Dinar', countryCode: 'BH', dialCode: '+973', flag: '🇧🇭', isZeroDecimal: false },
  { code: 'omr', symbol: 'OMR', name: 'Omani Rial', countryCode: 'OM', dialCode: '+968', flag: '🇴🇲', isZeroDecimal: false },
  { code: 'jod', symbol: 'JOD', name: 'Jordanian Dinar', countryCode: 'JO', dialCode: '+962', flag: '🇯🇴', isZeroDecimal: false },
  { code: 'ils', symbol: '₪', name: 'Israeli New Shekel', countryCode: 'IL', dialCode: '+972', flag: '🇮🇱', isZeroDecimal: false },
  { code: 'egp', symbol: 'E£', name: 'Egyptian Pound', countryCode: 'EG', dialCode: '+20', flag: '🇪🇬', isZeroDecimal: false },
  { code: 'mad', symbol: 'MAD', name: 'Moroccan Dirham', countryCode: 'MA', dialCode: '+212', flag: '🇲🇦', isZeroDecimal: false },
  { code: 'dzd', symbol: 'DZD', name: 'Algerian Dinar', countryCode: 'DZ', dialCode: '+213', flag: '🇩🇿', isZeroDecimal: false },
  { code: 'tnd', symbol: 'TND', name: 'Tunisian Dinar', countryCode: 'TN', dialCode: '+216', flag: '🇹🇳', isZeroDecimal: false },
  { code: 'lbp', symbol: 'L£', name: 'Lebanese Pound', countryCode: 'LB', dialCode: '+961', flag: '🇱🇧', isZeroDecimal: false },
  { code: 'iqd', symbol: 'IQD', name: 'Iraqi Dinar', countryCode: 'IQ', dialCode: '+964', flag: '🇮🇶', isZeroDecimal: false },
  { code: 'lyd', symbol: 'LD', name: 'Libyan Dinar', countryCode: 'LY', dialCode: '+218', flag: '🇱🇾', isZeroDecimal: false },
  { code: 'yer', symbol: 'YR', name: 'Yemeni Rial', countryCode: 'YE', dialCode: '+967', flag: '🇾🇪', isZeroDecimal: false },

  // Asia-Pacific & South Asia
  { code: 'thb', symbol: '฿', name: 'Thai Baht', countryCode: 'TH', dialCode: '+66', flag: '🇹🇭', isZeroDecimal: false },
  { code: 'myr', symbol: 'RM', name: 'Malaysian Ringgit', countryCode: 'MY', dialCode: '+60', flag: '🇲🇾', isZeroDecimal: false },
  { code: 'idr', symbol: 'Rp', name: 'Indonesian Rupiah', countryCode: 'ID', dialCode: '+62', flag: '🇮🇩', isZeroDecimal: false },
  { code: 'php', symbol: '₱', name: 'Philippine Peso', countryCode: 'PH', dialCode: '+63', flag: '🇵🇭', isZeroDecimal: false },
  { code: 'vnd', symbol: '₫', name: 'Vietnamese Dong', countryCode: 'VN', dialCode: '+84', flag: '🇻🇳', isZeroDecimal: true },
  { code: 'twd', symbol: 'NT$', name: 'New Taiwan Dollar', countryCode: 'TW', dialCode: '+886', flag: '🇹🇼', isZeroDecimal: false },
  { code: 'bdt', symbol: '৳', name: 'Bangladeshi Taka', countryCode: 'BD', dialCode: '+880', flag: '🇧🇩', isZeroDecimal: false },
  { code: 'pkr', symbol: '₨', name: 'Pakistani Rupee', countryCode: 'PK', dialCode: '+92', flag: '🇵🇰', isZeroDecimal: false },
  { code: 'lkr', symbol: 'Rs', name: 'Sri Lankan Rupee', countryCode: 'LK', dialCode: '+94', flag: '🇱🇰', isZeroDecimal: false },
  { code: 'npr', symbol: 'रू', name: 'Nepalese Rupee', countryCode: 'NP', dialCode: '+977', flag: '🇳🇵', isZeroDecimal: false },
  { code: 'khr', symbol: '៛', name: 'Cambodian Riel', countryCode: 'KH', dialCode: '+855', flag: '🇰🇭', isZeroDecimal: false },
  { code: 'lak', symbol: '₭', name: 'Lao Kip', countryCode: 'LA', dialCode: '+856', flag: '🇱🇦', isZeroDecimal: false },
  { code: 'mmk', symbol: 'K', name: 'Myanmar Kyat', countryCode: 'MM', dialCode: '+95', flag: '🇲🇲', isZeroDecimal: false },
  { code: 'mnt', symbol: '₮', name: 'Mongolian Tugrik', countryCode: 'MN', dialCode: '+976', flag: '🇲🇳', isZeroDecimal: false },
  { code: 'kzt', symbol: '₸', name: 'Kazakhstani Tenge', countryCode: 'KZ', dialCode: '+7', flag: '🇰🇿', isZeroDecimal: false },
  { code: 'uzs', symbol: 'soʻm', name: 'Uzbekistani Som', countryCode: 'UZ', dialCode: '+998', flag: '🇺🇿', isZeroDecimal: false },
  { code: 'kgs', symbol: 'som', name: 'Kyrgyzstani Som', countryCode: 'KG', dialCode: '+996', flag: '🇰🇬', isZeroDecimal: false },
  { code: 'tjs', symbol: 'SM', name: 'Tajikistani Somoni', countryCode: 'TJ', dialCode: '+992', flag: '🇹🇯', isZeroDecimal: false },
  { code: 'afn', symbol: '؋', name: 'Afghan Afghani', countryCode: 'AF', dialCode: '+93', flag: '🇦🇫', isZeroDecimal: false },
  { code: 'btn', symbol: 'Nu.', name: 'Bhutanese Ngultrum', countryCode: 'BT', dialCode: '+975', flag: '🇧🇹', isZeroDecimal: false },
  { code: 'mop', symbol: 'MOP$', name: 'Macanese Pataca', countryCode: 'MO', dialCode: '+853', flag: '🇲🇴', isZeroDecimal: false },
  { code: 'mvr', symbol: 'Rf', name: 'Maldivian Rufiyaa', countryCode: 'MV', dialCode: '+960', flag: '🇲🇻', isZeroDecimal: false },

  // Eastern & Central Europe
  { code: 'czk', symbol: 'Kč', name: 'Czech Koruna', countryCode: 'CZ', dialCode: '+420', flag: '🇨🇿', isZeroDecimal: false },
  { code: 'huf', symbol: 'Ft', name: 'Hungarian Forint', countryCode: 'HU', dialCode: '+36', flag: '🇭🇺', isZeroDecimal: false },
  { code: 'ron', symbol: 'lei', name: 'Romanian Leu', countryCode: 'RO', dialCode: '+40', flag: '🇷🇴', isZeroDecimal: false },
  { code: 'bgn', symbol: 'лв', name: 'Bulgarian Lev', countryCode: 'BG', dialCode: '+359', flag: '🇧🇬', isZeroDecimal: false },
  { code: 'hrk', symbol: 'kn', name: 'Croatian Kuna', countryCode: 'HR', dialCode: '+385', flag: '🇭🇷', isZeroDecimal: false },
  { code: 'rsd', symbol: 'дин.', name: 'Serbian Dinar', countryCode: 'RS', dialCode: '+381', flag: '🇷🇸', isZeroDecimal: false },
  { code: 'isk', symbol: 'kr', name: 'Icelandic Krona', countryCode: 'IS', dialCode: '+354', flag: '🇮🇸', isZeroDecimal: false },
  { code: 'uah', symbol: '₴', name: 'Ukrainian Hryvnia', countryCode: 'UA', dialCode: '+380', flag: '🇺🇦', isZeroDecimal: false },
  { code: 'try', symbol: '₺', name: 'Turkish Lira', countryCode: 'TR', dialCode: '+90', flag: '🇹🇷', isZeroDecimal: false },
  { code: 'gel', symbol: '₾', name: 'Georgian Lari', countryCode: 'GE', dialCode: '+995', flag: '🇬🇪', isZeroDecimal: false },
  { code: 'azn', symbol: '₼', name: 'Azerbaijani Manat', countryCode: 'AZ', dialCode: '+994', flag: '🇦🇿', isZeroDecimal: false },
  { code: 'amd', symbol: '֏', name: 'Armenian Dram', countryCode: 'AM', dialCode: '+374', flag: '🇦🇲', isZeroDecimal: false },
  { code: 'all', symbol: 'Lek', name: 'Albanian Lek', countryCode: 'AL', dialCode: '+355', flag: '🇦🇱', isZeroDecimal: false },
  { code: 'bam', symbol: 'KM', name: 'Bosnia-Herzegovina Mark', countryCode: 'BA', dialCode: '+387', flag: '🇧🇦', isZeroDecimal: false },
  { code: 'mkd', symbol: 'ден', name: 'Macedonian Denar', countryCode: 'MK', dialCode: '+389', flag: '🇲🇰', isZeroDecimal: false },
  { code: 'mdl', symbol: 'L', name: 'Moldovan Leu', countryCode: 'MD', dialCode: '+373', flag: '🇲🇩', isZeroDecimal: false },

  // Latin America & Caribbean
  { code: 'ars', symbol: 'AR$', name: 'Argentine Peso', countryCode: 'AR', dialCode: '+54', flag: '🇦🇷', isZeroDecimal: false },
  { code: 'clp', symbol: 'CL$', name: 'Chilean Peso', countryCode: 'CL', dialCode: '+56', flag: '🇨🇱', isZeroDecimal: true },
  { code: 'cop', symbol: 'COL$', name: 'Colombian Peso', countryCode: 'CO', dialCode: '+57', flag: '🇨🇴', isZeroDecimal: false },
  { code: 'pen', symbol: 'S/.', name: 'Peruvian Sol', countryCode: 'PE', dialCode: '+51', flag: '🇵🇪', isZeroDecimal: false },
  { code: 'uyu', symbol: '$U', name: 'Uruguayan Peso', countryCode: 'UY', dialCode: '+598', flag: '🇺🇾', isZeroDecimal: false },
  { code: 'pyg', symbol: '₲', name: 'Paraguayan Guarani', countryCode: 'PY', dialCode: '+595', flag: '🇵🇾', isZeroDecimal: true },
  { code: 'bob', symbol: 'Bs', name: 'Bolivian Boliviano', countryCode: 'BO', dialCode: '+591', flag: '🇧🇴', isZeroDecimal: false },
  { code: 'crc', symbol: '₡', name: 'Costa Rican Colon', countryCode: 'CR', dialCode: '+506', flag: '🇨🇷', isZeroDecimal: false },
  { code: 'dop', symbol: 'RD$', name: 'Dominican Peso', countryCode: 'DO', dialCode: '+1', flag: '🇩🇴', isZeroDecimal: false },
  { code: 'gtq', symbol: 'Q', name: 'Guatemalan Quetzal', countryCode: 'GT', dialCode: '+502', flag: '🇬🇹', isZeroDecimal: false },
  { code: 'hnl', symbol: 'L', name: 'Honduran Lempira', countryCode: 'HN', dialCode: '+504', flag: '🇭🇳', isZeroDecimal: false },
  { code: 'nio', symbol: 'C$', name: 'Nicaraguan Cordoba', countryCode: 'NI', dialCode: '+505', flag: '🇳🇮', isZeroDecimal: false },
  { code: 'pab', symbol: 'B/.', name: 'Panamanian Balboa', countryCode: 'PA', dialCode: '+507', flag: '🇵🇦', isZeroDecimal: false },
  { code: 'jmd', symbol: 'J$', name: 'Jamaican Dollar', countryCode: 'JM', dialCode: '+1', flag: '🇯🇲', isZeroDecimal: false },
  { code: 'ttd', symbol: 'TT$', name: 'Trinidad & Tobago Dollar', countryCode: 'TT', dialCode: '+1', flag: '🇹🇹', isZeroDecimal: false },
  { code: 'bbd', symbol: 'Bds$', name: 'Barbadian Dollar', countryCode: 'BB', dialCode: '+1', flag: '🇧🇧', isZeroDecimal: false },
  { code: 'bsd', symbol: 'B$', name: 'Bahamian Dollar', countryCode: 'BS', dialCode: '+1', flag: '🇧🇸', isZeroDecimal: false },
  { code: 'bzd', symbol: 'BZ$', name: 'Belize Dollar', countryCode: 'BZ', dialCode: '+501', flag: '🇧🇿', isZeroDecimal: false },
  { code: 'bmd', symbol: 'BD$', name: 'Bermudian Dollar', countryCode: 'BM', dialCode: '+1', flag: '🇧🇲', isZeroDecimal: false },
  { code: 'kyd', symbol: 'CI$', name: 'Cayman Islands Dollar', countryCode: 'KY', dialCode: '+1', flag: '🇰🇾', isZeroDecimal: false },
  { code: 'xcd', symbol: 'EC$', name: 'East Caribbean Dollar', countryCode: 'AG', dialCode: '+1', flag: '🇦🇬', isZeroDecimal: false },
  { code: 'gyd', symbol: 'G$', name: 'Guyanese Dollar', countryCode: 'GY', dialCode: '+592', flag: '🇬🇾', isZeroDecimal: false },
  { code: 'srd', symbol: 'Sr$', name: 'Surinamese Dollar', countryCode: 'SR', dialCode: '+597', flag: '🇸🇷', isZeroDecimal: false },
  { code: 'awg', symbol: 'Afl.', name: 'Aruban Florin', countryCode: 'AW', dialCode: '+297', flag: '🇦🇼', isZeroDecimal: false },
  { code: 'htg', symbol: 'G', name: 'Haitian Gourde', countryCode: 'HT', dialCode: '+509', flag: '🇭🇹', isZeroDecimal: false },

  // Sub-Saharan Africa
  { code: 'ngn', symbol: '₦', name: 'Nigerian Naira', countryCode: 'NG', dialCode: '+234', flag: '🇳🇬', isZeroDecimal: false },
  { code: 'kes', symbol: 'KSh', name: 'Kenyan Shilling', countryCode: 'KE', dialCode: '+254', flag: '🇰🇪', isZeroDecimal: false },
  { code: 'ghs', symbol: 'GH₵', name: 'Ghanaian Cedi', countryCode: 'GH', dialCode: '+233', flag: '🇬🇭', isZeroDecimal: false },
  { code: 'ugx', symbol: 'USh', name: 'Ugandan Shilling', countryCode: 'UG', dialCode: '+256', flag: '🇺🇬', isZeroDecimal: true },
  { code: 'tzs', symbol: 'TSh', name: 'Tanzanian Shilling', countryCode: 'TZ', dialCode: '+255', flag: '🇹🇿', isZeroDecimal: false },
  { code: 'rwf', symbol: 'FRw', name: 'Rwandan Franc', countryCode: 'RW', dialCode: '+250', flag: '🇷🇼', isZeroDecimal: true },
  { code: 'etb', symbol: 'Br', name: 'Ethiopian Birr', countryCode: 'ET', dialCode: '+251', flag: '🇪🇹', isZeroDecimal: false },
  { code: 'mzn', symbol: 'MT', name: 'Mozambican Metical', countryCode: 'MZ', dialCode: '+258', flag: '🇲🇿', isZeroDecimal: false },
  { code: 'aoa', symbol: 'Kz', name: 'Angolan Kwanza', countryCode: 'AO', dialCode: '+244', flag: '🇦🇴', isZeroDecimal: false },
  { code: 'xaf', symbol: 'FCFA', name: 'Central African CFA Franc', countryCode: 'CM', dialCode: '+237', flag: '🇨🇲', isZeroDecimal: true },
  { code: 'xof', symbol: 'CFA', name: 'West African CFA Franc', countryCode: 'SN', dialCode: '+221', flag: '🇸🇳', isZeroDecimal: true },
  { code: 'bif', symbol: 'FBu', name: 'Burundian Franc', countryCode: 'BI', dialCode: '+257', flag: '🇧🇮', isZeroDecimal: true },
  { code: 'djf', symbol: 'Fdj', name: 'Djiboutian Franc', countryCode: 'DJ', dialCode: '+253', flag: '🇩🇯', isZeroDecimal: true },
  { code: 'gnf', symbol: 'FG', name: 'Guinean Franc', countryCode: 'GN', dialCode: '+224', flag: '🇬🇳', isZeroDecimal: true },
  { code: 'kmf', symbol: 'CF', name: 'Comorian Franc', countryCode: 'KM', dialCode: '+269', flag: '🇰🇲', isZeroDecimal: true },
  { code: 'mga', symbol: 'Ar', name: 'Malagasy Ariary', countryCode: 'MG', dialCode: '+261', flag: '🇲🇬', isZeroDecimal: true },
  { code: 'mur', symbol: '₨', name: 'Mauritian Rupee', countryCode: 'MU', dialCode: '+230', flag: '🇲🇺', isZeroDecimal: false },
  { code: 'scr', symbol: 'SR', name: 'Seychellois Rupee', countryCode: 'SC', dialCode: '+248', flag: '🇸🇨', isZeroDecimal: false },
  { code: 'bwp', symbol: 'P', name: 'Botswana Pula', countryCode: 'BW', dialCode: '+267', flag: '🇧🇼', isZeroDecimal: false },
  { code: 'nad', symbol: 'N$', name: 'Namibian Dollar', countryCode: 'NA', dialCode: '+264', flag: '🇳🇦', isZeroDecimal: false },
  { code: 'mwk', symbol: 'MK', name: 'Malawian Kwacha', countryCode: 'MW', dialCode: '+265', flag: '🇲🇼', isZeroDecimal: false },
  { code: 'zmw', symbol: 'ZK', name: 'Zambian Kwacha', countryCode: 'ZM', dialCode: '+260', flag: '🇿🇲', isZeroDecimal: false },
  { code: 'cdf', symbol: 'FC', name: 'Congolese Franc', countryCode: 'CD', dialCode: '+243', flag: '🇨🇩', isZeroDecimal: false },
  { code: 'cve', symbol: 'Esc', name: 'Cape Verdean Escudo', countryCode: 'CV', dialCode: '+238', flag: '🇨🇻', isZeroDecimal: false },
  { code: 'gmd', symbol: 'D', name: 'Gambian Dalasi', countryCode: 'GM', dialCode: '+220', flag: '🇬🇲', isZeroDecimal: false },
  { code: 'lrd', symbol: 'L$', name: 'Liberian Dollar', countryCode: 'LR', dialCode: '+231', flag: '🇱🇷', isZeroDecimal: false },
  { code: 'lsl', symbol: 'L', name: 'Lesotho Loti', countryCode: 'LS', dialCode: '+266', flag: '🇱🇸', isZeroDecimal: false },
  { code: 'mru', symbol: 'UM', name: 'Mauritanian Ouguiya', countryCode: 'MR', dialCode: '+222', flag: '🇲🇷', isZeroDecimal: false },
  { code: 'sos', symbol: 'Sh', name: 'Somali Shilling', countryCode: 'SO', dialCode: '+252', flag: '🇸🇴', isZeroDecimal: false },
  { code: 'szl', symbol: 'E', name: 'Swazi Lilangeni', countryCode: 'SZ', dialCode: '+268', flag: '🇸🇿', isZeroDecimal: false },

  // Oceania & Pacific
  { code: 'fjd', symbol: 'FJ$', name: 'Fijian Dollar', countryCode: 'FJ', dialCode: '+679', flag: '🇫🇯', isZeroDecimal: false },
  { code: 'pgk', symbol: 'K', name: 'Papua New Guinean Kina', countryCode: 'PG', dialCode: '+675', flag: '🇵🇬', isZeroDecimal: false },
  { code: 'vuv', symbol: 'VT', name: 'Vanuatu Vatu', countryCode: 'VU', dialCode: '+678', flag: '🇻🇺', isZeroDecimal: true },
  { code: 'wst', symbol: 'WS$', name: 'Samoan Tala', countryCode: 'WS', dialCode: '+685', flag: '🇼🇸', isZeroDecimal: false },
  { code: 'top', symbol: 'T$', name: 'Tongan Paʻanga', countryCode: 'TO', dialCode: '+676', flag: '🇹🇴', isZeroDecimal: false },
  { code: 'sbd', symbol: 'SI$', name: 'Solomon Islands Dollar', countryCode: 'SB', dialCode: '+677', flag: '🇸🇧', isZeroDecimal: false },
  { code: 'xpf', symbol: 'CFPF', name: 'CFP Franc', countryCode: 'PF', dialCode: '+689', flag: '🇵🇫', isZeroDecimal: true }
]);

/**
 * Comprehensive List of Countries with International Calling / Verification Codes ("country number")
 * and Primary Associated Currencies
 */
export const COUNTRIES = Object.freeze([
  { code: 'US', name: 'United States', dialCode: '+1', currency: 'usd', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', currency: 'gbp', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', currency: 'cad', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', currency: 'aud', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', currency: 'eur', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', currency: 'eur', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', currency: 'eur', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', currency: 'eur', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', currency: 'eur', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', currency: 'chf', flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', currency: 'sek', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', currency: 'nok', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', currency: 'dkk', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', currency: 'eur', flag: '🇫🇮' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', currency: 'eur', flag: '🇮🇪' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', currency: 'eur', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', dialCode: '+43', currency: 'eur', flag: '🇦🇹' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', currency: 'eur', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', dialCode: '+30', currency: 'eur', flag: '🇬🇷' },
  { code: 'PL', name: 'Poland', dialCode: '+48', currency: 'pln', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', currency: 'czk', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', currency: 'huf', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', dialCode: '+40', currency: 'ron', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', currency: 'bgn', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', currency: 'eur', flag: '🇭🇷' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', currency: 'rsd', flag: '🇷🇸' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', currency: 'uah', flag: '🇺🇦' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', currency: 'try', flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', dialCode: '+972', currency: 'ils', flag: '🇮🇱' },
  { code: 'JP', name: 'Japan', dialCode: '+81', currency: 'jpy', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', currency: 'krw', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', currency: 'cny', flag: '🇨🇳' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', currency: 'hkd', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', currency: 'twd', flag: '🇹🇼' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', currency: 'sgd', flag: '🇸🇬' },
  { code: 'IN', name: 'India', dialCode: '+91', currency: 'inr', flag: '🇮🇳' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', currency: 'aed', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', currency: 'sar', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', currency: 'qar', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', currency: 'kwd', flag: '🇰🇼' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', currency: 'bhd', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', dialCode: '+968', currency: 'omr', flag: '🇴🇲' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', currency: 'jod', flag: '🇯🇴' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', currency: 'egp', flag: '🇪🇬' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', currency: 'zar', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', currency: 'ngn', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', currency: 'kes', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', currency: 'ghs', flag: '🇬🇭' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', currency: 'tzs', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', currency: 'ugx', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', currency: 'rwf', flag: '🇷🇼' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', currency: 'mad', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', currency: 'dzd', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', currency: 'tnd', flag: '🇹🇳' },
  { code: 'LY', name: 'Libya', dialCode: '+218', currency: 'lyd', flag: '🇱🇾' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', currency: 'lbp', flag: '🇱🇧' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', currency: 'iqd', flag: '🇮🇶' },
  { code: 'YE', name: 'Yemen', dialCode: '+967', currency: 'yer', flag: '🇾🇪' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', currency: 'brl', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', currency: 'mxn', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', currency: 'ars', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', currency: 'clp', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', currency: 'cop', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dialCode: '+51', currency: 'pen', flag: '🇵🇪' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', currency: 'uyu', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', currency: 'pyg', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', currency: 'bob', flag: '🇧🇴' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', currency: 'crc', flag: '🇨🇷' },
  { code: 'PA', name: 'Panama', dialCode: '+507', currency: 'pab', flag: '🇵🇦' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1', currency: 'dop', flag: '🇩🇴' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', currency: 'gtq', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', currency: 'hnl', flag: '🇭🇳' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', currency: 'nio', flag: '🇳🇮' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', currency: 'usd', flag: '🇸🇻' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1', currency: 'jmd', flag: '🇯🇲' },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1', currency: 'ttd', flag: '🇹🇹' },
  { code: 'BB', name: 'Barbados', dialCode: '+1', currency: 'bbd', flag: '🇧🇧' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1', currency: 'bsd', flag: '🇧🇸' },
  { code: 'BZ', name: 'Belize', dialCode: '+501', currency: 'bzd', flag: '🇧🇿' },
  { code: 'BM', name: 'Bermuda', dialCode: '+1', currency: 'bmd', flag: '🇧🇲' },
  { code: 'KY', name: 'Cayman Islands', dialCode: '+1', currency: 'kyd', flag: '🇰🇾' },
  { code: 'AW', name: 'Aruba', dialCode: '+297', currency: 'awg', flag: '🇦🇼' },
  { code: 'HT', name: 'Haiti', dialCode: '+509', currency: 'htg', flag: '🇭🇹' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', currency: 'nzd', flag: '🇳🇿' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', currency: 'thb', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', currency: 'myr', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', currency: 'idr', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', currency: 'php', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', currency: 'vnd', flag: '🇻🇳' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', currency: 'bdt', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', currency: 'pkr', flag: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', currency: 'lkr', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', currency: 'npr', flag: '🇳🇵' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855', currency: 'khr', flag: '🇰🇭' },
  { code: 'LA', name: 'Laos', dialCode: '+856', currency: 'lak', flag: '🇱🇦' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', currency: 'mmk', flag: '🇲🇲' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', currency: 'mnt', flag: '🇲🇳' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', currency: 'kzt', flag: '🇰🇿' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', currency: 'uzs', flag: '🇺🇿' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', currency: 'kgs', flag: '🇰🇬' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992', currency: 'tjs', flag: '🇹🇯' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', currency: 'afn', flag: '🇦🇫' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975', currency: 'btn', flag: '🇧🇹' },
  { code: 'MO', name: 'Macau', dialCode: '+853', currency: 'mop', flag: '🇲🇴' },
  { code: 'MV', name: 'Maldives', dialCode: '+960', currency: 'mvr', flag: '🇲🇻' },
  { code: 'GE', name: 'Georgia', dialCode: '+995', currency: 'gel', flag: '🇬🇪' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', currency: 'azn', flag: '🇦🇿' },
  { code: 'AM', name: 'Armenia', dialCode: '+374', currency: 'amd', flag: '🇦🇲' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', currency: 'isk', flag: '🇮🇸' },
  { code: 'AL', name: 'Albania', dialCode: '+355', currency: 'all', flag: '🇦🇱' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', currency: 'bam', flag: '🇧🇦' },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389', currency: 'mkd', flag: '🇲🇰' },
  { code: 'MD', name: 'Moldova', dialCode: '+373', currency: 'mdl', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', currency: 'eur', flag: '🇲🇪' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', currency: 'eur', flag: '🇨🇾' },
  { code: 'MT', name: 'Malta', dialCode: '+356', currency: 'eur', flag: '🇲🇹' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', currency: 'eur', flag: '🇱🇺' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', currency: 'eur', flag: '🇸🇮' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', currency: 'eur', flag: '🇸🇰' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', currency: 'eur', flag: '🇪🇪' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', currency: 'eur', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', currency: 'eur', flag: '🇱🇹' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', currency: 'xaf', flag: '🇨🇲' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', currency: 'xof', flag: '🇸🇳' },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225', currency: 'xof', flag: '🇨🇮' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', currency: 'etb', flag: '🇪🇹' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', currency: 'mzn', flag: '🇲🇿' },
  { code: 'AO', name: 'Angola', dialCode: '+244', currency: 'aoa', flag: '🇦🇴' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', currency: 'mur', flag: '🇲🇺' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', currency: 'bwp', flag: '🇧🇼' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', currency: 'nad', flag: '🇳🇦' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', currency: 'zmw', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', currency: 'usd', flag: '🇿🇼' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238', currency: 'cve', flag: '🇨🇻' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', currency: 'gmd', flag: '🇬🇲' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', currency: 'gnf', flag: '🇬🇳' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', currency: 'lrd', flag: '🇱🇷' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', currency: 'lsl', flag: '🇱🇸' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', currency: 'mru', flag: '🇲🇷' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', currency: 'sos', flag: '🇸🇴' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', currency: 'szl', flag: '🇸🇿' },
  { code: 'CD', name: 'DR Congo', dialCode: '+243', currency: 'cdf', flag: '🇨🇩' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', currency: 'bif', flag: '🇧🇮' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', currency: 'djf', flag: '🇩🇯' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', currency: 'kmf', flag: '🇰🇲' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', currency: 'mga', flag: '🇲🇬' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', currency: 'scr', flag: '🇸🇨' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', currency: 'mwk', flag: '🇲🇼' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679', currency: 'fjd', flag: '🇫🇯' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', currency: 'pgk', flag: '🇵🇬' },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678', currency: 'vuv', flag: '🇻🇺' },
  { code: 'WS', name: 'Samoa', dialCode: '+685', currency: 'wst', flag: '🇼🇸' },
  { code: 'TO', name: 'Tonga', dialCode: '+676', currency: 'top', flag: '🇹🇴' },
  { code: 'SB', name: 'Solomon Islands', dialCode: '+677', currency: 'sbd', flag: '🇸🇧' },
  { code: 'PF', name: 'French Polynesia', dialCode: '+689', currency: 'xpf', flag: '🇵🇫' }
]);

// Fast Lookup Maps
export const CURRENCIES_BY_CODE = new Map(CURRENCIES.map(c => [c.code.toLowerCase(), c]));
export const COUNTRIES_BY_CODE = new Map(COUNTRIES.map(c => [c.code.toUpperCase(), c]));

/**
 * Returns all supported ISO currencies.
 */
export function getAllCurrencies() {
  return CURRENCIES;
}

/**
 * Returns all countries with calling code / verification phone prefix.
 */
export function getAllCountries() {
  return COUNTRIES;
}

/**
 * Find currency details by 3-letter code.
 */
export function getCurrency(code) {
  if (!code) return null;
  return CURRENCIES_BY_CODE.get(code.toLowerCase().trim()) || null;
}

/**
 * Find country details by 2-letter ISO code.
 */
export function getCountry(code) {
  if (!code) return null;
  return COUNTRIES_BY_CODE.get(code.toUpperCase().trim()) || null;
}

/**
 * Validates international phone number against ITU-T E.164 requirements.
 * Dial code e.g. "+1", "+44", "+91", "+880".
 * National number e.g. "5551234567" or "9876543210".
 */
export function validatePhoneNumber(dialCode, nationalNumber) {
  if (!dialCode || typeof dialCode !== 'string') {
    return { valid: false, error: 'Dial code is required' };
  }
  const cleanDial = dialCode.trim();
  if (!/^\+\d{1,4}$/.test(cleanDial)) {
    return { valid: false, error: 'Invalid country dial code format (must start with +)' };
  }

  if (!nationalNumber || typeof nationalNumber !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }
  // Remove non-digit characters
  const digitsOnly = nationalNumber.replace(/\D/g, '');
  if (digitsOnly.length < 5 || digitsOnly.length > 15) {
    return { valid: false, error: 'Phone number must be between 5 and 15 digits' };
  }

  const e164 = `${cleanDial}${digitsOnly}`;
  return {
    valid: true,
    dialCode: cleanDial,
    nationalNumber: digitsOnly,
    e164
  };
}

/**
 * Formats a phone number for display.
 */
export function formatPhoneNumber(dialCode, nationalNumber) {
  const digits = (nationalNumber || '').replace(/\D/g, '');
  if (!dialCode) return digits;
  if (!digits) return dialCode;

  if (digits.length === 10) {
    return `${dialCode} (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return `${dialCode} ${digits}`;
}
