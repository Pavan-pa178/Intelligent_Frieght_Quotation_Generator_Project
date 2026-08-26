# International Customs Regulation Corpus with Full RAG Citations
REGULATION_DOCUMENTS = [
    {
        "id": "REG-EU-UCC-2024",
        "title": "EU Union Customs Code (UCC) Import Formalities",
        "country": "Netherlands",
        "authority": "European Commission / Dutch Douane",
        "citation": "Regulation (EU) No 952/2013, Articles 127-149",
        "hs_chapters": ["84", "85", "90", "29", "30"],
        "sections": [
            {
                "section_id": "UCC-ART-127",
                "title": "Entry Summary Declaration (ENS) & Advance Cargo Security",
                "content": "Carriers and forwarders must lodge an electronic Entry Summary Declaration (ENS) at least 24 hours prior to container loading at the port of departure. Mandatory data elements include 6-digit HS Code, consignee EORI number, and full package breakdown.",
                "required_documents": ["Entry Summary Declaration (ENS)", "Commercial Invoice", "Ocean Bill of Lading"],
                "citation": "UCC Regulation (EU) No 952/2013 Art 127"
            },
            {
                "section_id": "UCC-CE-CONFORMITY",
                "title": "CE Mark & EU Declaration of Conformity for Electrical Equipment",
                "content": "For electrical machinery (HS 8504, 8517, 8544), importers must present a valid EU Declaration of Conformity and technical documentation proving adherence to Low Voltage Directive (LVD 2014/35/EU) and RoHS Directive (2011/65/EU).",
                "required_documents": ["EU Declaration of Conformity (DoC)", "RoHS Compliance Certificate", "CE Technical File"],
                "citation": "EU Directives 2014/35/EU & 2011/65/EU"
            }
        ]
    },
    {
        "id": "REG-IN-CUSTOMS-1962",
        "title": "Indian Customs Tariff Act & Advance Cargo Declaration",
        "country": "India",
        "authority": "Central Board of Indirect Taxes and Customs (CBIC)",
        "citation": "Indian Customs Act 1962, Sections 46 & 50 / SCMTR 2019",
        "hs_chapters": ["ALL"],
        "sections": [
            {
                "section_id": "IN-SCMTR-EXP",
                "title": "Sea Cargo Manifest and Transhipment Regulations (SCMTR)",
                "content": "Export manifest must be filed prior to departure from Indian gateway port. Mandatory submission of Shipping Bill, GST Invoice, Letter of Undertaking (LUT), and e-Way Bill for inland haulage legs.",
                "required_documents": ["Export Shipping Bill", "GST Tax Invoice", "Packing List with Net/Gross weights", "Letter of Undertaking (LUT)"],
                "citation": "CBIC Notification No. 88/2019-Customs (N.T.)"
            },
            {
                "section_id": "IN-COO-RULES",
                "title": "Preferential Certificate of Origin (AIFTA / CECA)",
                "content": "To claim tariff concessions under India-Singapore CECA or ASEAN-India FTA, goods must be accompanied by an authorized Certificate of Origin (Form AIA / CECA) issued by the Export Inspection Council (EIC).",
                "required_documents": ["Preferential Certificate of Origin", "Non-Manipulation Certificate (if transhipped)"],
                "citation": "India-Singapore CECA Rules of Origin, Rule 5"
            }
        ]
    },
    {
        "id": "REG-SG-CUSTOMS-2024",
        "title": "Singapore Customs Import / Inward Permit Procedures",
        "country": "Singapore",
        "authority": "Singapore Customs & Enterprise Singapore",
        "citation": "Singapore Customs Act (Cap. 70), Regulation 14",
        "hs_chapters": ["ALL"],
        "sections": [
            {
                "section_id": "SG-TRADENET",
                "title": "TradeNet Inward Permit & GST Payment Clearance",
                "content": "All commercial imports into Singapore require an Inward Non-Dutiable or Dutiable Payment Permit obtained via TradeNet prior to cargo discharge. Consignee UEN must be registered with Singapore Customs.",
                "required_documents": ["Singapore Customs Inward TradeNet Permit", "Commercial Invoice (SGD/USD)", "Original Delivery Order / Bill of Lading"],
                "citation": "Singapore Customs Circular No. 04/2023"
            },
            {
                "section_id": "SG-STRATEGIC-GOODS",
                "title": "Strategic Goods Control Act (SGCA) - Dual-Use Items",
                "content": "Goods categorized under strategic goods control (HS 8471, 8542, 8802, high-performance electronics) require a Strategic Goods Import/Export Permit issued by Singapore Customs prior to entry.",
                "required_documents": ["Strategic Goods Permit (SGCA)", "End-User Statement (EUS)"],
                "citation": "Strategic Goods (Control) Act (Chapter 300)"
            }
        ]
    },
    {
        "id": "REG-IMO-IMDG-HAZ",
        "title": "IMO International Maritime Dangerous Goods Code (IMDG)",
        "country": "GLOBAL",
        "authority": "International Maritime Organization (IMO)",
        "citation": "SOLAS Convention Chapter VII / IMDG Code 2024 Amdt 41-22",
        "hs_chapters": ["28", "29", "38", "8507", "8504"],
        "sections": [
            {
                "section_id": "IMDG-DG-DECLARATION",
                "title": "Multimodal Dangerous Goods Form & Material Safety Data Sheet",
                "content": "All shipments containing hazardous materials, chemicals, or lithium batteries must furnish an IMO Dangerous Goods Declaration, UN packaging certification, and current 16-point Material Safety Data Sheet (MSDS).",
                "required_documents": ["IMO Multimodal Dangerous Goods Declaration", "Material Safety Data Sheet (MSDS 16-Point)", "UN Packaging Certificate"],
                "citation": "IMDG Code Chapter 5.4"
            }
        ]
    }
]

HS_CODE_REGISTRY = {
    "850440": {
        "description": "Static converters, power supply units, inverters",
        "chapter": "85",
        "restricted": False,
        "prohibited": False,
        "default_risk": "MEDIUM",
        "mandatory_docs": ["Commercial Invoice", "Packing List", "Ocean Bill of Lading", "EU Declaration of Conformity (DoC)", "RoHS Certificate"]
    },
    "851762": {
        "description": "Machines for the reception, conversion and transmission of voice/data (Routers, Switches)",
        "chapter": "85",
        "restricted": False,
        "prohibited": False,
        "default_risk": "LOW",
        "mandatory_docs": ["Commercial Invoice", "Packing List", "Air Waybill / BL", "Telecommunications Type Approval"]
    },
    "847130": {
        "description": "Portable automatic data processing machines (Laptops, Tablets)",
        "chapter": "84",
        "restricted": False,
        "prohibited": False,
        "default_risk": "MEDIUM",
        "mandatory_docs": ["Commercial Invoice", "Packing List", "UN38.3 Lithium Battery Test Summary", "MSDS"]
    },
    "290511": {
        "description": "Methanol (methyl alcohol) - Industrial Organic Chemical",
        "chapter": "29",
        "restricted": True,
        "prohibited": False,
        "default_risk": "HIGH",
        "mandatory_docs": ["Dangerous Goods Declaration (DGD)", "Material Safety Data Sheet (MSDS)", "Chemical Import License", "UN Packaging Certificate"]
    },
    "930690": {
        "description": "Munitions and military defence parts",
        "chapter": "93",
        "restricted": True,
        "prohibited": True,
        "default_risk": "CRITICAL",
        "mandatory_docs": ["Military Export Defense License", "End-User Certificate"]
    }
}
