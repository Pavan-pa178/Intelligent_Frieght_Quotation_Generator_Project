"""
Real-world Master Database Seed for PortLine Freight Engine.
Contains comprehensive master data across Ocean, Standard Air, Express Air, Ground Trucking, and Rail Intermodal.
Populates 19 collections with 534+ production-grade records.
"""

from datetime import datetime, timezone

def now():
    return datetime.now(timezone.utc).isoformat()

COUNTRIES = [
    {
        "code": "IN",
        "name": "India",
        "region": "South Asia",
        "currency": "INR",
        "dial_code": "+91",
        "customs_union": null,
        "active": true
    },
    {
        "code": "AE",
        "name": "United Arab Emirates",
        "region": "Middle East",
        "currency": "AED",
        "dial_code": "+971",
        "customs_union": "GCC",
        "active": true
    },
    {
        "code": "SG",
        "name": "Singapore",
        "region": "Southeast Asia",
        "currency": "SGD",
        "dial_code": "+65",
        "customs_union": null,
        "active": true
    },
    {
        "code": "NL",
        "name": "Netherlands",
        "region": "Europe",
        "currency": "EUR",
        "dial_code": "+31",
        "customs_union": "EU",
        "active": true
    },
    {
        "code": "DE",
        "name": "Germany",
        "region": "Europe",
        "currency": "EUR",
        "dial_code": "+49",
        "customs_union": "EU",
        "active": true
    },
    {
        "code": "GB",
        "name": "United Kingdom",
        "region": "Europe",
        "currency": "GBP",
        "dial_code": "+44",
        "customs_union": null,
        "active": true
    },
    {
        "code": "US",
        "name": "United States",
        "region": "North America",
        "currency": "USD",
        "dial_code": "+1",
        "customs_union": "USMCA",
        "active": true
    },
    {
        "code": "CN",
        "name": "China",
        "region": "East Asia",
        "currency": "CNY",
        "dial_code": "+86",
        "customs_union": null,
        "active": true
    },
    {
        "code": "JP",
        "name": "Japan",
        "region": "East Asia",
        "currency": "JPY",
        "dial_code": "+81",
        "customs_union": null,
        "active": true
    },
    {
        "code": "KR",
        "name": "South Korea",
        "region": "East Asia",
        "currency": "KRW",
        "dial_code": "+82",
        "customs_union": null,
        "active": true
    },
    {
        "code": "AU",
        "name": "Australia",
        "region": "Oceania",
        "currency": "AUD",
        "dial_code": "+61",
        "customs_union": null,
        "active": true
    },
    {
        "code": "SA",
        "name": "Saudi Arabia",
        "region": "Middle East",
        "currency": "SAR",
        "dial_code": "+966",
        "customs_union": "GCC",
        "active": true
    },
    {
        "code": "EG",
        "name": "Egypt",
        "region": "Africa",
        "currency": "EGP",
        "dial_code": "+20",
        "customs_union": null,
        "active": true
    },
    {
        "code": "ZA",
        "name": "South Africa",
        "region": "Africa",
        "currency": "ZAR",
        "dial_code": "+27",
        "customs_union": null,
        "active": true
    },
    {
        "code": "NG",
        "name": "Nigeria",
        "region": "Africa",
        "currency": "NGN",
        "dial_code": "+234",
        "customs_union": "ECOWAS",
        "active": true
    },
    {
        "code": "BR",
        "name": "Brazil",
        "region": "South America",
        "currency": "BRL",
        "dial_code": "+55",
        "customs_union": "MERCOSUR",
        "active": true
    },
    {
        "code": "MX",
        "name": "Mexico",
        "region": "North America",
        "currency": "MXN",
        "dial_code": "+52",
        "customs_union": "USMCA",
        "active": true
    },
    {
        "code": "CA",
        "name": "Canada",
        "region": "North America",
        "currency": "CAD",
        "dial_code": "+1",
        "customs_union": "USMCA",
        "active": true
    },
    {
        "code": "FR",
        "name": "France",
        "region": "Europe",
        "currency": "EUR",
        "dial_code": "+33",
        "customs_union": "EU",
        "active": true
    },
    {
        "code": "BE",
        "name": "Belgium",
        "region": "Europe",
        "currency": "EUR",
        "dial_code": "+32",
        "customs_union": "EU",
        "active": true
    },
    {
        "code": "IT",
        "name": "Italy",
        "region": "Europe",
        "currency": "EUR",
        "dial_code": "+39",
        "customs_union": "EU",
        "active": true
    },
    {
        "code": "ES",
        "name": "Spain",
        "region": "Europe",
        "currency": "EUR",
        "dial_code": "+34",
        "customs_union": "EU",
        "active": true
    },
    {
        "code": "MY",
        "name": "Malaysia",
        "region": "Southeast Asia",
        "currency": "MYR",
        "dial_code": "+60",
        "customs_union": "ASEAN",
        "active": true
    },
    {
        "code": "TH",
        "name": "Thailand",
        "region": "Southeast Asia",
        "currency": "THB",
        "dial_code": "+66",
        "customs_union": "ASEAN",
        "active": true
    },
    {
        "code": "VN",
        "name": "Vietnam",
        "region": "Southeast Asia",
        "currency": "VND",
        "dial_code": "+84",
        "customs_union": "ASEAN",
        "active": true
    },
    {
        "code": "PK",
        "name": "Pakistan",
        "region": "South Asia",
        "currency": "PKR",
        "dial_code": "+92",
        "customs_union": null,
        "active": true
    },
    {
        "code": "BD",
        "name": "Bangladesh",
        "region": "South Asia",
        "currency": "BDT",
        "dial_code": "+880",
        "customs_union": null,
        "active": true
    },
    {
        "code": "TR",
        "name": "Turkey",
        "region": "Middle East / Europe",
        "currency": "TRY",
        "dial_code": "+90",
        "customs_union": null,
        "active": true
    },
    {
        "code": "KE",
        "name": "Kenya",
        "region": "Africa",
        "currency": "KES",
        "dial_code": "+254",
        "customs_union": "EAC",
        "active": true
    },
    {
        "code": "OM",
        "name": "Oman",
        "region": "Middle East",
        "currency": "OMR",
        "dial_code": "+968",
        "customs_union": "GCC",
        "active": true
    }
]

