import fs from 'node:fs';
import path from 'node:path';

const DIRECTUS_URL = 'http://168.144.130.147:8055';
const ADMIN_EMAIL = 'tarnpure@gmail.com';
const ADMIN_PASSWORD = 'f2ded46ae924d429b14e24db8a5418ac';

const COLLECTION_NAME = 'estella_locations';

const locations = [
  // Bangkok A-L
  {
    name: "100 Mahaseth",
    address: "198/3 Mahaseth road , Si Phraya , Bangrak, Bangkok, Thailand 10500",
    tel: "+66 235 0023",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "ABOUT EATERY",
    address: "Sukhumvit 21 Soi 3, Ocean Tower II, Yannawa, Yannawa Bangkok, Thailand 10120",
    tel: "+66 2676 6982",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "ALDO'S BISTRO",
    address: "7/F Ascott Sathorn 187 South Sathorn Road, Klongtoey Nua, Wattana, Bangkok, Thailand 10110",
    tel: "+66 2665 2772",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "AMONTE ITALIAN RESTAURANT",
    address: "99 ถนน อุดมสุข แขวง บางนา เขต บางนา กรุงเทพมหานคร 10260",
    tel: "+66 2398 2307",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Arno’s Butcher and Eatery",
    address: "2080/2 Narathiwas Soi 20, Bangkok, Thailand",
    tel: "+66 2678 8340",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "ARROZ Spanish Rice House",
    address: "112 Soi Sukhumvit 53, Klongtonnua, Wattana, Bangkok 10110, Thailand",
    tel: "+66 2258 7696",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "ANANTARA BANGKOK SATHORN HOTEL",
    address: "36 Naradhiwas Rajanagarindra Rd",
    tel: "+66 2210 9000",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "Anantara Siam Bangkok Hotel",
    address: "155 Rajadamri Road, Bangkok",
    tel: "+66 2 126 8866",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "Antonio's",
    address: "26, Sukhumvit 31, Sukhumvit Road, Bangkok, Watthana 10110",
    tel: "+66 2 662 1001",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "APPIA BANGKOK - ROMAN FAMILY RECIPES",
    address: "20/4 Sukhumvit 31, Bangkok, Thailand, 10110",
    tel: "+66 2261 2056",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Astarte Cafe & Wine bar Bangkok",
    address: "Metropolis Building No 725, 3rd floor, Sukhumvit Road, Klongtan-Nua, Wattana, 10110 Bangkok, Thailand",
    tel: "+66 99284 6398",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "BACCHUS",
    address: "20/6-7 Soi Ruemrudee Ploenchit Rd., Pathunwan-Lumpini, Bangkok, Thailand",
    tel: "+66 2650 8986",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "Bliss Contemporary Cuisine",
    address: "The Shoppes Grand Rama 9, Belle Condo, 10310 Bangkok, Thailand",
    tel: "+66 2618 1252",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Blue Elephant Bangkok",
    address: "233 South Sathorn Road, Kwaeng Yannawa, Khet Sathorn, 10120 Bangkok, Thailand",
    tel: "+66 673 9353",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "BOLAN",
    address: "House number 24 Soi Sukhumvit 53 (Soi Pai dee ma dee) Klong Toey Nua, Wattana Bangkok 10110 Thailand",
    tel: "+66 260 2962",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "BOTTLE GROTTO",
    address: "33/9 Sukhumvit 63, Klhong Ton Nua, Wattana, Bangkok, Thailand 10110",
    tel: "+66 84 977 3680",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "BOURBON STREET RESTAURANT",
    address: "9/39-40 Soi Tana Arcade Sukhumvit 63 Ekkamai Klongton Nua Wattana Bangkok 10110 Thailand",
    tel: "+66 2381 6801",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Brasserie 9",
    address: "27 Soi Piphat, Silom, Bangrak, Bangkok 10500 Thailand",
    tel: "+66 234 2588",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Bunker",
    address: "118/2 Soi Suksa (Sathorn 12), Bangkok 10500 Thailand",
    tel: "+66 234 7749",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "CAFE PARISIEN",
    address: "Witthayu 132 Sindhorn Tower, แขวง ลุมพินี เขต ปทุมวัน กรุงเทพมหานคร 10330",
    tel: "+66 2650 9993",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Cantina Wine Bar & Italian Kitchen",
    address: "4 Ari Samphan Soi 3, Bangkok, Thailand",
    tel: "+66 2278 0250",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "Canvas Restaurant",
    address: "113/9-10 Sukhumvit Soi 55, (near Thonglor Soi 5, opposite of Tops Supermaket), Klongton Nua, Wattana, Bangkok 10110",
    tel: "+66 99614 1158",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "CELLAR 11",
    address: "71/1 Sukhumvit 11, Khlong Toei Nuea, Watthana, Bangkok 10110, Thailand",
    tel: "+66 2255 5833",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "CENTARA GRAND AT CENTRAL PLAZA LADPRAO",
    address: "1695 Phaholyothin Road, Chatuchak, Bangkok 10900",
    tel: "+66 2541 1234",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "CHARME DE L'ASIE",
    address: "Helix Building 8th Floor, EmQuartier, Sukhumvit Rd., Watthana, Bangkok 10110, Thailand",
    tel: "+66 2269 1000",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Chesa Swiss Cuisine",
    address: "5 Sukhumvit 20, Klong-toey, Bangkok, Thailand 10110, Thailand",
    tel: "+66 2261 6650",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "DAINOKI JAPANESE RESTAURANT",
    address: "Premier Building, 135/2 Sukhumvit 53, Thonglor, Sukhumvit Rd., Khlong Ton Nuea, Watthana, Bangkok 10110, Thailand",
    tel: "+66 2185 3946",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Devilish Eats Restaurant",
    address: "29-29/1 Sukhumvit Soi 101/1 Road Di Wavery Place Community Mall, Bangchak, Prakanong, Bangkok 10110, Thailand",
    tel: "+66 2747 8920",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "DIVINO",
    address: "Penny's Balcony, Thong Lor 16, Sukhumvit 55 Rd., Watthana, Bangkok 10110, Thailand",
    tel: "+66 2714 8723",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "Double tree by hilton",
    address: "18 1 Sukhumvit Soi 26 Khlong Ton, Bangkok, 10110, Thailand",
    tel: "+66 2649 6666",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "EAT ME RESTAURANT",
    address: "20 metres off Convent Rd (in Soi Pipat 2), Silom, Bangkok, Thailand",
    tel: "+66 2238 0931",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "ENOTECA ITALIANA",
    address: "Soi Sukhumvit 27, Khlong Toei Nuea, Watthana, Bangkok 10110, Thailand",
    tel: "+66 2258 4386",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "FRAGRANT PROPERTY LTD.",
    address: "1550 Thanapoom Tower, Fl.31, New Petchburi Road Makasan, Ratthewi, Bangkok 10400 Thailand",
    tel: "+66 2652 9888",
    city: "Bangkok",
    category: "retail"
  },
  {
    name: "GAGGAN",
    address: "68/1 Soi Langsuan, Ploenchit Road, Lumpini, Bangkok 10330, Thailand",
    tel: "+66 2652 1700",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Galleria Milano Restaurant",
    address: "66/4 first floor soi20, Klonytoei, Bangkok 10110, Thailand",
    tel: "+66 2663 4988",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "GIANNI RISTORANTE",
    address: "34/1 Soi Tonson, Ploenchit Rd., Bangkok 10330, Thailand",
    tel: "+66 2252 1619, +66 2652 2922",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "GOLF ZONE",
    address: "Big C 3rd Floor, Ekkamai 78, Soi Sukhumvit 71, Khlong Ton Nuea, Watthana, Bangkok 10110, Thailand",
    tel: "+66 2714 8222",
    city: "Bangkok",
    category: "retail"
  },
  {
    name: "Godfather Mega Bangna",
    address: "1 Floor , Zone Food Walk , Amphoe Bang Phli, Changwat Samut Prakan, Samut Prakan, Thailand 10540",
    tel: "+66 2105 2207",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Golden Tulip Sovereign Hotel Bangkok",
    address: "92 soi saengcham rama 9 road huaykwang, Bangkok 10310 Thailand",
    tel: "+66 2641 4777",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "GOURMET PRIMO CO., LTD",
    address: "129 Sukhapiban 2 Road, Kwaeng Dokmai, Khet Prawet, Bangkok 10250 Thailand",
    tel: "+66 2328 5997",
    city: "Bangkok",
    category: "retail"
  },
  {
    name: "GRAND HYATT ERAWAN HOTEL",
    address: "494 Rajdamri Rd., Bangkok 10330, Thailand",
    tel: "+66 2254 1234",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "HAMAICHI",
    address: "12 Soi Sukhumvit 29, Khlong Toei Nuea, Watthana, Bangkok 10110, Thailand",
    tel: "+66 662 3376",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Haoma Bangkok",
    address: "231/3 Sukhumvit Soi 31, Bangkok, Thailand 10110, Thailand",
    tel: "+66 258 4744",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Happy Trees Bistro & Bar",
    address: "226 Pradit Manutham, Soi 2 Road, Phlapphla District, Wang Thonglang District, Bangkok 10310, Thailand",
    tel: "+66 996 636 939",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "Harvest",
    address: "Project Chapter 31 24/1 Soi Sukhumvit 31, Watthana District, Bangkok, Thailand",
    tel: "+66 262 0762",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Hotel Grand Mercure Bangkok Fortune",
    address: "1 Ratchadapisek Road, Dindaeng, Bangkok 10400 Bangkok, Thailand",
    tel: "+66 2641 1500",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "HYDE AND SEEK PEEK A BOO",
    address: "Ground Floor Groove at Central World, Rama 1, Bangkok, Thailand",
    tel: "+66 2646 1099",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "IL BOLOGNESE RISTORANTE",
    address: "South Sathorn 139/3 Soi 7 Bangkok, 10120, Thailand",
    tel: "+66 2286 8805",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Il Fumo Restaurant & Bar",
    address: "1098/2 Rama IV Rd, Sathorn, Bangkok 10120 , Thailand",
    tel: "+66 2286 8833",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "INTERCONTINENTAL BANGKOK",
    address: "973 Ploen Chit Road, Pathum Wan  Bangkok, 10330, Thailand",
    tel: "+66 2656 0444",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "IRORI JUBAN",
    address: "36/1 1Fl. Soi Promphak, Klongtan-nua, Wattana, Bangkok, 10110, Thailand",
    tel: "+66 2392 0489",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "JIM THOMPSON RESTAURANT & LOUNGE",
    address: "ถนน สุรวงศ์ แขวง สุริยวงศ์ เขต บางรัก กรุงเทพมหานคร 10500",
    tel: "+66 2235 8932",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "JITPOCHANA PARK",
    address: "26/268 พหลโยธิน แขวง สายไหม เขต สายไหม กรุงเทพมหานคร 10220",
    tel: "+66 2531 1644-5",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Jones the Grocer",
    address: "at Emquartier, Ground Floor 637 Sukhumvit Road, Khlong Tan Nuea, Watthana, 10110 Bangkok, Thailand",
    tel: "+66 2261 0382",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Karatama Robatayaki",
    address: "Soi Sukumvit 49, Klongton-Nua, Wattana, Bangkok 10110, Thailand",
    tel: "+66 2662 4237",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "KHUAKLING PAK SOD PRASARNMIT",
    address: "21/32 Sukhumvit Soi 29 (access through Sukhumvit Soi 23), Bangkok, Thailand",
    tel: "+66 2259 5189",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "KING POWER",
    address: "888 Moo 10, Bang Chalong Sub-district, Bang Phli, Samut Prakan 10540, Thailand",
    tel: "+66 2338 7888",
    city: "Bangkok",
    category: "retail"
  },
  {
    name: "L'ATELIER DE JOEL ROBUCHON BANGKOK",
    address: "5th Floor, MahaNakhon CUBE, 96 Narathiwas Ratchanakharin Road, Silom, Bang Rak, Bangkok 10500",
    tel: "+66 2001 0698",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "LE BOTTEGA DI LUCA",
    address: "Terrace 49 2nd Floor, Sukhumvit 49, Bangkok 10110, Thailand",
    tel: "+66 2204 1731",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Le Cabanon Restaurant",
    address: "44 Soi Akhan Songkhro Sai Ti 3 Kor,, Khwaeng Thung Maha Mek, Khet Sathon, Bangkok 10120, Thailand",
    tel: "+66 92 568 0444",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "LE VENDOME",
    address: "267/2 Sukhumvit 31, Khlong Toei Nuea, Watthana, Bangkok 10110, Thailand",
    tel: "+66 2662 0530",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "LENZI TUSCAN KITCHEN",
    address: "69/1-2 Ruamruedee 2, Wireless Rd., Lumpini, Pathumwan, Bangkok 10330, Thailand",
    tel: "+66 2001 0116",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "LYON FRENCH RESTAURANT",
    address: "33/2 Corner of Soi Ruam Ruedi 2, Ploenchit Road Bangkok 10330",
    tel: "+66 2253 8141",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Le Du Restaurant",
    address: "399/3 Silom Soi 7 Silom, Bangkok 10500",
    tel: "+66 92 919 9969",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "LUCCA (LVCCA) ITALIAN RESTAURANT BANGKOK",
    address: "108/4, ซอย สุขุมวิท 65, แขวง พระโขนงเหนือ เขต วัฒนา กรุงเทพมหานคร 10110",
    tel: "+66 2714 2207",
    city: "Bangkok",
    category: "restaurant"
  },
  // Bangkok M-Z
  {
    name: "MANDARIN ORIENTAL BANGKOK HOTEL",
    address: "48 Oriental Ave, Bang Rak, Bangkok 10500",
    tel: "+66 2659 9000",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "MATERIAL CONCEPT BAR",
    address: "ซอยหมู่บ้านเสรีวิลล่า แยก2 แขวงหนองบอน เขตประเวศ Bangkok 10250",
    tel: "+66 85 686 5162",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "NO IDEA CAFE & GASTROPUB",
    address: "ซอย สุขุมวิท 22 ถนน สุขุมวิท แขวง คลองเตยเหนือ เขต วัฒนา กรุงเทพมหานคร 10110",
    tel: "+66 2663 6686",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "NIPPON - TEI RESTAURANT",
    address: "11-12 อาคาร President Tower ชั้น B ถนน เพลินจิต แขวง ลุมพินี เขต ปทุมวัน กรุงเทพมหานคร 10330",
    tel: "+66 2656 0037",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "OKURA PRESTIGE HOTEL",
    address: "Park Ventures Ecoplex, 57 Wireless Rd, Lumpini, Pathumwan, Bangkok 10330, Thailand",
    tel: "+66 2687 9000",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "Oskar Bistro",
    address: "24 Soi Sukumvit 11, Klongton-Nua, Wattana, Bangkok 10110, Thailand",
    tel: "+66 97289 4410",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "OLIO bangkok",
    address: "Soi Phiphat 2, Convent Road, 10500 Bangkok, Thailand",
    tel: "+66 64686 3986",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "OPUS WINE BAR",
    address: "64 Pan Rd., Silom, Bangrak, Bangkok 10500, Thailand",
    tel: "+66 2637 9899",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "PASTE AT GAYSORN \"ARTISANAL THAI CUISINE\"",
    address: "3rd floor, Gaysorn Shopping Centre, Lumpini",
    tel: "+66 2 656 1003",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "PIZZAZO BISTRO",
    address: "188 Sukhumvit 16 Thailand, กรุงเทพมหานคร 10110",
    tel: "+66 2 259 1234",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "RED ARGOSY CLUB",
    address: "723 อาคารศุภาคาร ซอยเจริญนคร 15 ถนนเจริญนคร แขวงคลองต้นไทร เขตคลองสาน กรุงเทพฯ 10600",
    tel: "+66 2860 4500",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "RENAISSANCE BANGKOK RATCHAPRASONG HOTEL",
    address: "518/8 Ploenchit Road, Bangkok 10330",
    tel: "+66 2125 5000",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "RIEDEL WINE BAR AND RESTAURANT",
    address: "2rd floor, Gaysorn Shopping Centre, Lumpini",
    tel: "+66 2656 1133",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "RIVER VIBE RESTAURANT & BAR",
    address: "768 Soi Panurangsi, Songvad Road Talad Noi Samphantawong Bangkok 10100",
    tel: "+66 2234 2078",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "Royal Orchid Sheraton",
    address: "2 Charoen Krung Road Soi 30, Siphya, Bangrak, Bang Rak, Bangkok, 10500",
    tel: "+66 2266 0123",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "Sireena Italian Restaurant",
    address: "ถนนพัฒนาการ แขวง สวนหลวง เขต สวนหลวง กรุงเทพมหานคร 10250",
    tel: "+66 84 115 8888",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "SENSI",
    address: "Soi Naradhiwas, Rajanagarindra 17, Thung Maha Mek, Sathon, Bangkok 10120, Thailand",
    tel: "+66 2117 1618",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Siwilai City Club",
    address: "Level 5, Central Embassy, 1031 Ploenchit Road, Pathumwan, Bangkok 10330, Thailand",
    tel: "+66 2160 5630",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "SORRENTO",
    address: "ซ.สาธร10 บางรัก กทม. สาทร กรุงเทพมหานคร 10500",
    tel: "+66 2234 9933",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "SUHRING",
    address: "10, Yen Akat Soi 3, Chongnonsi, Yannawa, Bangkok 10120",
    tel: "+66 2287 1799",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "SUSHI NIO",
    address: "ถนน เลียบคลองประปา คลองเกลือ, ปากเกร็ด, นนทบุรี 11120",
    tel: "+66 87 544 4488",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "THE OWL SOCIETY GASTROBAR",
    address: "8/1 ซอย สุขุมวิท 61 แขวง คลองตันเหนือ เขตคลองเตย กรุงเทพมหานคร 10110",
    tel: "",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "THE PENINSULA HOTELS",
    address: "333 Charoennakorn Road, Klongsan, Bangkok 10600, Thailand",
    tel: "+66 2 020 2888",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "THE ST. REGIS BANGKOK",
    address: "159 Rajadamri Road, Bangkok, 10330, Thailand",
    tel: "+66 2207 7777",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "THE SUKOSOL",
    address: "477 ถนนศรีอยุธยา แขวงถนนพญาไท เขตราชเทวี กรุงเทพฯ 10400 ประเทศไทย",
    tel: "+66 2247 0123",
    city: "Bangkok",
    category: "hotel"
  },
  {
    name: "THONKRUENG RESTAURANT",
    address: "211/3 Sukhumvit 49/13, Klongton-nua, Wattana Bangkok 10110",
    tel: "+66 2185 3072",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "TreeCreeper",
    address: "Khwaeng Silom, Khet Bang Rak, Krung Thep Maha Nakhon 10500",
    tel: "+66 2636 2525",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "THYME EATERY & BAR",
    address: "411/2 ถ.นางลิ้นจี่ ช่องนนทรี ยานนาวา กรุงเทพมหานคร 10120",
    tel: "+66 2678 1333",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "Tony's Steak House",
    address: "หมู่บ้านสัมมากร สุขาภิบาล3 เลขที่244/10 ซอย21 กรุงเทพมหานคร 10250",
    tel: "+66 84 421 9336",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "VINO DI ZANOTTI",
    address: "399 Nanglychee 9, Chong Nonsi, Yan Nawa, Bangkok, Thailand",
    tel: "+66 2678 0577",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "Vogue Lounge",
    address: "MahaNakhon CUBE, 6th Floor, 96 Narathiwat Ratchanakharin Road, Silom, Bangrak, Bangkok, 10500, Thailand",
    tel: "+66 2001 0697",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "WINE DIGEST",
    address: "The Manor 39, 32/1 Sukhumvit 39 Watthana, Bangkok 10110, Thailand",
    tel: "+66 2662 4072",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "WARP Thonglor",
    address: "Thonglor Road, Khlong Tan Nuea, Watthana, Bangkok 10110",
    tel: "+66 65 513 8399",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "Wine de Bella",
    address: "72/46 Moo 3  Amphoe Pak Kret, Chang Wat Nonthaburi 11120, Thailand",
    tel: "+66 93 243 4488",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "Wishbeer",
    address: "1491 SUKHUMVIT ROAD ENTRANCE ON SUKHUMVIT SOI 67",
    tel: "+66 2392 14038",
    city: "Bangkok",
    category: "bar"
  },
  {
    name: "ZANOTTI IL RISTORANTE",
    address: "Saladaeng Colonnade Condominium 1st Floor, 21/2 Silom Rd., Silom, Bangrak, Bangkok 10500, Thailand",
    tel: "+66 2636 0002",
    city: "Bangkok",
    category: "restaurant"
  },
  {
    name: "661 SILOM",
    address: "Baan Silom Building 3, 661, Room A3, B3, Silom Rd., Silom, Bangrak, Bangkok 10500, Thailand",
    tel: "+66 2266 8661",
    city: "Bangkok",
    category: "restaurant"
  },
  // Ayutthaya
  {
    name: "The Summer House",
    address: "71/1 moo 6 koh rean, Ayuthaya, Thailand 13000",
    tel: "+6694 224 2223",
    city: "Ayutthaya",
    category: "restaurant"
  },
  // Chiang Mai
  {
    name: "DADDY'S PIZZA & RESTAURANT",
    address: "147/2 Chang Klan Road A.Muang Chiang Mai, Thailand 50000",
    tel: "+668 5073 5746",
    city: "Chiang Mai",
    category: "restaurant"
  },
  {
    name: "STREET PIZZA AND THE WINE HOUSE",
    address: "Tha Phae Rd, Mueang Chiang Mai District, Chiang Mai 50300",
    tel: "+668 5073 5746",
    city: "Chiang Mai",
    category: "bar"
  },
  // Hua Hin
  {
    name: "ANDREAS ITALIAN RESTAURANT AND GRILL",
    address: "4/91 Soi Mooban Nongkae, Nong Kae, Ampur Hua Hin, Prachuap Khiri Khan 77110",
    tel: "+669 9910 1018",
    city: "Hua Hin",
    category: "restaurant"
  },
  // Phuket
  {
    name: "B-LAY TONG RESORT",
    address: "198 Taveewong Rd., Patong, Kathu, Phuket, 83150 Thailand",
    tel: "+66 7634 4999",
    city: "Phuket",
    category: "hotel"
  },
  {
    name: "LUCA CINI",
    address: "Boat Avenue, 49/15 Bandon-Cherngtalay Road, Cherngtalay, Thalang, Phuket 83110",
    tel: "+66 94 804 4461",
    city: "Phuket",
    category: "bar"
  },
  {
    name: "PHUKET FANTASEA",
    address: "99 Moo 3 Kamala Kathu Phuket 83150 Thailand",
    tel: "+66 76 385 111",
    city: "Phuket",
    category: "retail"
  },
  // Rayong
  {
    name: "BARI LAMAI RESORT",
    address: "124/2 Moo 6, Soi Laem Mae Pim, Tambon Klang, Muang, Rayong, 2116 Thailand",
    tel: "+66 3864 7234",
    city: "Rayong",
    category: "hotel"
  },
  // Pattaya
  {
    name: "Gian's Italian Restaurant",
    address: "306/89 Chateau Dale Plaza 12 Thap Phraya, Bang Lamung District, Chon Buri 20150 Thailand",
    tel: "+66 3836 4934",
    city: "Pattaya",
    category: "restaurant"
  }
];

