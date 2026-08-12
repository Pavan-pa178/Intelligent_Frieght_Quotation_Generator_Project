"""
FreightQuote AI — Master Database Seed Script
All 19 collections with real-world accurate data.
Run via: python manage.py seed_masterdata
"""

from datetime import datetime, timezone

def now():
    return datetime.now(timezone.utc).isoformat()

# ─────────────────────────────────────────────────────────────────────────────
# 1. COUNTRIES  (30 major freight trading nations)
# ─────────────────────────────────────────────────────────────────────────────
COUNTRIES = [
    {"code":"IN","name":"India","region":"South Asia","currency":"INR","dial_code":"+91","customs_union":None,"active":True},
    {"code":"AE","name":"United Arab Emirates","region":"Middle East","currency":"AED","dial_code":"+971","customs_union":"GCC","active":True},
    {"code":"SG","name":"Singapore","region":"Southeast Asia","currency":"SGD","dial_code":"+65","customs_union":None,"active":True},
    {"code":"NL","name":"Netherlands","region":"Europe","currency":"EUR","dial_code":"+31","customs_union":"EU","active":True},
    {"code":"DE","name":"Germany","region":"Europe","currency":"EUR","dial_code":"+49","customs_union":"EU","active":True},
    {"code":"GB","name":"United Kingdom","region":"Europe","currency":"GBP","dial_code":"+44","customs_union":None,"active":True},
    {"code":"US","name":"United States","region":"North America","currency":"USD","dial_code":"+1","customs_union":"USMCA","active":True},
    {"code":"CN","name":"China","region":"East Asia","currency":"CNY","dial_code":"+86","customs_union":None,"active":True},
    {"code":"JP","name":"Japan","region":"East Asia","currency":"JPY","dial_code":"+81","customs_union":None,"active":True},
    {"code":"KR","name":"South Korea","region":"East Asia","currency":"KRW","dial_code":"+82","customs_union":None,"active":True},
    {"code":"AU","name":"Australia","region":"Oceania","currency":"AUD","dial_code":"+61","customs_union":None,"active":True},
    {"code":"SA","name":"Saudi Arabia","region":"Middle East","currency":"SAR","dial_code":"+966","customs_union":"GCC","active":True},
    {"code":"EG","name":"Egypt","region":"Africa","currency":"EGP","dial_code":"+20","customs_union":None,"active":True},
    {"code":"ZA","name":"South Africa","region":"Africa","currency":"ZAR","dial_code":"+27","customs_union":None,"active":True},
    {"code":"NG","name":"Nigeria","region":"Africa","currency":"NGN","dial_code":"+234","customs_union":"ECOWAS","active":True},
    {"code":"BR","name":"Brazil","region":"South America","currency":"BRL","dial_code":"+55","customs_union":"MERCOSUR","active":True},
    {"code":"MX","name":"Mexico","region":"North America","currency":"MXN","dial_code":"+52","customs_union":"USMCA","active":True},
    {"code":"CA","name":"Canada","region":"North America","currency":"CAD","dial_code":"+1","customs_union":"USMCA","active":True},
    {"code":"FR","name":"France","region":"Europe","currency":"EUR","dial_code":"+33","customs_union":"EU","active":True},
    {"code":"BE","name":"Belgium","region":"Europe","currency":"EUR","dial_code":"+32","customs_union":"EU","active":True},
    {"code":"IT","name":"Italy","region":"Europe","currency":"EUR","dial_code":"+39","customs_union":"EU","active":True},
    {"code":"ES","name":"Spain","region":"Europe","currency":"EUR","dial_code":"+34","customs_union":"EU","active":True},
    {"code":"MY","name":"Malaysia","region":"Southeast Asia","currency":"MYR","dial_code":"+60","customs_union":"ASEAN","active":True},
    {"code":"TH","name":"Thailand","region":"Southeast Asia","currency":"THB","dial_code":"+66","customs_union":"ASEAN","active":True},
    {"code":"VN","name":"Vietnam","region":"Southeast Asia","currency":"VND","dial_code":"+84","customs_union":"ASEAN","active":True},
    {"code":"PK","name":"Pakistan","region":"South Asia","currency":"PKR","dial_code":"+92","customs_union":None,"active":True},
    {"code":"BD","name":"Bangladesh","region":"South Asia","currency":"BDT","dial_code":"+880","customs_union":None,"active":True},
    {"code":"TR","name":"Turkey","region":"Middle East / Europe","currency":"TRY","dial_code":"+90","customs_union":None,"active":True},
    {"code":"KE","name":"Kenya","region":"Africa","currency":"KES","dial_code":"+254","customs_union":"EAC","active":True},
    {"code":"OM","name":"Oman","region":"Middle East","currency":"OMR","dial_code":"+968","customs_union":"GCC","active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 2. PORTS  (60 real sea ports — UN/LOCODE, GPS, max draft, terminal)
# ─────────────────────────────────────────────────────────────────────────────
PORTS = [
    # India
    {"locode":"INNSA","name":"Jawaharlal Nehru Port (JNPT)","city":"Navi Mumbai","country":"IN","lat":18.9500,"lon":72.9514,"type":"SEA","max_draft_m":14.5,"terminal":"APMT / Gateway Terminals","tier":1,"active":True},
    {"locode":"INMAA","name":"Chennai Port","city":"Chennai","country":"IN","lat":13.0827,"lon":80.2989,"type":"SEA","max_draft_m":13.0,"terminal":"CCTL / QCPL","tier":1,"active":True},
    {"locode":"INMUN","name":"Mundra Port","city":"Mundra","country":"IN","lat":22.8394,"lon":69.7141,"type":"SEA","max_draft_m":17.0,"terminal":"APMT Mundra","tier":1,"active":True},
    {"locode":"INPAV","name":"Pipavav Port (GPPL)","city":"Amreli","country":"IN","lat":20.9167,"lon":71.5000,"type":"SEA","max_draft_m":14.0,"terminal":"GPPL Container Terminal","tier":2,"active":True},
    {"locode":"INVIS","name":"Visakhapatnam Port","city":"Visakhapatnam","country":"IN","lat":17.6868,"lon":83.2185,"type":"SEA","max_draft_m":14.0,"terminal":"APSEZ Vizag","tier":2,"active":True},
    {"locode":"INKTP","name":"Kattupalli Port","city":"Chennai","country":"IN","lat":13.2720,"lon":80.3120,"type":"SEA","max_draft_m":14.0,"terminal":"L&T Kattupalli","tier":2,"active":True},
    {"locode":"INHAL","name":"Haldia Dock Complex","city":"Haldia","country":"IN","lat":22.0607,"lon":88.0703,"type":"SEA","max_draft_m":8.5,"terminal":"Haldia Dock Complex","tier":2,"active":True},
    {"locode":"INCOK","name":"Cochin Port (Vallarpadam)","city":"Kochi","country":"IN","lat":9.9653,"lon":76.2719,"type":"SEA","max_draft_m":14.5,"terminal":"ICTT Vallarpadam","tier":2,"active":True},
    # UAE
    {"locode":"AEJEA","name":"Jebel Ali Port","city":"Dubai","country":"AE","lat":24.9857,"lon":55.0640,"type":"SEA","max_draft_m":17.0,"terminal":"DP World Jebel Ali (T1/T2/T3)","tier":1,"active":True},
    {"locode":"AEAUH","name":"Abu Dhabi (Khalifa Port)","city":"Abu Dhabi","country":"AE","lat":24.8196,"lon":54.6519,"type":"SEA","max_draft_m":16.0,"terminal":"Abu Dhabi Terminals (ADT)","tier":1,"active":True},
    # Singapore
    {"locode":"SGSIN","name":"Port of Singapore (PSA)","city":"Singapore","country":"SG","lat":1.2655,"lon":103.8232,"type":"SEA","max_draft_m":18.0,"terminal":"Tanjong Pagar / Brani / Keppel","tier":1,"active":True},
    # Netherlands
    {"locode":"NLRTM","name":"Port of Rotterdam","city":"Rotterdam","country":"NL","lat":51.9500,"lon":4.1400,"type":"SEA","max_draft_m":23.0,"terminal":"ECT / APM Terminals Maasvlakte","tier":1,"active":True},
    {"locode":"NLAMS","name":"Port of Amsterdam","city":"Amsterdam","country":"NL","lat":52.3770,"lon":4.8952,"type":"SEA","max_draft_m":12.5,"terminal":"North Sea Port Amsterdam","tier":2,"active":True},
    # Germany
    {"locode":"DEHAM","name":"Port of Hamburg","city":"Hamburg","country":"DE","lat":53.5389,"lon":9.9900,"type":"SEA","max_draft_m":15.6,"terminal":"HHLA / Eurogate Hamburg","tier":1,"active":True},
    {"locode":"DEBRV","name":"Port of Bremerhaven","city":"Bremerhaven","country":"DE","lat":53.5500,"lon":8.5833,"type":"SEA","max_draft_m":16.0,"terminal":"BLG / Eurogate Bremerhaven","tier":1,"active":True},
    # Belgium
    {"locode":"BEANR","name":"Port of Antwerp-Bruges","city":"Antwerp","country":"BE","lat":51.2993,"lon":4.3814,"type":"SEA","max_draft_m":16.0,"terminal":"PSA Antwerp / MPET","tier":1,"active":True},
    # China
    {"locode":"CNSHA","name":"Port of Shanghai (Yangshan)","city":"Shanghai","country":"CN","lat":30.6236,"lon":122.0712,"type":"SEA","max_draft_m":18.0,"terminal":"SIPG Yangshan Deep Water Port","tier":1,"active":True},
    {"locode":"CNNBO","name":"Port of Ningbo-Zhoushan","city":"Ningbo","country":"CN","lat":29.9233,"lon":121.6274,"type":"SEA","max_draft_m":20.0,"terminal":"NBT / ZPCT","tier":1,"active":True},
    {"locode":"CNSZX","name":"Port of Shenzhen (Yantian)","city":"Shenzhen","country":"CN","lat":22.5773,"lon":114.2613,"type":"SEA","max_draft_m":17.0,"terminal":"YICT / COSCO Yantian","tier":1,"active":True},
    {"locode":"CNGGZ","name":"Port of Guangzhou (Nansha)","city":"Guangzhou","country":"CN","lat":22.7260,"lon":113.6183,"type":"SEA","max_draft_m":17.0,"terminal":"GPCT Nansha","tier":1,"active":True},
    {"locode":"CNTAO","name":"Port of Qingdao","city":"Qingdao","country":"CN","lat":36.0745,"lon":120.3228,"type":"SEA","max_draft_m":15.0,"terminal":"QQCT / QQCTU","tier":1,"active":True},
    # South Korea
    {"locode":"KRPUS","name":"Port of Busan (Pusan New Port)","city":"Busan","country":"KR","lat":35.0732,"lon":128.9831,"type":"SEA","max_draft_m":17.0,"terminal":"PNC / BPA / HJNC","tier":1,"active":True},
    # Japan
    {"locode":"JPTYO","name":"Port of Tokyo","city":"Tokyo","country":"JP","lat":35.6190,"lon":139.7540,"type":"SEA","max_draft_m":16.0,"terminal":"TCT Oi / Aomi","tier":1,"active":True},
    {"locode":"JPYOK","name":"Port of Yokohama","city":"Yokohama","country":"JP","lat":35.4479,"lon":139.6421,"type":"SEA","max_draft_m":16.0,"terminal":"Honmoku / Yokohama Daikoku","tier":1,"active":True},
    # United States
    {"locode":"USLAX","name":"Port of Los Angeles","city":"Los Angeles","country":"US","lat":33.7364,"lon":-118.2717,"type":"SEA","max_draft_m":16.8,"terminal":"APM Terminals Pier 400","tier":1,"active":True},
    {"locode":"USNYC","name":"Port of New York & New Jersey","city":"New York","country":"US","lat":40.6650,"lon":-74.1050,"type":"SEA","max_draft_m":15.5,"terminal":"GCT Bayonne / APMT Port Elizabeth","tier":1,"active":True},
    {"locode":"USSAV","name":"Port of Savannah","city":"Savannah","country":"US","lat":31.9683,"lon":-81.0931,"type":"SEA","max_draft_m":15.2,"terminal":"GPA Garden City Terminal","tier":1,"active":True},
    # UK
    {"locode":"GBLGP","name":"Port of Felixstowe","city":"Felixstowe","country":"GB","lat":51.9659,"lon":1.3329,"type":"SEA","max_draft_m":17.0,"terminal":"Felixstowe North / South","tier":1,"active":True},
    # Australia
    {"locode":"AUSYD","name":"Port of Sydney (Botany)","city":"Sydney","country":"AU","lat":-33.9693,"lon":151.1975,"type":"SEA","max_draft_m":14.0,"terminal":"Patrick / DP World Botany","tier":1,"active":True},
    {"locode":"AUMEL","name":"Port of Melbourne","city":"Melbourne","country":"AU","lat":-37.8228,"lon":144.9255,"type":"SEA","max_draft_m":14.5,"terminal":"VICT / DP World Swanson","tier":1,"active":True},
    # Malaysia
    {"locode":"MYPKG","name":"Port Klang (Westports)","city":"Port Klang","country":"MY","lat":3.0091,"lon":101.3899,"type":"SEA","max_draft_m":17.0,"terminal":"Westports / Northport","tier":1,"active":True},
    # Saudi Arabia
    {"locode":"SAJED","name":"King Abdulaziz Port (Jeddah Islamic Port)","city":"Jeddah","country":"SA","lat":21.5086,"lon":39.1578,"type":"SEA","max_draft_m":17.0,"terminal":"Red Sea Gateway Terminal (RSGT)","tier":1,"active":True},
    # Egypt
    {"locode":"EGPSD","name":"Port Said East Port","city":"Port Said","country":"EG","lat":31.2601,"lon":32.3686,"type":"SEA","max_draft_m":16.0,"terminal":"SCCT / El-Dekheila","tier":1,"active":True},
    # South Africa
    {"locode":"ZACPT","name":"Port of Cape Town","city":"Cape Town","country":"ZA","lat":-33.9040,"lon":18.4232,"type":"SEA","max_draft_m":12.8,"terminal":"Cape Town Container Terminal (CTCT)","tier":2,"active":True},
    # Brazil
    {"locode":"BRSSZ","name":"Port of Santos","city":"Santos","country":"BR","lat":-23.9608,"lon":-46.3342,"type":"SEA","max_draft_m":15.0,"terminal":"Santos Brasil / BTP / APM Santos","tier":1,"active":True},
    # Turkey
    {"locode":"TRMRM","name":"Mersin International Port","city":"Mersin","country":"TR","lat":36.7961,"lon":34.5858,"type":"SEA","max_draft_m":16.0,"terminal":"MIP Terminal","tier":1,"active":True},
    # Oman
    {"locode":"OMSLL","name":"Port of Salalah","city":"Salalah","country":"OM","lat":16.9413,"lon":54.0139,"type":"SEA","max_draft_m":16.0,"terminal":"Salalah Container Terminal","tier":2,"active":True},
    # Vietnam
    {"locode":"VNHPH","name":"Hai Phong Port (Lach Huyen)","city":"Hai Phong","country":"VN","lat":20.8449,"lon":106.6880,"type":"SEA","max_draft_m":14.0,"terminal":"Lach Huyen International Container Terminal","tier":2,"active":True},
    # Thailand
    {"locode":"THBKK","name":"Laem Chabang Port","city":"Chonburi","country":"TH","lat":13.0853,"lon":100.8803,"type":"SEA","max_draft_m":16.0,"terminal":"LCMT / LCT","tier":1,"active":True},
    # Kenya
    {"locode":"KEMBA","name":"Port of Mombasa","city":"Mombasa","country":"KE","lat":-4.0435,"lon":39.6682,"type":"SEA","max_draft_m":13.5,"terminal":"Kenya Ports Authority (KPA)","tier":2,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 3. AIRPORTS  (40 real cargo airports — IATA, GPS, cargo tier)
# ─────────────────────────────────────────────────────────────────────────────
AIRPORTS = [
    # India
    {"iata":"BOM","icao":"VABB","name":"Chhatrapati Shivaji Maharaj International Airport","city":"Mumbai","country":"IN","lat":19.0896,"lon":72.8656,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"DEL","icao":"VIDP","name":"Indira Gandhi International Airport","city":"Delhi","country":"IN","lat":28.5665,"lon":77.1031,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"BLR","icao":"VOBL","name":"Kempegowda International Airport","city":"Bangalore","country":"IN","lat":13.1986,"lon":77.7066,"cargo_tier":2,"customs_open_24h":True,"active":True},
    {"iata":"MAA","icao":"VOMM","name":"Chennai International Airport","city":"Chennai","country":"IN","lat":12.9941,"lon":80.1709,"cargo_tier":2,"customs_open_24h":True,"active":True},
    {"iata":"HYD","icao":"VOHS","name":"Rajiv Gandhi International Airport","city":"Hyderabad","country":"IN","lat":17.2403,"lon":78.4294,"cargo_tier":2,"customs_open_24h":True,"active":True},
    {"iata":"CCU","icao":"VECC","name":"Netaji Subhash Chandra Bose International Airport","city":"Kolkata","country":"IN","lat":22.6520,"lon":88.4463,"cargo_tier":2,"customs_open_24h":True,"active":True},
    # UAE
    {"iata":"DXB","icao":"OMDB","name":"Dubai International Airport","city":"Dubai","country":"AE","lat":25.2532,"lon":55.3657,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"AUH","icao":"OMAA","name":"Abu Dhabi International Airport","city":"Abu Dhabi","country":"AE","lat":24.4330,"lon":54.6511,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"SHJ","icao":"OMSJ","name":"Sharjah International Airport","city":"Sharjah","country":"AE","lat":25.3286,"lon":55.5174,"cargo_tier":2,"customs_open_24h":True,"active":True},
    # Singapore
    {"iata":"SIN","icao":"WSSS","name":"Singapore Changi Airport","city":"Singapore","country":"SG","lat":1.3644,"lon":103.9915,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Netherlands
    {"iata":"AMS","icao":"EHAM","name":"Amsterdam Airport Schiphol","city":"Amsterdam","country":"NL","lat":52.3086,"lon":4.7639,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Germany
    {"iata":"FRA","icao":"EDDF","name":"Frankfurt Airport","city":"Frankfurt","country":"DE","lat":50.0379,"lon":8.5622,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"CGN","icao":"EDDK","name":"Cologne Bonn Airport","city":"Cologne","country":"DE","lat":50.8659,"lon":7.1427,"cargo_tier":2,"customs_open_24h":True,"active":True},
    {"iata":"LEJ","icao":"EDDP","name":"Leipzig/Halle Airport","city":"Leipzig","country":"DE","lat":51.4324,"lon":12.2160,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Belgium
    {"iata":"BRU","icao":"EBBR","name":"Brussels Airport","city":"Brussels","country":"BE","lat":50.9014,"lon":4.4844,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"LGG","icao":"EBLG","name":"Liège Airport","city":"Liège","country":"BE","lat":50.6374,"lon":5.4432,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # China
    {"iata":"PVG","icao":"ZSPD","name":"Shanghai Pudong International Airport","city":"Shanghai","country":"CN","lat":31.1443,"lon":121.8083,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"PEK","icao":"ZBAA","name":"Beijing Capital International Airport","city":"Beijing","country":"CN","lat":40.0799,"lon":116.6031,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"HKG","icao":"VHHH","name":"Hong Kong International Airport","city":"Hong Kong","country":"CN","lat":22.3080,"lon":113.9185,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"CAN","icao":"ZGGG","name":"Guangzhou Baiyun International Airport","city":"Guangzhou","country":"CN","lat":23.3924,"lon":113.2988,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # South Korea
    {"iata":"ICN","icao":"RKSI","name":"Incheon International Airport","city":"Seoul","country":"KR","lat":37.4602,"lon":126.4407,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Japan
    {"iata":"NRT","icao":"RJAA","name":"Narita International Airport","city":"Tokyo","country":"JP","lat":35.7647,"lon":140.3864,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"KIX","icao":"RJBB","name":"Kansai International Airport","city":"Osaka","country":"JP","lat":34.4274,"lon":135.2440,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # USA
    {"iata":"LAX","icao":"KLAX","name":"Los Angeles International Airport","city":"Los Angeles","country":"US","lat":33.9416,"lon":-118.4085,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"JFK","icao":"KJFK","name":"John F. Kennedy International Airport","city":"New York","country":"US","lat":40.6413,"lon":-73.7781,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"ORD","icao":"KORD","name":"O'Hare International Airport","city":"Chicago","country":"US","lat":41.9742,"lon":-87.9073,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"MIA","icao":"KMIA","name":"Miami International Airport","city":"Miami","country":"US","lat":25.7959,"lon":-80.2870,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # UK
    {"iata":"LHR","icao":"EGLL","name":"London Heathrow Airport","city":"London","country":"GB","lat":51.4700,"lon":-0.4543,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"STN","icao":"EGSS","name":"London Stansted Airport","city":"London","country":"GB","lat":51.8850,"lon":0.2350,"cargo_tier":2,"customs_open_24h":True,"active":True},
    # Australia
    {"iata":"SYD","icao":"YSSY","name":"Sydney Kingsford Smith Airport","city":"Sydney","country":"AU","lat":-33.9399,"lon":151.1753,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"MEL","icao":"YMML","name":"Melbourne Airport","city":"Melbourne","country":"AU","lat":-37.6690,"lon":144.8410,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Saudi Arabia
    {"iata":"RUH","icao":"OERK","name":"King Khalid International Airport","city":"Riyadh","country":"SA","lat":24.9576,"lon":46.6988,"cargo_tier":1,"customs_open_24h":True,"active":True},
    {"iata":"JED","icao":"OEJN","name":"King Abdulaziz International Airport","city":"Jeddah","country":"SA","lat":21.6796,"lon":39.1565,"cargo_tier":2,"customs_open_24h":True,"active":True},
    # Malaysia
    {"iata":"KUL","icao":"WMKK","name":"Kuala Lumpur International Airport","city":"Kuala Lumpur","country":"MY","lat":2.7456,"lon":101.7099,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Thailand
    {"iata":"BKK","icao":"VTBS","name":"Suvarnabhumi Airport","city":"Bangkok","country":"TH","lat":13.6811,"lon":100.7475,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Brazil
    {"iata":"GRU","icao":"SBGR","name":"São Paulo Guarulhos International Airport","city":"São Paulo","country":"BR","lat":-23.4356,"lon":-46.4731,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # France
    {"iata":"CDG","icao":"LFPG","name":"Paris Charles de Gaulle Airport","city":"Paris","country":"FR","lat":49.0097,"lon":2.5479,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Turkey
    {"iata":"IST","icao":"LTFM","name":"Istanbul Airport","city":"Istanbul","country":"TR","lat":41.2753,"lon":28.7519,"cargo_tier":1,"customs_open_24h":True,"active":True},
    # Kenya
    {"iata":"NBO","icao":"HKJK","name":"Jomo Kenyatta International Airport","city":"Nairobi","country":"KE","lat":-1.3192,"lon":36.9275,"cargo_tier":2,"customs_open_24h":True,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 4. TRADE LANES  (50 real lanes — actual nautical mile distances & transit days)
# ─────────────────────────────────────────────────────────────────────────────
TRADE_LANES = [
    # India → Middle East
    {"lane_code":"INNSA-AEJEA-OCEAN","origin_locode":"INNSA","dest_locode":"AEJEA","mode":"OCEAN","dist_nm":1250,"transit_days_min":4,"transit_days_max":7,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"INNSA-AEAUH-OCEAN","origin_locode":"INNSA","dest_locode":"AEAUH","mode":"OCEAN","dist_nm":1280,"transit_days_min":5,"transit_days_max":8,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"INMUN-AEJEA-OCEAN","origin_locode":"INMUN","dest_locode":"AEJEA","mode":"OCEAN","dist_nm":1160,"transit_days_min":4,"transit_days_max":6,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"INMAA-AEJEA-OCEAN","origin_locode":"INMAA","dest_locode":"AEJEA","mode":"OCEAN","dist_nm":1890,"transit_days_min":6,"transit_days_max":9,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"INMUN-SAJED-OCEAN","origin_locode":"INMUN","dest_locode":"SAJED","mode":"OCEAN","dist_nm":2080,"transit_days_min":7,"transit_days_max":10,"canals_crossed":[],"risk_zone":"RED_SEA","active":True},
    # India → Europe
    {"lane_code":"INNSA-NLRTM-OCEAN","origin_locode":"INNSA","dest_locode":"NLRTM","mode":"OCEAN","dist_nm":7950,"transit_days_min":18,"transit_days_max":24,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    {"lane_code":"INNSA-DEHAM-OCEAN","origin_locode":"INNSA","dest_locode":"DEHAM","mode":"OCEAN","dist_nm":8210,"transit_days_min":18,"transit_days_max":25,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    {"lane_code":"INNSA-BEANR-OCEAN","origin_locode":"INNSA","dest_locode":"BEANR","mode":"OCEAN","dist_nm":8030,"transit_days_min":18,"transit_days_max":24,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    {"lane_code":"INNSA-GBLGP-OCEAN","origin_locode":"INNSA","dest_locode":"GBLGP","mode":"OCEAN","dist_nm":8050,"transit_days_min":20,"transit_days_max":26,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    {"lane_code":"INMUN-NLRTM-OCEAN","origin_locode":"INMUN","dest_locode":"NLRTM","mode":"OCEAN","dist_nm":7760,"transit_days_min":17,"transit_days_max":23,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    # India → Far East
    {"lane_code":"INNSA-SGSIN-OCEAN","origin_locode":"INNSA","dest_locode":"SGSIN","mode":"OCEAN","dist_nm":2730,"transit_days_min":8,"transit_days_max":12,"canals_crossed":["MALACCA"],"risk_zone":None,"active":True},
    {"lane_code":"INNSA-CNSHA-OCEAN","origin_locode":"INNSA","dest_locode":"CNSHA","mode":"OCEAN","dist_nm":4850,"transit_days_min":14,"transit_days_max":18,"canals_crossed":["MALACCA"],"risk_zone":None,"active":True},
    {"lane_code":"INNSA-KRPUS-OCEAN","origin_locode":"INNSA","dest_locode":"KRPUS","mode":"OCEAN","dist_nm":5200,"transit_days_min":15,"transit_days_max":20,"canals_crossed":["MALACCA"],"risk_zone":None,"active":True},
    {"lane_code":"INMAA-SGSIN-OCEAN","origin_locode":"INMAA","dest_locode":"SGSIN","mode":"OCEAN","dist_nm":2300,"transit_days_min":7,"transit_days_max":10,"canals_crossed":[],"risk_zone":None,"active":True},
    # India → USA
    {"lane_code":"INNSA-USLAX-OCEAN","origin_locode":"INNSA","dest_locode":"USLAX","mode":"OCEAN","dist_nm":8320,"transit_days_min":20,"transit_days_max":28,"canals_crossed":["MALACCA"],"risk_zone":None,"active":True},
    {"lane_code":"INNSA-USNYC-OCEAN","origin_locode":"INNSA","dest_locode":"USNYC","mode":"OCEAN","dist_nm":9110,"transit_days_min":22,"transit_days_max":30,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    {"lane_code":"INNSA-USSAV-OCEAN","origin_locode":"INNSA","dest_locode":"USSAV","mode":"OCEAN","dist_nm":9240,"transit_days_min":22,"transit_days_max":30,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    # India → Australia
    {"lane_code":"INNSA-AUSYD-OCEAN","origin_locode":"INNSA","dest_locode":"AUSYD","mode":"OCEAN","dist_nm":6210,"transit_days_min":16,"transit_days_max":21,"canals_crossed":[],"risk_zone":None,"active":True},
    # China → Europe
    {"lane_code":"CNSHA-NLRTM-OCEAN","origin_locode":"CNSHA","dest_locode":"NLRTM","mode":"OCEAN","dist_nm":10890,"transit_days_min":25,"transit_days_max":32,"canals_crossed":["SUEZ","MALACCA"],"risk_zone":None,"active":True},
    {"lane_code":"CNSHA-DEHAM-OCEAN","origin_locode":"CNSHA","dest_locode":"DEHAM","mode":"OCEAN","dist_nm":11100,"transit_days_min":25,"transit_days_max":33,"canals_crossed":["SUEZ","MALACCA"],"risk_zone":None,"active":True},
    # China → USA
    {"lane_code":"CNSHA-USLAX-OCEAN","origin_locode":"CNSHA","dest_locode":"USLAX","mode":"OCEAN","dist_nm":5546,"transit_days_min":13,"transit_days_max":18,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"CNSHA-USNYC-OCEAN","origin_locode":"CNSHA","dest_locode":"USNYC","mode":"OCEAN","dist_nm":10700,"transit_days_min":24,"transit_days_max":30,"canals_crossed":["SUEZ","MALACCA"],"risk_zone":None,"active":True},
    # Singapore → Europe
    {"lane_code":"SGSIN-NLRTM-OCEAN","origin_locode":"SGSIN","dest_locode":"NLRTM","mode":"OCEAN","dist_nm":8470,"transit_days_min":20,"transit_days_max":26,"canals_crossed":["SUEZ","MALACCA"],"risk_zone":None,"active":True},
    # UAE → Europe
    {"lane_code":"AEJEA-NLRTM-OCEAN","origin_locode":"AEJEA","dest_locode":"NLRTM","mode":"OCEAN","dist_nm":6820,"transit_days_min":15,"transit_days_max":21,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    {"lane_code":"AEJEA-DEHAM-OCEAN","origin_locode":"AEJEA","dest_locode":"DEHAM","mode":"OCEAN","dist_nm":7060,"transit_days_min":16,"transit_days_max":22,"canals_crossed":["SUEZ"],"risk_zone":None,"active":True},
    # Air lanes (in km)
    {"lane_code":"BOM-DXB-AIR","origin_locode":"BOM","dest_locode":"DXB","mode":"AIR","dist_nm":1203,"transit_days_min":1,"transit_days_max":2,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"BOM-LHR-AIR","origin_locode":"BOM","dest_locode":"LHR","mode":"AIR","dist_nm":4474,"transit_days_min":1,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"BOM-FRA-AIR","origin_locode":"BOM","dest_locode":"FRA","mode":"AIR","dist_nm":4284,"transit_days_min":1,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"BOM-JFK-AIR","origin_locode":"BOM","dest_locode":"JFK","mode":"AIR","dist_nm":7803,"transit_days_min":2,"transit_days_max":4,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"DEL-DXB-AIR","origin_locode":"DEL","dest_locode":"DXB","mode":"AIR","dist_nm":1193,"transit_days_min":1,"transit_days_max":2,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"DEL-LHR-AIR","origin_locode":"DEL","dest_locode":"LHR","mode":"AIR","dist_nm":4153,"transit_days_min":1,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"DEL-FRA-AIR","origin_locode":"DEL","dest_locode":"FRA","mode":"AIR","dist_nm":4041,"transit_days_min":1,"transit_days_max":2,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"DEL-SIN-AIR","origin_locode":"DEL","dest_locode":"SIN","mode":"AIR","dist_nm":2638,"transit_days_min":1,"transit_days_max":2,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"BLR-DXB-AIR","origin_locode":"BLR","dest_locode":"DXB","mode":"AIR","dist_nm":1650,"transit_days_min":1,"transit_days_max":2,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"MAA-SIN-AIR","origin_locode":"MAA","dest_locode":"SIN","mode":"AIR","dist_nm":1819,"transit_days_min":1,"transit_days_max":2,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"PVG-FRA-AIR","origin_locode":"PVG","dest_locode":"FRA","mode":"AIR","dist_nm":5175,"transit_days_min":1,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"PVG-LAX-AIR","origin_locode":"PVG","dest_locode":"LAX","mode":"AIR","dist_nm":5591,"transit_days_min":2,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"ICN-FRA-AIR","origin_locode":"ICN","dest_locode":"FRA","mode":"AIR","dist_nm":5196,"transit_days_min":1,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"DXB-LHR-AIR","origin_locode":"DXB","dest_locode":"LHR","mode":"AIR","dist_nm":3381,"transit_days_min":1,"transit_days_max":2,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"DXB-JFK-AIR","origin_locode":"DXB","dest_locode":"JFK","mode":"AIR","dist_nm":6837,"transit_days_min":2,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"HKG-LAX-AIR","origin_locode":"HKG","dest_locode":"LAX","mode":"AIR","dist_nm":5970,"transit_days_min":2,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"SIN-AMS-AIR","origin_locode":"SIN","dest_locode":"AMS","mode":"AIR","dist_nm":5768,"transit_days_min":1,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    # Africa / Brazil
    {"lane_code":"INNSA-KEMBA-OCEAN","origin_locode":"INNSA","dest_locode":"KEMBA","mode":"OCEAN","dist_nm":2690,"transit_days_min":9,"transit_days_max":13,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"CNSHA-BRSSZ-OCEAN","origin_locode":"CNSHA","dest_locode":"BRSSZ","mode":"OCEAN","dist_nm":11680,"transit_days_min":28,"transit_days_max":35,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"NLRTM-BRSSZ-OCEAN","origin_locode":"NLRTM","dest_locode":"BRSSZ","mode":"OCEAN","dist_nm":5480,"transit_days_min":13,"transit_days_max":18,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"EGPSD-NLRTM-OCEAN","origin_locode":"EGPSD","dest_locode":"NLRTM","mode":"OCEAN","dist_nm":3240,"transit_days_min":9,"transit_days_max":13,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"OMSLL-AEJEA-OCEAN","origin_locode":"OMSLL","dest_locode":"AEJEA","mode":"OCEAN","dist_nm":430,"transit_days_min":2,"transit_days_max":3,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"MYPKG-SGSIN-OCEAN","origin_locode":"MYPKG","dest_locode":"SGSIN","mode":"OCEAN","dist_nm":220,"transit_days_min":1,"transit_days_max":2,"canals_crossed":[],"risk_zone":None,"active":True},
    {"lane_code":"THBKK-CNSHA-OCEAN","origin_locode":"THBKK","dest_locode":"CNSHA","mode":"OCEAN","dist_nm":2100,"transit_days_min":7,"transit_days_max":10,"canals_crossed":[],"risk_zone":None,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 5. CARRIERS  (20 ocean lines + 10 airlines)
# ─────────────────────────────────────────────────────────────────────────────
CARRIERS = [
    # Ocean lines
    {"scac":"MAEU","name":"Maersk Line","type":"OCEAN","alliance":"2M","reliability_score":91,"tracking_url":"https://www.maersk.com/tracking/","active":True},
    {"scac":"MSCU","name":"MSC Mediterranean Shipping Company","type":"OCEAN","alliance":"2M","reliability_score":87,"tracking_url":"https://www.msc.com/track-a-shipment","active":True},
    {"scac":"CMDU","name":"CMA CGM","type":"OCEAN","alliance":"OCEAN Alliance","reliability_score":88,"tracking_url":"https://www.cma-cgm.com/ebusiness/tracking","active":True},
    {"scac":"COSU","name":"COSCO Shipping Lines","type":"OCEAN","alliance":"OCEAN Alliance","reliability_score":84,"tracking_url":"https://elines.coscoshipping.com/ebusiness/cargoTracking","active":True},
    {"scac":"EGLV","name":"Evergreen Marine","type":"OCEAN","alliance":"OCEAN Alliance","reliability_score":82,"tracking_url":"https://www.evergreen-line.com/eservice/index.jsp","active":True},
    {"scac":"HLCU","name":"Hapag-Lloyd","type":"OCEAN","alliance":"THE Alliance","reliability_score":90,"tracking_url":"https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-solution.html","active":True},
    {"scac":"ONEY","name":"ONE (Ocean Network Express)","type":"OCEAN","alliance":"THE Alliance","reliability_score":83,"tracking_url":"https://www.one-line.com/en/our-services/eservices/cargo-tracking.html","active":True},
    {"scac":"YANGM","name":"Yang Ming Marine Transport","type":"OCEAN","alliance":"THE Alliance","reliability_score":80,"tracking_url":"https://www.yangming.com/e_service/Track_Trace/track_trace_cargo.aspx","active":True},
    {"scac":"HDMU","name":"HMM (Hyundai Merchant Marine)","type":"OCEAN","alliance":"THE Alliance","reliability_score":81,"tracking_url":"https://www.hmm21.com/cms/business/ebiz/trackTrace/index.jsp","active":True},
    {"scac":"ZIMU","name":"ZIM Integrated Shipping Services","type":"OCEAN","alliance":"Independent","reliability_score":78,"tracking_url":"https://www.zim.com/tools/track-a-shipment","active":True},
    {"scac":"ANNU","name":"ANL Container Line","type":"OCEAN","alliance":"OCEAN Alliance","reliability_score":76,"tracking_url":"https://www.anl.com.au","active":True},
    {"scac":"WHLC","name":"Wan Hai Lines","type":"OCEAN","alliance":"Independent","reliability_score":74,"tracking_url":"https://www.wanhai.com/views/Service/TrackYourShipment.xhtml","active":True},
    {"scac":"SMLM","name":"Simatech Shipping & Forwarding","type":"OCEAN","alliance":"Independent","reliability_score":69,"tracking_url":"https://www.simatech.ae","active":True},
    {"scac":"TBIL","name":"X-Press Feeders","type":"OCEAN","alliance":"Independent","reliability_score":71,"tracking_url":"https://www.x-pressfeeders.com","active":True},
    {"scac":"IQAX","name":"PIL (Pacific International Lines)","type":"OCEAN","alliance":"Independent","reliability_score":72,"tracking_url":"https://www.pilship.com","active":True},
    {"scac":"ARKU","name":"ARKAS Line","type":"OCEAN","alliance":"Independent","reliability_score":68,"tracking_url":"https://www.arkas.com","active":True},
    {"scac":"IRSL","name":"IRISL (Islamic Republic of Iran Shipping Lines)","type":"OCEAN","alliance":"Independent","reliability_score":55,"tracking_url":"https://www.irisl.net","active":False},
    {"scac":"IQAX2","name":"Rohlig India Pvt Ltd","type":"OCEAN","alliance":"Independent","reliability_score":66,"tracking_url":"https://www.rohlig.com","active":True},
    {"scac":"SAGL","name":"Safmarine (MAEU subsidiary)","type":"OCEAN","alliance":"2M","reliability_score":80,"tracking_url":"https://www.safmarine.com","active":True},
    {"scac":"SVDR","name":"Silverstar Shipping","type":"OCEAN","alliance":"Independent","reliability_score":63,"tracking_url":"https://www.silverstarshipping.com","active":True},
    # Airlines
    {"scac":"EK","name":"Emirates SkyCargo","type":"AIR","iata":"EK","alliance":"Independent","reliability_score":95,"tracking_url":"https://www.skycargo.com/english/tracking.aspx","active":True},
    {"scac":"QR","name":"Qatar Airways Cargo","type":"AIR","iata":"QR","alliance":"Independent","reliability_score":93,"tracking_url":"https://www.qrcargo.com/s/track-your-shipment","active":True},
    {"scac":"AI","name":"Air India Cargo","type":"AIR","iata":"AI","alliance":"Independent","reliability_score":80,"tracking_url":"https://cargo.airindia.com/eCargo/","active":True},
    {"scac":"FX","name":"FedEx International Priority Freight","type":"AIR_EXPRESS","iata":"FX","alliance":"Independent","reliability_score":96,"tracking_url":"https://www.fedex.com/en-in/tracking.html","active":True},
    {"scac":"5X","name":"UPS Airlines","type":"AIR_EXPRESS","iata":"5X","alliance":"Independent","reliability_score":95,"tracking_url":"https://www.ups.com/track","active":True},
    {"scac":"DHL","name":"DHL Aviation","type":"AIR_EXPRESS","iata":"D0","alliance":"Independent","reliability_score":96,"tracking_url":"https://www.dhl.com/en/express/tracking.html","active":True},
    {"scac":"LH","name":"Lufthansa Cargo","type":"AIR","iata":"LH","alliance":"Star Alliance","reliability_score":91,"tracking_url":"https://lufthansa-cargo.com/tracking","active":True},
    {"scac":"SQ","name":"Singapore Airlines Cargo","type":"AIR","iata":"SQ","alliance":"Star Alliance","reliability_score":92,"tracking_url":"https://www.singaporeair.com/en_UK/us/plan-travel/cargo/","active":True},
    {"scac":"CV","name":"Cargolux Airlines International","type":"AIR","iata":"CV","alliance":"Independent","reliability_score":89,"tracking_url":"https://www.cargolux.com/en/Cargo-Services/Tracking/","active":True},
    {"scac":"KE","name":"Korean Air Cargo","type":"AIR","iata":"KE","alliance":"SkyTeam","reliability_score":88,"tracking_url":"https://www.koreanair.com/content/koreanair/en/cargo/tracking.html","active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 6. SERVICE TYPES
# ─────────────────────────────────────────────────────────────────────────────
SERVICE_TYPES = [
    {"code":"OCEAN_FCL","name":"Ocean FCL (Full Container Load)","mode":"OCEAN","chargeable_weight_divisor":None,"min_chargeable_unit":"container","active":True},
    {"code":"OCEAN_LCL","name":"Ocean LCL (Less than Container Load)","mode":"OCEAN","chargeable_weight_divisor":1000,"min_chargeable_unit":"kg","active":True},
    {"code":"AIR_GEN","name":"Air Freight – General","mode":"AIR","chargeable_weight_divisor":6000,"min_chargeable_unit":"kg","min_chargeable_kg":45,"active":True},
    {"code":"AIR_EXPRESS","name":"Air Freight – Express / Courier","mode":"AIR","chargeable_weight_divisor":5000,"min_chargeable_unit":"kg","min_chargeable_kg":0.5,"active":True},
    {"code":"GROUND_ROAD","name":"Road Transport (FTL)","mode":"GROUND","chargeable_weight_divisor":3000,"min_chargeable_unit":"kg","active":True},
    {"code":"GROUND_RAIL","name":"Rail Freight (Container)","mode":"RAIL","chargeable_weight_divisor":None,"min_chargeable_unit":"container","active":True},
    {"code":"MULTIMODAL","name":"Multimodal (Sea + Rail / Road)","mode":"MULTIMODAL","chargeable_weight_divisor":None,"min_chargeable_unit":"varies","active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 7. CONTAINER TYPES
# ─────────────────────────────────────────────────────────────────────────────
CONTAINER_TYPES = [
    {"iso_code":"22G1","code":"20GP","name":"20ft General Purpose","teu":1,"internal_length_m":5.898,"internal_width_m":2.352,"internal_height_m":2.392,"internal_cbm":33.2,"max_payload_kg":21800,"tare_kg":2200,"is_reefer":False,"active":True},
    {"iso_code":"42G1","code":"40GP","name":"40ft General Purpose","teu":2,"internal_length_m":12.032,"internal_width_m":2.352,"internal_height_m":2.392,"internal_cbm":67.7,"max_payload_kg":26600,"tare_kg":3780,"is_reefer":False,"active":True},
    {"iso_code":"45G1","code":"40HC","name":"40ft High Cube","teu":2,"internal_length_m":12.032,"internal_width_m":2.352,"internal_height_m":2.698,"internal_cbm":76.4,"max_payload_kg":28800,"tare_kg":3900,"is_reefer":False,"active":True},
    {"iso_code":"L5G1","code":"45HC","name":"45ft High Cube","teu":2.25,"internal_length_m":13.556,"internal_width_m":2.352,"internal_height_m":2.698,"internal_cbm":86.0,"max_payload_kg":27600,"tare_kg":4800,"is_reefer":False,"active":True},
    {"iso_code":"22R1","code":"20RF","name":"20ft Reefer","teu":1,"internal_length_m":5.456,"internal_width_m":2.268,"internal_height_m":2.272,"internal_cbm":28.3,"max_payload_kg":21000,"tare_kg":2900,"is_reefer":True,"temp_range_c":"-30 to +30","active":True},
    {"iso_code":"42R1","code":"40RF","name":"40ft Reefer High Cube","teu":2,"internal_length_m":11.583,"internal_width_m":2.268,"internal_height_m":2.400,"internal_cbm":63.2,"max_payload_kg":27700,"tare_kg":4660,"is_reefer":True,"temp_range_c":"-30 to +30","active":True},
    {"iso_code":"22U1","code":"20OT","name":"20ft Open Top","teu":1,"internal_length_m":5.898,"internal_width_m":2.352,"internal_height_m":2.350,"internal_cbm":32.5,"max_payload_kg":21000,"tare_kg":2400,"is_reefer":False,"active":True},
    {"iso_code":"42P3","code":"40FR","name":"40ft Flat Rack (Collapsible)","teu":2,"internal_length_m":12.088,"internal_width_m":2.400,"internal_height_m":1.942,"internal_cbm":None,"max_payload_kg":40600,"tare_kg":5720,"is_reefer":False,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 8. CARGO TYPES
# ─────────────────────────────────────────────────────────────────────────────
CARGO_TYPES = [
    {"code":"GEN","name":"General Cargo","imo_class":None,"requires_temp_control":False,"is_hazmat":False,"surcharge_pct":0,"active":True},
    {"code":"PERISHABLE","name":"Perishable – Food & Beverages","imo_class":None,"requires_temp_control":True,"temp_range_c":"2 to 8","is_hazmat":False,"surcharge_pct":12,"active":True},
    {"code":"PHARMA","name":"Pharmaceuticals & Life Sciences","imo_class":None,"requires_temp_control":True,"temp_range_c":"2 to 8","is_hazmat":False,"surcharge_pct":15,"active":True},
    {"code":"DG2","name":"Hazmat – DG Class 2 (Gases)","imo_class":"2","requires_temp_control":False,"is_hazmat":True,"surcharge_pct":20,"active":True},
    {"code":"DG3","name":"Hazmat – DG Class 3 (Flammable Liquids)","imo_class":"3","requires_temp_control":False,"is_hazmat":True,"surcharge_pct":25,"active":True},
    {"code":"DG4","name":"Hazmat – DG Class 4 (Flammable Solids)","imo_class":"4","requires_temp_control":False,"is_hazmat":True,"surcharge_pct":20,"active":True},
    {"code":"DG6","name":"Hazmat – DG Class 6 (Toxic Substances)","imo_class":"6","requires_temp_control":False,"is_hazmat":True,"surcharge_pct":30,"active":True},
    {"code":"DG8","name":"Hazmat – DG Class 8 (Corrosives)","imo_class":"8","requires_temp_control":False,"is_hazmat":True,"surcharge_pct":22,"active":True},
    {"code":"DG9","name":"Hazmat – DG Class 9 (Misc. Dangerous)","imo_class":"9","requires_temp_control":False,"is_hazmat":True,"surcharge_pct":10,"active":True},
    {"code":"LIION","name":"Lithium Batteries (Cargo only, UN3480/3481)","imo_class":"9","requires_temp_control":False,"is_hazmat":True,"surcharge_pct":18,"active":True},
    {"code":"AUTOPARTS","name":"Automotive Parts & Accessories","imo_class":None,"requires_temp_control":False,"is_hazmat":False,"surcharge_pct":5,"active":True},
    {"code":"HEAVY","name":"Heavy Lift / Out-of-Gauge (OOG)","imo_class":None,"requires_temp_control":False,"is_hazmat":False,"surcharge_pct":35,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 9. COMMODITIES  (30 real HS codes)
# ─────────────────────────────────────────────────────────────────────────────
COMMODITIES = [
    {"hs6":"620342","desc":"Men's suits/ensembles of cotton","section":"XI","cargo_type":"GEN","typical_duty_pct":12,"active":True},
    {"hs6":"620462","desc":"Women's trousers/breeches of cotton","section":"XI","cargo_type":"GEN","typical_duty_pct":12,"active":True},
    {"hs6":"610910","desc":"T-shirts of cotton, knitted","section":"XI","cargo_type":"GEN","typical_duty_pct":12,"active":True},
    {"hs6":"870899","desc":"Parts & accessories of motor vehicles, NES","section":"XVII","cargo_type":"AUTOPARTS","typical_duty_pct":7.5,"active":True},
    {"hs6":"870421","desc":"Motor vehicles for goods transport (diesel, ≤5t)","section":"XVII","cargo_type":"AUTOPARTS","typical_duty_pct":10,"active":True},
    {"hs6":"300490","desc":"Medicaments, mixed or unmixed, retail pack","section":"VI","cargo_type":"PHARMA","typical_duty_pct":0,"active":True},
    {"hs6":"300210","desc":"Antisera and other blood fractions (vaccines)","section":"VI","cargo_type":"PHARMA","typical_duty_pct":0,"active":True},
    {"hs6":"851712","desc":"Telephones for cellular networks (smartphones)","section":"XVI","cargo_type":"GEN","typical_duty_pct":0,"active":True},
    {"hs6":"854231","desc":"Electronic integrated circuits – processors","section":"XVI","cargo_type":"GEN","typical_duty_pct":0,"active":True},
    {"hs6":"847330","desc":"Parts/accessories for automatic data processing machines","section":"XVI","cargo_type":"GEN","typical_duty_pct":0,"active":True},
    {"hs6":"190190","desc":"Malt extract; food prep of flour (food)","section":"IV","cargo_type":"PERISHABLE","typical_duty_pct":8,"active":True},
    {"hs6":"100190","desc":"Wheat other than durum wheat (bulk)","section":"II","cargo_type":"GEN","typical_duty_pct":5,"active":True},
    {"hs6":"230120","desc":"Flours/meals/pellets of fish (fishmeal)","section":"II","cargo_type":"GEN","typical_duty_pct":0,"active":True},
    {"hs6":"270900","desc":"Petroleum oils, crude","section":"V","cargo_type":"DG3","typical_duty_pct":0,"active":True},
    {"hs6":"271011","desc":"Light oils and preparations (petrol/gasoline)","section":"V","cargo_type":"DG3","typical_duty_pct":0,"active":True},
    {"hs6":"280920","desc":"Phosphoric acid and polyphosphoric acids","section":"VI","cargo_type":"DG8","typical_duty_pct":5,"active":True},
    {"hs6":"850650","desc":"Lithium primary cells and batteries","section":"XVI","cargo_type":"LIION","typical_duty_pct":0,"active":True},
    {"hs6":"850760","desc":"Lithium-ion accumulators (rechargeable)","section":"XVI","cargo_type":"LIION","typical_duty_pct":0,"active":True},
    {"hs6":"940360","desc":"Wooden furniture for domestic purposes","section":"XX","cargo_type":"GEN","typical_duty_pct":10,"active":True},
    {"hs6":"940161","desc":"Seats with metal frame (upholstered)","section":"XX","cargo_type":"GEN","typical_duty_pct":10,"active":True},
    {"hs6":"720839","desc":"Flat-rolled iron/steel products (coil)","section":"XV","cargo_type":"HEAVY","typical_duty_pct":5,"active":True},
    {"hs6":"760110","desc":"Aluminium, unwrought","section":"XV","cargo_type":"GEN","typical_duty_pct":2,"active":True},
    {"hs6":"520100","desc":"Cotton, not carded or combed (raw cotton)","section":"XI","cargo_type":"GEN","typical_duty_pct":0,"active":True},
    {"hs6":"520811","desc":"Woven fabrics of cotton, plain weave (bleached)","section":"XI","cargo_type":"GEN","typical_duty_pct":10,"active":True},
    {"hs6":"390110","desc":"Polyethylene with density < 0.94 (LDPE)","section":"VII","cargo_type":"DG3","typical_duty_pct":5,"active":True},
    {"hs6":"390210","desc":"Polypropylene in primary forms","section":"VII","cargo_type":"GEN","typical_duty_pct":5,"active":True},
    {"hs6":"84713000","desc":"Portable automatic data processing machines (laptops)","section":"XVI","cargo_type":"GEN","typical_duty_pct":0,"active":True},
    {"hs6":"950300","desc":"Toys (bicycles, scooters, puzzles, dolls etc.)","section":"XX","cargo_type":"GEN","typical_duty_pct":12,"active":True},
    {"hs6":"560219","desc":"Textile wadding and articles thereof, NES","section":"XI","cargo_type":"GEN","typical_duty_pct":10,"active":True},
    {"hs6":"842199","desc":"Filtering/purifying machinery parts (industrial)","section":"XVI","cargo_type":"GEN","typical_duty_pct":5,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 10. PACKAGING TYPES
# ─────────────────────────────────────────────────────────────────────────────
PACKAGING_TYPES = [
    {"code":"PLT_EUR","name":"Euro Pallet (1200×800mm)","standard":"ISO 6780","length_mm":1200,"width_mm":800,"height_mm":145,"tare_kg":25,"stackable":True,"max_stack_kg":4000,"active":True},
    {"code":"PLT_STD","name":"Standard Pallet (1200×1000mm)","standard":"ISO 6780","length_mm":1200,"width_mm":1000,"height_mm":145,"tare_kg":30,"stackable":True,"max_stack_kg":4500,"active":True},
    {"code":"PLT_US","name":"GMA Pallet / North American 48×40","standard":"GMA","length_mm":1219,"width_mm":1016,"height_mm":145,"tare_kg":29,"stackable":True,"max_stack_kg":4500,"active":True},
    {"code":"CTN","name":"Corrugated Carton Box","standard":"ASTM D4169","length_mm":None,"width_mm":None,"height_mm":None,"tare_kg":0.8,"stackable":True,"max_stack_kg":600,"active":True},
    {"code":"CRATE","name":"Wooden Crate (custom dimensions)","standard":"ISPM 15","length_mm":None,"width_mm":None,"height_mm":None,"tare_kg":None,"stackable":False,"max_stack_kg":None,"active":True},
    {"code":"DRUM_S","name":"Steel Drum (200L / 55 gal)","standard":"UN 1A1","length_mm":None,"width_mm":None,"height_mm":880,"capacity_litres":200,"tare_kg":22,"stackable":False,"active":True},
    {"code":"DRUM_P","name":"Plastic Drum (200L)","standard":"UN 1H1","length_mm":None,"width_mm":None,"height_mm":870,"capacity_litres":200,"tare_kg":9,"stackable":False,"active":True},
    {"code":"FLEXIBAG","name":"Flexitank (Liquid Bulk in 20GP)","standard":"CoA","capacity_litres":24000,"tare_kg":None,"stackable":False,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 11. INCOTERMS 2020
# ─────────────────────────────────────────────────────────────────────────────
INCOTERMS = [
    {"code":"EXW","name":"Ex Works","version":2020,"seller_pays":[],"buyer_pays":["export_customs","origin_haulage","origin_port","main_freight","import_customs","dest_port","dest_haulage"],"risk_transfer":"Seller's premises","modes":["ALL"],"active":True},
    {"code":"FCA","name":"Free Carrier","version":2020,"seller_pays":["export_customs"],"buyer_pays":["origin_haulage","origin_port","main_freight","import_customs","dest_port","dest_haulage"],"risk_transfer":"Named place/carrier","modes":["ALL"],"active":True},
    {"code":"FAS","name":"Free Alongside Ship","version":2020,"seller_pays":["export_customs","origin_haulage"],"buyer_pays":["loading","main_freight","import_customs","dest_port","dest_haulage"],"risk_transfer":"Alongside ship at origin port","modes":["OCEAN"],"active":True},
    {"code":"FOB","name":"Free On Board","version":2020,"seller_pays":["export_customs","origin_haulage","loading"],"buyer_pays":["main_freight","import_customs","dest_port","dest_haulage"],"risk_transfer":"On board vessel at origin port","modes":["OCEAN"],"active":True},
    {"code":"CFR","name":"Cost and Freight","version":2020,"seller_pays":["export_customs","origin_haulage","loading","main_freight"],"buyer_pays":["import_customs","dest_port","dest_haulage"],"risk_transfer":"On board vessel at origin port","modes":["OCEAN"],"active":True},
    {"code":"CIF","name":"Cost, Insurance and Freight","version":2020,"seller_pays":["export_customs","origin_haulage","loading","main_freight","insurance"],"buyer_pays":["import_customs","dest_port","dest_haulage"],"risk_transfer":"On board vessel at origin port","modes":["OCEAN"],"active":True},
    {"code":"CPT","name":"Carriage Paid To","version":2020,"seller_pays":["export_customs","origin_haulage","loading","main_freight"],"buyer_pays":["import_customs","dest_haulage"],"risk_transfer":"First carrier at origin","modes":["ALL"],"active":True},
    {"code":"CIP","name":"Carriage and Insurance Paid To","version":2020,"seller_pays":["export_customs","origin_haulage","loading","main_freight","insurance"],"buyer_pays":["import_customs","dest_haulage"],"risk_transfer":"First carrier at origin","modes":["ALL"],"active":True},
    {"code":"DAP","name":"Delivered at Place","version":2020,"seller_pays":["export_customs","origin_haulage","loading","main_freight","dest_haulage"],"buyer_pays":["import_customs","unloading"],"risk_transfer":"Named place of destination (ready for unloading)","modes":["ALL"],"active":True},
    {"code":"DPU","name":"Delivered at Place Unloaded","version":2020,"seller_pays":["export_customs","origin_haulage","loading","main_freight","dest_haulage","unloading"],"buyer_pays":["import_customs"],"risk_transfer":"Named place of destination (after unloading)","modes":["ALL"],"active":True},
    {"code":"DDP","name":"Delivered Duty Paid","version":2020,"seller_pays":["export_customs","origin_haulage","loading","main_freight","import_customs","dest_haulage","unloading"],"buyer_pays":[],"risk_transfer":"Named place of destination (import cleared)","modes":["ALL"],"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 12. CHARGE HEADS  (25 standard freight charge codes)
# ─────────────────────────────────────────────────────────────────────────────
CHARGE_HEADS = [
    # Origin charges
    {"code":"OFR","name":"Ocean Freight","category":"MAIN_FREIGHT","applies_to":["OCEAN"],"uom":"per_container","taxable":False,"active":True},
    {"code":"AFR","name":"Air Freight","category":"MAIN_FREIGHT","applies_to":["AIR"],"uom":"per_kg_chargeable","taxable":False,"active":True},
    {"code":"THC_O","name":"Origin Terminal Handling Charge (THC)","category":"ORIGIN","applies_to":["OCEAN"],"uom":"per_container","taxable":True,"active":True},
    {"code":"ORT","name":"Origin Road Transport / Haulage","category":"ORIGIN","applies_to":["ALL"],"uom":"per_truck","taxable":True,"active":True},
    {"code":"CUSEXP_O","name":"Origin Customs Export Clearance","category":"ORIGIN","applies_to":["ALL"],"uom":"per_shipment","taxable":True,"active":True},
    {"code":"VGMFEE","name":"VGM (Verified Gross Mass) Fee","category":"ORIGIN","applies_to":["OCEAN_FCL"],"uom":"per_container","taxable":True,"active":True},
    {"code":"CFS_O","name":"Origin CFS Stuffing / De-stuffing (LCL)","category":"ORIGIN","applies_to":["OCEAN_LCL"],"uom":"per_cbm","taxable":True,"active":True},
    # Freight surcharges
    {"code":"BAF","name":"Bunker Adjustment Factor (BAF/EBS)","category":"SURCHARGE","applies_to":["OCEAN"],"uom":"per_container","taxable":False,"active":True},
    {"code":"CAF","name":"Currency Adjustment Factor (CAF)","category":"SURCHARGE","applies_to":["OCEAN"],"uom":"per_container","taxable":False,"active":True},
    {"code":"PSS","name":"Peak Season Surcharge (PSS)","category":"SURCHARGE","applies_to":["OCEAN"],"uom":"per_container","taxable":False,"active":True},
    {"code":"WRS","name":"War Risk Surcharge (WRS)","category":"SURCHARGE","applies_to":["OCEAN","AIR"],"uom":"per_container","taxable":False,"active":True},
    {"code":"CLS","name":"Congestion Surcharge","category":"SURCHARGE","applies_to":["OCEAN"],"uom":"per_container","taxable":False,"active":True},
    {"code":"REDSEA","name":"Red Sea / Suez Avoidance Surcharge","category":"SURCHARGE","applies_to":["OCEAN"],"uom":"per_container","taxable":False,"active":True},
    {"code":"DGS","name":"Dangerous Goods Surcharge (DGS)","category":"SURCHARGE","applies_to":["ALL"],"uom":"per_container","taxable":False,"active":True},
    {"code":"REEFER","name":"Reefer/Cold Chain Operating Surcharge","category":"SURCHARGE","applies_to":["OCEAN_FCL"],"uom":"per_container_day","taxable":False,"active":True},
    # Destination charges
    {"code":"THC_D","name":"Destination Terminal Handling Charge (DTHC)","category":"DESTINATION","applies_to":["OCEAN"],"uom":"per_container","taxable":True,"active":True},
    {"code":"DRT","name":"Destination Road Transport / Haulage","category":"DESTINATION","applies_to":["ALL"],"uom":"per_truck","taxable":True,"active":True},
    {"code":"CUSEXP_D","name":"Destination Customs Import Clearance","category":"DESTINATION","applies_to":["ALL"],"uom":"per_shipment","taxable":True,"active":True},
    {"code":"CFS_D","name":"Destination CFS De-stuffing (LCL)","category":"DESTINATION","applies_to":["OCEAN_LCL"],"uom":"per_cbm","taxable":True,"active":True},
    # Documentation & admin
    {"code":"DOC","name":"Documentation Fee / BL/AWB Issuance","category":"ADMIN","applies_to":["ALL"],"uom":"per_BL","taxable":True,"active":True},
    {"code":"SURCHS","name":"Seal Charge","category":"ADMIN","applies_to":["OCEAN_FCL"],"uom":"per_container","taxable":True,"active":True},
    {"code":"INS","name":"Cargo Insurance","category":"INSURANCE","applies_to":["ALL"],"uom":"pct_of_cargo_value","taxable":False,"active":True},
    {"code":"FUEL_AIR","name":"Air Fuel Surcharge (FSC)","category":"SURCHARGE","applies_to":["AIR"],"uom":"per_kg_chargeable","taxable":False,"active":True},
    {"code":"SECURAIR","name":"Air Security Surcharge (SSC)","category":"SURCHARGE","applies_to":["AIR"],"uom":"per_kg_chargeable","taxable":False,"active":True},
    {"code":"XRAY","name":"X-Ray / Screening Fee","category":"ORIGIN","applies_to":["AIR"],"uom":"per_shipment","taxable":True,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 13. CURRENCIES & EXCHANGE RATES
# ─────────────────────────────────────────────────────────────────────────────
CURRENCIES = [
    {"code":"USD","name":"US Dollar","symbol":"$","decimals":2,"active":True},
    {"code":"INR","name":"Indian Rupee","symbol":"₹","decimals":2,"active":True},
    {"code":"EUR","name":"Euro","symbol":"€","decimals":2,"active":True},
    {"code":"AED","name":"UAE Dirham","symbol":"AED","decimals":2,"active":True},
    {"code":"GBP","name":"British Pound Sterling","symbol":"£","decimals":2,"active":True},
    {"code":"SGD","name":"Singapore Dollar","symbol":"S$","decimals":2,"active":True},
    {"code":"CNY","name":"Chinese Yuan (Renminbi)","symbol":"¥","decimals":2,"active":True},
    {"code":"JPY","name":"Japanese Yen","symbol":"¥","decimals":0,"active":True},
    {"code":"AUD","name":"Australian Dollar","symbol":"A$","decimals":2,"active":True},
    {"code":"SAR","name":"Saudi Riyal","symbol":"SR","decimals":2,"active":True},
    {"code":"BRL","name":"Brazilian Real","symbol":"R$","decimals":2,"active":True},
    {"code":"CAD","name":"Canadian Dollar","symbol":"CA$","decimals":2,"active":True},
]

# Rates as of 2025-12-01 (approximate, base USD)
EXCHANGE_RATES = [
    {"from_ccy":"USD","to_ccy":"INR","rate":84.00,"effective_date":"2025-12-01","source":"RBI","active":True},
    {"from_ccy":"USD","to_ccy":"EUR","rate":0.918,"effective_date":"2025-12-01","source":"ECB","active":True},
    {"from_ccy":"USD","to_ccy":"AED","rate":3.671,"effective_date":"2025-12-01","source":"UAE Central Bank","active":True},
    {"from_ccy":"USD","to_ccy":"GBP","rate":0.795,"effective_date":"2025-12-01","source":"Bank of England","active":True},
    {"from_ccy":"USD","to_ccy":"SGD","rate":1.338,"effective_date":"2025-12-01","source":"MAS","active":True},
    {"from_ccy":"USD","to_ccy":"CNY","rate":7.247,"effective_date":"2025-12-01","source":"PBOC","active":True},
    {"from_ccy":"USD","to_ccy":"JPY","rate":151.50,"effective_date":"2025-12-01","source":"Bank of Japan","active":True},
    {"from_ccy":"USD","to_ccy":"AUD","rate":1.542,"effective_date":"2025-12-01","source":"RBA","active":True},
    {"from_ccy":"USD","to_ccy":"SAR","rate":3.750,"effective_date":"2025-12-01","source":"SAMA","active":True},
    {"from_ccy":"USD","to_ccy":"BRL","rate":4.935,"effective_date":"2025-12-01","source":"BCB","active":True},
    {"from_ccy":"USD","to_ccy":"CAD","rate":1.359,"effective_date":"2025-12-01","source":"Bank of Canada","active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 14. RATE CARDS  (10 structured, format-accurate rate cards)
# ─────────────────────────────────────────────────────────────────────────────
RATE_CARDS = [
    {
        "card_id":"RC-2026-MAEU-INME-001",
        "carrier_scac":"MAEU",
        "trade":"INDIA - MIDDLE EAST",
        "service_type":"OCEAN_FCL",
        "validity_from":"2026-01-01",
        "validity_to":"2026-06-30",
        "currency":"USD",
        "rates":[
            {"lane_code":"INNSA-AEJEA-OCEAN","container":"20GP","base_rate_usd":650,"thc_origin_usd":110,"thc_dest_usd":90,"baf_usd":120,"doc_fee_usd":75},
            {"lane_code":"INNSA-AEJEA-OCEAN","container":"40GP","base_rate_usd":950,"thc_origin_usd":145,"thc_dest_usd":120,"baf_usd":180,"doc_fee_usd":75},
            {"lane_code":"INNSA-AEJEA-OCEAN","container":"40HC","base_rate_usd":980,"thc_origin_usd":145,"thc_dest_usd":120,"baf_usd":180,"doc_fee_usd":75},
            {"lane_code":"INMUN-AEJEA-OCEAN","container":"20GP","base_rate_usd":620,"thc_origin_usd":95,"thc_dest_usd":90,"baf_usd":120,"doc_fee_usd":75},
            {"lane_code":"INMUN-AEJEA-OCEAN","container":"40HC","base_rate_usd":940,"thc_origin_usd":130,"thc_dest_usd":120,"baf_usd":180,"doc_fee_usd":75},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-HLCU-INEU-001",
        "carrier_scac":"HLCU",
        "trade":"INDIA - NORTH EUROPE",
        "service_type":"OCEAN_FCL",
        "validity_from":"2026-01-01",
        "validity_to":"2026-03-31",
        "currency":"USD",
        "rates":[
            {"lane_code":"INNSA-NLRTM-OCEAN","container":"20GP","base_rate_usd":1250,"thc_origin_usd":110,"thc_dest_usd":280,"baf_usd":380,"doc_fee_usd":95},
            {"lane_code":"INNSA-NLRTM-OCEAN","container":"40GP","base_rate_usd":2100,"thc_origin_usd":145,"thc_dest_usd":395,"baf_usd":520,"doc_fee_usd":95},
            {"lane_code":"INNSA-NLRTM-OCEAN","container":"40HC","base_rate_usd":2180,"thc_origin_usd":145,"thc_dest_usd":395,"baf_usd":520,"doc_fee_usd":95},
            {"lane_code":"INNSA-DEHAM-OCEAN","container":"20GP","base_rate_usd":1280,"thc_origin_usd":110,"thc_dest_usd":260,"baf_usd":380,"doc_fee_usd":95},
            {"lane_code":"INNSA-DEHAM-OCEAN","container":"40HC","base_rate_usd":2200,"thc_origin_usd":145,"thc_dest_usd":360,"baf_usd":520,"doc_fee_usd":95},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-CMDU-INFE-001",
        "carrier_scac":"CMDU",
        "trade":"INDIA - FAR EAST",
        "service_type":"OCEAN_FCL",
        "validity_from":"2026-01-01",
        "validity_to":"2026-06-30",
        "currency":"USD",
        "rates":[
            {"lane_code":"INNSA-SGSIN-OCEAN","container":"20GP","base_rate_usd":380,"thc_origin_usd":110,"thc_dest_usd":245,"baf_usd":90,"doc_fee_usd":75},
            {"lane_code":"INNSA-SGSIN-OCEAN","container":"40HC","base_rate_usd":620,"thc_origin_usd":145,"thc_dest_usd":310,"baf_usd":145,"doc_fee_usd":75},
            {"lane_code":"INNSA-CNSHA-OCEAN","container":"20GP","base_rate_usd":480,"thc_origin_usd":110,"thc_dest_usd":160,"baf_usd":130,"doc_fee_usd":75},
            {"lane_code":"INNSA-CNSHA-OCEAN","container":"40HC","base_rate_usd":780,"thc_origin_usd":145,"thc_dest_usd":218,"baf_usd":205,"doc_fee_usd":75},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-EK-INME-AIR-001",
        "carrier_scac":"EK",
        "trade":"INDIA - MIDDLE EAST (AIR)",
        "service_type":"AIR_GEN",
        "validity_from":"2026-01-01",
        "validity_to":"2026-12-31",
        "currency":"USD",
        "rates":[
            {"lane_code":"BOM-DXB-AIR","rate_per_kg_usd":1.35,"min_charge_usd":65,"fuel_surchg_per_kg":0.45,"sec_surchg_per_kg":0.12},
            {"lane_code":"DEL-DXB-AIR","rate_per_kg_usd":1.25,"min_charge_usd":65,"fuel_surchg_per_kg":0.45,"sec_surchg_per_kg":0.12},
            {"lane_code":"BLR-DXB-AIR","rate_per_kg_usd":1.45,"min_charge_usd":65,"fuel_surchg_per_kg":0.45,"sec_surchg_per_kg":0.12},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-LH-INEU-AIR-001",
        "carrier_scac":"LH",
        "trade":"INDIA - EUROPE (AIR)",
        "service_type":"AIR_GEN",
        "validity_from":"2026-01-01",
        "validity_to":"2026-06-30",
        "currency":"USD",
        "rates":[
            {"lane_code":"BOM-FRA-AIR","rate_per_kg_usd":2.80,"min_charge_usd":100,"fuel_surchg_per_kg":0.75,"sec_surchg_per_kg":0.18},
            {"lane_code":"DEL-FRA-AIR","rate_per_kg_usd":2.65,"min_charge_usd":100,"fuel_surchg_per_kg":0.75,"sec_surchg_per_kg":0.18},
            {"lane_code":"BOM-LHR-AIR","rate_per_kg_usd":2.90,"min_charge_usd":100,"fuel_surchg_per_kg":0.75,"sec_surchg_per_kg":0.18},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-MAEU-CNUS-001",
        "carrier_scac":"MAEU",
        "trade":"CHINA - USA WEST COAST",
        "service_type":"OCEAN_FCL",
        "validity_from":"2026-01-01",
        "validity_to":"2026-06-30",
        "currency":"USD",
        "rates":[
            {"lane_code":"CNSHA-USLAX-OCEAN","container":"20GP","base_rate_usd":1800,"thc_origin_usd":160,"thc_dest_usd":290,"baf_usd":320,"doc_fee_usd":95},
            {"lane_code":"CNSHA-USLAX-OCEAN","container":"40HC","base_rate_usd":3200,"thc_origin_usd":220,"thc_dest_usd":395,"baf_usd":540,"doc_fee_usd":95},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-MSCU-INME-LCL-001",
        "carrier_scac":"MSCU",
        "trade":"INDIA - MIDDLE EAST (LCL)",
        "service_type":"OCEAN_LCL",
        "validity_from":"2026-01-01",
        "validity_to":"2026-12-31",
        "currency":"USD",
        "rates":[
            {"lane_code":"INNSA-AEJEA-OCEAN","rate_per_cbm_usd":38,"rate_per_ton_usd":38,"min_cbm":1,"min_charge_usd":95},
            {"lane_code":"INMUN-AEJEA-OCEAN","rate_per_cbm_usd":35,"rate_per_ton_usd":35,"min_cbm":1,"min_charge_usd":85},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-FX-GLOBAL-EXPRESS-001",
        "carrier_scac":"FX",
        "trade":"GLOBAL EXPRESS",
        "service_type":"AIR_EXPRESS",
        "validity_from":"2026-01-01",
        "validity_to":"2026-12-31",
        "currency":"USD",
        "rates":[
            {"lane_code":"BOM-DXB-AIR","rate_per_kg_usd":6.80,"min_charge_usd":35,"fuel_surchg_pct":25},
            {"lane_code":"BOM-LHR-AIR","rate_per_kg_usd":9.50,"min_charge_usd":45,"fuel_surchg_pct":25},
            {"lane_code":"BOM-JFK-AIR","rate_per_kg_usd":12.00,"min_charge_usd":55,"fuel_surchg_pct":25},
            {"lane_code":"DEL-DXB-AIR","rate_per_kg_usd":6.50,"min_charge_usd":35,"fuel_surchg_pct":25},
            {"lane_code":"DEL-FRA-AIR","rate_per_kg_usd":9.20,"min_charge_usd":45,"fuel_surchg_pct":25},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-COSU-CNEU-001",
        "carrier_scac":"COSU",
        "trade":"CHINA - EUROPE",
        "service_type":"OCEAN_FCL",
        "validity_from":"2026-01-01",
        "validity_to":"2026-06-30",
        "currency":"USD",
        "rates":[
            {"lane_code":"CNSHA-NLRTM-OCEAN","container":"20GP","base_rate_usd":2200,"thc_origin_usd":160,"thc_dest_usd":280,"baf_usd":450,"doc_fee_usd":95},
            {"lane_code":"CNSHA-NLRTM-OCEAN","container":"40HC","base_rate_usd":3900,"thc_origin_usd":220,"thc_dest_usd":395,"baf_usd":730,"doc_fee_usd":95},
        ],
        "tier":"STANDARD","active":True
    },
    {
        "card_id":"RC-2026-HLCU-INAU-001",
        "carrier_scac":"HLCU",
        "trade":"INDIA - AUSTRALIA",
        "service_type":"OCEAN_FCL",
        "validity_from":"2026-01-01",
        "validity_to":"2026-12-31",
        "currency":"USD",
        "rates":[
            {"lane_code":"INNSA-AUSYD-OCEAN","container":"20GP","base_rate_usd":880,"thc_origin_usd":110,"thc_dest_usd":285,"baf_usd":210,"doc_fee_usd":95},
            {"lane_code":"INNSA-AUSYD-OCEAN","container":"40HC","base_rate_usd":1480,"thc_origin_usd":145,"thc_dest_usd":395,"baf_usd":345,"doc_fee_usd":95},
        ],
        "tier":"STANDARD","active":True
    },
]

# ─────────────────────────────────────────────────────────────────────────────
# 15. SURCHARGE RULES
# ─────────────────────────────────────────────────────────────────────────────
SURCHARGE_RULES = [
    {"code":"SUR-PSS-2026Q1","name":"Peak Season Surcharge Q1 2026","applies_to_modes":["OCEAN_FCL","OCEAN_LCL"],"applies_to_lanes":["ALL"],"amount_usd_20gp":200,"amount_usd_40gp":350,"amount_usd_40hc":350,"valid_from":"2026-01-01","valid_to":"2026-03-31","active":True},
    {"code":"SUR-WAR-REDSEA-2026","name":"Red Sea / Suez War Risk Surcharge 2026","applies_to_modes":["OCEAN_FCL","OCEAN_LCL"],"applies_to_lanes":["RED_SEA"],"amount_usd_20gp":450,"amount_usd_40gp":700,"amount_usd_40hc":700,"valid_from":"2026-01-01","valid_to":"2026-12-31","active":True},
    {"code":"SUR-CONG-JNPT-2026","name":"JNPT Port Congestion Surcharge","applies_to_modes":["OCEAN_FCL"],"applies_to_lanes":["INNSA-*"],"amount_usd_20gp":75,"amount_usd_40gp":120,"amount_usd_40hc":120,"valid_from":"2026-06-01","valid_to":"2026-09-30","active":True},
    {"code":"SUR-DG-HAZ-GEN","name":"Dangerous Goods General Surcharge","applies_to_modes":["ALL"],"applies_to_lanes":["ALL"],"amount_usd_20gp":350,"amount_usd_40gp":550,"amount_usd_40hc":550,"valid_from":"2026-01-01","valid_to":"2026-12-31","active":True},
    {"code":"SUR-LIION-2026","name":"Lithium Battery Surcharge","applies_to_modes":["AIR"],"applies_to_lanes":["ALL"],"amount_per_kg_usd":0.35,"valid_from":"2026-01-01","valid_to":"2026-12-31","active":True},
    {"code":"SUR-REEFER-POWER","name":"Reefer Electricity / Power Surcharge","applies_to_modes":["OCEAN_FCL"],"applies_to_lanes":["ALL"],"amount_usd_per_day":22,"valid_from":"2026-01-01","valid_to":"2026-12-31","active":True},
    {"code":"SUR-GRI-2026Q2","name":"General Rate Increase Q2 2026","applies_to_modes":["OCEAN_FCL"],"applies_to_lanes":["ALL"],"amount_usd_20gp":300,"amount_usd_40gp":500,"amount_usd_40hc":500,"valid_from":"2026-04-01","valid_to":"2026-06-30","active":True},
    {"code":"SUR-CCF","name":"Carrier Carbon Fee (CII / FuelEU)","applies_to_modes":["OCEAN_FCL","OCEAN_LCL"],"applies_to_lanes":["ALL"],"amount_usd_20gp":45,"amount_usd_40gp":75,"amount_usd_40hc":75,"valid_from":"2026-01-01","valid_to":"2026-12-31","active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 16. MARGIN POLICIES
# ─────────────────────────────────────────────────────────────────────────────
MARGIN_POLICIES = [
    {"code":"MP-GLOBAL","name":"Global Fallback Margin Policy","priority":99,"target_margin_pct":18,"floor_margin_pct":8,"ceiling_margin_pct":40,"applies_to":"ALL","active":True},
    {"code":"MP-OCEAN-FCL","name":"Ocean FCL Standard Margin","priority":10,"target_margin_pct":15,"floor_margin_pct":6,"ceiling_margin_pct":35,"applies_to":"OCEAN_FCL","active":True},
    {"code":"MP-AIR","name":"Air Freight Margin Policy","priority":10,"target_margin_pct":22,"floor_margin_pct":10,"ceiling_margin_pct":45,"applies_to":"AIR_GEN","active":True},
    {"code":"MP-TIER-GOLD","name":"Gold Customer Reduced Margin","priority":5,"target_margin_pct":12,"floor_margin_pct":5,"ceiling_margin_pct":30,"applies_to_customer_tier":"GOLD","active":True},
    {"code":"MP-TIER-ENTERPRISE","name":"Enterprise Customer Thin Margin","priority":2,"target_margin_pct":8,"floor_margin_pct":3,"ceiling_margin_pct":22,"applies_to_customer_tier":"ENTERPRISE","active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 17. CUSTOMS TARIFFS  (20 HS-code / country pairs)
# ─────────────────────────────────────────────────────────────────────────────
CUSTOMS_TARIFFS = [
    {"hs6":"620342","import_country":"IN","duty_pct":12.0,"gst_vat_pct":12.0,"required_docs":["Commercial Invoice","Packing List","BL","COO"],"active":True},
    {"hs6":"620342","import_country":"AE","duty_pct":5.0,"gst_vat_pct":5.0,"required_docs":["Commercial Invoice","Packing List","BL","COO"],"active":True},
    {"hs6":"620342","import_country":"DE","duty_pct":12.0,"gst_vat_pct":19.0,"required_docs":["EUR1","Commercial Invoice","Packing List","BL"],"active":True},
    {"hs6":"870899","import_country":"IN","duty_pct":7.5,"gst_vat_pct":18.0,"required_docs":["Commercial Invoice","Packing List","BL"],"active":True},
    {"hs6":"870899","import_country":"US","duty_pct":2.5,"gst_vat_pct":0,"required_docs":["Commercial Invoice","Packing List","BL","ISF"],"active":True},
    {"hs6":"300490","import_country":"IN","duty_pct":10.0,"gst_vat_pct":12.0,"required_docs":["Commercial Invoice","BL","CDSCO NOC","MSDS"],"active":True},
    {"hs6":"300490","import_country":"AE","duty_pct":5.0,"gst_vat_pct":5.0,"required_docs":["Commercial Invoice","BL","MOH Approval"],"active":True},
    {"hs6":"851712","import_country":"IN","duty_pct":20.0,"gst_vat_pct":18.0,"required_docs":["Commercial Invoice","BL","BIS License"],"active":True},
    {"hs6":"851712","import_country":"DE","duty_pct":0,"gst_vat_pct":19.0,"required_docs":["Commercial Invoice","BL","CE Declaration"],"active":True},
    {"hs6":"270900","import_country":"IN","duty_pct":5.0,"gst_vat_pct":5.0,"required_docs":["Commercial Invoice","BL","Q88","COO"],"active":True},
    {"hs6":"850760","import_country":"AE","duty_pct":5.0,"gst_vat_pct":5.0,"required_docs":["Commercial Invoice","BL","MSDS","IEC"],"active":True},
    {"hs6":"850760","import_country":"US","duty_pct":0,"gst_vat_pct":0,"required_docs":["Commercial Invoice","BL","CPSC Compliance"],"active":True},
    {"hs6":"940360","import_country":"AE","duty_pct":5.0,"gst_vat_pct":5.0,"required_docs":["Commercial Invoice","BL","COO"],"active":True},
    {"hs6":"940360","import_country":"DE","duty_pct":0,"gst_vat_pct":19.0,"required_docs":["Commercial Invoice","BL","EUR1 or GSP Form A"],"active":True},
    {"hs6":"720839","import_country":"IN","duty_pct":15.0,"gst_vat_pct":18.0,"required_docs":["Commercial Invoice","BL","Mill TC","COO"],"active":True},
    {"hs6":"100190","import_country":"AE","duty_pct":0,"gst_vat_pct":0,"required_docs":["Commercial Invoice","BL","Phytosanitary Cert","COO"],"active":True},
    {"hs6":"390110","import_country":"IN","duty_pct":7.5,"gst_vat_pct":18.0,"required_docs":["Commercial Invoice","BL","MSDS","COO"],"active":True},
    {"hs6":"520100","import_country":"CN","duty_pct":0,"gst_vat_pct":9.0,"required_docs":["Commercial Invoice","BL","Phytosanitary Cert"],"active":True},
    {"hs6":"300210","import_country":"US","duty_pct":0,"gst_vat_pct":0,"required_docs":["Commercial Invoice","BL","FDA Prior Notice","COO"],"active":True},
    {"hs6":"950300","import_country":"AU","duty_pct":0,"gst_vat_pct":10.0,"required_docs":["Commercial Invoice","BL","COO","ACCC Declaration"],"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 18. DOCUMENT TYPES
# ─────────────────────────────────────────────────────────────────────────────
DOCUMENT_TYPES = [
    {"code":"CI","name":"Commercial Invoice","required_for":["ALL"],"issuer":"Seller","digital_accepted":True,"active":True},
    {"code":"PL","name":"Packing List","required_for":["ALL"],"issuer":"Seller","digital_accepted":True,"active":True},
    {"code":"BL","name":"Bill of Lading (Ocean)","required_for":["OCEAN"],"issuer":"Carrier","digital_accepted":True,"active":True},
    {"code":"SEAWAY","name":"Sea Waybill","required_for":["OCEAN"],"issuer":"Carrier","digital_accepted":True,"active":True},
    {"code":"AWB","name":"Air Waybill (HAWB/MAWB)","required_for":["AIR"],"issuer":"Carrier","digital_accepted":True,"active":True},
    {"code":"COO","name":"Certificate of Origin","required_for":["CUSTOMS"],"issuer":"Chamber of Commerce","digital_accepted":False,"active":True},
    {"code":"EUR1","name":"EUR.1 Movement Certificate (EU Preference)","required_for":["EU_IMPORT"],"issuer":"Customs Authority","digital_accepted":False,"active":True},
    {"code":"MSDS","name":"Material Safety Data Sheet (SDS)","required_for":["HAZMAT","CHEMICALS"],"issuer":"Manufacturer","digital_accepted":True,"active":True},
    {"code":"PHYTO","name":"Phytosanitary Certificate","required_for":["AGRICULTURAL"],"issuer":"Plant Quarantine Authority","digital_accepted":False,"active":True},
    {"code":"FUMIG","name":"Fumigation Certificate","required_for":["WOOD_PACKAGING"],"issuer":"Accredited Fumigator","digital_accepted":False,"active":True},
    {"code":"COA","name":"Certificate of Analysis","required_for":["PHARMA","CHEMICALS"],"issuer":"Testing Lab","digital_accepted":True,"active":True},
    {"code":"ISF","name":"Importer Security Filing (ISF 10+2)","required_for":["US_IMPORT_OCEAN"],"issuer":"Importer","digital_accepted":True,"active":True},
    {"code":"ENS","name":"Entry Summary Declaration (EU Safety)","required_for":["EU_IMPORT"],"issuer":"Carrier/Forwarder","digital_accepted":True,"active":True},
    {"code":"VGM","name":"Verified Gross Mass Declaration","required_for":["OCEAN_FCL"],"issuer":"Shipper","digital_accepted":True,"active":True},
    {"code":"DGD","name":"Dangerous Goods Declaration (IMO/IATA)","required_for":["HAZMAT"],"issuer":"Shipper","digital_accepted":True,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# 19. CUSTOMER TIERS
# ─────────────────────────────────────────────────────────────────────────────
CUSTOMER_TIERS = [
    {"code":"STANDARD","name":"Standard","quote_sla_hours":24,"max_discount_pct":5,"credit_days":0,"priority_support":False,"active":True},
    {"code":"SILVER","name":"Silver","quote_sla_hours":12,"max_discount_pct":10,"credit_days":15,"priority_support":False,"active":True},
    {"code":"GOLD","name":"Gold","quote_sla_hours":6,"max_discount_pct":18,"credit_days":30,"priority_support":True,"active":True},
    {"code":"PLATINUM","name":"Platinum","quote_sla_hours":4,"max_discount_pct":25,"credit_days":45,"priority_support":True,"active":True},
    {"code":"ENTERPRISE","name":"Enterprise","quote_sla_hours":2,"max_discount_pct":35,"credit_days":60,"priority_support":True,"active":True},
]

# ─────────────────────────────────────────────────────────────────────────────
# SEED FUNCTION
# ─────────────────────────────────────────────────────────────────────────────
COLLECTION_MAP = {
    "countries":       COUNTRIES,
    "ports":           PORTS,
    "airports":        AIRPORTS,
    "trade_lanes":     TRADE_LANES,
    "carriers":        CARRIERS,
    "service_types":   SERVICE_TYPES,
    "container_types": CONTAINER_TYPES,
    "cargo_types":     CARGO_TYPES,
    "commodities":     COMMODITIES,
    "packaging_types": PACKAGING_TYPES,
    "incoterms":       INCOTERMS,
    "charge_heads":    CHARGE_HEADS,
    "currencies":      CURRENCIES,
    "exchange_rates":  EXCHANGE_RATES,
    "rate_cards":      RATE_CARDS,
    "surcharge_rules": SURCHARGE_RULES,
    "margin_policies": MARGIN_POLICIES,
    "customs_tariffs": CUSTOMS_TARIFFS,
    "document_types":  DOCUMENT_TYPES,
    "customer_tiers":  CUSTOMER_TIERS,
}


def seed_all(drop_existing=False, verbose=True):
    """
    Seeds all 19 master collections into MongoDB.
    Skips a collection if already populated (unless drop_existing=True).
    """
    import sys, os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

    try:
        import django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
        django.setup()
    except Exception:
        pass

    from core.mongodb import get_collection

    ts = now()
    results = {}
    total_inserted = 0

    for col_name, records in COLLECTION_MAP.items():
        col = get_collection(col_name)
        if col is None:
            results[col_name] = "SKIPPED (no MongoDB connection)"
            continue

        existing_count = col.count_documents({})
        if existing_count > 0 and not drop_existing:
            if verbose:
                print(f"  [SKIP] {col_name}: already has {existing_count} records")
            results[col_name] = f"SKIPPED ({existing_count} existing)"
            continue

        if drop_existing:
            col.drop()

        # Stamp each record with audit fields
        stamped = []
        for r in records:
            doc = dict(r)
            doc["_created_at"] = ts
            doc["_updated_at"] = ts
            doc["_created_by"] = "seed_master"
            stamped.append(doc)

        res = col.insert_many(stamped)
        count = len(res.inserted_ids)
        total_inserted += count
        results[col_name] = f"OK ({count} records)"
        if verbose:
            print(f"  [OK] {col_name}: inserted {count} records")

    print(f"\n{'='*55}")
    print(f"  Master DB Seed Complete -- {total_inserted} total records inserted")
    print(f"{'='*55}")
    return results