PORTS = [
    {
        "locode": "INNSA",
        "name": "Jawaharlal Nehru Port (JNPT)",
        "city": "Navi Mumbai",
        "country": "IN",
        "lat": 18.95,
        "lon": 72.9514,
        "type": "SEA",
        "max_draft_m": 14.5,
        "terminal": "APMT / Gateway Terminals",
        "tier": 1,
        "active": true
    },
    {
        "locode": "INMAA",
        "name": "Chennai Port",
        "city": "Chennai",
        "country": "IN",
        "lat": 13.0827,
        "lon": 80.2989,
        "type": "SEA",
        "max_draft_m": 13.0,
        "terminal": "CCTL / QCPL",
        "tier": 1,
        "active": true
    },
    {
        "locode": "INMUN",
        "name": "Mundra Port",
        "city": "Mundra",
        "country": "IN",
        "lat": 22.8394,
        "lon": 69.7141,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "APMT Mundra / AICTPL",
        "tier": 1,
        "active": true
    },
    {
        "locode": "INPAV",
        "name": "Pipavav Port (GPPL)",
        "city": "Amreli",
        "country": "IN",
        "lat": 20.9167,
        "lon": 71.5,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "GPPL Container Terminal",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INVIS",
        "name": "Visakhapatnam Port",
        "city": "Visakhapatnam",
        "country": "IN",
        "lat": 17.6868,
        "lon": 83.2185,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "APSEZ Vizag",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INKTP",
        "name": "Kattupalli Port",
        "city": "Chennai",
        "country": "IN",
        "lat": 13.272,
        "lon": 80.312,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "L&T Kattupalli",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INHAL",
        "name": "Haldia Dock Complex",
        "city": "Haldia",
        "country": "IN",
        "lat": 22.0607,
        "lon": 88.0703,
        "type": "SEA",
        "max_draft_m": 8.5,
        "terminal": "Haldia Dock Complex",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INCCU",
        "name": "Kolkata Port (Syama Prasad)",
        "city": "Kolkata",
        "country": "IN",
        "lat": 22.54,
        "lon": 88.32,
        "type": "SEA",
        "max_draft_m": 8.0,
        "terminal": "NSD Netaji Subhash Dock",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INCOK",
        "name": "Cochin Port (Vallarpadam)",
        "city": "Kochi",
        "country": "IN",
        "lat": 9.9653,
        "lon": 76.2719,
        "type": "SEA",
        "max_draft_m": 14.5,
        "terminal": "ICTT Vallarpadam",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INTUT",
        "name": "V.O. Chidambaranar Port (Tuticorin)",
        "city": "Thoothukudi",
        "country": "IN",
        "lat": 8.7642,
        "lon": 78.1348,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "DBGT Tuticorin",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INIXE",
        "name": "New Mangalore Port",
        "city": "Mangalore",
        "country": "IN",
        "lat": 12.9234,
        "lon": 74.819,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "NMPT Container Berth",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INMRM",
        "name": "Mormugao Port",
        "city": "Goa",
        "country": "IN",
        "lat": 15.4137,
        "lon": 73.8016,
        "type": "SEA",
        "max_draft_m": 13.0,
        "terminal": "Mormugao Terminal",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INKRP",
        "name": "Krishnapatnam Port",
        "city": "Nellore",
        "country": "IN",
        "lat": 14.25,
        "lon": 80.12,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "APSEZ Krishnapatnam",
        "tier": 2,
        "active": true
    },
    {
        "locode": "INHZR",
        "name": "Hazira Port",
        "city": "Surat",
        "country": "IN",
        "lat": 21.1167,
        "lon": 72.6333,
        "type": "SEA",
        "max_draft_m": 14.5,
        "terminal": "Adani Hazira Port",
        "tier": 2,
        "active": true
    },
    {
        "locode": "AEJEA",
        "name": "Jebel Ali Port",
        "city": "Dubai",
        "country": "AE",
        "lat": 24.9857,
        "lon": 55.064,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "DP World Jebel Ali (T1/T2/T3)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "AEAUH",
        "name": "Abu Dhabi (Khalifa Port)",
        "city": "Abu Dhabi",
        "country": "AE",
        "lat": 24.8196,
        "lon": 54.6519,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Abu Dhabi Terminals (ADT)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "AEKLF",
        "name": "Khor Fakkan Container Terminal",
        "city": "Sharjah",
        "country": "AE",
        "lat": 25.35,
        "lon": 56.35,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Gulftainer Khor Fakkan",
        "tier": 2,
        "active": true
    },
    {
        "locode": "SAJED",
        "name": "King Abdulaziz Port (Jeddah Islamic)",
        "city": "Jeddah",
        "country": "SA",
        "lat": 21.5086,
        "lon": 39.1578,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "Red Sea Gateway Terminal (RSGT)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "SADMN",
        "name": "King Abdulaziz Port (Dammam)",
        "city": "Dammam",
        "country": "SA",
        "lat": 26.4444,
        "lon": 50.1989,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "SGP Dammam",
        "tier": 1,
        "active": true
    },
    {
        "locode": "OMSLL",
        "name": "Port of Salalah",
        "city": "Salalah",
        "country": "OM",
        "lat": 16.9413,
        "lon": 54.0139,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Salalah Container Terminal",
        "tier": 2,
        "active": true
    },
    {
        "locode": "OMSOH",
        "name": "Port of Sohar",
        "city": "Sohar",
        "country": "OM",
        "lat": 24.4989,
        "lon": 56.6347,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "OICT Sohar",
        "tier": 2,
        "active": true
    },
    {
        "locode": "QAHMD",
        "name": "Hamad Port",
        "city": "Doha",
        "country": "QA",
        "lat": 25.0167,
        "lon": 51.6,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "QTerminals Hamad Port",
        "tier": 1,
        "active": true
    },
    {
        "locode": "KWSWK",
        "name": "Port of Shuwaikh",
        "city": "Kuwait City",
        "country": "KW",
        "lat": 29.35,
        "lon": 47.9333,
        "type": "SEA",
        "max_draft_m": 12.5,
        "terminal": "KPA Shuwaikh",
        "tier": 2,
        "active": true
    },
    {
        "locode": "BHKBS",
        "name": "Khalifa Bin Salman Port",
        "city": "Hidd",
        "country": "BH",
        "lat": 26.1833,
        "lon": 50.6833,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "APMT Bahrain",
        "tier": 2,
        "active": true
    },
    {
        "locode": "SGSIN",
        "name": "Port of Singapore (PSA)",
        "city": "Singapore",
        "country": "SG",
        "lat": 1.2655,
        "lon": 103.8232,
        "type": "SEA",
        "max_draft_m": 18.0,
        "terminal": "Tanjong Pagar / Pasir Panjang / Tuas",
        "tier": 1,
        "active": true
    },
    {
        "locode": "MYPKG",
        "name": "Port Klang (Westports & Northport)",
        "city": "Port Klang",
        "country": "MY",
        "lat": 3.0091,
        "lon": 101.3899,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "Westports / Northport",
        "tier": 1,
        "active": true
    },
    {
        "locode": "MYTPP",
        "name": "Port of Tanjung Pelepas (PTP)",
        "city": "Johor",
        "country": "MY",
        "lat": 1.3667,
        "lon": 103.55,
        "type": "SEA",
        "max_draft_m": 17.5,
        "terminal": "PTP Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "THBKK",
        "name": "Laem Chabang Port",
        "city": "Chonburi",
        "country": "TH",
        "lat": 13.0853,
        "lon": 100.8803,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "LCMT / LCT / TIPS",
        "tier": 1,
        "active": true
    },
    {
        "locode": "VNHPH",
        "name": "Hai Phong Port (Lach Huyen)",
        "city": "Hai Phong",
        "country": "VN",
        "lat": 20.8449,
        "lon": 106.688,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "Lach Huyen International (TC-HICT)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "VNSGN",
        "name": "Ho Chi Minh City (Cat Lai & Cai Mep)",
        "city": "Ho Chi Minh City",
        "country": "VN",
        "lat": 10.75,
        "lon": 106.7833,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Saigon Newport / Cai Mep TCIT",
        "tier": 1,
        "active": true
    },
    {
        "locode": "IDTPP",
        "name": "Tanjung Priok (Jakarta)",
        "city": "Jakarta",
        "country": "ID",
        "lat": -6.1,
        "lon": 106.8833,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "JICT / NPCT1 Jakarta",
        "tier": 1,
        "active": true
    },
    {
        "locode": "PHMNL",
        "name": "Port of Manila (MICT)",
        "city": "Manila",
        "country": "PH",
        "lat": 14.5833,
        "lon": 120.9667,
        "type": "SEA",
        "max_draft_m": 14.5,
        "terminal": "ICTSI MICT Manila",
        "tier": 1,
        "active": true
    },
    {
        "locode": "LKCMB",
        "name": "Port of Colombo",
        "city": "Colombo",
        "country": "LK",
        "lat": 6.95,
        "lon": 79.85,
        "type": "SEA",
        "max_draft_m": 18.0,
        "terminal": "CICT / SAGT / JCT Colombo",
        "tier": 1,
        "active": true
    },
    {
        "locode": "BDCGP",
        "name": "Chattogram Port (Chittagong)",
        "city": "Chittagong",
        "country": "BD",
        "lat": 22.3167,
        "lon": 91.8,
        "type": "SEA",
        "max_draft_m": 9.5,
        "terminal": "CPA Chittagong Container Terminal",
        "tier": 2,
        "active": true
    },
    {
        "locode": "PKKHI",
        "name": "Port of Karachi (KPT & QICT)",
        "city": "Karachi",
        "country": "PK",
        "lat": 24.8,
        "lon": 66.9833,
        "type": "SEA",
        "max_draft_m": 13.0,
        "terminal": "KICT / SAPT / QICT Port Qasim",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CNSHA",
        "name": "Port of Shanghai (Yangshan)",
        "city": "Shanghai",
        "country": "CN",
        "lat": 30.6236,
        "lon": 122.0712,
        "type": "SEA",
        "max_draft_m": 18.0,
        "terminal": "SIPG Yangshan Deep Water Port",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CNNBO",
        "name": "Port of Ningbo-Zhoushan",
        "city": "Ningbo",
        "country": "CN",
        "lat": 29.9233,
        "lon": 121.6274,
        "type": "SEA",
        "max_draft_m": 20.0,
        "terminal": "NBT / ZPCT / Meishan",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CNSZX",
        "name": "Port of Shenzhen (Yantian & Shekou)",
        "city": "Shenzhen",
        "country": "CN",
        "lat": 22.5773,
        "lon": 114.2613,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "YICT / CCT Shekou / Chiwan",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CNGGZ",
        "name": "Port of Guangzhou (Nansha)",
        "city": "Guangzhou",
        "country": "CN",
        "lat": 22.726,
        "lon": 113.6183,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "GPCT Nansha Phase 1-4",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CNTAO",
        "name": "Port of Qingdao",
        "city": "Qingdao",
        "country": "CN",
        "lat": 36.0745,
        "lon": 120.3228,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "QQCT / QQCTU Qianwan",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CNTNJ",
        "name": "Port of Tianjin (Xingang)",
        "city": "Tianjin",
        "country": "CN",
        "lat": 38.9833,
        "lon": 117.75,
        "type": "SEA",
        "max_draft_m": 15.5,
        "terminal": "TPCT / TACT Tianjin",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CNXMN",
        "name": "Port of Xiamen",
        "city": "Xiamen",
        "country": "CN",
        "lat": 24.4833,
        "lon": 118.0833,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "Xiamen International Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "HKHKG",
        "name": "Port of Hong Kong (Kwai Tsing)",
        "city": "Hong Kong",
        "country": "CN",
        "lat": 22.35,
        "lon": 114.1167,
        "type": "SEA",
        "max_draft_m": 15.5,
        "terminal": "HIT / Modern Terminals / COSCO-HIT",
        "tier": 1,
        "active": true
    },
    {
        "locode": "KRPUS",
        "name": "Port of Busan (Pusan New Port)",
        "city": "Busan",
        "country": "KR",
        "lat": 35.0732,
        "lon": 128.9831,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "PNC / BPA / HJNC Busan",
        "tier": 1,
        "active": true
    },
    {
        "locode": "KRINC",
        "name": "Port of Incheon",
        "city": "Incheon",
        "country": "KR",
        "lat": 37.45,
        "lon": 126.6,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "SNCT / HJIT Incheon",
        "tier": 2,
        "active": true
    },
    {
        "locode": "JPTYO",
        "name": "Port of Tokyo",
        "city": "Tokyo",
        "country": "JP",
        "lat": 35.619,
        "lon": 139.754,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "TCT Oi / Aomi Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "JPYOK",
        "name": "Port of Yokohama",
        "city": "Yokohama",
        "country": "JP",
        "lat": 35.4479,
        "lon": 139.6421,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Honmoku / Daikoku Pier",
        "tier": 1,
        "active": true
    },
    {
        "locode": "JPKOB",
        "name": "Port of Kobe",
        "city": "Kobe",
        "country": "JP",
        "lat": 34.6833,
        "lon": 135.2,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "Port Island / Rokko Island",
        "tier": 1,
        "active": true
    },
    {
        "locode": "TWKHH",
        "name": "Port of Kaohsiung",
        "city": "Kaohsiung",
        "country": "TW",
        "lat": 22.6167,
        "lon": 120.2833,
        "type": "SEA",
        "max_draft_m": 16.5,
        "terminal": "Kaohsiung Intercontinental Terminals",
        "tier": 1,
        "active": true
    },
    {
        "locode": "NLRTM",
        "name": "Port of Rotterdam",
        "city": "Rotterdam",
        "country": "NL",
        "lat": 51.95,
        "lon": 4.14,
        "type": "SEA",
        "max_draft_m": 23.0,
        "terminal": "ECT Delta / APMT Maasvlakte II",
        "tier": 1,
        "active": true
    },
    {
        "locode": "NLAMS",
        "name": "Port of Amsterdam",
        "city": "Amsterdam",
        "country": "NL",
        "lat": 52.377,
        "lon": 4.8952,
        "type": "SEA",
        "max_draft_m": 12.5,
        "terminal": "North Sea Port Amsterdam",
        "tier": 2,
        "active": true
    },
    {
        "locode": "BEANR",
        "name": "Port of Antwerp-Bruges",
        "city": "Antwerp",
        "country": "BE",
        "lat": 51.2993,
        "lon": 4.3814,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "PSA Antwerp / MPET Deurganckdok",
        "tier": 1,
        "active": true
    },
    {
        "locode": "DEHAM",
        "name": "Port of Hamburg",
        "city": "Hamburg",
        "country": "DE",
        "lat": 53.5389,
        "lon": 9.99,
        "type": "SEA",
        "max_draft_m": 15.6,
        "terminal": "HHLA Altenwerder / Eurogate",
        "tier": 1,
        "active": true
    },
    {
        "locode": "DEBRV",
        "name": "Port of Bremerhaven",
        "city": "Bremerhaven",
        "country": "DE",
        "lat": 53.55,
        "lon": 8.5833,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Eurogate / NTB Bremerhaven",
        "tier": 1,
        "active": true
    },
    {
        "locode": "GBLGP",
        "name": "Port of Felixstowe",
        "city": "Felixstowe",
        "country": "GB",
        "lat": 51.9659,
        "lon": 1.3329,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "Felixstowe Trinity / Berths 8&9",
        "tier": 1,
        "active": true
    },
    {
        "locode": "GBSOU",
        "name": "Port of Southampton",
        "city": "Southampton",
        "country": "GB",
        "lat": 50.9,
        "lon": -1.4,
        "type": "SEA",
        "max_draft_m": 15.5,
        "terminal": "DP World Southampton",
        "tier": 1,
        "active": true
    },
    {
        "locode": "GBLON",
        "name": "London Gateway Port",
        "city": "London / Essex",
        "country": "GB",
        "lat": 51.5,
        "lon": 0.4667,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "DP World London Gateway",
        "tier": 1,
        "active": true
    },
    {
        "locode": "FRLEH",
        "name": "Port of Le Havre (HAROPA)",
        "city": "Le Havre",
        "country": "FR",
        "lat": 49.4833,
        "lon": 0.1167,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "HAROPA Port 2000 GMP/TN",
        "tier": 1,
        "active": true
    },
    {
        "locode": "FRMRS",
        "name": "Port of Marseille-Fos",
        "city": "Marseille",
        "country": "FR",
        "lat": 43.4,
        "lon": 4.9,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Fos 2XL Eurofos / Seayard",
        "tier": 1,
        "active": true
    },
    {
        "locode": "ESVLC",
        "name": "Port of Valencia",
        "city": "Valencia",
        "country": "ES",
        "lat": 39.45,
        "lon": -0.3167,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "CSP Iberian / MSC Valencia Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "ESBCN",
        "name": "Port of Barcelona",
        "city": "Barcelona",
        "country": "ES",
        "lat": 41.35,
        "lon": 2.1667,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "BEST Hutchison / APMT Barcelona",
        "tier": 1,
        "active": true
    },
    {
        "locode": "ESALG",
        "name": "Port of Algeciras",
        "city": "Algeciras",
        "country": "ES",
        "lat": 36.1333,
        "lon": -5.4333,
        "type": "SEA",
        "max_draft_m": 17.5,
        "terminal": "APMT Algeciras / TTI Algeciras",
        "tier": 1,
        "active": true
    },
    {
        "locode": "ITGOA",
        "name": "Port of Genoa",
        "city": "Genoa",
        "country": "IT",
        "lat": 44.4,
        "lon": 8.9,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "PSA Genova Pra / SECH Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "ITGIT",
        "name": "Port of Gioia Tauro",
        "city": "Gioia Tauro",
        "country": "IT",
        "lat": 38.4333,
        "lon": 15.9,
        "type": "SEA",
        "max_draft_m": 18.0,
        "terminal": "MCT Medcenter Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "GRPIR",
        "name": "Port of Piraeus",
        "city": "Athens / Piraeus",
        "country": "GR",
        "lat": 37.95,
        "lon": 23.6333,
        "type": "SEA",
        "max_draft_m": 16.5,
        "terminal": "Piraeus Container Terminal (COSCO)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "TRMRM",
        "name": "Mersin International Port",
        "city": "Mersin",
        "country": "TR",
        "lat": 36.7961,
        "lon": 34.5858,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "MIP Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "TRIST",
        "name": "Port of Ambarli (Istanbul)",
        "city": "Istanbul",
        "country": "TR",
        "lat": 40.9667,
        "lon": 28.6833,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Marport / Kumport Istanbul",
        "tier": 1,
        "active": true
    },
    {
        "locode": "PLGDN",
        "name": "Baltic Hub (Port of Gdansk)",
        "city": "Gdansk",
        "country": "PL",
        "lat": 54.3833,
        "lon": 18.6667,
        "type": "SEA",
        "max_draft_m": 17.0,
        "terminal": "Baltic Hub T1/T2 Gdansk",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USLAX",
        "name": "Port of Los Angeles",
        "city": "Los Angeles",
        "country": "US",
        "lat": 33.7364,
        "lon": -118.2717,
        "type": "SEA",
        "max_draft_m": 16.8,
        "terminal": "APM Terminals Pier 400 / Trapac",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USLGB",
        "name": "Port of Long Beach",
        "city": "Long Beach",
        "country": "US",
        "lat": 33.754,
        "lon": -118.216,
        "type": "SEA",
        "max_draft_m": 16.5,
        "terminal": "Long Beach Container Terminal (LBCT)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USNYC",
        "name": "Port of New York & New Jersey",
        "city": "New York",
        "country": "US",
        "lat": 40.665,
        "lon": -74.105,
        "type": "SEA",
        "max_draft_m": 15.5,
        "terminal": "GCT Bayonne / APMT Port Elizabeth / Maher",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USSAV",
        "name": "Port of Savannah",
        "city": "Savannah",
        "country": "US",
        "lat": 31.9683,
        "lon": -81.0931,
        "type": "SEA",
        "max_draft_m": 15.2,
        "terminal": "GPA Garden City Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USHOU",
        "name": "Port of Houston",
        "city": "Houston",
        "country": "US",
        "lat": 29.75,
        "lon": -95.25,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "Bayport / Barbours Cut Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USORF",
        "name": "Port of Virginia (Norfolk)",
        "city": "Norfolk",
        "country": "US",
        "lat": 36.9,
        "lon": -76.3333,
        "type": "SEA",
        "max_draft_m": 16.5,
        "terminal": "Norfolk International Terminals (NIT)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USCHS",
        "name": "Port of Charleston",
        "city": "Charleston",
        "country": "US",
        "lat": 32.7833,
        "lon": -79.9333,
        "type": "SEA",
        "max_draft_m": 15.8,
        "terminal": "Wando Welch / Leatherman Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USSEA",
        "name": "Port of Seattle / Tacoma (NWSA)",
        "city": "Seattle / Tacoma",
        "country": "US",
        "lat": 47.6,
        "lon": -122.3333,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "NWSA Terminal 5 / Husky / Washington",
        "tier": 1,
        "active": true
    },
    {
        "locode": "USOAK",
        "name": "Port of Oakland",
        "city": "Oakland",
        "country": "US",
        "lat": 37.8,
        "lon": -122.2833,
        "type": "SEA",
        "max_draft_m": 15.2,
        "terminal": "Oakland International Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CAVAN",
        "name": "Port of Vancouver",
        "city": "Vancouver",
        "country": "CA",
        "lat": 49.2833,
        "lon": -123.1167,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "Deltaport / Centerm Vancouver",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CAPRR",
        "name": "Port of Prince Rupert",
        "city": "Prince Rupert",
        "country": "CA",
        "lat": 54.3167,
        "lon": -130.3333,
        "type": "SEA",
        "max_draft_m": 18.0,
        "terminal": "Fairview Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CAMTR",
        "name": "Port of Montreal",
        "city": "Montreal",
        "country": "CA",
        "lat": 45.5,
        "lon": -73.55,
        "type": "SEA",
        "max_draft_m": 11.3,
        "terminal": "Cast / Racine / Maisonneuve",
        "tier": 1,
        "active": true
    },
    {
        "locode": "MXZLO",
        "name": "Port of Manzanillo",
        "city": "Manzanillo",
        "country": "MX",
        "lat": 19.05,
        "lon": -104.3167,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "CONTECON / SSA Mexico Manzanillo",
        "tier": 1,
        "active": true
    },
    {
        "locode": "MXLZC",
        "name": "Port of Lazaro Cardenas",
        "city": "Lazaro Cardenas",
        "country": "MX",
        "lat": 17.95,
        "lon": -102.1833,
        "type": "SEA",
        "max_draft_m": 16.5,
        "terminal": "APMT Lazaro Cardenas / Hutchison",
        "tier": 1,
        "active": true
    },
    {
        "locode": "BRSSZ",
        "name": "Port of Santos",
        "city": "Santos / Sao Paulo",
        "country": "BR",
        "lat": -23.9608,
        "lon": -46.3342,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "Santos Brasil / BTP / DP World Santos",
        "tier": 1,
        "active": true
    },
    {
        "locode": "BRPNG",
        "name": "Port of Paranagua",
        "city": "Paranagua",
        "country": "BR",
        "lat": -25.5,
        "lon": -48.5,
        "type": "SEA",
        "max_draft_m": 13.5,
        "terminal": "TCP Terminal de Conteineres",
        "tier": 1,
        "active": true
    },
    {
        "locode": "ARBUE",
        "name": "Port of Buenos Aires",
        "city": "Buenos Aires",
        "country": "AR",
        "lat": -34.6,
        "lon": -58.3667,
        "type": "SEA",
        "max_draft_m": 10.5,
        "terminal": "Terminales Rio de la Plata (TRP) / BACTSSA",
        "tier": 1,
        "active": true
    },
    {
        "locode": "PECLL",
        "name": "Port of Callao",
        "city": "Callao / Lima",
        "country": "PE",
        "lat": -12.05,
        "lon": -77.15,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "DP World Callao / APM Terminals Callao",
        "tier": 1,
        "active": true
    },
    {
        "locode": "CLSAI",
        "name": "Port of San Antonio",
        "city": "San Antonio",
        "country": "CL",
        "lat": -33.5833,
        "lon": -71.6167,
        "type": "SEA",
        "max_draft_m": 15.0,
        "terminal": "San Antonio Terminal Internacional (STI)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "COCTG",
        "name": "Port of Cartagena",
        "city": "Cartagena",
        "country": "CO",
        "lat": 10.4,
        "lon": -75.5,
        "type": "SEA",
        "max_draft_m": 15.5,
        "terminal": "SPRC / Contecar Cartagena",
        "tier": 1,
        "active": true
    },
    {
        "locode": "EGPSD",
        "name": "Port Said East Port (Suez Canal Hub)",
        "city": "Port Said",
        "country": "EG",
        "lat": 31.2601,
        "lon": 32.3686,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "SCCT Suez Canal Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "EGALE",
        "name": "Port of Alexandria",
        "city": "Alexandria",
        "country": "EG",
        "lat": 31.2,
        "lon": 29.9,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "Alexandria Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "MATNG",
        "name": "Tanger Med Port",
        "city": "Tangier",
        "country": "MA",
        "lat": 35.8833,
        "lon": -5.5,
        "type": "SEA",
        "max_draft_m": 18.0,
        "terminal": "APMT Tanger / TC3 / Eurogate Tanger",
        "tier": 1,
        "active": true
    },
    {
        "locode": "ZADUR",
        "name": "Port of Durban",
        "city": "Durban",
        "country": "ZA",
        "lat": -29.8667,
        "lon": 31.0167,
        "type": "SEA",
        "max_draft_m": 12.8,
        "terminal": "Durban Container Terminal (DCT Pier 1/2)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "ZACPT",
        "name": "Port of Cape Town",
        "city": "Cape Town",
        "country": "ZA",
        "lat": -33.904,
        "lon": 18.4232,
        "type": "SEA",
        "max_draft_m": 12.8,
        "terminal": "Cape Town Container Terminal (CTCT)",
        "tier": 2,
        "active": true
    },
    {
        "locode": "KEMBA",
        "name": "Port of Mombasa",
        "city": "Mombasa",
        "country": "KE",
        "lat": -4.0435,
        "lon": 39.6682,
        "type": "SEA",
        "max_draft_m": 13.5,
        "terminal": "Kenya Ports Authority (KPA Berth 20/21)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "TZDAR",
        "name": "Port of Dar es Salaam",
        "city": "Dar es Salaam",
        "country": "TZ",
        "lat": -6.8333,
        "lon": 39.3,
        "type": "SEA",
        "max_draft_m": 14.5,
        "terminal": "DP World Dar es Salaam",
        "tier": 2,
        "active": true
    },
    {
        "locode": "NGAPP",
        "name": "Port of Lagos (Apapa & Tin Can)",
        "city": "Lagos",
        "country": "NG",
        "lat": 6.45,
        "lon": 3.3667,
        "type": "SEA",
        "max_draft_m": 13.0,
        "terminal": "APMT Apapa / TICT Tin Can Island",
        "tier": 1,
        "active": true
    },
    {
        "locode": "NGLEK",
        "name": "Lekki Deep Sea Port",
        "city": "Lagos",
        "country": "NG",
        "lat": 6.4167,
        "lon": 3.9667,
        "type": "SEA",
        "max_draft_m": 16.5,
        "terminal": "Lekki Port LFTZ (CMA CGM)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "GHAPA",
        "name": "Port of Tema",
        "city": "Tema / Accra",
        "country": "GH",
        "lat": 5.6333,
        "lon": 0.0,
        "type": "SEA",
        "max_draft_m": 16.0,
        "terminal": "MPS Terminal 3 Tema",
        "tier": 1,
        "active": true
    },
    {
        "locode": "DJJIB",
        "name": "Port of Djibouti (Doraleh)",
        "city": "Djibouti",
        "country": "DJ",
        "lat": 11.6,
        "lon": 43.15,
        "type": "SEA",
        "max_draft_m": 18.0,
        "terminal": "Doraleh Container Terminal (SGTD)",
        "tier": 1,
        "active": true
    },
    {
        "locode": "AUSYD",
        "name": "Port of Sydney (Botany)",
        "city": "Sydney",
        "country": "AU",
        "lat": -33.9693,
        "lon": 151.1975,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "Patrick / DP World Botany",
        "tier": 1,
        "active": true
    },
    {
        "locode": "AUMEL",
        "name": "Port of Melbourne",
        "city": "Melbourne",
        "country": "AU",
        "lat": -37.8228,
        "lon": 144.9255,
        "type": "SEA",
        "max_draft_m": 14.5,
        "terminal": "VICT Webb Dock / DP World Swanson",
        "tier": 1,
        "active": true
    },
    {
        "locode": "AUBNE",
        "name": "Port of Brisbane",
        "city": "Brisbane",
        "country": "AU",
        "lat": -27.3833,
        "lon": 153.1667,
        "type": "SEA",
        "max_draft_m": 14.0,
        "terminal": "Patrick / DP World Brisbane",
        "tier": 1,
        "active": true
    },
    {
        "locode": "AUFRE",
        "name": "Port of Fremantle (Perth)",
        "city": "Fremantle",
        "country": "AU",
        "lat": -32.05,
        "lon": 115.75,
        "type": "SEA",
        "max_draft_m": 13.0,
        "terminal": "Patrick / DP World Fremantle",
        "tier": 2,
        "active": true
    },
    {
        "locode": "NZAKL",
        "name": "Port of Auckland",
        "city": "Auckland",
        "country": "NZ",
        "lat": -36.8333,
        "lon": 174.7833,
        "type": "SEA",
        "max_draft_m": 13.5,
        "terminal": "Fergusson Container Terminal",
        "tier": 1,
        "active": true
    },
    {
        "locode": "NZTRG",
        "name": "Port of Tauranga",
        "city": "Tauranga",
        "country": "NZ",
        "lat": -37.6667,
        "lon": 176.1833,
        "type": "SEA",
        "max_draft_m": 14.5,
        "terminal": "Sulphur Point Container Terminal",
        "tier": 1,
        "active": true
    }
]

