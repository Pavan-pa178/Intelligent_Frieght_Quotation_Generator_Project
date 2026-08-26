// Customs Intelligence & Legal RAG Retrieval Engine
export const REGULATION_CORPUS = [
  {
    id: 'REG-EU-UCC-2024',
    title: 'EU Union Customs Code (UCC) Import Formalities',
    authority: 'European Commission / Dutch Douane',
    citation: 'Regulation (EU) No 952/2013, Articles 127-149',
    sections: [
      {
        sectionId: 'UCC-ART-127',
        title: 'Entry Summary Declaration (ENS) & Advance Security Filing',
        content: 'Carriers must lodge an electronic Entry Summary Declaration (ENS) 24 hours prior to container loading at port of departure. Mandatory fields include 6-digit HS Code, EORI consignee number, and gross package breakdown.',
        citation: 'UCC Regulation (EU) No 952/2013 Art 127',
        requiredDocs: ['Entry Summary Declaration (ENS)', 'Commercial Invoice', 'Ocean Bill of Lading']
      },
      {
        sectionId: 'UCC-CE-CONFORMITY',
        title: 'CE Mark & EU Declaration of Conformity for Electrical Equipment',
        content: 'Electrical machinery and inverters (HS 8504) must provide a valid EU Declaration of Conformity (DoC) proving compliance with Low Voltage Directive (2014/35/EU) and RoHS Directive (2011/65/EU).',
        citation: 'EU Directives 2014/35/EU & 2011/65/EU',
        requiredDocs: ['EU Declaration of Conformity (DoC)', 'RoHS Compliance Certificate', 'CE Technical File']
      }
    ]
  },
  {
    id: 'REG-IN-CUSTOMS-1962',
    title: 'Indian Customs Tariff Act & SCMTR Regulations',
    authority: 'CBIC (Central Board of Indirect Taxes & Customs)',
    citation: 'Indian Customs Act 1962, Sec 46 / SCMTR 2019',
    sections: [
      {
        sectionId: 'IN-SCMTR-EXP',
        title: 'Sea Cargo Manifest & Export Transhipment Declaration',
        content: 'Export manifest filing mandatory prior to vessel departure. Requires valid GST Tax Invoice, Shipping Bill under LUT, and e-Way Bill for inland container movements.',
        citation: 'CBIC Notification No. 88/2019-Customs',
        requiredDocs: ['Export Shipping Bill', 'GST Tax Invoice', 'Packing List with Net/Gross Weight', 'Letter of Undertaking (LUT)']
      },
      {
        sectionId: 'IN-COO-RULES',
        title: 'Preferential Certificate of Origin (India-Singapore CECA / ASEAN)',
        content: 'To claim preferential import tariff treatment, an authorized Certificate of Origin issued by Export Inspection Council (EIC) is required.',
        citation: 'India-Singapore CECA Rules of Origin, Rule 5',
        requiredDocs: ['Preferential Certificate of Origin', 'Non-Manipulation Certificate']
      }
    ]
  },
  {
    id: 'REG-SG-CUSTOMS-2024',
    title: 'Singapore Customs TradeNet Inward Permit Procedures',
    authority: 'Singapore Customs & Enterprise Singapore',
    citation: 'Singapore Customs Act (Cap. 70), Regulation 14',
    sections: [
      {
        sectionId: 'SG-TRADENET',
        title: 'TradeNet Inward Non-Dutiable / Payment Permit',
        content: 'All commercial imports into Singapore require an approved TradeNet Inward Permit prior to cargo release. Consignee Unique Entity Number (UEN) must be actively registered.',
        citation: 'Singapore Customs Circular No. 04/2023',
        requiredDocs: ['Singapore Customs Inward TradeNet Permit', 'Commercial Invoice (USD/SGD)', 'Ocean Bill of Lading']
      }
    ]
  }
]

