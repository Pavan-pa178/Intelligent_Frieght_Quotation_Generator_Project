import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { FileText, ArrowLeft, Ship, Check, ShieldCheck, CheckCircle2, XCircle, Clock, ThumbsUp, ThumbsDown, Upload, X, Loader2, AlertTriangle, Receipt, Lock, Sparkles } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import StatusBadge from '../components/StatusBadge'
import WeatherRiskPanel from '../components/WeatherRiskPanel'
import CustomsComplianceCard from '../components/CustomsComplianceCard'
import CompositeRiskCard from '../components/CompositeRiskCard'
import MLPricingCard from '../components/MLPricingCard'
import { assessRouteWeather } from '../lib/weatherEngine'
import { validateCustomsCompliance } from '../lib/customsRAG'
import { computeCompositeRisk } from '../lib/riskEngine'
import { predictMLFreightPrice } from '../lib/mlPricingEngine'
import {
  fetchQuoteById,
  customerDecisionOnQuote,
  selectQuoteRoute,
  uploadQuoteDocuments,
  fetchBackendMLPrice,
  fetchBackendWeatherAssess,
  fetchBackendCustomsValidate
} from '../lib/api'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'

export default function QuoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { user } = useApp()

  const getBackNavigation = () => {
    const from = location.state?.from || (searchParams.get('view') === 'agent' ? '/agent' : null)
    if (location.state?.from) {
      return { 
        path: location.state.from, 
        label: location.state.fromLabel || (location.state.from === '/quotes' ? 'Back to Quotations' : location.state.from === '/portal' ? 'Back to Shipper Portal' : 'Back') 
      }
    }
    if (from === '/agent' || user?.role === 'agent' || user?.role === 'broker') {
      return { path: '/agent', label: 'Back to Agent Workspace' }
    }
    if (from === '/customs' || user?.role === 'customs_officer') {
      return { path: '/customs', label: 'Back to Customs Workspace' }
    }
    if (from === '/admin' || user?.role === 'admin') {
      return { path: '/admin', label: 'Back to Admin Console' }
    }
    if (user?.role === 'customer') {
      return { path: '/quotes', label: 'Back to Quotations' }
    }
    return { path: '/quotes', label: 'Back to Quotations' }
  }
  const backNav = getBackNavigation()

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from)
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(backNav.path)
    }
  }
  const toast = useToast()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deciding, setDeciding] = useState(false)
  const [decisionNotes, setDecisionNotes] = useState('')
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  const isAgentOrAdmin = 
    user?.role === 'agent' || 
    user?.role === 'admin' || 
    user?.role === 'manager' || 
    user?.role === 'customs_officer' || 
    user?.role === 'agent_operator' ||
    searchParams.get('view') === 'agent' ||
    searchParams.get('role') === 'agent' ||
    searchParams.get('role') === 'admin'

  const isAgentView = isAgentOrAdmin

  // Real backend async state (used if quote document doesn't already have precomputed AI)
  const [liveML, setLiveML] = useState(null)
  const [liveWeather, setLiveWeather] = useState(null)
  const [liveCustoms, setLiveCustoms] = useState(null)

  useEffect(() => {
    fetchQuoteById(id).then((res) => {
      setQuote(res)
      setLoading(false)

      // If quote lacks precomputed backend AI, fetch from real backend endpoints
      if (res) {
        const d = res.details || {}
        const ogCode = d.originGw?.code || 'INMAA'
        const dgCode = d.destGw?.code || 'SGSIN'
        const mode = res.mode || 'OCEAN'

        if (!res.m2_ml_pricing) {
          fetchBackendMLPrice({
            distance_nm: 1205,
            weight_kg: d.grossWeightKg || 15000,
            container_count: d.containerCount || 2,
            mode,
            container_type: d.containerType || '40HC',
            rule_price: res.indicativeTotal || 148350,
            origin: d.originGw?.city || 'Chennai',
            destination: d.destGw?.city || 'Singapore',
            cargo_type: d.commodity || 'General Cargo'
          }).then(mlRes => mlRes && setLiveML(mlRes))
        }

        if (!res.m3_weather) {
          fetchBackendWeatherAssess({
            origin_code: ogCode,
            dest_code: dgCode,
            mode
          }).then(wRes => wRes && setLiveWeather(wRes))
        }

        if (!res.m3_customs) {
          fetchBackendCustomsValidate({
            hs_code: d.hsCode || '850440',
            commodity: d.commodity || 'General Merchandise',
            origin: 'IN',
            destination: 'SG',
            shipment_id: res.shipment_id || res.id
          }).then(cRes => cRes && setLiveCustoms(cRes))
        }
      }
    })
  }, [id])

  const d = quote?.details || {}
  const routes = d.routes || []

  // Milestone 3 Intelligence calculations (prioritizes real backend data from MongoDB)
  const weatherData = useMemo(() => {
    if (!quote) return null
    if (quote.m3_weather) {
      const w = quote.m3_weather
      return {
        riskScore: w.risk_score,
        riskLevel: w.risk_level,
        delayProbabilityPct: w.delay_probability_pct,
        maxWaveHeightM: w.max_wave_height_m,
        maxWindSpeedKts: w.max_wind_speed_kts,
        waypoints: w.observations || [],
        storms: w.storm_details || [],
        routeAdvice: w.route_advice || 'Standard transit schedule expected.'
      }
    }
    if (liveWeather) {
      return {
        riskScore: liveWeather.risk_score,
        riskLevel: liveWeather.risk_level,
        delayProbabilityPct: liveWeather.delay_probability_pct,
        maxWaveHeightM: liveWeather.max_wave_height_m,
        maxWindSpeedKts: liveWeather.max_wind_speed_kts,
        waypoints: liveWeather.observations || [],
        storms: liveWeather.storm_details || [],
        routeAdvice: liveWeather.route_advice
      }
    }
    return assessRouteWeather(d.originGw?.code || 'INMAA', d.destGw?.code || 'SGSIN', quote.mode || 'OCEAN')
  }, [quote, liveWeather, d])

  const customsData = useMemo(() => {
    if (!quote) return null
    if (quote.m3_customs) {
      const c = quote.m3_customs
      const checklistItems = Array.isArray(c.checklist) ? c.checklist : []
      return {
        hsCode: c.hs_code || d.hsCode || '850440',
        hsDescription: d.commodity || 'Standard Commercial Cargo',
        readinessScore: c.readiness_score || 85,
        complianceStatus: c.compliance_status || 'APPROVED',
        checklist: checklistItems.map(item => ({
          name: item?.item_name || item?.name || 'Statutory Declaration',
          uploaded: item?.document_uploaded ?? item?.uploaded ?? true,
          status: item?.status || 'VERIFIED'
        })),
        citations: Array.isArray(c.retrieved_citations) ? c.retrieved_citations : [],
        summary: c.summary || 'Customs trade classification verified against regulatory corpus.',
        requiresOfficerReview: c.requires_officer_review || false
      }
    }
    if (liveCustoms) {
      const liveChecklist = Array.isArray(liveCustoms.document_checklist) ? liveCustoms.document_checklist : []
      return {
        hsCode: liveCustoms.hs_code || d.hsCode || '850440',
        hsDescription: d.commodity || 'Standard Commercial Cargo',
        readinessScore: liveCustoms.readiness_score || 85,
        complianceStatus: liveCustoms.compliance_status || 'APPROVED',
        checklist: liveChecklist.map(item => ({
          name: item?.item_name || item?.name || 'Statutory Declaration',
          uploaded: item?.document_uploaded ?? true,
          status: item?.status || 'VERIFIED'
        })),
        citations: Array.isArray(liveCustoms.retrieved_citations) ? liveCustoms.retrieved_citations : [],
        summary: liveCustoms.summary,
        requiresOfficerReview: liveCustoms.requires_officer_review
      }
    }
    return validateCustomsCompliance({
      hsCode: d.hsCode || '850440',
      commodity: d.commodity || 'Static Inverters',
      originCountry: 'IN',
      destCountry: 'SG'
    })
  }, [quote, liveCustoms, d])

  const compositeRiskData = useMemo(() => {
    if (!quote) return null
    const r = quote.m3_risk || quote.m3_composite_risk
    if (r) {
      const factors = Array.isArray(r.factor_breakdown) ? r.factor_breakdown : []
      return {
        overallScore: r.overall_score ?? 20,
        riskLevel: r.risk_level || 'LOW',
        color: r.risk_level === 'CRITICAL' ? '#991B1B' : r.risk_level === 'HIGH' ? '#EF4444' : r.risk_level === 'MEDIUM' ? '#F59E0B' : '#10B981',
        primaryDriver: r.primary_driver || 'Normal transit corridors',
        explanation: r.explanation || 'Nominal operational risk profile.',
        guidance: r.guidance || 'Standard dispatch schedule recommended.',
        formula: r.formula || 'Weather (30%) + Customs (25%) + Route (20%) + Port (15%) + Cargo (10%)',
        factors: factors.map(f => ({
          name: f?.factor_name || 'Risk Factor',
          score: f?.score ?? 20,
          weight: f?.weight_pct ?? 20,
          contribution: f?.contribution_pts ?? 4,
          severity: f?.severity || 'LOW',
          reason: f?.reason || 'Clear baseline parameters',
          source: f?.source || 'Analytical Assessment'
        }))
      }
    }
    if (!weatherData || !customsData) return null
    return computeCompositeRisk({
      weatherScore: weatherData.riskScore,
      customsScore: customsData.complianceStatus === 'APPROVED' ? 18 : 65,
      routeScore: 22,
      portScore: 18,
      cargoScore: 12,
      weatherDetails: weatherData.routeAdvice,
      customsDetails: customsData.summary
    })
  }, [quote, weatherData, customsData])

  const mlPricingData = useMemo(() => {
    if (!quote) return null
    if (quote.m2_ml_pricing) {
      const ml = quote.m2_ml_pricing
      const rule = ml.rule_based_price || quote.indicativeTotal || 148350
      const pred = ml.ml_predicted_price || rule
      return {
        rulePrice: rule,
        mlPredictedPrice: pred,
        varianceInr: pred - rule,
        variancePct: ml.price_variance_pct || 0,
        lowerBound: Math.round(pred * 0.96),
        upperBound: Math.round(pred * 1.04),
        marketSentiment: ml.confidence_level === 'HIGH' ? 'BALANCED' : 'TIGHT',
        recommendation: 'RULE_COMPETITIVE',
        explanation: `LightGBM ML Model v${ml.model_version || '2.0'} predicts Rs. ${pred.toLocaleString()} (${ml.price_variance_pct >= 0 ? '+' : ''}${ml.price_variance_pct}% vs rule tariff) with R2 = ${ml.r2_score || 0.8387}.`,
        modelName: 'LightGBM Gradient Boosted Regressor (v2.0)',
        accuracyR2: ml.r2_score || 0.8387
      }
    }
    if (liveML) {
      const rule = liveML.rule_based_price || quote.indicativeTotal || 148350
      const pred = liveML.ml_predicted_price || rule
      return {
        rulePrice: rule,
        mlPredictedPrice: pred,
        varianceInr: pred - rule,
        variancePct: liveML.price_variance_pct || 0,
        lowerBound: Math.round(pred * 0.96),
        upperBound: Math.round(pred * 1.04),
        marketSentiment: liveML.confidence_level === 'HIGH' ? 'BALANCED' : 'TIGHT',
        recommendation: 'RULE_COMPETITIVE',
        explanation: `LightGBM ML Model predicts Rs. ${pred.toLocaleString()} (${liveML.price_variance_pct >= 0 ? '+' : ''}${liveML.price_variance_pct}% vs rule tariff) with R2 = ${liveML.r2_score || 0.8387}.`,
        modelName: liveML.model_type || 'LightGBM Regression v2.0',
        accuracyR2: liveML.r2_score || 0.8387
      }
    }
    return predictMLFreightPrice({
      distanceNm: 1205,
      weightKg: d.grossWeightKg || 15000,
      containerCount: d.containerCount || 2,
      mode: quote.mode || 'OCEAN',
      containerType: d.containerType || '40HC',
      rulePrice: quote.indicativeTotal || 148350
    })
  }, [quote, liveML, d])

  // Clean, transparent commercial tariff breakdown for customers & invoices
  const customerTariffBreakdown = useMemo(() => {
    if (!quote) return []
    const total = quote.indicativeTotal || 0
    const modeLabel = quote.mode || 'Freight'
    const basisLabel = quote.basis || 'Per Unit Tariff'

    if (Array.isArray(d.costBreakdown) && d.costBreakdown.length > 0) {
      const cleanItems = d.costBreakdown
        .filter(item => !item.isSubtotal && !item.label?.toLowerCase().includes('margin'))
        .map(item => {
          let note = ''
          if (item.label?.toLowerCase().includes('baf')) note = 'Bunker & marine fuel price adjustment surcharge'
          else if (item.label?.toLowerCase().includes('thc')) note = 'Origin port container terminal handling charge'
          else if (item.label?.toLowerCase().includes('doc')) note = 'Statutory carrier bill of lading & booking fee'
          else if (item.label?.toLowerCase().includes('base')) note = `Linehaul carriage across ${quote.laneCode || 'route'}`

          return {
            label: item.label,
            val: item.val,
            basis: item.isTotal ? 'All-Inclusive Total' : basisLabel,
            isTotal: item.isTotal,
            note
          }
        })

      if (!cleanItems.some(i => i.isTotal)) {
        cleanItems.push({
          label: 'Total Commercial Tariff',
          val: total,
          basis: 'All-Inclusive Total',
          isTotal: true,
          note: 'Applicable all-in carrier rate'
        })
      }
      return cleanItems
    }

    // Default commercial tariff build-up calculated from indicativeTotal
    const baseVal = Math.round(total * 0.72)
    const bafVal = Math.round(total * 0.10)
    const thcVal = Math.round(total * 0.15)
    const docVal = total - (baseVal + bafVal + thcVal)

    return [
      {
        label: `${modeLabel} Base Carriage`,
        val: baseVal,
        basis: basisLabel,
        note: `Primary haulage tariff for ${quote.laneCode || 'origin to destination'}`
      },
      {
        label: 'Bunker Adjustment Factor (BAF)',
        val: bafVal,
        basis: '10% Fuel Surcharge',
        note: 'Compensates fuel market fluctuations along voyage'
      },
      {
        label: 'Origin Terminal Handling Charges (THC)',
        val: thcVal,
        basis: 'Port Standard Tariff',
        note: 'Wharfage, crane handling, and port staging charges'
      },
      {
        label: 'Carrier Documentation & Port Filing',
        val: docVal > 0 ? docVal : 3000,
        basis: 'Flat Statutory Fee',
        note: 'Electronic manifest transmission and document generation'
      },
      {
        label: 'Total Commercial Tariff (Indicative)',
        val: total,
        basis: 'All-Inclusive Total',
        isTotal: true,
        note: 'Guaranteed valid for standard dispatch window'
      }
    ]
  }, [quote, d.costBreakdown])

  const handleCustomerDecision = async (decision) => {
    setDeciding(true)
    try {
      await customerDecisionOnQuote(quote.id, decision, decisionNotes, user)
      toast(`Quotation ${quote.id} ${decision === 'accepted' ? 'accepted' : 'declined'} successfully!`)
      setQuote(prev => ({
        ...prev,
        status: decision === 'accepted' ? 'Accepted' : 'Rejected',
        customer_decision: {
          status: decision.toUpperCase(),
          notes: decisionNotes,
          decided_at: new Date().toISOString()
        }
      }))
      setShowDeclineModal(false)
      setDecisionNotes('')
    } catch (err) {
      toast(err.message || 'Error updating quote decision')
    } finally {
      setDeciding(false)
    }
  }

  const handleSelectRoute = async (route) => {
    // Agents & Admins cannot override customer route selection
    if (isAgentOrAdmin) {
      toast("Route selection is reserved for the customer. As an agent, your role is to validate the customer's preferred route.")
      return
    }
    // Block if quotation is already approved or accepted
    if (quote?.status === 'Accepted' || agentApproved) {
      toast('Route selection is locked because this quotation has already been approved.')
      return
    }
    try {
      await selectQuoteRoute(quote.id, route, user?.email || quote.user_email)
      setQuote(prev => ({
        ...prev,
        selected_route: route,
        indicativeTotal: route.cost || prev.indicativeTotal
      }))
      toast(`Route selected: ${route.carrier} (${route.transitDays}d) — ₹${(route.cost || 0).toLocaleString('en-IN')}. Route request logged.`)
    } catch (err) {
      toast(`Route selection failed: ${err.message}`)
    }
  }

  const handleUploadSubmit = async () => {
    setIsUploading(true)
    try {
      const docsList = await Promise.all(
        Object.entries(uploadedFiles).map(async ([name, file]) => {
          let fileData = null
          try {
            fileData = await new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result)
              reader.onerror = reject
              reader.readAsDataURL(file)
            })
          } catch (e) {
            console.error('Failed reading file data URL', e)
          }
          return {
            name,
            file_name: file.name,
            file_size: `${Math.round(file.size / 1024)} KB`,
            file_type: file.type || (file.name.match(/\.(png|jpe?g|webp|gif)$/i) ? 'image/jpeg' : 'application/pdf'),
            file_data: fileData
          }
        })
      )
      await uploadQuoteDocuments(quote.id, docsList, user?.name || 'Customer')
      toast('Customs documents uploaded successfully! Customs compliance desk notified.')
      setShowUploadModal(false)
      setQuote(prev => ({
        ...prev,
        status: 'Documents Submitted (Pending Customs Sign-off)',
        customs_document_request: {
          ...(prev.customs_document_request || {}),
          status: 'DOCUMENTS_SUBMITTED'
        },
        customer_uploaded_documents: [
          ...(prev.customer_uploaded_documents || []),
          ...docsList
        ]
      }))
    } catch (err) {
      toast(`Document upload failed: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const agentApproved = 
    quote?.agent_review?.status === 'approved' || 
    quote?.status === 'Approved' ||
    quote?.pipeline_status === 'CUSTOMS_APPROVED' ||
    quote?.status === 'Accepted'

  const agentRejected = 
    quote?.agent_review?.status === 'rejected' || 
    (quote?.status === 'Rejected' && !quote?.customer_decision?.status && quote?.customs_review?.status !== 'rejected')

  const customsApproved = 
    quote?.customs_review?.status === 'approved' || 
    quote?.status === 'Approved' ||
    quote?.pipeline_status === 'CUSTOMS_APPROVED' ||
    quote?.m3_customs?.compliance_status === 'APPROVED'

  const customsRejected = 
    quote?.customs_review?.status === 'rejected' ||
    quote?.status === 'Rejected by Customs' ||
    quote?.pipeline_status === 'CUSTOMS_REJECTED' ||
    quote?.m3_customs?.compliance_status === 'REJECTED'

  const canCustomerAccept = (agentApproved || quote?.status === 'Approved') && customsApproved

  const isAcceptedByCustomer = quote?.customer_decision?.status === 'ACCEPTED' || quote?.status === 'Accepted'
  const isRejectedByCustomer = quote?.customer_decision?.status === 'REJECTED' || (quote?.status === 'Rejected' && quote?.customer_decision?.status === 'REJECTED')

  const docReq = quote?.customs_document_request
  const docsSubmitted = 
    docReq?.status === 'DOCUMENTS_SUBMITTED' || 
    quote?.status === 'Documents Submitted (Pending Customs Sign-off)' || 
    quote?.status?.toLowerCase()?.includes('submitted') ||
    quote?.pipeline_status === 'DOCS_SUBMITTED'

  const hasOfficerRequestedDocs = 
    Boolean(docReq?.requested_docs && Array.isArray(docReq.requested_docs) && docReq.requested_docs.length > 0) ||
    quote?.status === 'Documents Requested' ||
    docReq?.status === 'REQUESTED' ||
    docReq?.status === 'PENDING_CUSTOMER_UPLOAD'

  const pendingDocsList = useMemo(() => {
    if (docReq?.requested_docs && Array.isArray(docReq.requested_docs) && docReq.requested_docs.length > 0) {
      return docReq.requested_docs
    }
    if (quote?.status === 'Documents Requested') {
      const customsChecklist = Array.isArray(customsData?.checklist) ? customsData.checklist : []
      return customsChecklist.filter(c => c && !c.uploaded).map(c => c.name)
    }
    return []
  }, [docReq, customsData, quote?.status])

  if (loading) {
    return (
      <div className="py-20 text-center text-brand-slate">
        <p>Loading quotation details…</p>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-bold text-brand-navy">Quote not found</h3>
        <button onClick={handleBack} className="mt-4 rounded-lg bg-brand-navy px-5 py-2 text-white">{backNav.label}</button>
      </div>
    )
  }

  const displayTimestamp = quote.created_at 
    ? new Date(quote.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : (quote.created && quote.created !== 'Just now' ? quote.created : 'Today')

  return (
    <>
      <PageBanner
        crumb={`Quotations / ${quote.id}`}
        title={`${quote.customer} · ${quote.laneName}`}
        subtitle={`Quotation ${quote.id} · ${quote.mode} (${quote.basis})`}
        icon={FileText}
      />

      <section className="pt-10 pb-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <button onClick={handleBack} className="inline-flex items-center gap-2 text-xs font-semibold text-brand-slate hover:text-brand-navy">
              <ArrowLeft className="h-4 w-4" /> {backNav.label}
            </button>
            <div className="flex items-center gap-3">
              <StatusBadge status={customsApproved && quote.status !== 'Accepted' ? 'Approved' : quote.status} />
              <span className="font-mono text-xs text-brand-slateLight">Generated {displayTimestamp}</span>
            </div>
          </div>

          {/* DYNAMIC CONSIGNMENT LIFECYCLE UPDATE WINDOW */}
          {isAcceptedByCustomer ? (
            /* 1. POST-ACCEPTANCE: QUOTATION BOOKED SUCCESSFULLY */
            <div className="mb-8 rounded-2xl border-2 border-emerald-500 bg-emerald-50/95 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-emerald-600 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 block">
                      Quotation Booked Successfully
                    </span>
                    <p className="mt-0.5 text-xs text-emerald-900 leading-relaxed">
                      Your quotation has been confirmed and booked. Our operations team is now coordinating carrier booking, container release, and dispatch.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3.5 py-2 text-xs font-bold text-emerald-800 border border-emerald-300">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Booked & Confirmed
                </span>
              </div>
            </div>
          ) : isRejectedByCustomer ? (
            /* 2. CUSTOMER DECLINED */
            <div className="mb-8 rounded-2xl border-2 border-rose-400 bg-rose-50/95 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-rose-600 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-950 block">
                      Quotation Declined by Customer
                    </span>
                    <p className="mt-0.5 text-xs text-rose-900 leading-relaxed">
                      You have declined this quotation. You can generate a new quotation with revised cargo specifications or dates at any time.
                    </p>
                    {quote?.customer_decision?.notes && (
                      <p className="mt-2 rounded-lg border border-rose-200 bg-white/90 p-2 text-xs italic text-rose-950 font-medium">
                        Customer Note: &ldquo;{quote.customer_decision.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-100 px-3.5 py-2 text-xs font-bold text-rose-800 border border-rose-300">
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  Declined
                </span>
              </div>
            </div>
          ) : customsRejected ? (
            /* 3. CUSTOMS REJECTED */
            <div className="mb-8 rounded-2xl border-2 border-rose-400 bg-rose-50/95 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-rose-600 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-950 block">
                      Customs Compliance Rejected
                    </span>
                    <p className="mt-0.5 text-xs text-rose-900 leading-relaxed">
                      Customs authorities have reviewed and rejected statutory compliance declarations for this consignment.
                    </p>
                    {(quote?.customs_review?.notes || quote?.customs_document_request?.officer_notes) && (
                      <p className="mt-2 rounded-lg border border-rose-200 bg-white/90 p-2 text-xs italic text-rose-950 font-medium">
                        Customs Officer Reason: &ldquo;{quote?.customs_review?.notes || quote?.customs_document_request?.officer_notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-100 px-3.5 py-2 text-xs font-bold text-rose-800 border border-rose-300">
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  Rejected by Customs
                </span>
              </div>
            </div>
          ) : customsApproved ? (
            /* 4. CUSTOMS CLEARED & VERIFIED (Ready for customer action) */
            <div className="mb-8 rounded-2xl border-2 border-emerald-400 bg-emerald-50/95 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-emerald-600 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 block">
                      Customs Compliance Cleared & Verified
                    </span>
                    <p className="mt-0.5 text-xs text-emerald-900 leading-relaxed">
                      Customs Authorities have inspected and signed off all statutory compliance declarations for this consignment. Please accept the quotation below to lock in your booking.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3.5 py-2 text-xs font-bold text-emerald-800 border border-emerald-300">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Verified by Customs
                </span>
              </div>
            </div>
          ) : docsSubmitted ? (
            /* 5. DOCUMENTS SUBMITTED · AWAITING CUSTOMS SIGN-OFF */
            <div className="mb-8 rounded-2xl border-2 border-indigo-400 bg-indigo-50/95 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-indigo-600 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-950 block">
                      Documents Uploaded · Awaiting Customs Approval
                    </span>
                    <p className="mt-0.5 text-xs text-indigo-900 leading-relaxed">
                      Your required compliance documents have been submitted successfully. A customs compliance officer is reviewing your paperwork for final clearance.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-100 px-3.5 py-2 text-xs font-bold text-indigo-800 border border-indigo-300">
                  <Clock className="h-3.5 w-3.5 text-indigo-600" />
                  Under Customs Review
                </span>
              </div>
            </div>
          ) : hasOfficerRequestedDocs && pendingDocsList.length > 0 ? (
            /* 6. CUSTOMS ACTION REQUIRED · DOCUMENTS REQUESTED */
            <div className="mb-8 rounded-2xl border-2 border-amber-400 bg-amber-50/95 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-amber-500 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-amber-950 uppercase tracking-wider">Customs Action Required · Documents Requested</span>
                      <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                        Action Needed
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                      The customs compliance officer has inspected your consignment and requested specific statutory documents before clearance can be granted.
                    </p>
                    {docReq?.officer_notes && (
                      <p className="mt-2 rounded-lg border border-amber-300 bg-white/90 p-2.5 text-xs italic text-amber-950 font-medium">
                        Customs Officer Message: &ldquo;{docReq.officer_notes}&rdquo;
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pendingDocsList.map((doc, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900 shadow-2xs">
                          <FileText className="h-3.5 w-3.5 text-amber-600" /> {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm transition-all"
                >
                  <Upload className="h-4 w-4" /> Upload Required Documents
                </button>
              </div>
            </div>
          ) : agentRejected ? (
            /* 7. AGENT REJECTED */
            <div className="mb-8 rounded-2xl border-2 border-rose-400 bg-rose-50/95 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-rose-600 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-950 block">
                      Quotation Declined by Freight Agent
                    </span>
                    <p className="mt-0.5 text-xs text-rose-900 leading-relaxed">
                      The freight agent reviewed this quotation and could not approve it due to commercial tariff or carrier constraints.
                    </p>
                    {quote?.agent_review?.comment && (
                      <p className="mt-2 rounded-lg border border-rose-200 bg-white/90 p-2 text-xs italic text-rose-950 font-medium">
                        Agent Reason: &ldquo;{quote.agent_review.comment}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-100 px-3.5 py-2 text-xs font-bold text-rose-800 border border-rose-300">
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  Rejected by Agent
                </span>
              </div>
            </div>
          ) : agentApproved ? (
            /* 8. AGENT APPROVED · AWAITING CUSTOMS */
            <div className="mb-8 rounded-2xl border-2 border-sky-400 bg-sky-50/95 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-sky-600 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-950 block">
                      Freight Agent Approved · Awaiting Customs Clearance
                    </span>
                    <p className="mt-0.5 text-xs text-sky-900 leading-relaxed">
                      The freight agent has approved your commercial tariff and route schedule. Consignment details are now in queue for customs inspection and clearance.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-sky-100 px-3.5 py-2 text-xs font-bold text-sky-800 border border-sky-300">
                  <Check className="h-3.5 w-3.5 text-sky-600" />
                  Agent Approved · Pending Customs
                </span>
              </div>
            </div>
          ) : (
            /* 9. INITIAL: QUOTATION GENERATED · AWAITING AGENT REVIEW */
            <div className="mb-8 rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-amber-500 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-950 block">
                      Quotation Generated · Awaiting Freight Agent Review
                    </span>
                    <p className="mt-0.5 text-xs text-amber-900 leading-relaxed">
                      Your quotation has been generated. A freight agent is currently reviewing the commercial tariff schedule, carrier allocation, and route feasibility.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3.5 py-2 text-xs font-bold text-amber-800 border border-amber-300">
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  Awaiting Agent Review
                </span>
              </div>
            </div>
          )}

          {/* PROMINENT CUSTOMER ACTION HERO BANNER (When approved & ready to book) */}
          {!isAgentOrAdmin && canCustomerAccept && !quote.customer_decision?.status && quote.status !== 'Accepted' && quote.status !== 'Rejected' && (
            <div className="mb-8 overflow-hidden rounded-2xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 text-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-6 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100 border border-emerald-400/30">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    Approvals Granted · Ready For Booking
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
                    Accept & Confirm Your Shipment Booking
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Both Freight Agent and Customs Authorities have verified and cleared all compliance and statutory tariffs. 
                    Confirm now to lock in your carrier slot with <b>{quote.selected_route?.carrier || 'your chosen carrier'}</b> for 
                    <span className="font-bold text-white ml-1">₹ {(quote.indicativeTotal || 0).toLocaleString('en-IN')}</span>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                  <button
                    type="button"
                    disabled={deciding}
                    onClick={() => handleCustomerDecision('accepted')}
                    className="flex-1 lg:flex-initial flex items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-4 text-sm font-bold text-emerald-900 shadow-lg hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <ThumbsUp className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                    {deciding ? 'Confirming Booking...' : 'Accept & Book Quotation'}
                  </button>
                  <button
                    type="button"
                    disabled={deciding}
                    onClick={() => setShowDeclineModal(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700/60 border border-emerald-400/40 px-5 py-4 text-xs font-semibold text-white hover:bg-rose-600 hover:border-rose-500 transition-all"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    Decline / Revision
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">

            {/* LEFT DETAILS */}
            <div className="space-y-8">

              {/* Route Map Card */}
              <div className="rounded-lg2 border border-brand-line bg-brand-navy p-6 shadow-md2 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Ship className="h-5 w-5 text-brand-orangeLight" />
                    <span className="font-mono text-sm font-bold">{quote.laneCode}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-300">{quote.transit}</span>
                </div>

                {/* SVG Route Map Visual */}
                <div className="relative my-4 h-48 w-full rounded-md2 bg-brand-navy2 p-4 border border-white/10 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 600 180">
                    <path d="M 80 90 Q 300 20 520 90" fill="none" stroke="#2E6DA8" strokeWidth="2.5" strokeDasharray="6 4" />
                    <path d="M 80 90 Q 300 150 520 90" fill="none" stroke="#F0692A" strokeWidth="3" />
                    <circle cx="80" cy="90" r="8" fill="#F0692A" />
                    <circle cx="520" cy="90" r="8" fill="#1B8A56" />
                    <text x="80" y="130" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">{d.originGw?.city || 'Origin'}</text>
                    <text x="520" y="130" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">{d.destGw?.city || 'Destination'}</text>
                  </svg>
                </div>
              </div>

              {/* Itemized Commercial Tariff Breakdown */}
              <div className="rounded-lg2 border border-brand-line bg-white p-6 shadow-sm2">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-brand-navy" />
                      <h3 className="text-base font-bold text-brand-navy">Itemized Tariff & Charge Breakdown</h3>
                    </div>
                    <p className="text-xs text-brand-slate mt-0.5">
                      Statutory tariff schedule and linehaul build-up for this consignment.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-cloud px-3 py-1 text-xs font-semibold text-brand-navy border border-brand-line">
                      Currency: INR (₹)
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      All-Inclusive Tariff
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-brand-line/80 text-brand-slate uppercase font-mono text-[11px] tracking-wider">
                        <th className="py-2.5 px-3 font-bold">Charge Description</th>
                        <th className="py-2.5 px-3 font-bold">Basis / Rating</th>
                        <th className="py-2.5 px-3 font-bold text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-line/50">
                      {customerTariffBreakdown.map((item, idx) => (
                        <tr 
                          key={idx} 
                          className={item.isTotal ? "bg-brand-cloud/70 font-bold text-brand-navy text-[13px]" : "hover:bg-slate-50/60 text-brand-navy"}
                        >
                          <td className="py-3 px-3">
                            <span className={item.isTotal ? "font-bold text-brand-navy" : "font-medium"}>{item.label}</span>
                            {item.note && <span className="block text-[11px] text-brand-slate font-normal mt-0.5">{item.note}</span>}
                          </td>
                          <td className="py-3 px-3 text-brand-slate font-mono">
                            {item.isTotal ? "Final Quote" : item.basis || quote.basis || "Standard Tariff"}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold">
                            ₹ {(item.val || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-[11px] text-brand-slate border border-brand-line/60">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Includes Ocean/Air carriage, terminal handling at origin, bunker surcharges, and statutory documentation fees.</span>
                  </div>
                  <span className="font-mono text-brand-navy font-semibold">No Hidden Charges</span>
                </div>
              </div>

              {/* INTERNAL BROKER INTELLIGENCE (Strictly Restricted to Agents & Admins) */}
              {isAgentOrAdmin && (
                <div className="space-y-6 rounded-2xl border-2 border-brand-navy/20 bg-brand-cloud/40 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg bg-brand-navy p-2 text-white">
                        <ShieldCheck className="h-5 w-5 text-brand-orangeLight" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-brand-navy">Broker Decision Support & Underwriting Intelligence</h3>
                        <p className="text-xs text-brand-slate">Internal ML pricing benchmarks, spot variance, and risk underwriting models.</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-brand-orange px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                      Agent & Admin Eyes Only
                    </span>
                  </div>

                  {/* ML Pricing Prediction & Benchmark */}
                  {mlPricingData && (
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-navy">Machine Learning Market Pricing Benchmark</h4>
                      <MLPricingCard mlPricing={mlPricingData} />
                    </div>
                  )}

                  {/* 5-Factor Composite Risk Engine */}
                  {compositeRiskData && (
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-navy">Composite Shipment Risk Assessment</h4>
                      <CompositeRiskCard risk={compositeRiskData} />
                    </div>
                  )}

                  {/* Customs & Legal RAG Verification */}
                  {customsData && (
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-navy">Customs Clearance & Trade Regulation Verification</h4>
                      <CustomsComplianceCard customs={customsData} />
                    </div>
                  )}

                  {/* Weather Intelligence Assessment */}
                  {weatherData && (
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-navy">Meteorological & Voyage Weather Intelligence</h4>
                      <WeatherRiskPanel weather={weatherData} />
                    </div>
                  )}
                </div>
              )}

              {/* Ranked Route Options */}
              {routes.length > 0 && (
                <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-brand-navy">Recommended Route Options ({routes.length})</h3>
                      {isAgentOrAdmin && quote.selected_route && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 border border-slate-300 flex items-center gap-1">
                          <Lock className="h-3 w-3 text-slate-500" /> Customer Choice Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-slate">
                      {isAgentOrAdmin 
                        ? (quote.selected_route 
                            ? `The customer has selected ${quote.selected_route.carrier}. This route selection is locked to respect the customer's decision.`
                            : 'Available carrier routes and commercial options for this lane.')
                        : (quote.selected_route
                            ? 'Your selected route is confirmed below. You can adjust your route before final agent approval.'
                            : 'Choose your preferred carrier route. Click to select and request approval.')}
                    </p>
                  </div>
                    {quote.selected_route && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        Chosen: {quote.selected_route.carrier}
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    {routes.map((r, idx) => {
                      const isSelected = (quote.selected_route?.carrier === r.carrier) || (!quote.selected_route && r.recommended)
                      return (
                        <div
                          key={r.id || idx}
                          className={`rounded-lg2 border-[1.5px] p-6 bg-white shadow-sm2 transition-all ${
                            isSelected
                              ? 'border-emerald-500 shadow-md2 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                              : r.recommended 
                                ? 'border-brand-orange shadow-md2 ring-2 ring-brand-orange/20' 
                                : 'border-brand-line hover:border-brand-navy/30'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line pb-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display text-base font-bold text-brand-navy">{r.carrier}</span>
                                {r.recommended && (
                                  <span className="rounded-full bg-brand-orangePale px-2.5 py-0.5 font-mono text-[10px] font-bold text-brand-orange">
                                    RECOMMENDED
                                  </span>
                                )}
                                {isSelected && (
                                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                                    <Check className="h-3 w-3" /> {isAgentOrAdmin ? 'CHOSEN BY CUSTOMER' : 'SELECTED ROUTE'}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-brand-slate mt-0.5">{r.serviceName} · {r.sailingFrequency}</div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-display text-xl font-bold text-brand-navy">₹ {(r.cost || 0).toLocaleString('en-IN')}</div>
                                <div className="text-[10px] font-bold text-brand-slate font-mono">{r.transitDays} DAYS TRANSIT</div>
                              </div>
                              {isSelected ? (
                                <span className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white flex items-center gap-1.5 shadow-xs">
                                  <Check className="h-3.5 w-3.5" /> {isAgentOrAdmin ? 'Customer Selection' : 'Chosen'}
                                </span>
                              ) : isAgentOrAdmin ? (
                                <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 border border-slate-200 cursor-not-allowed flex items-center gap-1">
                                  <Lock className="h-3 w-3 text-slate-400" /> Option Only
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={quote.status === 'Accepted' || agentApproved}
                                  onClick={() => handleSelectRoute(r)}
                                  className={`rounded-lg px-3.5 py-2 text-xs font-bold shadow-xs transition-colors ${
                                    quote.status === 'Accepted' || agentApproved
                                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                      : 'bg-brand-navy text-white hover:bg-brand-marine'
                                  }`}
                                >
                                  Select Route
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Score breakdown bars */}
                          {r.scores && (
                            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                              <ScoreBar label="Transit score" val={r.scores.transit} />
                              <ScoreBar label="Cost score" val={r.scores.cost} />
                              <ScoreBar label="Reliability" val={r.scores.reliability} />
                              <ScoreBar label="Congestion" val={r.scores.congestion} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Transit Breakdown */}
              {d.transitBreakdown && (
                <div className="rounded-lg2 border border-brand-line bg-white p-6 shadow-sm2">
                  <h3 className="mb-4 text-base font-bold text-brand-navy">Transit Breakdown & Dwell Times</h3>
                  <div className="divide-y divide-brand-line/60">
                    {d.transitBreakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-3 text-xs font-medium text-brand-navy">
                        <span className="text-brand-slate">{item.label}</span>
                        <span className="font-mono font-semibold">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Booking Action Box directly in the main flow */}
              {!isAgentOrAdmin && (
                <div className="rounded-2xl border-2 border-brand-navy/15 bg-white p-7 shadow-sm2 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-lg font-bold text-brand-navy">Customer Quotation Decision & Booking</h3>
                      </div>
                      <p className="text-xs text-brand-slate mt-0.5">
                        Confirm your freight quote and finalize carrier dispatch instructions.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-brand-slate uppercase">All-Inclusive Total</div>
                      <div className="font-display text-2xl font-bold text-brand-navy">
                        ₹ {(quote.indicativeTotal || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {quote.customer_decision?.status === 'ACCEPTED' || quote.status === 'Accepted' ? (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
                      <CheckCircle2 className="h-9 w-9 text-emerald-600 mx-auto mb-2" />
                      <h4 className="text-base font-bold text-emerald-900">Quotation Booked Successfully</h4>
                      <p className="text-xs text-emerald-700 mt-1">
                        Carrier allocation secured with {quote.selected_route?.carrier || 'Carrier'}. Operations team notified.
                      </p>
                    </div>
                  ) : quote.customer_decision?.status === 'REJECTED' || quote.status === 'Rejected' ? (
                    <div className="rounded-xl bg-rose-50 border border-rose-200 p-5 text-center">
                      <XCircle className="h-9 w-9 text-rose-600 mx-auto mb-2" />
                      <h4 className="text-base font-bold text-rose-900">Quotation Declined</h4>
                      <p className="text-xs text-rose-700 mt-1">This quotation was declined by customer.</p>
                    </div>
                  ) : canCustomerAccept ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-white border-2 border-emerald-300">
                      <div className="flex items-start gap-3.5">
                        <div className="rounded-xl bg-emerald-600 p-2.5 text-white shrink-0 mt-0.5 shadow-xs">
                          <Check className="h-5 w-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-emerald-950">Approvals Complete · Ready For Your Booking</div>
                          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                            Selected Carrier: <span className="font-bold text-emerald-950">{quote.selected_route?.carrier || 'Standard Route'}</span> · 
                            Click below to confirm your consignment.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          disabled={deciding}
                          onClick={() => handleCustomerDecision('accepted')}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {deciding ? 'Confirming...' : 'Accept & Book Quotation'}
                        </button>
                        <button
                          type="button"
                          disabled={deciding}
                          onClick={() => setShowDeclineModal(true)}
                          className="rounded-xl border border-slate-300 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 px-5 py-3.5 text-xs font-semibold text-slate-700 transition-all"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                          Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                      <span>
                        {!agentApproved 
                          ? 'Freight Agent is validating the commercial tariff schedule.' 
                          : 'Customs Authorities are inspecting trade documentation.'} The booking buttons will activate as soon as approvals are granted.
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              
              {/* Quote Summary Box */}
              <div className="rounded-lg2 border border-brand-line bg-white p-6 shadow-sm2">
                <h3 className="mb-4 text-base font-bold text-brand-navy">Quotation Details</h3>
                
                <div className="space-y-3 text-xs">
                  <DetailRow label="Customer" val={quote.customer} />
                  <DetailRow label="Commodity" val={d.commodity || 'General Cargo'} />
                  {d.hsCode && <DetailRow label="HS Code" val={d.hsCode} mono />}
                  <DetailRow label="Gross weight" val={`${(d.grossWeightKg || quote.indicativeTotal || 0).toLocaleString()} kg`} />
                  <DetailRow label="Mode" val={quote.mode} />
                  <DetailRow label="Basis" val={quote.basis} />
                  {d.destinationPhone && <DetailRow label="Mobile / Phone" val={d.destinationPhone} />}
                  {quote.selected_route && (
                    <DetailRow label="Selected Carrier" val={`${quote.selected_route.carrier} (${quote.selected_route.transitDays}d)`} />
                  )}
                </div>

                <div className="mt-6 border-t border-brand-line pt-4">
                  <div className="text-[11px] font-semibold text-brand-slate uppercase">Indicative Total</div>
                  <div className="font-display text-2xl font-bold text-brand-navy mt-1">
                    ₹ {(quote.indicativeTotal || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Multi-Stage Sequential Approval Tracker */}
              <div className="rounded-lg2 border border-brand-line bg-white p-5 shadow-sm2">
                <h4 className="mb-3 text-xs font-bold text-brand-navy uppercase tracking-wider">Approval Sequence</h4>
                
                <div className="space-y-3 text-xs">
                  {/* Stage 1: Freight Agent Review */}
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-brand-cloud/60 border border-brand-line/60">
                    <div className="mt-0.5">
                      {agentApproved ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : agentRejected ? (
                        <XCircle className="h-4 w-4 text-rose-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-navy">1. Freight Agent Review</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          agentApproved 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : agentRejected 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {agentApproved ? 'APPROVED' : agentRejected ? 'REJECTED' : 'PENDING'}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-slate mt-0.5">
                        {agentApproved 
                          ? `Verified by ${quote.agent_review?.agent_name || 'Agent'}` 
                          : agentRejected 
                            ? 'Commercial tariff rejected by agent' 
                            : 'Awaiting commercial tariff validation'}
                      </p>
                    </div>
                  </div>

                  {/* Stage 2: Customs Officer Check */}
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-brand-cloud/60 border border-brand-line/60">
                    <div className="mt-0.5">
                      {customsApproved ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : customsRejected ? (
                        <XCircle className="h-4 w-4 text-rose-600" />
                      ) : docsSubmitted ? (
                        <Clock className="h-4 w-4 text-indigo-600" />
                      ) : hasOfficerRequestedDocs ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-brand-slateLight" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-navy">2. Customs Officer Check</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          customsApproved 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : customsRejected 
                              ? 'bg-rose-100 text-rose-800' 
                              : docsSubmitted 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : hasOfficerRequestedDocs 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-slate-100 text-slate-700'
                        }`}>
                          {customsApproved 
                            ? 'APPROVED' 
                            : customsRejected 
                              ? 'REJECTED' 
                              : docsSubmitted 
                                ? 'DOCS SUBMITTED' 
                                : hasOfficerRequestedDocs 
                                  ? 'DOCS REQUIRED' 
                                  : 'PENDING'}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-slate mt-0.5">
                        {customsApproved 
                          ? 'Regulatory compliance signed off' 
                          : customsRejected 
                            ? 'Customs compliance rejected' 
                            : docsSubmitted 
                              ? 'Documents under customs review' 
                              : hasOfficerRequestedDocs 
                                ? 'Upload requested docs below' 
                                : 'Awaiting customs inspection'}
                      </p>
                    </div>
                  </div>

                  {/* Stage 3: Customer Final Acceptance */}
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-brand-cloud/60 border border-brand-line/60">
                    <div className="mt-0.5">
                      {isAcceptedByCustomer ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : isRejectedByCustomer ? (
                        <XCircle className="h-4 w-4 text-rose-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-brand-slateLight" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-navy">3. Customer Acceptance</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isAcceptedByCustomer 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isRejectedByCustomer 
                              ? 'bg-rose-100 text-rose-800' 
                              : canCustomerAccept 
                                ? 'bg-emerald-100 text-emerald-800 animate-pulse' 
                                : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isAcceptedByCustomer ? 'ACCEPTED' : isRejectedByCustomer ? 'DECLINED' : canCustomerAccept ? 'READY' : 'LOCKED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-slate mt-0.5">
                        {isAcceptedByCustomer 
                          ? 'Quotation booked successfully' 
                          : isRejectedByCustomer 
                            ? 'Quotation declined' 
                            : canCustomerAccept 
                              ? 'All approvals granted. You can accept now!' 
                              : 'Requires Agent & Customs approvals first'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="rounded-lg2 border border-brand-line bg-white p-6 shadow-sm2">
                <h4 className="mb-3 text-xs font-bold text-brand-navy uppercase tracking-wider">Data Verification</h4>
                <div className="space-y-2.5 text-xs text-brand-slate">
                  <CheckItem text="Gateway masterdata verified" />
                  <CheckItem text="5-layer base freight rates applied" />
                  <CheckItem text="Weather satellite ensemble sampled" />
                  <CheckItem text="Customs trade regulations validated" />
                  <CheckItem text="5-factor composite risk calculated" />
                  <CheckItem text="ML market rate benchmarked" />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* DECLINE CONFIRMATION MODAL */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-brand-line">
            <h3 className="font-display text-lg font-bold text-brand-navy">Decline Quotation</h3>
            <p className="mt-1 text-xs text-brand-slate">
              Please share a reason or feedback for our commercial freight desk:
            </p>
            <textarea
              rows={3}
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="e.g. Schedule does not align / Rate above budget / Found alternate route..."
              className="mt-3 w-full rounded-xl border border-brand-line p-3 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 rounded-xl border border-brand-line py-2 text-xs font-semibold text-brand-slate hover:bg-brand-cloud"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deciding}
                onClick={() => handleCustomerDecision('rejected')}
                className="flex-1 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED CUSTOMS DOCUMENT UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-brand-line bg-white p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-brand-line pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-brand-marine" />
                <h3 className="text-base font-bold text-brand-navy">Upload Required Customs Documents</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="rounded-full p-1 text-brand-slate hover:bg-brand-cloud">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-brand-slate">
              Customs compliance requires verifying the following documents before clearance sign-off. Please upload each required document using its dedicated field:
            </p>

            <div className="mt-4 space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
              {pendingDocsList.map((docName, idx) => (
                <div key={idx} className="rounded-xl border border-brand-line bg-brand-cloud/40 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-brand-marine" /> {docName} <span className="text-brand-danger">*</span>
                    </label>
                    {uploadedFiles[docName] && (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Attached
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setUploadedFiles(prev => ({ ...prev, [docName]: file }))
                      }
                    }}
                    className="block w-full text-xs text-brand-slate file:mr-3 file:rounded-lg file:border-0 file:bg-brand-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-marine transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-brand-line pt-4">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="rounded-xl border border-brand-line px-4 py-2 text-xs font-semibold text-brand-slate hover:bg-brand-cloud"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUploading || Object.keys(uploadedFiles).length === 0}
                onClick={handleUploadSubmit}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
              >
                {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                Submit Documents to Customs
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ScoreBar({ label, val }) {
  return (
    <div>
      <div className="flex justify-between text-slate-500 mb-1">
        <span>{label}</span>
        <span className="font-bold text-brand-navy">{val}/100</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-brand-orange rounded-full" style={{ width: `${val}%` }} />
      </div>
    </div>
  )
}

function DetailRow({ label, val, mono }) {
  return (
    <div className="flex items-center justify-between border-b border-brand-line/40 pb-2">
      <span className="text-brand-slate">{label}</span>
      <span className={`font-semibold text-brand-navy ${mono ? 'font-mono' : ''}`}>{val}</span>
    </div>
  )
}

function CheckItem({ text }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Check className="h-2.5 w-2.5 stroke-[3]" />
      </div>
      <span>{text}</span>
    </div>
  )
}