AIRPORTS = [
    {
        "iata": "BOM",
        "icao": "VABB",
        "name": "Chhatrapati Shivaji Maharaj International Airport",
        "city": "Mumbai",
        "country": "IN",
        "lat": 19.0896,
        "lon": 72.8656,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "DEL",
        "icao": "VIDP",
        "name": "Indira Gandhi International Airport",
        "city": "Delhi",
        "country": "IN",
        "lat": 28.5665,
        "lon": 77.1031,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "BLR",
        "icao": "VOBL",
        "name": "Kempegowda International Airport",
        "city": "Bangalore",
        "country": "IN",
        "lat": 13.1986,
        "lon": 77.7066,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "MAA",
        "icao": "VOMM",
        "name": "Chennai International Airport",
        "city": "Chennai",
        "country": "IN",
        "lat": 12.9941,
        "lon": 80.1709,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "HYD",
        "icao": "VOHS",
        "name": "Rajiv Gandhi International Airport",
        "city": "Hyderabad",
        "country": "IN",
        "lat": 17.2403,
        "lon": 78.4294,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "CCU",
        "icao": "VECC",
        "name": "Netaji Subhash Chandra Bose International Airport",
        "city": "Kolkata",
        "country": "IN",
        "lat": 22.652,
        "lon": 88.4463,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "AMD",
        "icao": "VAAH",
        "name": "Sardar Vallabhbhai Patel International Airport",
        "city": "Ahmedabad",
        "country": "IN",
        "lat": 23.0772,
        "lon": 72.6347,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "COK",
        "icao": "VOCI",
        "name": "Cochin International Airport",
        "city": "Kochi",
        "country": "IN",
        "lat": 10.1556,
        "lon": 76.39,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "DXB",
        "icao": "OMDB",
        "name": "Dubai International Airport",
        "city": "Dubai",
        "country": "AE",
        "lat": 25.2532,
        "lon": 55.3657,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "DWC",
        "icao": "OMDW",
        "name": "Al Maktoum International Airport (Dubai South)",
        "city": "Dubai",
        "country": "AE",
        "lat": 24.896,
        "lon": 55.1614,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "AUH",
        "icao": "OMAA",
        "name": "Zayed International Airport (Abu Dhabi)",
        "city": "Abu Dhabi",
        "country": "AE",
        "lat": 24.433,
        "lon": 54.6511,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SHJ",
        "icao": "OMSJ",
        "name": "Sharjah International Airport",
        "city": "Sharjah",
        "country": "AE",
        "lat": 25.3286,
        "lon": 55.5174,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "DOH",
        "icao": "OTHH",
        "name": "Hamad International Airport",
        "city": "Doha",
        "country": "QA",
        "lat": 25.2731,
        "lon": 51.6081,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "RUH",
        "icao": "OERK",
        "name": "King Khalid International Airport",
        "city": "Riyadh",
        "country": "SA",
        "lat": 24.9576,
        "lon": 46.6988,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "JED",
        "icao": "OEJN",
        "name": "King Abdulaziz International Airport",
        "city": "Jeddah",
        "country": "SA",
        "lat": 21.6796,
        "lon": 39.1565,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "BAH",
        "icao": "OBBI",
        "name": "Bahrain International Airport",
        "city": "Manama",
        "country": "BH",
        "lat": 26.2708,
        "lon": 50.6336,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "KWI",
        "icao": "OKBK",
        "name": "Kuwait International Airport",
        "city": "Kuwait City",
        "country": "KW",
        "lat": 29.2267,
        "lon": 47.9689,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SIN",
        "icao": "WSSS",
        "name": "Singapore Changi Airport",
        "city": "Singapore",
        "country": "SG",
        "lat": 1.3644,
        "lon": 103.9915,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "HKG",
        "icao": "VHHH",
        "name": "Hong Kong International Airport",
        "city": "Hong Kong",
        "country": "CN",
        "lat": 22.308,
        "lon": 113.9185,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "PVG",
        "icao": "ZSPD",
        "name": "Shanghai Pudong International Airport",
        "city": "Shanghai",
        "country": "CN",
        "lat": 31.1443,
        "lon": 121.8083,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "PEK",
        "icao": "ZBAA",
        "name": "Beijing Capital International Airport",
        "city": "Beijing",
        "country": "CN",
        "lat": 40.0799,
        "lon": 116.6031,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "CAN",
        "icao": "ZGGG",
        "name": "Guangzhou Baiyun International Airport",
        "city": "Guangzhou",
        "country": "CN",
        "lat": 23.3924,
        "lon": 113.2988,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SZX",
        "icao": "ZGSZ",
        "name": "Shenzhen Bao'an International Airport",
        "city": "Shenzhen",
        "country": "CN",
        "lat": 22.6394,
        "lon": 113.8108,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "CGO",
        "icao": "ZHCC",
        "name": "Zhengzhou Xinzheng International Airport",
        "city": "Zhengzhou",
        "country": "CN",
        "lat": 34.5197,
        "lon": 113.8408,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "ICN",
        "icao": "RKSI",
        "name": "Incheon International Airport",
        "city": "Seoul",
        "country": "KR",
        "lat": 37.4602,
        "lon": 126.4407,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "NRT",
        "icao": "RJAA",
        "name": "Narita International Airport",
        "city": "Tokyo",
        "country": "JP",
        "lat": 35.7647,
        "lon": 140.3864,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "HND",
        "icao": "RJTT",
        "name": "Tokyo Haneda Airport",
        "city": "Tokyo",
        "country": "JP",
        "lat": 35.5494,
        "lon": 139.7798,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "KIX",
        "icao": "RJBB",
        "name": "Kansai International Airport",
        "city": "Osaka",
        "country": "JP",
        "lat": 34.4274,
        "lon": 135.244,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "TPE",
        "icao": "RCTP",
        "name": "Taiwan Taoyuan International Airport",
        "city": "Taipei",
        "country": "TW",
        "lat": 25.0797,
        "lon": 121.2342,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "BKK",
        "icao": "VTBS",
        "name": "Suvarnabhumi Airport",
        "city": "Bangkok",
        "country": "TH",
        "lat": 13.6811,
        "lon": 100.7475,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "KUL",
        "icao": "WMKK",
        "name": "Kuala Lumpur International Airport",
        "city": "Kuala Lumpur",
        "country": "MY",
        "lat": 2.7456,
        "lon": 101.7099,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SGN",
        "icao": "VVTS",
        "name": "Tan Son Nhat International Airport",
        "city": "Ho Chi Minh City",
        "country": "VN",
        "lat": 10.8188,
        "lon": 106.6519,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "HAN",
        "icao": "VVNB",
        "name": "Noi Bai International Airport",
        "city": "Hanoi",
        "country": "VN",
        "lat": 21.2211,
        "lon": 105.8072,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "CGK",
        "icao": "WIII",
        "name": "Soekarno-Hatta International Airport",
        "city": "Jakarta",
        "country": "ID",
        "lat": -6.1256,
        "lon": 106.6558,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "MNL",
        "icao": "RPLL",
        "name": "Ninoy Aquino International Airport",
        "city": "Manila",
        "country": "PH",
        "lat": 14.5086,
        "lon": 121.0194,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "FRA",
        "icao": "EDDF",
        "name": "Frankfurt Airport",
        "city": "Frankfurt",
        "country": "DE",
        "lat": 50.0379,
        "lon": 8.5622,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "LEJ",
        "icao": "EDDP",
        "name": "Leipzig/Halle Airport (DHL Hub)",
        "city": "Leipzig",
        "country": "DE",
        "lat": 51.4324,
        "lon": 12.216,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "CGN",
        "icao": "EDDK",
        "name": "Cologne Bonn Airport (UPS Hub)",
        "city": "Cologne",
        "country": "DE",
        "lat": 50.8659,
        "lon": 7.1427,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "AMS",
        "icao": "EHAM",
        "name": "Amsterdam Airport Schiphol",
        "city": "Amsterdam",
        "country": "NL",
        "lat": 52.3086,
        "lon": 4.7639,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "LHR",
        "icao": "EGLL",
        "name": "London Heathrow Airport",
        "city": "London",
        "country": "GB",
        "lat": 51.47,
        "lon": -0.4543,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "STN",
        "icao": "EGSS",
        "name": "London Stansted Airport",
        "city": "London",
        "country": "GB",
        "lat": 51.885,
        "lon": 0.235,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "EMA",
        "icao": "EGNX",
        "name": "East Midlands Airport (UK Hub)",
        "city": "Derby / Nottingham",
        "country": "GB",
        "lat": 52.8311,
        "lon": -1.3281,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "CDG",
        "icao": "LFPG",
        "name": "Paris Charles de Gaulle Airport",
        "city": "Paris",
        "country": "FR",
        "lat": 49.0097,
        "lon": 2.5479,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "BRU",
        "icao": "EBBR",
        "name": "Brussels Airport",
        "city": "Brussels",
        "country": "BE",
        "lat": 50.9014,
        "lon": 4.4844,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "LGG",
        "icao": "EBLG",
        "name": "Li\u00e8ge Airport (Euro Hub)",
        "city": "Li\u00e8ge",
        "country": "BE",
        "lat": 50.6374,
        "lon": 5.4432,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "MXP",
        "icao": "LIMC",
        "name": "Milan Malpensa Airport",
        "city": "Milan",
        "country": "IT",
        "lat": 45.63,
        "lon": 8.7231,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "MAD",
        "icao": "LEMD",
        "name": "Adolfo Su\u00e1rez Madrid-Barajas Airport",
        "city": "Madrid",
        "country": "ES",
        "lat": 40.4983,
        "lon": -3.5676,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "IST",
        "icao": "LTFM",
        "name": "Istanbul Airport",
        "city": "Istanbul",
        "country": "TR",
        "lat": 41.2753,
        "lon": 28.7519,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "ZRH",
        "icao": "LSZH",
        "name": "Zurich Airport",
        "city": "Zurich",
        "country": "CH",
        "lat": 47.4647,
        "lon": 8.5492,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "VIE",
        "icao": "LOWW",
        "name": "Vienna International Airport",
        "city": "Vienna",
        "country": "AT",
        "lat": 48.1103,
        "lon": 16.5697,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "MEM",
        "icao": "KMEM",
        "name": "Memphis International Airport (FedEx Superhub)",
        "city": "Memphis",
        "country": "US",
        "lat": 35.0424,
        "lon": -89.9767,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SDF",
        "icao": "KSDF",
        "name": "Louisville Muhammad Ali Intl (UPS Worldport)",
        "city": "Louisville",
        "country": "US",
        "lat": 38.1744,
        "lon": -85.736,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "MIA",
        "icao": "KMIA",
        "name": "Miami International Airport (LATAM Gateway)",
        "city": "Miami",
        "country": "US",
        "lat": 25.7959,
        "lon": -80.287,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "LAX",
        "icao": "KLAX",
        "name": "Los Angeles International Airport",
        "city": "Los Angeles",
        "country": "US",
        "lat": 33.9416,
        "lon": -118.4085,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "ORD",
        "icao": "KORD",
        "name": "O'Hare International Airport",
        "city": "Chicago",
        "country": "US",
        "lat": 41.9742,
        "lon": -87.9073,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "JFK",
        "icao": "KJFK",
        "name": "John F. Kennedy International Airport",
        "city": "New York",
        "country": "US",
        "lat": 40.6413,
        "lon": -73.7781,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "ATL",
        "icao": "KATL",
        "name": "Hartsfield-Jackson Atlanta International",
        "city": "Atlanta",
        "country": "US",
        "lat": 33.6407,
        "lon": -84.4277,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "DFW",
        "icao": "KDFW",
        "name": "Dallas/Fort Worth International Airport",
        "city": "Dallas",
        "country": "US",
        "lat": 32.8998,
        "lon": -97.0403,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SFO",
        "icao": "KSFO",
        "name": "San Francisco International Airport",
        "city": "San Francisco",
        "country": "US",
        "lat": 37.6213,
        "lon": -122.379,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SEA",
        "icao": "KSEA",
        "name": "Seattle-Tacoma International Airport",
        "city": "Seattle",
        "country": "US",
        "lat": 47.4502,
        "lon": -122.3088,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "YYZ",
        "icao": "CYYZ",
        "name": "Toronto Pearson International Airport",
        "city": "Toronto",
        "country": "CA",
        "lat": 43.6777,
        "lon": -79.6248,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "YVR",
        "icao": "CYVR",
        "name": "Vancouver International Airport",
        "city": "Vancouver",
        "country": "CA",
        "lat": 49.1967,
        "lon": -123.1815,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "MEX",
        "icao": "MMMX",
        "name": "Mexico City International Airport (Benito Juarez)",
        "city": "Mexico City",
        "country": "MX",
        "lat": 19.4361,
        "lon": -99.0719,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "NLU",
        "icao": "MMSM",
        "name": "Felipe \u00c1ngeles International Airport (AIFA Cargo)",
        "city": "Mexico City",
        "country": "MX",
        "lat": 19.7461,
        "lon": -99.0147,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "GRU",
        "icao": "SBGR",
        "name": "S\u00e3o Paulo Guarulhos International Airport",
        "city": "S\u00e3o Paulo",
        "country": "BR",
        "lat": -23.4356,
        "lon": -46.4731,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "VCP",
        "icao": "SBKP",
        "name": "Viracopos International Airport (Campinas)",
        "city": "Campinas / S\u00e3o Paulo",
        "country": "BR",
        "lat": -23.0074,
        "lon": -47.1345,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "BOG",
        "icao": "SKBO",
        "name": "El Dorado International Airport",
        "city": "Bogot\u00e1",
        "country": "CO",
        "lat": 4.7016,
        "lon": -74.1469,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SCL",
        "icao": "SCEL",
        "name": "Arturo Merino Ben\u00edtez International Airport",
        "city": "Santiago",
        "country": "CL",
        "lat": -33.393,
        "lon": -70.7858,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "EZE",
        "icao": "SAEZ",
        "name": "Ministro Pistarini International Airport (Ezeiza)",
        "city": "Buenos Aires",
        "country": "AR",
        "lat": -34.8222,
        "lon": -58.5358,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "LIM",
        "icao": "SPJC",
        "name": "Jorge Ch\u00e1vez International Airport",
        "city": "Lima",
        "country": "PE",
        "lat": -12.0219,
        "lon": -77.1143,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "JNB",
        "icao": "FAOR",
        "name": "O.R. Tambo International Airport",
        "city": "Johannesburg",
        "country": "ZA",
        "lat": -26.1392,
        "lon": 28.246,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "NBO",
        "icao": "HKJK",
        "name": "Jomo Kenyatta International Airport",
        "city": "Nairobi",
        "country": "KE",
        "lat": -1.3192,
        "lon": 36.9275,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "ADD",
        "icao": "HAAB",
        "name": "Addis Ababa Bole International Airport (ET Cargo)",
        "city": "Addis Ababa",
        "country": "ET",
        "lat": 8.9779,
        "lon": 38.7993,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "CAI",
        "icao": "HECA",
        "name": "Cairo International Airport",
        "city": "Cairo",
        "country": "EG",
        "lat": 30.1219,
        "lon": 31.4056,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "LOS",
        "icao": "DNMM",
        "name": "Murtala Muhammed International Airport",
        "city": "Lagos",
        "country": "NG",
        "lat": 6.5774,
        "lon": 3.3212,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "CMN",
        "icao": "GMMN",
        "name": "Mohammed V International Airport",
        "city": "Casablanca",
        "country": "MA",
        "lat": 33.3675,
        "lon": -7.5898,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "SYD",
        "icao": "YSSY",
        "name": "Sydney Kingsford Smith Airport",
        "city": "Sydney",
        "country": "AU",
        "lat": -33.9399,
        "lon": 151.1753,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "MEL",
        "icao": "YMML",
        "name": "Melbourne Airport",
        "city": "Melbourne",
        "country": "AU",
        "lat": -37.669,
        "lon": 144.841,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "BNE",
        "icao": "YBBN",
        "name": "Brisbane Airport",
        "city": "Brisbane",
        "country": "AU",
        "lat": -27.3842,
        "lon": 153.1175,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "PER",
        "icao": "YPPH",
        "name": "Perth Airport",
        "city": "Perth",
        "country": "AU",
        "lat": -31.9403,
        "lon": 115.9669,
        "cargo_tier": 2,
        "customs_open_24h": true,
        "active": true
    },
    {
        "iata": "AKL",
        "icao": "NZAA",
        "name": "Auckland Airport",
        "city": "Auckland",
        "country": "NZ",
        "lat": -37.0082,
        "lon": 174.785,
        "cargo_tier": 1,
        "customs_open_24h": true,
        "active": true
    }
]