export const HS_CODE_CATALOG = {
  '850440': {
    description: 'Static converters, power supply units, solar inverters',
    chapter: '85',
    restricted: false,
    prohibited: false,
    defaultRisk: 'MEDIUM',
    mandatoryDocs: ['Commercial Invoice', 'Packing List', 'Ocean Bill of Lading', 'EU Declaration of Conformity (DoC)', 'RoHS Certificate']
  },
  '851762': {
    description: 'Telecommunications routing and switching apparatus',
    chapter: '85',
    restricted: false,
    prohibited: false,
    defaultRisk: 'LOW',
    mandatoryDocs: ['Commercial Invoice', 'Packing List', 'Bill of Lading', 'Telecom Type Approval']
  },
  '847130': {
    description: 'Laptops and automated data processing machines',
    chapter: '84',
    restricted: false,
    prohibited: false,
    defaultRisk: 'MEDIUM',
    mandatoryDocs: ['Commercial Invoice', 'Packing List', 'UN38.3 Lithium Battery Test Summary', 'MSDS']
  },
  '290511': {
    description: 'Methanol (methyl alcohol) - Industrial Organic Chemical',
    chapter: '29',
    restricted: true,
    prohibited: false,
    defaultRisk: 'HIGH',
    mandatoryDocs: ['Dangerous Goods Declaration (DGD)', 'Material Safety Data Sheet (MSDS)', 'Chemical Import License', 'UN Packaging Certificate']
  },
  '930690': {
    description: 'Munitions and military defence parts',
    chapter: '93',
    restricted: true,
    prohibited: true,
    defaultRisk: 'CRITICAL',
    mandatoryDocs: ['Military Export Defense License', 'End-User Certificate']
  }
}

export function validateCustomsCompliance(shipment) {
  const hsCode = String(shipment?.hsCode || '850440').trim()
  const commodity = shipment?.commodity || shipment?.cargoType || 'Electrical Inverter Equipment'
  const origin = shipment?.originCountry || 'IN'
  const dest = shipment?.destCountry || 'SG'
  
  const hsMeta = HS_CODE_CATALOG[hsCode] || {
    description: `Standard commercial cargo - ${commodity}`,
    chapter: hsCode.slice(0, 2) || '85',
    restricted: false,
    prohibited: false,
    defaultRisk: 'LOW',
    mandatoryDocs: ['Commercial Invoice', 'Packing List', 'Ocean Bill of Lading', 'Certificate of Origin']
  }

  const retrievedCitations = []
  const requiredDocsSet = new Set(hsMeta.mandatoryDocs)

  for (const doc of REGULATION_CORPUS) {
    for (const sec of doc.sections) {
      retrievedCitations.push({
        docTitle: doc.title,
        sectionTitle: sec.title,
        citation: sec.citation,
        authority: doc.authority,
        content: sec.content
      })
      for (const d of sec.requiredDocs) requiredDocsSet.add(d)
    }
  }

  const checklist = Array.from(requiredDocsSet).map((docName, idx) => {
    const isBasic = ['Commercial Invoice', 'Packing List', 'Ocean Bill of Lading', 'Bill of Lading'].includes(docName)
    return {
      id: `CHK-${idx + 1}`,
      name: docName,
      mandatory: true,
      uploaded: isBasic,
      status: isBasic ? 'VERIFIED' : 'PENDING_UPLOAD',
      citation: retrievedCitations[0]?.citation || 'Customs Import Regulations'
    }
  })

  const uploadedCount = checklist.filter(c => c.uploaded).length
  const readinessScore = Math.round((uploadedCount / Math.max(1, checklist.length)) * 100)

  let complianceStatus = 'APPROVED'
  let riskLevel = 'LOW'
  let requiresOfficer = false
  let summary = 'Full regulatory document set verified. Automated customs pre-clearance granted.'

  if (hsMeta.prohibited) {
    complianceStatus = 'REJECTED'
    riskLevel = 'CRITICAL'
    requiresOfficer = true
    summary = 'Prohibited cargo category. Shipment cannot proceed.'
  } else if (hsMeta.restricted || readinessScore < 70) {
    complianceStatus = 'OFFICER_REVIEW_REQUIRED'
    riskLevel = 'HIGH'
    requiresOfficer = true
    summary = 'Specialized compliance / DG declarations require human Customs Officer sign-off.'
  } else if (readinessScore < 100) {
    complianceStatus = 'NEEDS_DOCUMENTS'
    riskLevel = 'MEDIUM'
    requiresOfficer = true
    summary = 'Standard customs path. Supplementary compliance certificates pending upload.'
  }

  return {
    checkId: `CUST-${Date.now()}`,
    hsCode,
    hsDescription: hsMeta.description,
    commodity,
    readinessScore,
    riskLevel,
    complianceStatus,
    requiresOfficerReview: requiresOfficer,
    summary,
    checklist,
    citations: retrievedCitations.slice(0, 3),
    officerDecision: requiresOfficer ? 'PENDING' : 'AUTO_APPROVED'
  }
}