async function main() {
  console.log(`Logging in to Directus at ${DIRECTUS_URL}...`);
  const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!loginRes.ok) {
    throw new Error(`Authentication failed: ${loginRes.statusText}`);
  }

  const payload = await loginRes.json();
  const token = payload.data.access_token;
  console.log('Authenticated successfully!');

  // 1. Check if collection exists
  console.log(`Checking if collection '${COLLECTION_NAME}' exists...`);
  const collectionsRes = await fetch(`${DIRECTUS_URL}/collections/${COLLECTION_NAME}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (collectionsRes.ok) {
    console.log(`Collection '${COLLECTION_NAME}' already exists. Deleting it to start clean...`);
    const deleteColRes = await fetch(`${DIRECTUS_URL}/collections/${COLLECTION_NAME}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!deleteColRes.ok) {
      throw new Error(`Failed to delete collection: ${await deleteColRes.text()}`);
    }
    console.log(`Collection '${COLLECTION_NAME}' deleted successfully.`);
  }

  console.log(`Creating collection '${COLLECTION_NAME}'...`);
  // Create collection
  const createColRes = await fetch(`${DIRECTUS_URL}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      collection: COLLECTION_NAME,
      meta: {
        display_template: "{{name}}",
        icon: "place",
        note: "Locations, restaurants, hotels, and partners where Estella Wine is available in Thailand."
      },
      schema: {}
    })
  });

  if (!createColRes.ok) {
    throw new Error(`Failed to create collection: ${await createColRes.text()}`);
  }
  console.log(`Collection '${COLLECTION_NAME}' created successfully.`);

  // Create fields
  const fields = [
    {
      field: "name",
      type: "string",
      meta: { interface: "input", width: "full", required: true }
    },
    {
      field: "address",
      type: "text",
      meta: { interface: "textarea", width: "full", required: true }
    },
    {
      field: "tel",
      type: "string",
      meta: { interface: "input", width: "half" }
    },
    {
      field: "city",
      type: "string",
      meta: { interface: "input", width: "half" }
    },
    {
      field: "category",
      type: "string",
      meta: {
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Hotel & Resort", value: "hotel" },
            { text: "Restaurant", value: "restaurant" },
            { text: "Wine Bar & Cafe", value: "bar" },
            { text: "Retail & Other", value: "retail" }
          ]
        },
        width: "half"
      }
    },
    {
      field: "google_map_url",
      type: "text",
      meta: { interface: "input", width: "full" }
    }
  ];

  for (const fieldDef of fields) {
    console.log(`Creating field '${fieldDef.field}'...`);
    const createFieldRes = await fetch(`${DIRECTUS_URL}/fields/${COLLECTION_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(fieldDef)
    });

    if (!createFieldRes.ok) {
      throw new Error(`Failed to create field '${fieldDef.field}': ${await createFieldRes.text()}`);
    }
  }
  console.log("All fields created successfully.");

  // Configure public read permissions
  console.log("Configuring public read permissions...");
  const grantPermRes = await fetch(`${DIRECTUS_URL}/permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      collection: COLLECTION_NAME,
      action: "read",
      permissions: {},
      validation: {},
      fields: ["*"],
      policy: "abf8a154-5b1c-4a46-ac9c-7300570f4f17"
    })
  });

  if (!grantPermRes.ok) {
    console.error(`⚠️ Failed to configure permissions automatically: ${await grantPermRes.text()}. Please configure public read access to '${COLLECTION_NAME}' in Directus admin dashboard.`);
  } else {
    console.log("Public read permissions granted successfully.");
  }

  // 2. Clear old items and import fresh items
  console.log("Fetching existing items to clear...");
  const getItemsRes = await fetch(`${DIRECTUS_URL}/items/${COLLECTION_NAME}?limit=-1`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (getItemsRes.ok) {
    const existingItems = await getItemsRes.json();
    if (existingItems.data && existingItems.data.length > 0) {
      const idsToDelete = existingItems.data.map(item => item.id);
      console.log(`Deleting ${idsToDelete.length} existing items...`);
      const deleteRes = await fetch(`${DIRECTUS_URL}/items/${COLLECTION_NAME}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(idsToDelete)
      });
      if (deleteRes.ok) {
        console.log("Existing items cleared.");
      } else {
        console.warn(`⚠️ Failed to clear existing items: ${await deleteRes.text()}`);
      }
    }
  }

  console.log(`Importing ${locations.length} locations...`);
  // Generate map links and prepare payloads
  const importPayload = locations.map(loc => {
    const mapQuery = `${loc.name}, ${loc.address}`;
    const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    return {
      ...loc,
      google_map_url: googleMapUrl
    };
  });

  // Batch insert items (Directus allows batch insert by passing an array of objects)
  const batchSize = 50;
  for (let i = 0; i < importPayload.length; i += batchSize) {
    const chunk = importPayload.slice(i, i + batchSize);
    console.log(`Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(importPayload.length / batchSize)} (${chunk.length} items)...`);
    
    const insertRes = await fetch(`${DIRECTUS_URL}/items/${COLLECTION_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(chunk)
    });

    if (!insertRes.ok) {
      throw new Error(`Failed to insert batch starting at index ${i}: ${await insertRes.text()}`);
    }
  }

  console.log("🎉 Locations import completed successfully!");
}

main().catch(error => {
  console.error("❌ Import failed with error:", error);
  process.exit(1);
});