TRADE_LANES = [
    {
        "lane_code": "INNSA-AEJEA-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "AEJEA",
        "mode": "OCEAN",
        "dist_nm": 1250,
        "transit_days_min": 4,
        "transit_days_max": 7,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-AEAUH-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "AEAUH",
        "mode": "OCEAN",
        "dist_nm": 1280,
        "transit_days_min": 5,
        "transit_days_max": 8,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INMUN-AEJEA-OCEAN",
        "origin_locode": "INMUN",
        "dest_locode": "AEJEA",
        "mode": "OCEAN",
        "dist_nm": 1160,
        "transit_days_min": 4,
        "transit_days_max": 6,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INMAA-AEJEA-OCEAN",
        "origin_locode": "INMAA",
        "dest_locode": "AEJEA",
        "mode": "OCEAN",
        "dist_nm": 1890,
        "transit_days_min": 6,
        "transit_days_max": 9,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INMUN-SAJED-OCEAN",
        "origin_locode": "INMUN",
        "dest_locode": "SAJED",
        "mode": "OCEAN",
        "dist_nm": 2080,
        "transit_days_min": 7,
        "transit_days_max": 10,
        "canals_crossed": [],
        "risk_zone": "RED_SEA",
        "active": true
    },
    {
        "lane_code": "INNSA-NLRTM-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "NLRTM",
        "mode": "OCEAN",
        "dist_nm": 7950,
        "transit_days_min": 18,
        "transit_days_max": 24,
        "canals_crossed": [
            "SUEZ"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-DEHAM-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "DEHAM",
        "mode": "OCEAN",
        "dist_nm": 8210,
        "transit_days_min": 18,
        "transit_days_max": 25,
        "canals_crossed": [
            "SUEZ"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-BEANR-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "BEANR",
        "mode": "OCEAN",
        "dist_nm": 8030,
        "transit_days_min": 18,
        "transit_days_max": 24,
        "canals_crossed": [
            "SUEZ"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-GBLGP-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "GBLGP",
        "mode": "OCEAN",
        "dist_nm": 8050,
        "transit_days_min": 20,
        "transit_days_max": 26,
        "canals_crossed": [
            "SUEZ"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INMUN-NLRTM-OCEAN",
        "origin_locode": "INMUN",
        "dest_locode": "NLRTM",
        "mode": "OCEAN",
        "dist_nm": 7760,
        "transit_days_min": 17,
        "transit_days_max": 23,
        "canals_crossed": [
            "SUEZ"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-SGSIN-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "SGSIN",
        "mode": "OCEAN",
        "dist_nm": 2730,
        "transit_days_min": 8,
        "transit_days_max": 12,
        "canals_crossed": [
            "MALACCA"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-CNSHA-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "CNSHA",
        "mode": "OCEAN",
        "dist_nm": 4850,
        "transit_days_min": 14,
        "transit_days_max": 18,
        "canals_crossed": [
            "MALACCA"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-KRPUS-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "KRPUS",
        "mode": "OCEAN",
        "dist_nm": 5200,
        "transit_days_min": 15,
        "transit_days_max": 20,
        "canals_crossed": [
            "MALACCA"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INMAA-SGSIN-OCEAN",
        "origin_locode": "INMAA",
        "dest_locode": "SGSIN",
        "mode": "OCEAN",
        "dist_nm": 2300,
        "transit_days_min": 7,
        "transit_days_max": 10,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-USLAX-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "USLAX",
        "mode": "OCEAN",
        "dist_nm": 8320,
        "transit_days_min": 20,
        "transit_days_max": 28,
        "canals_crossed": [
            "MALACCA"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-USNYC-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "USNYC",
        "mode": "OCEAN",
        "dist_nm": 9110,
        "transit_days_min": 22,
        "transit_days_max": 30,
        "canals_crossed": [
            "SUEZ"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-USSAV-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "USSAV",
        "mode": "OCEAN",
        "dist_nm": 9240,
        "transit_days_min": 22,
        "transit_days_max": 30,
        "canals_crossed": [
            "SUEZ"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "INNSA-AUSYD-OCEAN",
        "origin_locode": "INNSA",
        "dest_locode": "AUSYD",
        "mode": "OCEAN",
        "dist_nm": 6210,
        "transit_days_min": 16,
        "transit_days_max": 21,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "CNSHA-NLRTM-OCEAN",
        "origin_locode": "CNSHA",
        "dest_locode": "NLRTM",
        "mode": "OCEAN",
        "dist_nm": 10890,
        "transit_days_min": 25,
        "transit_days_max": 32,
        "canals_crossed": [
            "SUEZ",
            "MALACCA"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "CNSHA-DEHAM-OCEAN",
        "origin_locode": "CNSHA",
        "dest_locode": "DEHAM",
        "mode": "OCEAN",
        "dist_nm": 11100,
        "transit_days_min": 25,
        "transit_days_max": 33,
        "canals_crossed": [
            "SUEZ",
            "MALACCA"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "CNSHA-USLAX-OCEAN",
        "origin_locode": "CNSHA",
        "dest_locode": "USLAX",
        "mode": "OCEAN",
        "dist_nm": 5546,
        "transit_days_min": 13,
        "transit_days_max": 18,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "CNSHA-USNYC-OCEAN",
        "origin_locode": "CNSHA",
        "dest_locode": "USNYC",
        "mode": "OCEAN",
        "dist_nm": 10700,
        "transit_days_min": 24,
        "transit_days_max": 30,
        "canals_crossed": [
            "SUEZ",
            "MALACCA"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "SGSIN-NLRTM-OCEAN",
        "origin_locode": "SGSIN",
        "dest_locode": "NLRTM",
        "mode": "OCEAN",
        "dist_nm": 8470,
        "transit_days_min": 20,
        "transit_days_max": 26,
        "canals_crossed": [
            "SUEZ",
            "MALACCA"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "AEJEA-NLRTM-OCEAN",
        "origin_locode": "AEJEA",
        "dest_locode": "NLRTM",
        "mode": "OCEAN",
        "dist_nm": 6820,
        "transit_days_min": 15,
        "transit_days_max": 21,
        "canals_crossed": [
            "SUEZ"
        ],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "BOM-DXB-AIR",
        "origin_locode": "BOM",
        "dest_locode": "DXB",
        "mode": "AIR",
        "dist_nm": 1203,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "BOM-LHR-AIR",
        "origin_locode": "BOM",
        "dest_locode": "LHR",
        "mode": "AIR",
        "dist_nm": 4474,
        "transit_days_min": 1,
        "transit_days_max": 3,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "BOM-FRA-AIR",
        "origin_locode": "BOM",
        "dest_locode": "FRA",
        "mode": "AIR",
        "dist_nm": 4284,
        "transit_days_min": 1,
        "transit_days_max": 3,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "BOM-JFK-AIR",
        "origin_locode": "BOM",
        "dest_locode": "JFK",
        "mode": "AIR",
        "dist_nm": 7803,
        "transit_days_min": 2,
        "transit_days_max": 4,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "DEL-DXB-AIR",
        "origin_locode": "DEL",
        "dest_locode": "DXB",
        "mode": "AIR",
        "dist_nm": 1193,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "DEL-LHR-AIR",
        "origin_locode": "DEL",
        "dest_locode": "LHR",
        "mode": "AIR",
        "dist_nm": 4153,
        "transit_days_min": 1,
        "transit_days_max": 3,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "DEL-FRA-AIR",
        "origin_locode": "DEL",
        "dest_locode": "FRA",
        "mode": "AIR",
        "dist_nm": 4041,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "DEL-SIN-AIR",
        "origin_locode": "DEL",
        "dest_locode": "SIN",
        "mode": "AIR",
        "dist_nm": 2638,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "BLR-DXB-AIR",
        "origin_locode": "BLR",
        "dest_locode": "DXB",
        "mode": "AIR",
        "dist_nm": 1650,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "MAA-SIN-AIR",
        "origin_locode": "MAA",
        "dest_locode": "SIN",
        "mode": "AIR",
        "dist_nm": 1819,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "PVG-FRA-AIR",
        "origin_locode": "PVG",
        "dest_locode": "FRA",
        "mode": "AIR",
        "dist_nm": 5175,
        "transit_days_min": 1,
        "transit_days_max": 3,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "PVG-LAX-AIR",
        "origin_locode": "PVG",
        "dest_locode": "LAX",
        "mode": "AIR",
        "dist_nm": 5591,
        "transit_days_min": 2,
        "transit_days_max": 3,
        "canals_crossed": [],
        "risk_zone": null,
        "active": true
    },
    {
        "lane_code": "BOM-DXB-EXP",
        "origin_locode": "BOM",
        "dest_locode": "DXB",
        "mode": "AIR_EXPRESS",
        "dist_nm": 1203,
        "transit_days_min": 1,
        "transit_days_max": 1,
        "canals_crossed": [],
        "risk_zone": null,
        "service_tier": "Next Flight Out",
        "active": true
    },
    {
        "lane_code": "DEL-LHR-EXP",
        "origin_locode": "DEL",
        "dest_locode": "LHR",
        "mode": "AIR_EXPRESS",
        "dist_nm": 4153,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "service_tier": "Express Priority",
        "active": true
    },
    {
        "lane_code": "DEL-FRA-EXP",
        "origin_locode": "DEL",
        "dest_locode": "FRA",
        "mode": "AIR_EXPRESS",
        "dist_nm": 4041,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "service_tier": "Express Priority",
        "active": true
    },
    {
        "lane_code": "BLR-SIN-EXP",
        "origin_locode": "BLR",
        "dest_locode": "SIN",
        "mode": "AIR_EXPRESS",
        "dist_nm": 1720,
        "transit_days_min": 1,
        "transit_days_max": 1,
        "canals_crossed": [],
        "risk_zone": null,
        "service_tier": "Next Flight Out",
        "active": true
    },
    {
        "lane_code": "PVG-MEM-EXP",
        "origin_locode": "PVG",
        "dest_locode": "MEM",
        "mode": "AIR_EXPRESS",
        "dist_nm": 6880,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "service_tier": "World Hub Express",
        "active": true
    },
    {
        "lane_code": "HKG-LEJ-EXP",
        "origin_locode": "HKG",
        "dest_locode": "LEJ",
        "mode": "AIR_EXPRESS",
        "dist_nm": 5420,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "service_tier": "European Hub Express",
        "active": true
    },
    {
        "lane_code": "FRA-JFK-EXP",
        "origin_locode": "FRA",
        "dest_locode": "JFK",
        "mode": "AIR_EXPRESS",
        "dist_nm": 3360,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "service_tier": "Transatlantic Priority",
        "active": true
    },
    {
        "lane_code": "NRT-LAX-EXP",
        "origin_locode": "NRT",
        "dest_locode": "LAX",
        "mode": "AIR_EXPRESS",
        "dist_nm": 4750,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "canals_crossed": [],
        "risk_zone": null,
        "service_tier": "Transpacific Priority",
        "active": true
    },
    {
        "lane_code": "DEL-MUM-ROAD",
        "origin_locode": "DEL",
        "dest_locode": "INNSA",
        "mode": "GROUND",
        "dist_km": 1420,
        "transit_days_min": 3,
        "transit_days_max": 4,
        "route_type": "National Highway NH48",
        "active": true
    },
    {
        "lane_code": "DEL-BLR-ROAD",
        "origin_locode": "DEL",
        "dest_locode": "BLR",
        "mode": "GROUND",
        "dist_km": 2150,
        "transit_days_min": 4,
        "transit_days_max": 6,
        "route_type": "Golden Quadrilateral",
        "active": true
    },
    {
        "lane_code": "MUM-MAA-ROAD",
        "origin_locode": "INNSA",
        "dest_locode": "INMAA",
        "mode": "GROUND",
        "dist_km": 1340,
        "transit_days_min": 3,
        "transit_days_max": 4,
        "route_type": "South Industrial Corridor",
        "active": true
    },
    {
        "lane_code": "DXB-RUH-ROAD",
        "origin_locode": "DXB",
        "dest_locode": "RUH",
        "mode": "GROUND",
        "dist_km": 980,
        "transit_days_min": 2,
        "transit_days_max": 3,
        "route_type": "Gulf Highway Trans-Border",
        "active": true
    },
    {
        "lane_code": "RTM-FRA-ROAD",
        "origin_locode": "NLRTM",
        "dest_locode": "FRA",
        "mode": "GROUND",
        "dist_km": 450,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "route_type": "European Motorway E35",
        "active": true
    },
    {
        "lane_code": "LAX-PHX-ROAD",
        "origin_locode": "USLAX",
        "dest_locode": "PHX",
        "mode": "GROUND",
        "dist_km": 600,
        "transit_days_min": 1,
        "transit_days_max": 1,
        "route_type": "Interstate I-10 Express",
        "active": true
    },
    {
        "lane_code": "DADRI-JNPT-RAIL",
        "origin_locode": "DEL",
        "dest_locode": "INNSA",
        "mode": "RAIL",
        "dist_km": 1480,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "route_type": "Western Dedicated Freight Corridor (WDFC)",
        "active": true
    },
    {
        "lane_code": "TKD-MUN-RAIL",
        "origin_locode": "DEL",
        "dest_locode": "INMUN",
        "mode": "RAIL",
        "dist_km": 1120,
        "transit_days_min": 2,
        "transit_days_max": 3,
        "route_type": "ICD Tughlakabad - Mundra Double Stack Rail",
        "active": true
    },
    {
        "lane_code": "WFD-MAA-RAIL",
        "origin_locode": "BLR",
        "dest_locode": "INMAA",
        "mode": "RAIL",
        "dist_km": 360,
        "transit_days_min": 1,
        "transit_days_max": 1,
        "route_type": "ICD Whitefield - Chennai Port Rail",
        "active": true
    },
    {
        "lane_code": "RTM-DUI-RAIL",
        "origin_locode": "NLRTM",
        "dest_locode": "DUI",
        "mode": "RAIL",
        "dist_km": 210,
        "transit_days_min": 1,
        "transit_days_max": 1,
        "route_type": "Betuweroute European Intermodal Rail",
        "active": true
    },
    {
        "lane_code": "HAM-MUC-RAIL",
        "origin_locode": "DEHAM",
        "dest_locode": "MUC",
        "mode": "RAIL",
        "dist_km": 790,
        "transit_days_min": 1,
        "transit_days_max": 2,
        "route_type": "German North-South Rail Freight Corridor",
        "active": true
    },
    {
        "lane_code": "LAX-CHI-RAIL",
        "origin_locode": "USLAX",
        "dest_locode": "CHI",
        "mode": "RAIL",
        "dist_km": 3550,
        "transit_days_min": 3,
        "transit_days_max": 5,
        "route_type": "BNSF/UP Transcontinental Double-Stack Rail",
        "active": true
    },
    {
        "lane_code": "VAN-TOR-RAIL",
        "origin_locode": "CAVAN",
        "dest_locode": "TOR",
        "mode": "RAIL",
        "dist_km": 4380,
        "transit_days_min": 4,
        "transit_days_max": 6,
        "route_type": "CN Rail Trans-Canada Intermodal",
        "active": true
    },
    {
        "lane_code": "YIWU-DUI-RAIL",
        "origin_locode": "CNSHA",
        "dest_locode": "DUI",
        "mode": "RAIL",
        "dist_km": 10200,
        "transit_days_min": 14,
        "transit_days_max": 18,
        "route_type": "China-Europe Express (New Silk Road Rail)",
        "active": true
    }
]

CARRIERS = [
    {
        "scac": "MAEU",
        "name": "Maersk Line",
        "type": "OCEAN",
        "alliance": "2M",
        "reliability_score": 91,
        "tracking_url": "https://www.maersk.com/tracking/",
        "active": true
    },
    {
        "scac": "MSCU",
        "name": "MSC Mediterranean Shipping Company",
        "type": "OCEAN",
        "alliance": "2M",
        "reliability_score": 87,
        "tracking_url": "https://www.msc.com/track-a-shipment",
        "active": true
    },
    {
        "scac": "CMDU",
        "name": "CMA CGM",
        "type": "OCEAN",
        "alliance": "OCEAN Alliance",
        "reliability_score": 88,
        "tracking_url": "https://www.cma-cgm.com/ebusiness/tracking",
        "active": true
    },
    {
        "scac": "COSU",
        "name": "COSCO Shipping Lines",
        "type": "OCEAN",
        "alliance": "OCEAN Alliance",
        "reliability_score": 84,
        "tracking_url": "https://elines.coscoshipping.com/ebusiness/cargoTracking",
        "active": true
    },
    {
        "scac": "EGLV",
        "name": "Evergreen Marine",
        "type": "OCEAN",
        "alliance": "OCEAN Alliance",
        "reliability_score": 82,
        "tracking_url": "https://www.evergreen-line.com/eservice/index.jsp",
        "active": true
    },
    {
        "scac": "HLCU",
        "name": "Hapag-Lloyd",
        "type": "OCEAN",
        "alliance": "THE Alliance",
        "reliability_score": 90,
        "tracking_url": "https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-solution.html",
        "active": true
    },
    {
        "scac": "ONEY",
        "name": "ONE (Ocean Network Express)",
        "type": "OCEAN",
        "alliance": "THE Alliance",
        "reliability_score": 83,
        "tracking_url": "https://www.one-line.com/en/our-services/eservices/cargo-tracking.html",
        "active": true
    },
    {
        "scac": "YANGM",
        "name": "Yang Ming Marine Transport",
        "type": "OCEAN",
        "alliance": "THE Alliance",
        "reliability_score": 80,
        "tracking_url": "https://www.yangming.com/e_service/Track_Trace/track_trace_cargo.aspx",
        "active": true
    },
    {
        "scac": "HDMU",
        "name": "HMM (Hyundai Merchant Marine)",
        "type": "OCEAN",
        "alliance": "THE Alliance",
        "reliability_score": 81,
        "tracking_url": "https://www.hmm21.com/cms/business/ebiz/trackTrace/index.jsp",
        "active": true
    },
    {
        "scac": "ZIMU",
        "name": "ZIM Integrated Shipping Services",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 78,
        "tracking_url": "https://www.zim.com/tools/track-a-shipment",
        "active": true
    },
    {
        "scac": "ANNU",
        "name": "ANL Container Line",
        "type": "OCEAN",
        "alliance": "OCEAN Alliance",
        "reliability_score": 76,
        "tracking_url": "https://www.anl.com.au",
        "active": true
    },
    {
        "scac": "WHLC",
        "name": "Wan Hai Lines",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 74,
        "tracking_url": "https://www.wanhai.com/views/Service/TrackYourShipment.xhtml",
        "active": true
    },
    {
        "scac": "SMLM",
        "name": "Simatech Shipping & Forwarding",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 69,
        "tracking_url": "https://www.simatech.ae",
        "active": true
    },
    {
        "scac": "TBIL",
        "name": "X-Press Feeders",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 71,
        "tracking_url": "https://www.x-pressfeeders.com",
        "active": true
    },
    {
        "scac": "IQAX",
        "name": "PIL (Pacific International Lines)",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 72,
        "tracking_url": "https://www.pilship.com",
        "active": true
    },
    {
        "scac": "ARKU",
        "name": "ARKAS Line",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 68,
        "tracking_url": "https://www.arkas.com",
        "active": true
    },
    {
        "scac": "IRSL",
        "name": "IRISL (Islamic Republic of Iran Shipping Lines)",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 55,
        "tracking_url": "https://www.irisl.net",
        "active": false
    },
    {
        "scac": "IQAX2",
        "name": "Rohlig India Pvt Ltd",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 66,
        "tracking_url": "https://www.rohlig.com",
        "active": true
    },
    {
        "scac": "SAGL",
        "name": "Safmarine (MAEU subsidiary)",
        "type": "OCEAN",
        "alliance": "2M",
        "reliability_score": 80,
        "tracking_url": "https://www.safmarine.com",
        "active": true
    },
    {
        "scac": "SVDR",
        "name": "Silverstar Shipping",
        "type": "OCEAN",
        "alliance": "Independent",
        "reliability_score": 63,
        "tracking_url": "https://www.silverstarshipping.com",
        "active": true
    },
    {
        "scac": "EK",
        "name": "Emirates SkyCargo",
        "type": "AIR",
        "iata": "EK",
        "alliance": "Independent",
        "reliability_score": 95,
        "tracking_url": "https://www.skycargo.com/english/tracking.aspx",
        "active": true
    },
    {
        "scac": "QR",
        "name": "Qatar Airways Cargo",
        "type": "AIR",
        "iata": "QR",
        "alliance": "Independent",
        "reliability_score": 93,
        "tracking_url": "https://www.qrcargo.com/s/track-your-shipment",
        "active": true
    },
    {
        "scac": "AI",
        "name": "Air India Cargo",
        "type": "AIR",
        "iata": "AI",
        "alliance": "Independent",
        "reliability_score": 80,
        "tracking_url": "https://cargo.airindia.com/eCargo/",
        "active": true
    },
    {
        "scac": "LH",
        "name": "Lufthansa Cargo",
        "type": "AIR",
        "iata": "LH",
        "alliance": "Star Alliance",
        "reliability_score": 91,
        "tracking_url": "https://lufthansa-cargo.com/tracking",
        "active": true
    },
    {
        "scac": "SQ",
        "name": "Singapore Airlines Cargo",
        "type": "AIR",
        "iata": "SQ",
        "alliance": "Star Alliance",
        "reliability_score": 92,
        "tracking_url": "https://www.singaporeair.com/en_UK/us/plan-travel/cargo/",
        "active": true
    },
    {
        "scac": "CV",
        "name": "Cargolux Airlines International",
        "type": "AIR",
        "iata": "CV",
        "alliance": "Independent",
        "reliability_score": 89,
        "tracking_url": "https://www.cargolux.com/en/Cargo-Services/Tracking/",
        "active": true
    },
    {
        "scac": "KE",
        "name": "Korean Air Cargo",
        "type": "AIR",
        "iata": "KE",
        "alliance": "SkyTeam",
        "reliability_score": 88,
        "tracking_url": "https://www.koreanair.com/content/koreanair/en/cargo/tracking.html",
        "active": true
    },
    {
        "scac": "CX",
        "name": "Cathay Cargo",
        "type": "AIR",
        "iata": "CX",
        "alliance": "Oneworld",
        "reliability_score": 90,
        "tracking_url": "https://www.cathaycargo.com/en-us/track/track-shipments.html",
        "active": true
    },
    {
        "scac": "TK",
        "name": "Turkish Cargo",
        "type": "AIR",
        "iata": "TK",
        "alliance": "Star Alliance",
        "reliability_score": 87,
        "tracking_url": "https://www.turkishcargo.com/en/online-services/tracking",
        "active": true
    },
    {
        "scac": "AFKL",
        "name": "Air France KLM Cargo",
        "type": "AIR",
        "iata": "AF",
        "alliance": "SkyTeam",
        "reliability_score": 89,
        "tracking_url": "https://www.afklcargo.com/WW/en/local/app/index.jsp#/myCargo/track-trace",
        "active": true
    },
    {
        "scac": "DHL_EXP",
        "name": "DHL Express Worldwide",
        "type": "AIR_EXPRESS",
        "iata": "D0",
        "alliance": "Express Integrator",
        "reliability_score": 98,
        "tracking_url": "https://www.dhl.com/en/express/tracking.html",
        "active": true
    },
    {
        "scac": "FX_EXP",
        "name": "FedEx Express Priority",
        "type": "AIR_EXPRESS",
        "iata": "FX",
        "alliance": "Express Integrator",
        "reliability_score": 97,
        "tracking_url": "https://www.fedex.com/en-in/tracking.html",
        "active": true
    },
    {
        "scac": "UPS_EXP",
        "name": "UPS Worldwide Express",
        "type": "AIR_EXPRESS",
        "iata": "5X",
        "alliance": "Express Integrator",
        "reliability_score": 96,
        "tracking_url": "https://www.ups.com/track",
        "active": true
    },
    {
        "scac": "ARMX_EXP",
        "name": "Aramex International Express",
        "type": "AIR_EXPRESS",
        "iata": "AR",
        "alliance": "Express Integrator",
        "reliability_score": 89,
        "tracking_url": "https://www.aramex.com/express/track-results",
        "active": true
    },
    {
        "scac": "BDART",
        "name": "Blue Dart Aviation",
        "type": "AIR_EXPRESS",
        "iata": "BZ",
        "alliance": "Express Integrator",
        "reliability_score": 94,
        "tracking_url": "https://www.bluedart.com/tracking",
        "active": true
    },
    {
        "scac": "SFX",
        "name": "SF Express / SF Airlines",
        "type": "AIR_EXPRESS",
        "iata": "O3",
        "alliance": "Express Integrator",
        "reliability_score": 93,
        "tracking_url": "https://www.sf-international.com/us/en/dynamic_function/waybill/",
        "active": true
    },
    {
        "scac": "DHL_FRT",
        "name": "DHL Freight Road Logistics",
        "type": "GROUND",
        "alliance": "Global Land Transport",
        "reliability_score": 94,
        "tracking_url": "https://www.dhl.com/global-en/home/our-divisions/freight.html",
        "active": true
    },
    {
        "scac": "DSV_RD",
        "name": "DSV Road Logistics",
        "type": "GROUND",
        "alliance": "Global Land Transport",
        "reliability_score": 92,
        "tracking_url": "https://www.dsv.com/en/our-solutions/modes-of-transport/road-transport",
        "active": true
    },
    {
        "scac": "SCHN_RD",
        "name": "DB Schenker Land Transport",
        "type": "GROUND",
        "alliance": "Global Land Transport",
        "reliability_score": 93,
        "tracking_url": "https://www.dbschenker.com/global/business-customers/tracking",
        "active": true
    },
    {
        "scac": "TCI_FRT",
        "name": "TCI Freight (Transport Corp of India)",
        "type": "GROUND",
        "alliance": "National FTL/LTL Leader",
        "reliability_score": 88,
        "tracking_url": "https://www.tcifreight.com",
        "active": true
    },
    {
        "scac": "VRL_LOG",
        "name": "VRL Logistics Surface Express",
        "type": "GROUND",
        "alliance": "National FTL/LTL Leader",
        "reliability_score": 87,
        "tracking_url": "https://www.vrlgroup.in/vrl_consignment_tracking.aspx",
        "active": true
    },
    {
        "scac": "GATI_KWE",
        "name": "Gati-Kintetsu Express (Gati KWE)",
        "type": "GROUND",
        "alliance": "Express Surface Logistics",
        "reliability_score": 86,
        "tracking_url": "https://www.gatikwe.com",
        "active": true
    },
    {
        "scac": "DELHIVERY",
        "name": "Delhivery Enterprise Surface Freight",
        "type": "GROUND",
        "alliance": "Tech-enabled Surface Logistics",
        "reliability_score": 90,
        "tracking_url": "https://www.delhivery.com/tracking",
        "active": true
    },
    {
        "scac": "CONCOR",
        "name": "Container Corporation of India (CONCOR Rail)",
        "type": "RAIL",
        "alliance": "Navratna Rail Intermodal",
        "reliability_score": 92,
        "tracking_url": "https://concorindia.co.in/c_track.asp",
        "active": true
    },
    {
        "scac": "DBC_RAIL",
        "name": "DB Cargo (Deutsche Bahn Rail Freight)",
        "type": "RAIL",
        "alliance": "European Rail Alliance",
        "reliability_score": 91,
        "tracking_url": "https://www.dbcargo.com",
        "active": true
    },
    {
        "scac": "UNP_RAIL",
        "name": "Union Pacific Intermodal Rail",
        "type": "RAIL",
        "alliance": "North American Class I Rail",
        "reliability_score": 89,
        "tracking_url": "https://www.up.com/customers/track/index.htm",
        "active": true
    },
    {
        "scac": "BNSF_RAIL",
        "name": "BNSF Railway Intermodal",
        "type": "RAIL",
        "alliance": "North American Class I Rail",
        "reliability_score": 90,
        "tracking_url": "https://www.bnsf.com/tools/track-your-shipment.html",
        "active": true
    },
    {
        "scac": "CN_RAIL",
        "name": "Canadian National Railway (CN Intermodal)",
        "type": "RAIL",
        "alliance": "North American Class I Rail",
        "reliability_score": 88,
        "tracking_url": "https://www.cn.ca/en/customer-centre/tools/track-and-trace/",
        "active": true
    },
    {
        "scac": "CR_EXP",
        "name": "China Railway Express (CR Express - New Silk Road)",
        "type": "RAIL",
        "alliance": "Eurasian Rail Corridor",
        "reliability_score": 85,
        "tracking_url": "http://www.crexpress.cn",
        "active": true
    }
]

SERVICE_TYPES = [
    {
        "code": "OCEAN_FCL",
        "name": "Ocean FCL (Full Container Load)",
        "mode": "OCEAN",
        "chargeable_weight_divisor": null,
        "min_chargeable_unit": "container",
        "active": true
    },
    {
        "code": "OCEAN_LCL",
        "name": "Ocean LCL (Less than Container Load)",
        "mode": "OCEAN",
        "chargeable_weight_divisor": 1000,
        "min_chargeable_unit": "kg",
        "min_chargeable_kg": 100,
        "active": true
    },
    {
        "code": "AIR_GEN",
        "name": "Air Freight \u2013 General Cargo (Standard)",
        "mode": "AIR",
        "chargeable_weight_divisor": 6000,
        "min_chargeable_unit": "kg",
        "min_chargeable_kg": 45,
        "active": true
    },
    {
        "code": "AIR_EXPRESS_NFO",
        "name": "Express Air \u2013 Next Flight Out (NFO) Priority",
        "mode": "AIR_EXPRESS",
        "chargeable_weight_divisor": 5000,
        "min_chargeable_unit": "kg",
        "min_chargeable_kg": 0.5,
        "active": true
    },
    {
        "code": "AIR_COURIER",
        "name": "Express Air \u2013 Time-Definite Door-to-Door Courier",
        "mode": "AIR_EXPRESS",
        "chargeable_weight_divisor": 5000,
        "min_chargeable_unit": "kg",
        "min_chargeable_kg": 0.5,
        "active": true
    },
    {
        "code": "AIR_CHARTER",
        "name": "Express Air \u2013 Dedicated Full Aircraft Charter",
        "mode": "AIR_EXPRESS",
        "chargeable_weight_divisor": 6000,
        "min_chargeable_unit": "aircraft",
        "active": true
    },
    {
        "code": "GROUND_FTL",
        "name": "Ground Road \u2013 Full Truckload (FTL)",
        "mode": "GROUND",
        "chargeable_weight_divisor": 3000,
        "min_chargeable_unit": "truck",
        "active": true
    },
    {
        "code": "GROUND_LTL",
        "name": "Ground Road \u2013 Less Than Truckload (LTL / Part Load)",
        "mode": "GROUND",
        "chargeable_weight_divisor": 4000,
        "min_chargeable_unit": "kg",
        "min_chargeable_kg": 20,
        "active": true
    },
    {
        "code": "GROUND_EXPRESS_TRK",
        "name": "Ground Road \u2013 Dedicated Express Linehaul Trucking",
        "mode": "GROUND",
        "chargeable_weight_divisor": 3000,
        "min_chargeable_unit": "truck",
        "active": true
    },
    {
        "code": "RAIL_INTERMODAL",
        "name": "Rail Freight \u2013 Intermodal Container Corridor (ICD)",
        "mode": "RAIL",
        "chargeable_weight_divisor": null,
        "min_chargeable_unit": "container",
        "active": true
    },
    {
        "code": "RAIL_BULK_WAGON",
        "name": "Rail Freight \u2013 Bulk Wagonload / Dedicated Rake",
        "mode": "RAIL",
        "chargeable_weight_divisor": null,
        "min_chargeable_unit": "wagon",
        "active": true
    },
    {
        "code": "MULTIMODAL",
        "name": "Multimodal (Sea + Rail / Road Hub-to-Door)",
        "mode": "MULTIMODAL",
        "chargeable_weight_divisor": null,
        "min_chargeable_unit": "varies",
        "active": true
    }
]

CONTAINER_TYPES = [
    {
        "iso_code": "22G1",
        "code": "20GP",
        "name": "20ft General Purpose",
        "teu": 1,
        "internal_length_m": 5.898,
        "internal_width_m": 2.352,
        "internal_height_m": 2.392,
        "internal_cbm": 33.2,
        "max_payload_kg": 21800,
        "tare_kg": 2200,
        "is_reefer": false,
        "category": "OCEAN/RAIL",
        "active": true
    },
    {
        "iso_code": "42G1",
        "code": "40GP",
        "name": "40ft General Purpose",
        "teu": 2,
        "internal_length_m": 12.032,
        "internal_width_m": 2.352,
        "internal_height_m": 2.392,
        "internal_cbm": 67.7,
        "max_payload_kg": 26600,
        "tare_kg": 3780,
        "is_reefer": false,
        "category": "OCEAN/RAIL",
        "active": true
    },
    {
        "iso_code": "45G1",
        "code": "40HC",
        "name": "40ft High Cube",
        "teu": 2,
        "internal_length_m": 12.032,
        "internal_width_m": 2.352,
        "internal_height_m": 2.698,
        "internal_cbm": 76.4,
        "max_payload_kg": 28800,
        "tare_kg": 3900,
        "is_reefer": false,
        "category": "OCEAN/RAIL",
        "active": true
    },
    {
        "iso_code": "L5G1",
        "code": "45HC",
        "name": "45ft High Cube",
        "teu": 2.25,
        "internal_length_m": 13.556,
        "internal_width_m": 2.352,
        "internal_height_m": 2.698,
        "internal_cbm": 86.0,
        "max_payload_kg": 27600,
        "tare_kg": 4800,
        "is_reefer": false,
        "category": "OCEAN/RAIL",
        "active": true
    },
    {
        "iso_code": "45PW",
        "code": "45PW",
        "name": "45ft Euro Palletwide High Cube (33 Euro Pallets)",
        "teu": 2.25,
        "internal_length_m": 13.556,
        "internal_width_m": 2.444,
        "internal_height_m": 2.698,
        "internal_cbm": 89.2,
        "max_payload_kg": 29000,
        "tare_kg": 4920,
        "is_reefer": false,
        "category": "RAIL/SHORTSEA",
        "active": true
    },
    {
        "iso_code": "53DOM",
        "code": "53DOM",
        "name": "53ft North American Domestic Intermodal Container",
        "teu": 2.65,
        "internal_length_m": 16.002,
        "internal_width_m": 2.49,
        "internal_height_m": 2.79,
        "internal_cbm": 111.0,
        "max_payload_kg": 20400,
        "tare_kg": 5300,
        "is_reefer": false,
        "category": "RAIL/GROUND",
        "active": true
    },
    {
        "iso_code": "22R1",
        "code": "20RF",
        "name": "20ft Reefer",
        "teu": 1,
        "internal_length_m": 5.456,
        "internal_width_m": 2.268,
        "internal_height_m": 2.272,
        "internal_cbm": 28.3,
        "max_payload_kg": 21000,
        "tare_kg": 2900,
        "is_reefer": true,
        "temp_range_c": "-30 to +30",
        "category": "OCEAN/RAIL",
        "active": true
    },
    {
        "iso_code": "42R1",
        "code": "40RF",
        "name": "40ft Reefer High Cube",
        "teu": 2,
        "internal_length_m": 11.583,
        "internal_width_m": 2.268,
        "internal_height_m": 2.4,
        "internal_cbm": 63.2,
        "max_payload_kg": 27700,
        "tare_kg": 4660,
        "is_reefer": true,
        "temp_range_c": "-30 to +30",
        "category": "OCEAN/RAIL",
        "active": true
    },
    {
        "iso_code": "22U1",
        "code": "20OT",
        "name": "20ft Open Top",
        "teu": 1,
        "internal_length_m": 5.898,
        "internal_width_m": 2.352,
        "internal_height_m": 2.35,
        "internal_cbm": 32.5,
        "max_payload_kg": 21000,
        "tare_kg": 2400,
        "is_reefer": false,
        "category": "OCEAN/RAIL",
        "active": true
    },
    {
        "iso_code": "42P3",
        "code": "40FR",
        "name": "40ft Flat Rack (Collapsible)",
        "teu": 2,
        "internal_length_m": 12.088,
        "internal_width_m": 2.4,
        "internal_height_m": 1.942,
        "internal_cbm": null,
        "max_payload_kg": 40600,
        "tare_kg": 5720,
        "is_reefer": false,
        "category": "OCEAN/RAIL",
        "active": true
    },
    {
        "iso_code": "RFLT",
        "code": "RAIL_FLAT",
        "name": "ISO 60ft Rail Flat Wagon (2x20ft or 1x40ft)",
        "teu": 3,
        "internal_length_m": 18.288,
        "internal_width_m": 2.438,
        "internal_height_m": null,
        "internal_cbm": null,
        "max_payload_kg": 61000,
        "tare_kg": 19000,
        "is_reefer": false,
        "category": "RAIL",
        "active": true
    },
    {
        "iso_code": "CURT",
        "code": "MEGA_TRAILER",
        "name": "13.6m European Curtainsider Mega Trailer (34 Pallets)",
        "teu": 2.5,
        "internal_length_m": 13.62,
        "internal_width_m": 2.48,
        "internal_height_m": 3.0,
        "internal_cbm": 100.0,
        "max_payload_kg": 24000,
        "tare_kg": 7200,
        "is_reefer": false,
        "category": "GROUND",
        "active": true
    },
    {
        "iso_code": "TRK32",
        "code": "TRUCK_32FT",
        "name": "32ft Multi-Axle Containerized Truck Body (HQ FTL)",
        "teu": 1.6,
        "internal_length_m": 9.75,
        "internal_width_m": 2.4,
        "internal_height_m": 2.4,
        "internal_cbm": 56.0,
        "max_payload_kg": 15000,
        "tare_kg": 8000,
        "is_reefer": false,
        "category": "GROUND",
        "active": true
    },
    {
        "iso_code": "AKE",
        "code": "ULD_AKE",
        "name": "LD3 / AKE Express Air Container (Aircraft Lower Deck)",
        "teu": 0.3,
        "internal_length_m": 1.56,
        "internal_width_m": 1.53,
        "internal_height_m": 1.63,
        "internal_cbm": 4.3,
        "max_payload_kg": 1588,
        "tare_kg": 75,
        "is_reefer": false,
        "category": "EXPRESS_AIR",
        "active": true
    },
    {
        "iso_code": "AKH",
        "code": "ULD_AKH",
        "name": "LD3-45 / AKH Lower Deck Aircraft Express Container",
        "teu": 0.3,
        "internal_length_m": 1.56,
        "internal_width_m": 1.53,
        "internal_height_m": 1.14,
        "internal_cbm": 3.6,
        "max_payload_kg": 1134,
        "tare_kg": 65,
        "is_reefer": false,
        "category": "EXPRESS_AIR",
        "active": true
    }
]

CARGO_TYPES = [
    {
        "code": "GEN",
        "name": "General Cargo",
        "imo_class": null,
        "requires_temp_control": false,
        "is_hazmat": false,
        "surcharge_pct": 0,
        "active": true
    },
    {
        "code": "PERISHABLE",
        "name": "Perishable \u2013 Food & Beverages",
        "imo_class": null,
        "requires_temp_control": true,
        "temp_range_c": "2 to 8",
        "is_hazmat": false,
        "surcharge_pct": 12,
        "active": true
    },
    {
        "code": "PHARMA",
        "name": "Pharmaceuticals & Life Sciences",
        "imo_class": null,
        "requires_temp_control": true,
        "temp_range_c": "2 to 8",
        "is_hazmat": false,
        "surcharge_pct": 15,
        "active": true
    },
    {
        "code": "DG2",
        "name": "Hazmat \u2013 DG Class 2 (Gases)",
        "imo_class": "2",
        "requires_temp_control": false,
        "is_hazmat": true,
        "surcharge_pct": 20,
        "active": true
    },
    {
        "code": "DG3",
        "name": "Hazmat \u2013 DG Class 3 (Flammable Liquids)",
        "imo_class": "3",
        "requires_temp_control": false,
        "is_hazmat": true,
        "surcharge_pct": 25,
        "active": true
    },
    {
        "code": "DG4",
        "name": "Hazmat \u2013 DG Class 4 (Flammable Solids)",
        "imo_class": "4",
        "requires_temp_control": false,
        "is_hazmat": true,
        "surcharge_pct": 20,
        "active": true
    },
    {
        "code": "DG6",
        "name": "Hazmat \u2013 DG Class 6 (Toxic Substances)",
        "imo_class": "6",
        "requires_temp_control": false,
        "is_hazmat": true,
        "surcharge_pct": 30,
        "active": true
    },
    {
        "code": "DG8",
        "name": "Hazmat \u2013 DG Class 8 (Corrosives)",
        "imo_class": "8",
        "requires_temp_control": false,
        "is_hazmat": true,
        "surcharge_pct": 22,
        "active": true
    },
    {
        "code": "DG9",
        "name": "Hazmat \u2013 DG Class 9 (Misc. Dangerous)",
        "imo_class": "9",
        "requires_temp_control": false,
        "is_hazmat": true,
        "surcharge_pct": 10,
        "active": true
    },
    {
        "code": "LIION",
        "name": "Lithium Batteries (Cargo only, UN3480/3481)",
        "imo_class": "9",
        "requires_temp_control": false,
        "is_hazmat": true,
        "surcharge_pct": 18,
        "active": true
    },
    {
        "code": "AUTOPARTS",
        "name": "Automotive Parts & Accessories",
        "imo_class": null,
        "requires_temp_control": false,
        "is_hazmat": false,
        "surcharge_pct": 5,
        "active": true
    },
    {
        "code": "HEAVY",
        "name": "Heavy Lift / Out-of-Gauge (OOG)",
        "imo_class": null,
        "requires_temp_control": false,
        "is_hazmat": false,
        "surcharge_pct": 35,
        "active": true
    }
]

COMMODITIES = [
    {
        "hs6": "620342",
        "desc": "Men's suits/ensembles of cotton",
        "section": "XI",
        "cargo_type": "GEN",
        "typical_duty_pct": 12,
        "active": true
    },
    {
        "hs6": "620462",
        "desc": "Women's trousers/breeches of cotton",
        "section": "XI",
        "cargo_type": "GEN",
        "typical_duty_pct": 12,
        "active": true
    },
    {
        "hs6": "610910",
        "desc": "T-shirts of cotton, knitted",
        "section": "XI",
        "cargo_type": "GEN",
        "typical_duty_pct": 12,
        "active": true
    },
    {
        "hs6": "870899",
        "desc": "Parts & accessories of motor vehicles, NES",
        "section": "XVII",
        "cargo_type": "AUTOPARTS",
        "typical_duty_pct": 7.5,
        "active": true
    },
    {
        "hs6": "870421",
        "desc": "Motor vehicles for goods transport (diesel, \u22645t)",
        "section": "XVII",
        "cargo_type": "AUTOPARTS",
        "typical_duty_pct": 10,
        "active": true
    },
    {
        "hs6": "300490",
        "desc": "Medicaments, mixed or unmixed, retail pack",
        "section": "VI",
        "cargo_type": "PHARMA",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "300210",
        "desc": "Antisera and other blood fractions (vaccines)",
        "section": "VI",
        "cargo_type": "PHARMA",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "851712",
        "desc": "Telephones for cellular networks (smartphones)",
        "section": "XVI",
        "cargo_type": "GEN",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "854231",
        "desc": "Electronic integrated circuits \u2013 processors",
        "section": "XVI",
        "cargo_type": "GEN",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "847330",
        "desc": "Parts/accessories for automatic data processing machines",
        "section": "XVI",
        "cargo_type": "GEN",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "190190",
        "desc": "Malt extract; food prep of flour (food)",
        "section": "IV",
        "cargo_type": "PERISHABLE",
        "typical_duty_pct": 8,
        "active": true
    },
    {
        "hs6": "100190",
        "desc": "Wheat other than durum wheat (bulk)",
        "section": "II",
        "cargo_type": "GEN",
        "typical_duty_pct": 5,
        "active": true
    },
    {
        "hs6": "230120",
        "desc": "Flours/meals/pellets of fish (fishmeal)",
        "section": "II",
        "cargo_type": "GEN",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "270900",
        "desc": "Petroleum oils, crude",
        "section": "V",
        "cargo_type": "DG3",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "271011",
        "desc": "Light oils and preparations (petrol/gasoline)",
        "section": "V",
        "cargo_type": "DG3",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "280920",
        "desc": "Phosphoric acid and polyphosphoric acids",
        "section": "VI",
        "cargo_type": "DG8",
        "typical_duty_pct": 5,
        "active": true
    },
    {
        "hs6": "850650",
        "desc": "Lithium primary cells and batteries",
        "section": "XVI",
        "cargo_type": "LIION",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "850760",
        "desc": "Lithium-ion accumulators (rechargeable)",
        "section": "XVI",
        "cargo_type": "LIION",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "940360",
        "desc": "Wooden furniture for domestic purposes",
        "section": "XX",
        "cargo_type": "GEN",
        "typical_duty_pct": 10,
        "active": true
    },
    {
        "hs6": "940161",
        "desc": "Seats with metal frame (upholstered)",
        "section": "XX",
        "cargo_type": "GEN",
        "typical_duty_pct": 10,
        "active": true
    },
    {
        "hs6": "720839",
        "desc": "Flat-rolled iron/steel products (coil)",
        "section": "XV",
        "cargo_type": "HEAVY",
        "typical_duty_pct": 5,
        "active": true
    },
    {
        "hs6": "760110",
        "desc": "Aluminium, unwrought",
        "section": "XV",
        "cargo_type": "GEN",
        "typical_duty_pct": 2,
        "active": true
    },
    {
        "hs6": "520100",
        "desc": "Cotton, not carded or combed (raw cotton)",
        "section": "XI",
        "cargo_type": "GEN",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "520811",
        "desc": "Woven fabrics of cotton, plain weave (bleached)",
        "section": "XI",
        "cargo_type": "GEN",
        "typical_duty_pct": 10,
        "active": true
    },
    {
        "hs6": "390110",
        "desc": "Polyethylene with density < 0.94 (LDPE)",
        "section": "VII",
        "cargo_type": "DG3",
        "typical_duty_pct": 5,
        "active": true
    },
    {
        "hs6": "390210",
        "desc": "Polypropylene in primary forms",
        "section": "VII",
        "cargo_type": "GEN",
        "typical_duty_pct": 5,
        "active": true
    },
    {
        "hs6": "84713000",
        "desc": "Portable automatic data processing machines (laptops)",
        "section": "XVI",
        "cargo_type": "GEN",
        "typical_duty_pct": 0,
        "active": true
    },
    {
        "hs6": "950300",
        "desc": "Toys (bicycles, scooters, puzzles, dolls etc.)",
        "section": "XX",
        "cargo_type": "GEN",
        "typical_duty_pct": 12,
        "active": true
    },
    {
        "hs6": "560219",
        "desc": "Textile wadding and articles thereof, NES",
        "section": "XI",
        "cargo_type": "GEN",
        "typical_duty_pct": 10,
        "active": true
    },
    {
        "hs6": "842199",
        "desc": "Filtering/purifying machinery parts (industrial)",
        "section": "XVI",
        "cargo_type": "GEN",
        "typical_duty_pct": 5,
        "active": true
    }
]

PACKAGING_TYPES = [
    {
        "code": "PLT_EUR",
        "name": "Euro Pallet (1200\u00d7800mm)",
        "standard": "ISO 6780",
        "length_mm": 1200,
        "width_mm": 800,
        "height_mm": 145,
        "tare_kg": 25,
        "stackable": true,
        "max_stack_kg": 4000,
        "active": true
    },
    {
        "code": "PLT_STD",
        "name": "Standard Pallet (1200\u00d71000mm)",
        "standard": "ISO 6780",
        "length_mm": 1200,
        "width_mm": 1000,
        "height_mm": 145,
        "tare_kg": 30,
        "stackable": true,
        "max_stack_kg": 4500,
        "active": true
    },
    {
        "code": "PLT_US",
        "name": "GMA Pallet / North American 48\u00d740",
        "standard": "GMA",
        "length_mm": 1219,
        "width_mm": 1016,
        "height_mm": 145,
        "tare_kg": 29,
        "stackable": true,
        "max_stack_kg": 4500,
        "active": true
    },
    {
        "code": "CTN",
        "name": "Corrugated Carton Box (Master Carton)",
        "standard": "ASTM D4169",
        "length_mm": null,
        "width_mm": null,
        "height_mm": null,
        "tare_kg": 0.8,
        "stackable": true,
        "max_stack_kg": 600,
        "active": true
    },
    {
        "code": "CRATE",
        "name": "Wooden Crate (ISPM-15 Heat Treated)",
        "standard": "ISPM 15",
        "length_mm": null,
        "width_mm": null,
        "height_mm": null,
        "tare_kg": null,
        "stackable": false,
        "max_stack_kg": null,
        "active": true
    },
    {
        "code": "DRUM_S",
        "name": "Steel Drum (200L / 55 gal)",
        "standard": "UN 1A1",
        "length_mm": null,
        "width_mm": null,
        "height_mm": 880,
        "capacity_litres": 200,
        "tare_kg": 22,
        "stackable": false,
        "active": true
    },
    {
        "code": "DRUM_P",
        "name": "Plastic Drum (200L)",
        "standard": "UN 1H1",
        "length_mm": null,
        "width_mm": null,
        "height_mm": 870,
        "capacity_litres": 200,
        "tare_kg": 9,
        "stackable": false,
        "active": true
    },
    {
        "code": "FLEXIBAG",
        "name": "Flexitank (Liquid Bulk in 20GP)",
        "standard": "CoA",
        "capacity_litres": 24000,
        "tare_kg": null,
        "stackable": false,
        "active": true
    },
    {
        "code": "EXP_ENV",
        "name": "Express Document Flyer Envelope",
        "standard": "IATA Couriers",
        "length_mm": 350,
        "width_mm": 250,
        "height_mm": 10,
        "tare_kg": 0.05,
        "stackable": true,
        "active": true
    },
    {
        "code": "EXP_BOX_10",
        "name": "10kg Express Air Rigid Box",
        "standard": "IATA Priority",
        "length_mm": 410,
        "width_mm": 320,
        "height_mm": 310,
        "tare_kg": 0.6,
        "stackable": true,
        "active": true
    },
    {
        "code": "EXP_BOX_25",
        "name": "25kg Express Air Heavy Duty Box",
        "standard": "IATA Priority",
        "length_mm": 540,
        "width_mm": 440,
        "height_mm": 410,
        "tare_kg": 1.2,
        "stackable": true,
        "active": true
    }
]

INCOTERMS = [
    {
        "code": "EXW",
        "name": "Ex Works",
        "version": 2020,
        "seller_pays": [],
        "buyer_pays": [
            "export_customs",
            "origin_haulage",
            "origin_port",
            "main_freight",
            "import_customs",
            "dest_port",
            "dest_haulage"
        ],
        "risk_transfer": "Seller's premises",
        "modes": [
            "ALL"
        ],
        "active": true
    },
    {
        "code": "FCA",
        "name": "Free Carrier",
        "version": 2020,
        "seller_pays": [
            "export_customs"
        ],
        "buyer_pays": [
            "origin_haulage",
            "origin_port",
            "main_freight",
            "import_customs",
            "dest_port",
            "dest_haulage"
        ],
        "risk_transfer": "Named place/carrier",
        "modes": [
            "ALL"
        ],
        "active": true
    },
    {
        "code": "FAS",
        "name": "Free Alongside Ship",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage"
        ],
        "buyer_pays": [
            "loading",
            "main_freight",
            "import_customs",
            "dest_port",
            "dest_haulage"
        ],
        "risk_transfer": "Alongside ship at origin port",
        "modes": [
            "OCEAN"
        ],
        "active": true
    },
    {
        "code": "FOB",
        "name": "Free On Board",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage",
            "loading"
        ],
        "buyer_pays": [
            "main_freight",
            "import_customs",
            "dest_port",
            "dest_haulage"
        ],
        "risk_transfer": "On board vessel at origin port",
        "modes": [
            "OCEAN"
        ],
        "active": true
    },
    {
        "code": "CFR",
        "name": "Cost and Freight",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage",
            "loading",
            "main_freight"
        ],
        "buyer_pays": [
            "import_customs",
            "dest_port",
            "dest_haulage"
        ],
        "risk_transfer": "On board vessel at origin port",
        "modes": [
            "OCEAN"
        ],
        "active": true
    },
    {
        "code": "CIF",
        "name": "Cost, Insurance and Freight",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage",
            "loading",
            "main_freight",
            "insurance"
        ],
        "buyer_pays": [
            "import_customs",
            "dest_port",
            "dest_haulage"
        ],
        "risk_transfer": "On board vessel at origin port",
        "modes": [
            "OCEAN"
        ],
        "active": true
    },
    {
        "code": "CPT",
        "name": "Carriage Paid To",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage",
            "loading",
            "main_freight"
        ],
        "buyer_pays": [
            "import_customs",
            "dest_haulage"
        ],
        "risk_transfer": "First carrier at origin",
        "modes": [
            "ALL"
        ],
        "active": true
    },
    {
        "code": "CIP",
        "name": "Carriage and Insurance Paid To",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage",
            "loading",
            "main_freight",
            "insurance"
        ],
        "buyer_pays": [
            "import_customs",
            "dest_haulage"
        ],
        "risk_transfer": "First carrier at origin",
        "modes": [
            "ALL"
        ],
        "active": true
    },
    {
        "code": "DAP",
        "name": "Delivered at Place",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage",
            "loading",
            "main_freight",
            "dest_haulage"
        ],
        "buyer_pays": [
            "import_customs",
            "unloading"
        ],
        "risk_transfer": "Named place of destination (ready for unloading)",
        "modes": [
            "ALL"
        ],
        "active": true
    },
    {
        "code": "DPU",
        "name": "Delivered at Place Unloaded",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage",
            "loading",
            "main_freight",
            "dest_haulage",
            "unloading"
        ],
        "buyer_pays": [
            "import_customs"
        ],
        "risk_transfer": "Named place of destination (after unloading)",
        "modes": [
            "ALL"
        ],
        "active": true
    },
    {
        "code": "DDP",
        "name": "Delivered Duty Paid",
        "version": 2020,
        "seller_pays": [
            "export_customs",
            "origin_haulage",
            "loading",
            "main_freight",
            "import_customs",
            "dest_haulage",
            "unloading"
        ],
        "buyer_pays": [],
        "risk_transfer": "Named place of destination (import cleared)",
        "modes": [
            "ALL"
        ],
        "active": true
    }
]

CHARGE_HEADS = [
    {
        "code": "OFR",
        "name": "Ocean Freight Linehaul",
        "category": "MAIN_FREIGHT",
        "applies_to": [
            "OCEAN"
        ],
        "uom": "per_container",
        "taxable": false,
        "active": true
    },
    {
        "code": "AFR",
        "name": "Air Freight \u2013 General Cargo",
        "category": "MAIN_FREIGHT",
        "applies_to": [
            "AIR"
        ],
        "uom": "per_kg_chargeable",
        "taxable": false,
        "active": true
    },
    {
        "code": "AFR_EXP",
        "name": "Express Air Priority Charge",
        "category": "MAIN_FREIGHT",
        "applies_to": [
            "AIR_EXPRESS"
        ],
        "uom": "per_kg_chargeable",
        "taxable": false,
        "active": true
    },
    {
        "code": "ROAD_LH",
        "name": "Road Freight Linehaul (FTL/LTL)",
        "category": "MAIN_FREIGHT",
        "applies_to": [
            "GROUND"
        ],
        "uom": "per_truck_or_kg",
        "taxable": true,
        "active": true
    },
    {
        "code": "RAIL_FRT",
        "name": "Intermodal Rail Freight",
        "category": "MAIN_FREIGHT",
        "applies_to": [
            "RAIL"
        ],
        "uom": "per_container_or_rake",
        "taxable": true,
        "active": true
    },
    {
        "code": "THC_O",
        "name": "Origin Terminal Handling Charge (THC)",
        "category": "ORIGIN",
        "applies_to": [
            "OCEAN"
        ],
        "uom": "per_container",
        "taxable": true,
        "active": true
    },
    {
        "code": "ORT",
        "name": "Origin Road Transport / Haulage",
        "category": "ORIGIN",
        "applies_to": [
            "ALL"
        ],
        "uom": "per_truck",
        "taxable": true,
        "active": true
    },
    {
        "code": "CUSEXP_O",
        "name": "Origin Customs Export Clearance",
        "category": "ORIGIN",
        "applies_to": [
            "ALL"
        ],
        "uom": "per_shipment",
        "taxable": true,
        "active": true
    },
    {
        "code": "VGMFEE",
        "name": "VGM (Verified Gross Mass) Fee",
        "category": "ORIGIN",
        "applies_to": [
            "OCEAN_FCL"
        ],
        "uom": "per_container",
        "taxable": true,
        "active": true
    },
    {
        "code": "CFS_O",
        "name": "Origin CFS Stuffing / De-stuffing (LCL)",
        "category": "ORIGIN",
        "applies_to": [
            "OCEAN_LCL"
        ],
        "uom": "per_cbm",
        "taxable": true,
        "active": true
    },
    {
        "code": "ICD_HANDLING",
        "name": "Inland Container Depot (ICD) Railhead Lift Fee",
        "category": "ORIGIN",
        "applies_to": [
            "RAIL"
        ],
        "uom": "per_container",
        "taxable": true,
        "active": true
    },
    {
        "code": "TOLL_FEE",
        "name": "National Highway Tolls & Fastag Electronic Fee",
        "category": "SURCHARGE",
        "applies_to": [
            "GROUND"
        ],
        "uom": "per_trip",
        "taxable": true,
        "active": true
    },
    {
        "code": "DETENTION_TRK",
        "name": "Vehicle Detention / Waiting Time Fee",
        "category": "ADMIN",
        "applies_to": [
            "GROUND"
        ],
        "uom": "per_hour",
        "taxable": true,
        "active": true
    },
    {
        "code": "EXP_NFO",
        "name": "Next Flight Out Expedited Handling Fee",
        "category": "SURCHARGE",
        "applies_to": [
            "AIR_EXPRESS"
        ],
        "uom": "per_shipment",
        "taxable": true,
        "active": true
    },
    {
        "code": "EXP_BONDED",
        "name": "Express Bonded Ramp Transfer Fee",
        "category": "ORIGIN",
        "applies_to": [
            "AIR_EXPRESS"
        ],
        "uom": "per_shipment",
        "taxable": true,
        "active": true
    },
    {
        "code": "BAF",
        "name": "Bunker Adjustment Factor (BAF/EBS)",
        "category": "SURCHARGE",
        "applies_to": [
            "OCEAN"
        ],
        "uom": "per_container",
        "taxable": false,
        "active": true
    },
    {
        "code": "CAF",
        "name": "Currency Adjustment Factor (CAF)",
        "category": "SURCHARGE",
        "applies_to": [
            "OCEAN"
        ],
        "uom": "per_container",
        "taxable": false,
        "active": true
    },
    {
        "code": "PSS",
        "name": "Peak Season Surcharge (PSS)",
        "category": "SURCHARGE",
        "applies_to": [
            "OCEAN"
        ],
        "uom": "per_container",
        "taxable": false,
        "active": true
    },
    {
        "code": "WRS",
        "name": "War Risk Surcharge (WRS)",
        "category": "SURCHARGE",
        "applies_to": [
            "OCEAN",
            "AIR"
        ],
        "uom": "per_container",
        "taxable": false,
        "active": true
    },
    {
        "code": "CLS",
        "name": "Congestion Surcharge",
        "category": "SURCHARGE",
        "applies_to": [
            "OCEAN"
        ],
        "uom": "per_container",
        "taxable": false,
        "active": true
    },
    {
        "code": "REDSEA",
        "name": "Red Sea / Suez Avoidance Surcharge",
        "category": "SURCHARGE",
        "applies_to": [
            "OCEAN"
        ],
        "uom": "per_container",
        "taxable": false,
        "active": true
    },
    {
        "code": "DGS",
        "name": "Dangerous Goods Surcharge (DGS)",
        "category": "SURCHARGE",
        "applies_to": [
            "ALL"
        ],
        "uom": "per_container",
        "taxable": false,
        "active": true
    },
    {
        "code": "REEFER",
        "name": "Reefer/Cold Chain Operating Surcharge",
        "category": "SURCHARGE",
        "applies_to": [
            "OCEAN_FCL"
        ],
        "uom": "per_container_day",
        "taxable": false,
        "active": true
    },
    {
        "code": "THC_D",
        "name": "Destination Terminal Handling Charge (DTHC)",
        "category": "DESTINATION",
        "applies_to": [
            "OCEAN"
        ],
        "uom": "per_container",
        "taxable": true,
        "active": true
    },
    {
        "code": "DRT",
        "name": "Destination Road Transport / Haulage",
        "category": "DESTINATION",
        "applies_to": [
            "ALL"
        ],
        "uom": "per_truck",
        "taxable": true,
        "active": true
    },
    {
        "code": "CUSEXP_D",
        "name": "Destination Customs Import Clearance",
        "category": "DESTINATION",
        "applies_to": [
            "ALL"
        ],
        "uom": "per_shipment",
        "taxable": true,
        "active": true
    },
    {
        "code": "CFS_D",
        "name": "Destination CFS De-stuffing (LCL)",
        "category": "DESTINATION",
        "applies_to": [
            "OCEAN_LCL"
        ],
        "uom": "per_cbm",
        "taxable": true,
        "active": true
    },
    {
        "code": "DOC",
        "name": "Documentation Fee / BL/AWB Issuance",
        "category": "ADMIN",
        "applies_to": [
            "ALL"
        ],
        "uom": "per_BL",
        "taxable": true,
        "active": true
    },
    {
        "code": "SURCHS",
        "name": "High-Security ISO Seal Charge",
        "category": "ADMIN",
        "applies_to": [
            "OCEAN_FCL",
            "RAIL"
        ],
        "uom": "per_container",
        "taxable": true,
        "active": true
    },
    {
        "code": "INS",
        "name": "Cargo All-Risk Marine/Transit Insurance",
        "category": "INSURANCE",
        "applies_to": [
            "ALL"
        ],
        "uom": "pct_of_cargo_value",
        "taxable": false,
        "active": true
    },
    {
        "code": "FUEL_AIR",
        "name": "Air Fuel Surcharge (FSC)",
        "category": "SURCHARGE",
        "applies_to": [
            "AIR",
            "AIR_EXPRESS"
        ],
        "uom": "per_kg_chargeable",
        "taxable": false,
        "active": true
    },
    {
        "code": "SECURAIR",
        "name": "Air Security Surcharge (SSC)",
        "category": "SURCHARGE",
        "applies_to": [
            "AIR",
            "AIR_EXPRESS"
        ],
        "uom": "per_kg_chargeable",
        "taxable": false,
        "active": true
    },
    {
        "code": "XRAY",
        "name": "X-Ray / Explosive Screening Fee",
        "category": "ORIGIN",
        "applies_to": [
            "AIR",
            "AIR_EXPRESS"
        ],
        "uom": "per_shipment",
        "taxable": true,
        "active": true
    }
]

CURRENCIES = [
    {
        "code": "USD",
        "name": "US Dollar",
        "symbol": "$",
        "decimals": 2,
        "active": true
    },
    {
        "code": "INR",
        "name": "Indian Rupee",
        "symbol": "\u20b9",
        "decimals": 2,
        "active": true
    },
    {
        "code": "EUR",
        "name": "Euro",
        "symbol": "\u20ac",
        "decimals": 2,
        "active": true
    },
    {
        "code": "AED",
        "name": "UAE Dirham",
        "symbol": "AED",
        "decimals": 2,
        "active": true
    },
    {
        "code": "GBP",
        "name": "British Pound Sterling",
        "symbol": "\u00a3",
        "decimals": 2,
        "active": true
    },
    {
        "code": "SGD",
        "name": "Singapore Dollar",
        "symbol": "S$",
        "decimals": 2,
        "active": true
    },
    {
        "code": "CNY",
        "name": "Chinese Yuan (Renminbi)",
        "symbol": "\u00a5",
        "decimals": 2,
        "active": true
    },
    {
        "code": "JPY",
        "name": "Japanese Yen",
        "symbol": "\u00a5",
        "decimals": 0,
        "active": true
    },
    {
        "code": "AUD",
        "name": "Australian Dollar",
        "symbol": "A$",
        "decimals": 2,
        "active": true
    },
    {
        "code": "SAR",
        "name": "Saudi Riyal",
        "symbol": "SR",
        "decimals": 2,
        "active": true
    },
    {
        "code": "BRL",
        "name": "Brazilian Real",
        "symbol": "R$",
        "decimals": 2,
        "active": true
    },
    {
        "code": "CAD",
        "name": "Canadian Dollar",
        "symbol": "CA$",
        "decimals": 2,
        "active": true
    }
]

EXCHANGE_RATES = [
    {
        "from_ccy": "USD",
        "to_ccy": "INR",
        "rate": 84.0,
        "effective_date": "2025-12-01",
        "source": "RBI",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "EUR",
        "rate": 0.918,
        "effective_date": "2025-12-01",
        "source": "ECB",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "AED",
        "rate": 3.671,
        "effective_date": "2025-12-01",
        "source": "UAE Central Bank",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "GBP",
        "rate": 0.795,
        "effective_date": "2025-12-01",
        "source": "Bank of England",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "SGD",
        "rate": 1.338,
        "effective_date": "2025-12-01",
        "source": "MAS",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "CNY",
        "rate": 7.247,
        "effective_date": "2025-12-01",
        "source": "PBOC",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "JPY",
        "rate": 151.5,
        "effective_date": "2025-12-01",
        "source": "Bank of Japan",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "AUD",
        "rate": 1.542,
        "effective_date": "2025-12-01",
        "source": "RBA",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "SAR",
        "rate": 3.75,
        "effective_date": "2025-12-01",
        "source": "SAMA",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "BRL",
        "rate": 4.935,
        "effective_date": "2025-12-01",
        "source": "BCB",
        "active": true
    },
    {
        "from_ccy": "USD",
        "to_ccy": "CAD",
        "rate": 1.359,
        "effective_date": "2025-12-01",
        "source": "Bank of Canada",
        "active": true
    }
]

RATE_CARDS = [
    {
        "card_id": "RC-2026-MAEU-INME-001",
        "carrier_scac": "MAEU",
        "trade": "INDIA - MIDDLE EAST",
        "service_type": "OCEAN_FCL",
        "validity_from": "2026-01-01",
        "validity_to": "2026-06-30",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "INNSA-AEJEA-OCEAN",
                "container": "20GP",
                "base_rate_usd": 650,
                "thc_origin_usd": 110,
                "thc_dest_usd": 90,
                "baf_usd": 120,
                "doc_fee_usd": 75
            },
            {
                "lane_code": "INNSA-AEJEA-OCEAN",
                "container": "40GP",
                "base_rate_usd": 950,
                "thc_origin_usd": 145,
                "thc_dest_usd": 120,
                "baf_usd": 180,
                "doc_fee_usd": 75
            },
            {
                "lane_code": "INNSA-AEJEA-OCEAN",
                "container": "40HC",
                "base_rate_usd": 980,
                "thc_origin_usd": 145,
                "thc_dest_usd": 120,
                "baf_usd": 180,
                "doc_fee_usd": 75
            },
            {
                "lane_code": "INMUN-AEJEA-OCEAN",
                "container": "20GP",
                "base_rate_usd": 620,
                "thc_origin_usd": 95,
                "thc_dest_usd": 90,
                "baf_usd": 120,
                "doc_fee_usd": 75
            },
            {
                "lane_code": "INMUN-AEJEA-OCEAN",
                "container": "40HC",
                "base_rate_usd": 940,
                "thc_origin_usd": 130,
                "thc_dest_usd": 120,
                "baf_usd": 180,
                "doc_fee_usd": 75
            }
        ],
        "tier": "STANDARD",
        "active": true
    },
    {
        "card_id": "RC-2026-HLCU-INEU-001",
        "carrier_scac": "HLCU",
        "trade": "INDIA - NORTH EUROPE",
        "service_type": "OCEAN_FCL",
        "validity_from": "2026-01-01",
        "validity_to": "2026-03-31",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "INNSA-NLRTM-OCEAN",
                "container": "20GP",
                "base_rate_usd": 1250,
                "thc_origin_usd": 110,
                "thc_dest_usd": 280,
                "baf_usd": 380,
                "doc_fee_usd": 95
            },
            {
                "lane_code": "INNSA-NLRTM-OCEAN",
                "container": "40GP",
                "base_rate_usd": 2100,
                "thc_origin_usd": 145,
                "thc_dest_usd": 395,
                "baf_usd": 520,
                "doc_fee_usd": 95
            },
            {
                "lane_code": "INNSA-NLRTM-OCEAN",
                "container": "40HC",
                "base_rate_usd": 2180,
                "thc_origin_usd": 145,
                "thc_dest_usd": 395,
                "baf_usd": 520,
                "doc_fee_usd": 95
            },
            {
                "lane_code": "INNSA-DEHAM-OCEAN",
                "container": "20GP",
                "base_rate_usd": 1280,
                "thc_origin_usd": 110,
                "thc_dest_usd": 260,
                "baf_usd": 380,
                "doc_fee_usd": 95
            },
            {
                "lane_code": "INNSA-DEHAM-OCEAN",
                "container": "40HC",
                "base_rate_usd": 2200,
                "thc_origin_usd": 145,
                "thc_dest_usd": 360,
                "baf_usd": 520,
                "doc_fee_usd": 95
            }
        ],
        "tier": "STANDARD",
        "active": true
    },
    {
        "card_id": "RC-2026-CMDU-INFE-001",
        "carrier_scac": "CMDU",
        "trade": "INDIA - FAR EAST",
        "service_type": "OCEAN_FCL",
        "validity_from": "2026-01-01",
        "validity_to": "2026-06-30",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "INNSA-SGSIN-OCEAN",
                "container": "20GP",
                "base_rate_usd": 380,
                "thc_origin_usd": 110,
                "thc_dest_usd": 245,
                "baf_usd": 90,
                "doc_fee_usd": 75
            },
            {
                "lane_code": "INNSA-SGSIN-OCEAN",
                "container": "40HC",
                "base_rate_usd": 620,
                "thc_origin_usd": 145,
                "thc_dest_usd": 310,
                "baf_usd": 145,
                "doc_fee_usd": 75
            },
            {
                "lane_code": "INNSA-CNSHA-OCEAN",
                "container": "20GP",
                "base_rate_usd": 480,
                "thc_origin_usd": 110,
                "thc_dest_usd": 160,
                "baf_usd": 130,
                "doc_fee_usd": 75
            },
            {
                "lane_code": "INNSA-CNSHA-OCEAN",
                "container": "40HC",
                "base_rate_usd": 780,
                "thc_origin_usd": 145,
                "thc_dest_usd": 218,
                "baf_usd": 205,
                "doc_fee_usd": 75
            }
        ],
        "tier": "STANDARD",
        "active": true
    },
    {
        "card_id": "RC-2026-EK-INME-AIR-001",
        "carrier_scac": "EK",
        "trade": "INDIA - MIDDLE EAST (AIR)",
        "service_type": "AIR_GEN",
        "validity_from": "2026-01-01",
        "validity_to": "2026-12-31",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "BOM-DXB-AIR",
                "rate_per_kg_usd": 1.35,
                "min_charge_usd": 65,
                "fuel_surchg_per_kg": 0.45,
                "sec_surchg_per_kg": 0.12
            },
            {
                "lane_code": "DEL-DXB-AIR",
                "rate_per_kg_usd": 1.25,
                "min_charge_usd": 65,
                "fuel_surchg_per_kg": 0.45,
                "sec_surchg_per_kg": 0.12
            },
            {
                "lane_code": "BLR-DXB-AIR",
                "rate_per_kg_usd": 1.45,
                "min_charge_usd": 65,
                "fuel_surchg_per_kg": 0.45,
                "sec_surchg_per_kg": 0.12
            }
        ],
        "tier": "STANDARD",
        "active": true
    },
    {
        "card_id": "RC-2026-LH-INEU-AIR-001",
        "carrier_scac": "LH",
        "trade": "INDIA - EUROPE (AIR)",
        "service_type": "AIR_GEN",
        "validity_from": "2026-01-01",
        "validity_to": "2026-06-30",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "BOM-FRA-AIR",
                "rate_per_kg_usd": 2.8,
                "min_charge_usd": 100,
                "fuel_surchg_per_kg": 0.75,
                "sec_surchg_per_kg": 0.18
            },
            {
                "lane_code": "DEL-FRA-AIR",
                "rate_per_kg_usd": 2.65,
                "min_charge_usd": 100,
                "fuel_surchg_per_kg": 0.75,
                "sec_surchg_per_kg": 0.18
            },
            {
                "lane_code": "BOM-LHR-AIR",
                "rate_per_kg_usd": 2.9,
                "min_charge_usd": 100,
                "fuel_surchg_per_kg": 0.75,
                "sec_surchg_per_kg": 0.18
            }
        ],
        "tier": "STANDARD",
        "active": true
    },
    {
        "card_id": "RC-2026-DHLE-EXP-PRIORITY-001",
        "carrier_scac": "DHL_EXP",
        "trade": "GLOBAL EXPRESS PRIORITY (AIR)",
        "service_type": "AIR_EXPRESS_NFO",
        "validity_from": "2026-01-01",
        "validity_to": "2026-12-31",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "BOM-DXB-EXP",
                "rate_per_kg_usd": 7.5,
                "min_charge_usd": 40,
                "fuel_surchg_pct": 22,
                "transit_hours": "12-24h"
            },
            {
                "lane_code": "DEL-LHR-EXP",
                "rate_per_kg_usd": 11.2,
                "min_charge_usd": 55,
                "fuel_surchg_pct": 24,
                "transit_hours": "24-36h"
            },
            {
                "lane_code": "DEL-FRA-EXP",
                "rate_per_kg_usd": 10.8,
                "min_charge_usd": 50,
                "fuel_surchg_pct": 24,
                "transit_hours": "24-36h"
            },
            {
                "lane_code": "BLR-SIN-EXP",
                "rate_per_kg_usd": 6.9,
                "min_charge_usd": 35,
                "fuel_surchg_pct": 22,
                "transit_hours": "18-24h"
            },
            {
                "lane_code": "HKG-LEJ-EXP",
                "rate_per_kg_usd": 12.5,
                "min_charge_usd": 60,
                "fuel_surchg_pct": 25,
                "transit_hours": "24-36h"
            },
            {
                "lane_code": "FRA-JFK-EXP",
                "rate_per_kg_usd": 9.8,
                "min_charge_usd": 48,
                "fuel_surchg_pct": 22,
                "transit_hours": "18-24h"
            }
        ],
        "tier": "PRIORITY_EXPRESS",
        "active": true
    },
    {
        "card_id": "RC-2026-FDX-EXP-WORLD-001",
        "carrier_scac": "FX_EXP",
        "trade": "FEDEX INTERNATIONAL PRIORITY",
        "service_type": "AIR_EXPRESS_NFO",
        "validity_from": "2026-01-01",
        "validity_to": "2026-12-31",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "PVG-MEM-EXP",
                "rate_per_kg_usd": 13.2,
                "min_charge_usd": 65,
                "fuel_surchg_pct": 25,
                "transit_hours": "24-48h"
            },
            {
                "lane_code": "NRT-LAX-EXP",
                "rate_per_kg_usd": 11.5,
                "min_charge_usd": 55,
                "fuel_surchg_pct": 23,
                "transit_hours": "20-30h"
            },
            {
                "lane_code": "BOM-DXB-EXP",
                "rate_per_kg_usd": 7.2,
                "min_charge_usd": 38,
                "fuel_surchg_pct": 22,
                "transit_hours": "14-24h"
            }
        ],
        "tier": "PRIORITY_EXPRESS",
        "active": true
    },
    {
        "card_id": "RC-2026-CONCOR-WDFC-RAIL-001",
        "carrier_scac": "CONCOR",
        "trade": "INDIA WDFC INTERMODAL RAIL (ICD DADRI - JNPT)",
        "service_type": "RAIL_INTERMODAL",
        "validity_from": "2026-01-01",
        "validity_to": "2026-12-31",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "DADRI-JNPT-RAIL",
                "container": "20GP",
                "base_rate_usd": 380,
                "icd_lift_fee_usd": 45,
                "toll_tax_usd": 20,
                "transit_hours": "24-36h"
            },
            {
                "lane_code": "DADRI-JNPT-RAIL",
                "container": "40HC",
                "base_rate_usd": 680,
                "icd_lift_fee_usd": 70,
                "toll_tax_usd": 25,
                "transit_hours": "24-36h"
            },
            {
                "lane_code": "TKD-MUN-RAIL",
                "container": "20GP",
                "base_rate_usd": 340,
                "icd_lift_fee_usd": 40,
                "toll_tax_usd": 18,
                "transit_hours": "36-48h"
            },
            {
                "lane_code": "TKD-MUN-RAIL",
                "container": "40HC",
                "base_rate_usd": 610,
                "icd_lift_fee_usd": 65,
                "toll_tax_usd": 22,
                "transit_hours": "36-48h"
            },
            {
                "lane_code": "WFD-MAA-RAIL",
                "container": "20GP",
                "base_rate_usd": 180,
                "icd_lift_fee_usd": 30,
                "toll_tax_usd": 10,
                "transit_hours": "18-24h"
            },
            {
                "lane_code": "WFD-MAA-RAIL",
                "container": "40HC",
                "base_rate_usd": 310,
                "icd_lift_fee_usd": 50,
                "toll_tax_usd": 15,
                "transit_hours": "18-24h"
            }
        ],
        "tier": "STANDARD_RAIL",
        "active": true
    },
    {
        "card_id": "RC-2026-DBC-EUROPE-RAIL-001",
        "carrier_scac": "DBC_RAIL",
        "trade": "EUROPE INTERMODAL RAIL CORRIDOR",
        "service_type": "RAIL_INTERMODAL",
        "validity_from": "2026-01-01",
        "validity_to": "2026-12-31",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "RTM-DUI-RAIL",
                "container": "40HC",
                "base_rate_usd": 290,
                "icd_lift_fee_usd": 55,
                "toll_tax_usd": 0,
                "transit_hours": "12-18h"
            },
            {
                "lane_code": "HAM-MUC-RAIL",
                "container": "40HC",
                "base_rate_usd": 620,
                "icd_lift_fee_usd": 60,
                "toll_tax_usd": 0,
                "transit_hours": "24-36h"
            },
            {
                "lane_code": "YIWU-DUI-RAIL",
                "container": "40HC",
                "base_rate_usd": 3800,
                "icd_lift_fee_usd": 120,
                "toll_tax_usd": 0,
                "transit_hours": "14-18 days"
            }
        ],
        "tier": "STANDARD_RAIL",
        "active": true
    },
    {
        "card_id": "RC-2026-TCI-FTL-ROAD-001",
        "carrier_scac": "TCI_FRT",
        "trade": "INDIA NATIONAL ROAD FTL (32FT TRUCK)",
        "service_type": "GROUND_FTL",
        "validity_from": "2026-01-01",
        "validity_to": "2026-12-31",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "DEL-MUM-ROAD",
                "vehicle_type": "TRUCK_32FT",
                "base_rate_usd": 680,
                "toll_charges_usd": 110,
                "transit_days": 3
            },
            {
                "lane_code": "DEL-BLR-ROAD",
                "vehicle_type": "TRUCK_32FT",
                "base_rate_usd": 980,
                "toll_charges_usd": 160,
                "transit_days": 5
            },
            {
                "lane_code": "MUM-MAA-ROAD",
                "vehicle_type": "TRUCK_32FT",
                "base_rate_usd": 620,
                "toll_charges_usd": 95,
                "transit_days": 3
            }
        ],
        "tier": "STANDARD_ROAD",
        "active": true
    },
    {
        "card_id": "RC-2026-DHLF-EUROPE-ROAD-001",
        "carrier_scac": "DHL_FRT",
        "trade": "EUROPE CURTAINSIDER MEGA TRAILER FTL",
        "service_type": "GROUND_FTL",
        "validity_from": "2026-01-01",
        "validity_to": "2026-12-31",
        "currency": "USD",
        "rates": [
            {
                "lane_code": "RTM-FRA-ROAD",
                "vehicle_type": "MEGA_TRAILER",
                "base_rate_usd": 580,
                "toll_charges_usd": 85,
                "transit_days": 1
            },
            {
                "lane_code": "DXB-RUH-ROAD",
                "vehicle_type": "MEGA_TRAILER",
                "base_rate_usd": 1150,
                "toll_charges_usd": 140,
                "transit_days": 2
            },
            {
                "lane_code": "LAX-PHX-ROAD",
                "vehicle_type": "53DOM",
                "base_rate_usd": 890,
                "toll_charges_usd": 45,
                "transit_days": 1
            }
        ],
        "tier": "STANDARD_ROAD",
        "active": true
    }
]

SURCHARGE_RULES = [
    {
        "code": "SUR-PSS-2026Q1",
        "name": "Peak Season Surcharge Q1 2026",
        "applies_to_modes": [
            "OCEAN_FCL",
            "OCEAN_LCL"
        ],
        "applies_to_lanes": [
            "ALL"
        ],
        "amount_usd_20gp": 200,
        "amount_usd_40gp": 350,
        "amount_usd_40hc": 350,
        "valid_from": "2026-01-01",
        "valid_to": "2026-03-31",
        "active": true
    },
    {
        "code": "SUR-WAR-REDSEA-2026",
        "name": "Red Sea / Suez War Risk Surcharge 2026",
        "applies_to_modes": [
            "OCEAN_FCL",
            "OCEAN_LCL"
        ],
        "applies_to_lanes": [
            "RED_SEA"
        ],
        "amount_usd_20gp": 450,
        "amount_usd_40gp": 700,
        "amount_usd_40hc": 700,
        "valid_from": "2026-01-01",
        "valid_to": "2026-12-31",
        "active": true
    },
    {
        "code": "SUR-CONG-JNPT-2026",
        "name": "JNPT Port Congestion Surcharge",
        "applies_to_modes": [
            "OCEAN_FCL"
        ],
        "applies_to_lanes": [
            "INNSA-*"
        ],
        "amount_usd_20gp": 75,
        "amount_usd_40gp": 120,
        "amount_usd_40hc": 120,
        "valid_from": "2026-06-01",
        "valid_to": "2026-09-30",
        "active": true
    },
    {
        "code": "SUR-DG-HAZ-GEN",
        "name": "Dangerous Goods General Surcharge",
        "applies_to_modes": [
            "ALL"
        ],
        "applies_to_lanes": [
            "ALL"
        ],
        "amount_usd_20gp": 350,
        "amount_usd_40gp": 550,
        "amount_usd_40hc": 550,
        "valid_from": "2026-01-01",
        "valid_to": "2026-12-31",
        "active": true
    },
    {
        "code": "SUR-LIION-2026",
        "name": "Lithium Battery Surcharge",
        "applies_to_modes": [
            "AIR"
        ],
        "applies_to_lanes": [
            "ALL"
        ],
        "amount_per_kg_usd": 0.35,
        "valid_from": "2026-01-01",
        "valid_to": "2026-12-31",
        "active": true
    },
    {
        "code": "SUR-REEFER-POWER",
        "name": "Reefer Electricity / Power Surcharge",
        "applies_to_modes": [
            "OCEAN_FCL"
        ],
        "applies_to_lanes": [
            "ALL"
        ],
        "amount_usd_per_day": 22,
        "valid_from": "2026-01-01",
        "valid_to": "2026-12-31",
        "active": true
    },
    {
        "code": "SUR-GRI-2026Q2",
        "name": "General Rate Increase Q2 2026",
        "applies_to_modes": [
            "OCEAN_FCL"
        ],
        "applies_to_lanes": [
            "ALL"
        ],
        "amount_usd_20gp": 300,
        "amount_usd_40gp": 500,
        "amount_usd_40hc": 500,
        "valid_from": "2026-04-01",
        "valid_to": "2026-06-30",
        "active": true
    },
    {
        "code": "SUR-CCF",
        "name": "Carrier Carbon Fee (CII / FuelEU)",
        "applies_to_modes": [
            "OCEAN_FCL",
            "OCEAN_LCL"
        ],
        "applies_to_lanes": [
            "ALL"
        ],
        "amount_usd_20gp": 45,
        "amount_usd_40gp": 75,
        "amount_usd_40hc": 75,
        "valid_from": "2026-01-01",
        "valid_to": "2026-12-31",
        "active": true
    }
]

MARGIN_POLICIES = [
    {
        "code": "MP-GLOBAL",
        "name": "Global Fallback Margin Policy",
        "priority": 99,
        "target_margin_pct": 18,
        "floor_margin_pct": 8,
        "ceiling_margin_pct": 40,
        "applies_to": "ALL",
        "active": true
    },
    {
        "code": "MP-OCEAN-FCL",
        "name": "Ocean FCL Standard Margin",
        "priority": 10,
        "target_margin_pct": 15,
        "floor_margin_pct": 6,
        "ceiling_margin_pct": 35,
        "applies_to": "OCEAN_FCL",
        "active": true
    },
    {
        "code": "MP-AIR",
        "name": "Air Freight Margin Policy",
        "priority": 10,
        "target_margin_pct": 22,
        "floor_margin_pct": 10,
        "ceiling_margin_pct": 45,
        "applies_to": "AIR_GEN",
        "active": true
    },
    {
        "code": "MP-TIER-GOLD",
        "name": "Gold Customer Reduced Margin",
        "priority": 5,
        "target_margin_pct": 12,
        "floor_margin_pct": 5,
        "ceiling_margin_pct": 30,
        "applies_to_customer_tier": "GOLD",
        "active": true
    },
    {
        "code": "MP-TIER-ENTERPRISE",
        "name": "Enterprise Customer Thin Margin",
        "priority": 2,
        "target_margin_pct": 8,
        "floor_margin_pct": 3,
        "ceiling_margin_pct": 22,
        "applies_to_customer_tier": "ENTERPRISE",
        "active": true
    }
]

CUSTOMS_TARIFFS = [
    {
        "hs6": "620342",
        "import_country": "IN",
        "duty_pct": 12.0,
        "gst_vat_pct": 12.0,
        "required_docs": [
            "Commercial Invoice",
            "Packing List",
            "BL",
            "COO"
        ],
        "active": true
    },
    {
        "hs6": "620342",
        "import_country": "AE",
        "duty_pct": 5.0,
        "gst_vat_pct": 5.0,
        "required_docs": [
            "Commercial Invoice",
            "Packing List",
            "BL",
            "COO"
        ],
        "active": true
    },
    {
        "hs6": "620342",
        "import_country": "DE",
        "duty_pct": 12.0,
        "gst_vat_pct": 19.0,
        "required_docs": [
            "EUR1",
            "Commercial Invoice",
            "Packing List",
            "BL"
        ],
        "active": true
    },
    {
        "hs6": "870899",
        "import_country": "IN",
        "duty_pct": 7.5,
        "gst_vat_pct": 18.0,
        "required_docs": [
            "Commercial Invoice",
            "Packing List",
            "BL"
        ],
        "active": true
    },
    {
        "hs6": "870899",
        "import_country": "US",
        "duty_pct": 2.5,
        "gst_vat_pct": 0,
        "required_docs": [
            "Commercial Invoice",
            "Packing List",
            "BL",
            "ISF"
        ],
        "active": true
    },
    {
        "hs6": "300490",
        "import_country": "IN",
        "duty_pct": 10.0,
        "gst_vat_pct": 12.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "CDSCO NOC",
            "MSDS"
        ],
        "active": true
    },
    {
        "hs6": "300490",
        "import_country": "AE",
        "duty_pct": 5.0,
        "gst_vat_pct": 5.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "MOH Approval"
        ],
        "active": true
    },
    {
        "hs6": "851712",
        "import_country": "IN",
        "duty_pct": 20.0,
        "gst_vat_pct": 18.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "BIS License"
        ],
        "active": true
    },
    {
        "hs6": "851712",
        "import_country": "DE",
        "duty_pct": 0,
        "gst_vat_pct": 19.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "CE Declaration"
        ],
        "active": true
    },
    {
        "hs6": "270900",
        "import_country": "IN",
        "duty_pct": 5.0,
        "gst_vat_pct": 5.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "Q88",
            "COO"
        ],
        "active": true
    },
    {
        "hs6": "850760",
        "import_country": "AE",
        "duty_pct": 5.0,
        "gst_vat_pct": 5.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "MSDS",
            "IEC"
        ],
        "active": true
    },
    {
        "hs6": "850760",
        "import_country": "US",
        "duty_pct": 0,
        "gst_vat_pct": 0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "CPSC Compliance"
        ],
        "active": true
    },
    {
        "hs6": "940360",
        "import_country": "AE",
        "duty_pct": 5.0,
        "gst_vat_pct": 5.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "COO"
        ],
        "active": true
    },
    {
        "hs6": "940360",
        "import_country": "DE",
        "duty_pct": 0,
        "gst_vat_pct": 19.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "EUR1 or GSP Form A"
        ],
        "active": true
    },
    {
        "hs6": "720839",
        "import_country": "IN",
        "duty_pct": 15.0,
        "gst_vat_pct": 18.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "Mill TC",
            "COO"
        ],
        "active": true
    },
    {
        "hs6": "100190",
        "import_country": "AE",
        "duty_pct": 0,
        "gst_vat_pct": 0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "Phytosanitary Cert",
            "COO"
        ],
        "active": true
    },
    {
        "hs6": "390110",
        "import_country": "IN",
        "duty_pct": 7.5,
        "gst_vat_pct": 18.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "MSDS",
            "COO"
        ],
        "active": true
    },
    {
        "hs6": "520100",
        "import_country": "CN",
        "duty_pct": 0,
        "gst_vat_pct": 9.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "Phytosanitary Cert"
        ],
        "active": true
    },
    {
        "hs6": "300210",
        "import_country": "US",
        "duty_pct": 0,
        "gst_vat_pct": 0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "FDA Prior Notice",
            "COO"
        ],
        "active": true
    },
    {
        "hs6": "950300",
        "import_country": "AU",
        "duty_pct": 0,
        "gst_vat_pct": 10.0,
        "required_docs": [
            "Commercial Invoice",
            "BL",
            "COO",
            "ACCC Declaration"
        ],
        "active": true
    }
]

DOCUMENT_TYPES = [
    {
        "code": "CI",
        "name": "Commercial Invoice",
        "required_for": [
            "ALL"
        ],
        "issuer": "Seller",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "PL",
        "name": "Packing List",
        "required_for": [
            "ALL"
        ],
        "issuer": "Seller",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "BL",
        "name": "Bill of Lading (Ocean)",
        "required_for": [
            "OCEAN"
        ],
        "issuer": "Carrier",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "SEAWAY",
        "name": "Sea Waybill",
        "required_for": [
            "OCEAN"
        ],
        "issuer": "Carrier",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "AWB",
        "name": "Air Waybill (HAWB/MAWB)",
        "required_for": [
            "AIR"
        ],
        "issuer": "Carrier",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "COO",
        "name": "Certificate of Origin",
        "required_for": [
            "CUSTOMS"
        ],
        "issuer": "Chamber of Commerce",
        "digital_accepted": false,
        "active": true
    },
    {
        "code": "EUR1",
        "name": "EUR.1 Movement Certificate (EU Preference)",
        "required_for": [
            "EU_IMPORT"
        ],
        "issuer": "Customs Authority",
        "digital_accepted": false,
        "active": true
    },
    {
        "code": "MSDS",
        "name": "Material Safety Data Sheet (SDS)",
        "required_for": [
            "HAZMAT",
            "CHEMICALS"
        ],
        "issuer": "Manufacturer",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "PHYTO",
        "name": "Phytosanitary Certificate",
        "required_for": [
            "AGRICULTURAL"
        ],
        "issuer": "Plant Quarantine Authority",
        "digital_accepted": false,
        "active": true
    },
    {
        "code": "FUMIG",
        "name": "Fumigation Certificate",
        "required_for": [
            "WOOD_PACKAGING"
        ],
        "issuer": "Accredited Fumigator",
        "digital_accepted": false,
        "active": true
    },
    {
        "code": "COA",
        "name": "Certificate of Analysis",
        "required_for": [
            "PHARMA",
            "CHEMICALS"
        ],
        "issuer": "Testing Lab",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "ISF",
        "name": "Importer Security Filing (ISF 10+2)",
        "required_for": [
            "US_IMPORT_OCEAN"
        ],
        "issuer": "Importer",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "ENS",
        "name": "Entry Summary Declaration (EU Safety)",
        "required_for": [
            "EU_IMPORT"
        ],
        "issuer": "Carrier/Forwarder",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "VGM",
        "name": "Verified Gross Mass Declaration",
        "required_for": [
            "OCEAN_FCL"
        ],
        "issuer": "Shipper",
        "digital_accepted": true,
        "active": true
    },
    {
        "code": "DGD",
        "name": "Dangerous Goods Declaration (IMO/IATA)",
        "required_for": [
            "HAZMAT"
        ],
        "issuer": "Shipper",
        "digital_accepted": true,
        "active": true
    }
]

CUSTOMER_TIERS = [
    {
        "code": "STANDARD",
        "name": "Standard",
        "quote_sla_hours": 24,
        "max_discount_pct": 5,
        "credit_days": 0,
        "priority_support": false,
        "active": true
    },
    {
        "code": "SILVER",
        "name": "Silver",
        "quote_sla_hours": 12,
        "max_discount_pct": 10,
        "credit_days": 15,
        "priority_support": false,
        "active": true
    },
    {
        "code": "GOLD",
        "name": "Gold",
        "quote_sla_hours": 6,
        "max_discount_pct": 18,
        "credit_days": 30,
        "priority_support": true,
        "active": true
    },
    {
        "code": "PLATINUM",
        "name": "Platinum",
        "quote_sla_hours": 4,
        "max_discount_pct": 25,
        "credit_days": 45,
        "priority_support": true,
        "active": true
    },
    {
        "code": "ENTERPRISE",
        "name": "Enterprise",
        "quote_sla_hours": 2,
        "max_discount_pct": 35,
        "credit_days": 60,
        "priority_support": true,
        "active": true
    }
]

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

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Seed PortLine Master Database into MongoDB Atlas")
    parser.add_argument("--drop", action="store_true", help="Drop existing collections before seeding")
    args = parser.parse_args()
    seed_all(drop_existing=args.drop)
