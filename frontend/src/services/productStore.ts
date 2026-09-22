export interface StartupProduct {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  startupName: string;
  dpiitReg: string;
  sellerType: 'OEM' | 'Resellers';
  rating: number;
  reviewCount: number;
  verifiedApproval: boolean;
  price: number;
  mrp: number;
  discountPercentage: number;
  minOrderQty: number;
  brand: string;
  imageUrl: string;
  swadeshiCertified: boolean;
  trlLevel: string;
  deliveryPeriodDays: number;
  description: string;
  procurementSpecs: string[];
  departmentTestingStatus?: 'NOT_REQUESTED' | 'TEST_SCHEDULED' | 'PILOT_TESTING_ACTIVE' | 'TEST_PASSED' | 'PURCHASE_ORDER_ISSUED';
  pilotScore?: number;
  testSandboxLocation?: string;
  createdAt?: string;
}

export type ProductItem = StartupProduct;

export interface SandboxTrial {
  id: string;
  productId: string;
  productName: string;
  departmentName: string;
  districtLocation: string;
  nodalOfficerName: string;
  nodalOfficerEmail: string;
  nodalOfficerPhone: string;
  durationWeeks: number;
  targetSuccessKPIs: string;
  governmentTestingFacility: string;
  dpdpComplianceSigned: boolean;
  ipAgreementSigned: boolean;
  status: 'UNDER_EVALUATION' | 'APPROVED' | 'COMPLETED_SUCCESS' | 'REJECTED';
  submittedDate: string;
  notes?: string;
}

export interface PilotTestRequest {
  id: string;
  productId: string;
  productName: string;
  startupName: string;
  departmentName: string;
  departmentOfficerName: string;
  contactEmail: string;
  contactMobile: string;
  proposedTestDurationDays: number;
  testEnvironment: 'Municipal Field Sandbox' | 'Laboratory Simulation' | 'Controlled Agency Corridor';
  expectedOutcome: string;
  status: 'PENDING_APPROVAL' | 'SANCTIONED_TESTING' | 'COMPLETED_SUCCESS' | 'REJECTED';
  requestDate: string;
  testReportUrl?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  startupName: string;
  departmentName: string;
  quantity: number;
  totalAmount: number;
  rule149ExemptionRef: string;
  escrowStatus: 'ESCROW_LOCKED' | 'MILESTONE_1_DISBURSED' | 'FULL_DISBURSEMENT_COMPLETE';
  orderDate: string;
  status: 'ORDER_PLACED' | 'DISPATCHED' | 'DELIVERED_AND_VERIFIED';
}

const INITIAL_PRODUCTS: StartupProduct[] = [
  {
    id: 'PRD-ROBO-001',
    name: 'ROBOCOUPLER TECHNO SOLUTIONS Automated Robotic Inspection Kiosk',
    category: 'robotics',
    categoryName: 'Advanced Robotics',
    startupName: 'Apex AI Mobility Solutions Pvt Ltd',
    dpiitReg: 'DIPP104829',
    sellerType: 'OEM',
    rating: 4.8,
    reviewCount: 38,
    verifiedApproval: true,
    price: 832043.00,
    mrp: 924492.24,
    discountPercentage: 10,
    minOrderQty: 4,
    brand: 'ROBOCOUPLER',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (Commercial Ready)',
    deliveryPeriodDays: 21,
    description: 'Autonomous multi-sensor patrol and thermal inspection humanoid robot for critical government utility substations and public facilities.',
    procurementSpecs: ['Autonomous LiDAR SLAM', 'Thermal & Optical 4K Zoom', 'IP67 Ingress Protection', 'CERT-In Secured API'],
    departmentTestingStatus: 'TEST_PASSED',
    pilotScore: 92.5,
    testSandboxLocation: 'Pune Mahanagar Parivahan Corridor'
  },
  {
    id: 'PRD-ROBO-002',
    name: 'Endobot Pipeline Inspection Pipe Crawling Robotic Buggy (Series 50)',
    category: 'robotics',
    categoryName: 'Advanced Robotics',
    startupName: 'EndoBot Innovations India LLP',
    dpiitReg: 'DIPP109482',
    sellerType: 'OEM',
    rating: 4.7,
    reviewCount: 24,
    verifiedApproval: true,
    price: 2593403.00,
    mrp: 2881560.00,
    discountPercentage: 10,
    minOrderQty: 1,
    brand: 'Endobot',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (Govt Field Proven)',
    deliveryPeriodDays: 14,
    description: 'Ruggedized crawler for municipal underground sewer and potable water pipeline defect mapping with real-time AI crack segmentation.',
    procurementSpecs: ['Tethered 300m range', '360° Pan-Tilt Camera', 'Sonar Thickness Gauge', 'Zero Manual Entry Compliant'],
    departmentTestingStatus: 'PILOT_TESTING_ACTIVE',
    pilotScore: 88.0,
    testSandboxLocation: 'BMC Ward K-West Stormwater Drainage'
  },
  {
    id: 'PRD-ROBO-003',
    name: 'Endobot Pipeline Inspection Pipe Crawling Robotic System (Series 75)',
    category: 'robotics',
    categoryName: 'Advanced Robotics',
    startupName: 'EndoBot Innovations India LLP',
    dpiitReg: 'DIPP109482',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 19,
    verifiedApproval: true,
    price: 3182814.00,
    mrp: 3536460.00,
    discountPercentage: 10,
    minOrderQty: 1,
    brand: 'Endobot',
    imageUrl: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (Govt Field Proven)',
    deliveryPeriodDays: 14,
    description: 'High-torque heavy drainage crawler with integrated laser profiling for urban municipal corporations and industrial discharge lines.',
    procurementSpecs: ['Explosion-Proof ATEX Certified', '4K Laser Profiling', 'Automatic Pipe Diameter Calibration'],
    departmentTestingStatus: 'NOT_REQUESTED'
  },
  {
    id: 'PRD-AGRI-001',
    name: 'KisanDrishti Multi-Spectral Autonomous Drone for Agriculture Yield Prediction',
    category: 'agritech',
    categoryName: 'Agriculture Tech',
    startupName: 'Bharat AeroTech Solutions',
    dpiitReg: 'DIPP112930',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 45,
    verifiedApproval: true,
    price: 645000.00,
    mrp: 750000.00,
    discountPercentage: 14,
    minOrderQty: 2,
    brand: 'KisanDrishti',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (Field Proven)',
    deliveryPeriodDays: 10,
    description: 'DGCA Type-Certified mapping drone equipped with 5-band NDVI multi-spectral camera for district agriculture crop insurance audits.',
    procurementSpecs: ['45 min flight endurance', 'Sub-centimeter GSD', 'Automated PMFBY Survey Integration'],
    departmentTestingStatus: 'PURCHASE_ORDER_ISSUED',
    pilotScore: 95.0,
    testSandboxLocation: 'District Agriculture Office, Aurangabad'
  },
  {
    id: 'PRD-AI-001',
    name: 'Pravaah-AI Edge Smart Traffic Signal Controller with Computer Vision Sensor',
    category: 'ai-bigdata',
    categoryName: 'Artificial Intelligence',
    startupName: 'Apex AI Mobility Solutions Pvt Ltd',
    dpiitReg: 'DIPP104829',
    sellerType: 'OEM',
    rating: 4.8,
    reviewCount: 31,
    verifiedApproval: true,
    price: 485000.00,
    mrp: 550000.00,
    discountPercentage: 12,
    minOrderQty: 3,
    brand: 'Pravaah',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (State Validated)',
    deliveryPeriodDays: 14,
    description: 'Edge computing AI hardware module interfacing with existing municipal traffic junction poles to dynamically adapt signal cycle times.',
    procurementSpecs: ['NVIDIA Jetson Edge', 'Compatible with MoRTH standards', 'Direct Smart City ICCC Linkage'],
    departmentTestingStatus: 'TEST_PASSED',
    pilotScore: 94.0,
    testSandboxLocation: 'Pune Smart City 12 Junction Pilot'
  },
  {
    id: 'PRD-MED-001',
    name: 'ArogyaSetu Portable Tele-ICU Multi-Para Vital Monitor Kiosk',
    category: 'medtech',
    categoryName: 'MedTech Diagnostic Devices',
    startupName: 'VitalsCare MedTech Pvt Ltd',
    dpiitReg: 'DIPP110482',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 52,
    verifiedApproval: true,
    price: 215000.00,
    mrp: 260000.00,
    discountPercentage: 17,
    minOrderQty: 5,
    brand: 'ArogyaSetu',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (CDSCO Approved)',
    deliveryPeriodDays: 7,
    description: 'Solar-chargeable ruggedized health kiosk capturing 12-lead ECG, SpO2, NIBP, and blood glucose for remote Primary Health Centres.',
    procurementSpecs: ['CDSCO Class-B Certified', 'ABHA / ABDM Health ID Cloud Sync', 'Offline Operation up to 72 hours'],
    departmentTestingStatus: 'PILOT_TESTING_ACTIVE',
    pilotScore: 89.0,
    testSandboxLocation: 'Gadchiroli Rural Sub-District Hospital'
  },
  {
    id: 'PRD-WATER-001',
    name: 'JalShuddhi Real-Time Potable Water Quality IoT Analyzer Station',
    category: 'watertech',
    categoryName: 'Water Tech & Sanitation',
    startupName: 'AquaSens Sensors India',
    dpiitReg: 'DIPP114820',
    sellerType: 'OEM',
    rating: 4.6,
    reviewCount: 18,
    verifiedApproval: true,
    price: 185000.00,
    mrp: 210000.00,
    discountPercentage: 12,
    minOrderQty: 2,
    brand: 'JalShuddhi',
    imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (Jal Jeevan Tested)',
    deliveryPeriodDays: 14,
    description: 'Continuous monitoring unit for residual chlorine, pH, turbidity, TDS, and heavy metals with automated SMS alerts for rural water tanks.',
    procurementSpecs: ['Solar Powered with Battery Backup', '4G eSIM Telemetry', 'JJM Central Dashboard Integration'],
    departmentTestingStatus: 'NOT_REQUESTED'
  },
  {
    id: 'PRD-CLEAN-001',
    name: 'UrjaGrid Micro-Solar Smart Bi-Directional EV Fast Charger Unit',
    category: 'cleantech',
    categoryName: 'CleanTech / Renewables',
    startupName: 'UrjaGrid Technologies India Pvt Ltd',
    dpiitReg: 'DIPP116742',
    sellerType: 'OEM',
    rating: 4.8,
    reviewCount: 22,
    verifiedApproval: true,
    price: 345000.00,
    mrp: 395000.00,
    discountPercentage: 12,
    minOrderQty: 2,
    brand: 'UrjaGrid',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (State Validated)',
    deliveryPeriodDays: 15,
    description: 'Decentralized 60kW DC solar EV charging station with smart load-shedding and OCPP 2.0.1 protocol for government transport depots.',
    procurementSpecs: ['OCPP 2.0.1 Compliant', 'IP65 Weatherproof', 'Integrated Bharat EV Billing Protocol'],
    departmentTestingStatus: 'TEST_PASSED',
    pilotScore: 91.0,
    testSandboxLocation: 'Navi Mumbai Municipal Transport Depot'
  },
  {
    id: 'PRD-CYBER-001',
    name: 'KavachDef Zero-Trust Government Cloud & Endpoint Detection Suite',
    category: 'cybersecurity',
    categoryName: 'Cybersecurity & DefTech',
    startupName: 'KavachSec Defense Solutions LLP',
    dpiitReg: 'DIPP108492',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 29,
    verifiedApproval: true,
    price: 490000.00,
    mrp: 580000.00,
    discountPercentage: 15,
    minOrderQty: 1,
    brand: 'KavachDef',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (CERT-In Audited)',
    deliveryPeriodDays: 3,
    description: 'Air-gapped and hybrid government cloud intrusion protection suite with AI automated behavioral threat containment for state departments.',
    procurementSpecs: ['STQC & CERT-In Empanelled', 'DPDP Act 2023 Compliant', 'On-Premise HSM Key Storage'],
    departmentTestingStatus: 'PURCHASE_ORDER_ISSUED',
    pilotScore: 96.5,
    testSandboxLocation: 'Maharashtra State Data Centre (SDC)'
  },
  {
    id: 'PRD-ED-001',
    name: 'VidyaSetu Vernacular AI Interactive Smart Digital Classroom Pod',
    category: 'edtech',
    categoryName: 'Education Tech',
    startupName: 'VidyaVani EdTech Pvt Ltd',
    dpiitReg: 'DIPP119283',
    sellerType: 'OEM',
    rating: 4.7,
    reviewCount: 36,
    verifiedApproval: true,
    price: 125000.00,
    mrp: 150000.00,
    discountPercentage: 16,
    minOrderQty: 5,
    brand: 'VidyaSetu',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (State Pilot Complete)',
    deliveryPeriodDays: 14,
    description: 'Low-cost solar powered interactive digital board and offline vernacular content server for Zilla Parishad rural schools.',
    procurementSpecs: ['Offline DIKSHA Curriculum Sync', 'Marathi & English Dual Mode', 'Shatter-Proof Anti-Glare Display'],
    departmentTestingStatus: 'TEST_PASSED',
    pilotScore: 90.0,
    testSandboxLocation: 'ZP High School, Baramati'
  },
  {
    id: 'PRD-HL-001',
    name: 'NidaanPoint AI Portable Cervical & Breast Cancer Screening Camera',
    category: 'health-lifesciences',
    categoryName: 'Health and Life Sciences',
    startupName: 'Nidaan Diagnostic Labs LLP',
    dpiitReg: 'DIPP115930',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 41,
    verifiedApproval: true,
    price: 275000.00,
    mrp: 320000.00,
    discountPercentage: 14,
    minOrderQty: 3,
    brand: 'NidaanPoint',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (Clinical Validated)',
    deliveryPeriodDays: 7,
    description: 'Handheld radiation-free thermal and optical cancer screener for ASHA workers in community health centers.',
    procurementSpecs: ['CDSCO Approved', 'Thermal AI Sensitivity 94.8%', 'ABDM Health Locker Compatible'],
    departmentTestingStatus: 'TEST_PASSED',
    pilotScore: 93.0,
    testSandboxLocation: 'KEM Hospital & Research Centre'
  },
  {
    id: 'PRD-AST-001',
    name: 'DrishtiSparsh Refreshable Multi-Line Electronic Braille Reader',
    category: 'assistive',
    categoryName: 'Assistive Tech & Inclusion',
    startupName: 'Sparsh Assistive Devices Pvt Ltd',
    dpiitReg: 'DIPP118204',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 27,
    verifiedApproval: true,
    price: 48000.00,
    mrp: 60000.00,
    discountPercentage: 20,
    minOrderQty: 5,
    brand: 'DrishtiSparsh',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (National Institute Validated)',
    deliveryPeriodDays: 10,
    description: 'Affordable piezo-electric 40-cell refreshable braille display and screen reader with Marathi, Hindi, and English TTS.',
    procurementSpecs: ['40 Refreshable Piezo Cells', 'Support for 12 Indian Languages', '14-Hour Battery Life'],
    departmentTestingStatus: 'TEST_PASSED',
    pilotScore: 95.5,
    testSandboxLocation: 'National Association for the Blind, Worli'
  },
  {
    id: 'PRD-BC-001',
    name: 'SatyaChain Tamper-Proof Land Records & Subsidy DBT Ledger Node',
    category: 'blockchain',
    categoryName: 'Blockchain & Web3 Trust',
    startupName: 'SatyaLedger GovTech Systems',
    dpiitReg: 'DIPP107384',
    sellerType: 'OEM',
    rating: 4.7,
    reviewCount: 16,
    verifiedApproval: true,
    price: 380000.00,
    mrp: 450000.00,
    discountPercentage: 15,
    minOrderQty: 1,
    brand: 'SatyaChain',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (State Pilot Live)',
    deliveryPeriodDays: 7,
    description: 'Permissioned state blockchain node for immutable land registry ownership title issuance and DBT verification.',
    procurementSpecs: ['Hyperledger Besu Enterprise', 'BFT Consensus', 'Aadhaar e-Sign Integrated'],
    departmentTestingStatus: 'PILOT_TESTING_ACTIVE',
    pilotScore: 89.0,
    testSandboxLocation: 'Revenue Department Sub-Registrar Office, Haveli'
  },
  {
    id: 'PRD-ARVR-001',
    name: 'AapdaSim VR High-Fidelity Disaster & Fire Response Simulator',
    category: 'ar-vr',
    categoryName: 'Augmented / Virtual Reality',
    startupName: 'SimGov Immersive Labs',
    dpiitReg: 'DIPP113948',
    sellerType: 'OEM',
    rating: 4.8,
    reviewCount: 20,
    verifiedApproval: true,
    price: 520000.00,
    mrp: 620000.00,
    discountPercentage: 16,
    minOrderQty: 2,
    brand: 'AapdaSim',
    imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (State Civil Defense Tested)',
    deliveryPeriodDays: 14,
    description: '6-DOF VR headsets and tactical haptic hose training system for municipal fire brigades and state SDRF rescue personnel.',
    procurementSpecs: ['Wireless 4K Per-Eye HMD', 'Haptic Pressure Feedback Nozzle', 'Automated Officer Scoring Engine'],
    departmentTestingStatus: 'TEST_PASSED',
    pilotScore: 92.0,
    testSandboxLocation: 'Maharashtra State Fire Academy, Kalina'
  },
  {
    id: 'PRD-REN-001',
    name: 'SuryaVayu Hybrid Micro-Wind & Solar MPPT Irrigation Pump Rig',
    category: 'renewable',
    categoryName: 'Renewable Power & Storage',
    startupName: 'SuryaVayu Clean Energy LLP',
    dpiitReg: 'DIPP114920',
    sellerType: 'OEM',
    rating: 4.8,
    reviewCount: 34,
    verifiedApproval: true,
    price: 295000.00,
    mrp: 340000.00,
    discountPercentage: 13,
    minOrderQty: 3,
    brand: 'SuryaVayu',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (MNRE Validated)',
    deliveryPeriodDays: 12,
    description: 'Off-grid solar and micro-vertical wind turbine pump controller for tribal and drought-prone agricultural belts.',
    procurementSpecs: ['MNRE Type Test Approved', 'IoT Remote Telemetry', 'Automatic Dry Run Protection'],
    departmentTestingStatus: 'PURCHASE_ORDER_ISSUED',
    pilotScore: 94.0,
    testSandboxLocation: 'Kusum Yojana Pilot Zone, Osmanabad'
  }
];

const INITIAL_TEST_REQUESTS: PilotTestRequest[] = [
  {
    id: 'TST-2026-081',
    productId: 'PRD-ROBO-002',
    productName: 'Endobot Pipeline Inspection Pipe Crawling Robotic Buggy (Series 50)',
    startupName: 'EndoBot Innovations India LLP',
    departmentName: 'Municipal Corporation of Greater Mumbai (BMC)',
    departmentOfficerName: 'Shri R. V. Patil, Chief Engineer (Storm Water)',
    contactEmail: 'ce.swd@mcgm.gov.in',
    contactMobile: '9820123456',
    proposedTestDurationDays: 30,
    testEnvironment: 'Municipal Field Sandbox',
    expectedOutcome: 'Map underground pipe structural cracks and silt volume across 3km culvert without manual scavenger entry.',
    status: 'SANCTIONED_TESTING',
    requestDate: '10 Sep 2026'
  },
  {
    id: 'TST-2026-044',
    productId: 'PRD-AI-001',
    productName: 'Pravaah-AI Edge Smart Traffic Signal Controller',
    startupName: 'Apex AI Mobility Solutions Pvt Ltd',
    departmentName: 'Department of Transport, GoM & Pune Police',
    departmentOfficerName: 'DCP Traffic, Pune Commissionerate',
    contactEmail: 'dcp.traffic.pune@mahapolice.gov.in',
    contactMobile: '9822987654',
    proposedTestDurationDays: 60,
    testEnvironment: 'Controlled Agency Corridor',
    expectedOutcome: 'Demonstrate minimum 25% wait-time reduction at JM Road and FC Road junctions during peak evening traffic.',
    status: 'COMPLETED_SUCCESS',
    requestDate: '01 Aug 2026',
    testReportUrl: 'MH-IV-CERT-2026-PUNETRAFFIC.pdf'
  }
];

const INITIAL_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-MH-2026-009',
    orderNumber: 'GEM-GOM-2026-PO-94821',
    productId: 'PRD-AGRI-001',
    productName: 'KisanDrishti Multi-Spectral Autonomous Drone',
    startupName: 'Bharat AeroTech Solutions',
    departmentName: 'Department of Agriculture, GoM',
    quantity: 4,
    totalAmount: 2580000.00,
    rule149ExemptionRef: 'GFR-149(ii)-STARTUP-EXEMPT-MH2026-088',
    escrowStatus: 'MILESTONE_1_DISBURSED',
    orderDate: '15 Sep 2026',
    status: 'DISPATCHED'
  }
];

// Persistent state store helper
export const productStore = {
  getProducts: (): StartupProduct[] => {
    const saved = localStorage.getItem('ipp_startup_products');
    if (saved) {
      try {
        const parsed: StartupProduct[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to ensure all system categories exist
          const map = new Map<string, StartupProduct>();
          INITIAL_PRODUCTS.forEach(p => map.set(p.id, p));
          parsed.forEach(p => map.set(p.id, p));
          return Array.from(map.values());
        }
      } catch {}
    }
    return INITIAL_PRODUCTS;
  },
  
  saveProduct: (product: StartupProduct) => {
    const list = productStore.getProducts();
    const existingIndex = list.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      list[existingIndex] = product;
    } else {
      list.unshift(product);
    }
    localStorage.setItem('ipp_startup_products', JSON.stringify(list));
  },

  getTestRequests: (): PilotTestRequest[] => {
    const saved = localStorage.getItem('ipp_test_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_TEST_REQUESTS;
  },

  addTestRequest: (req: PilotTestRequest) => {
    const list = productStore.getTestRequests();
    list.unshift(req);
    localStorage.setItem('ipp_test_requests', JSON.stringify(list));
    
    // Update product status
    const products = productStore.getProducts();
    const target = products.find(p => p.id === req.productId);
    if (target) {
      target.departmentTestingStatus = 'TEST_SCHEDULED';
      productStore.saveProduct(target);
    }
  },

  getPurchaseOrders: (): PurchaseOrder[] => {
    const saved = localStorage.getItem('ipp_purchase_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ORDERS;
  },

  addPurchaseOrder: (po: PurchaseOrder) => {
    const list = productStore.getPurchaseOrders();
    list.unshift(po);
    localStorage.setItem('ipp_purchase_orders', JSON.stringify(list));

    const products = productStore.getProducts();
    const target = products.find(p => p.id === po.productId);
    if (target) {
      target.departmentTestingStatus = 'PURCHASE_ORDER_ISSUED';
      productStore.saveProduct(target);
    }
  }
};

const INITIAL_SANDBOX_TRIALS: SandboxTrial[] = [
  {
    id: 'SBT-2026-001',
    productId: 'PRD-WATER-001',
    productName: 'JalShuddhi Real-Time Potable Water Quality IoT Analyzer Station',
    departmentName: 'Water Supply & Sanitation Department, GoM',
    districtLocation: 'Solapur & Ahmednagar Rural Tehsils',
    nodalOfficerName: 'Shri Anand Deshmukh, Superintending Engineer',
    nodalOfficerEmail: 'se.watersolapur@maharashtra.gov.in',
    nodalOfficerPhone: '+91 9823019284',
    durationWeeks: 4,
    targetSuccessKPIs: 'Verify real-time residual chlorine, TDS, and turbidity detection against standard laboratory spectrophotometer with 98%+ precision.',
    governmentTestingFacility: 'District Public Health Laboratory, Solapur & 3 Gram Panchayat Overhead Tanks',
    dpdpComplianceSigned: true,
    ipAgreementSigned: true,
    status: 'COMPLETED_SUCCESS',
    submittedDate: '05 Sep 2026',
    notes: 'Trial completed successfully. Verified 99.1% sensor accuracy over 30 days under high ambient heat. Recommended for district-wide procurement.'
  },
  {
    id: 'SBT-2026-002',
    productId: 'PRD-ROBO-002',
    productName: 'Endobot Pipeline Inspection Pipe Crawling Robotic Buggy (Series 50)',
    departmentName: 'Municipal Corporation of Greater Mumbai (BMC)',
    districtLocation: 'Mumbai Suburban & Island City Culverts',
    nodalOfficerName: 'Smt. Kavita Shinde, Executive Engineer (Drainage)',
    nodalOfficerEmail: 'ee.drainage@mcgm.gov.in',
    nodalOfficerPhone: '+91 9819876543',
    durationWeeks: 6,
    targetSuccessKPIs: 'Detect concrete spalling, high silt accumulation, and methane pockets in 600mm to 1200mm diameter stormwater pipelines without human entry.',
    governmentTestingFacility: 'BMC Central Pumping Station & Hindmata Stormwater Drains',
    dpdpComplianceSigned: true,
    ipAgreementSigned: true,
    status: 'APPROVED',
    submittedDate: '12 Sep 2026'
  },
  {
    id: 'SBT-2026-003',
    productId: 'PRD-MED-001',
    productName: 'ArogyaSetu Portable Tele-ICU Multi-Para Vital Monitor Kiosk',
    departmentName: 'Public Health Department, GoM',
    districtLocation: 'Gadchiroli Tribal Sub-District Hospitals',
    nodalOfficerName: 'Dr. Suresh Gaikwad, Civil Surgeon',
    nodalOfficerEmail: 'cs.gadchiroli@mahadph.gov.in',
    nodalOfficerPhone: '+91 9422114477',
    durationWeeks: 8,
    targetSuccessKPIs: 'Zero-drop ECG telemetry transmission over low-bandwidth 2G/4G network and automated ABDM health record generation.',
    governmentTestingFacility: 'Sub-District Hospital Kurkheda & PHC Dhanora',
    dpdpComplianceSigned: true,
    ipAgreementSigned: true,
    status: 'UNDER_EVALUATION',
    submittedDate: '18 Sep 2026'
  }
];

export const getStoredProducts = (): StartupProduct[] => {
  return productStore.getProducts();
};

export const getSandboxTrials = (): SandboxTrial[] => {
  const saved = localStorage.getItem('ipp_sandbox_trials');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return INITIAL_SANDBOX_TRIALS;
};

export const updateSandboxTrialStatus = (
  id: string, 
  status: SandboxTrial['status'], 
  notes?: string
) => {
  const trials = getSandboxTrials();
  const trialIndex = trials.findIndex(t => t.id === id);
  if (trialIndex >= 0) {
    trials[trialIndex].status = status;
    if (notes) {
      trials[trialIndex].notes = notes;
    }
    localStorage.setItem('ipp_sandbox_trials', JSON.stringify(trials));
  }
};

export const addSandboxTrial = (trial: SandboxTrial) => {
  const trials = getSandboxTrials();
  trials.unshift(trial);
  localStorage.setItem('ipp_sandbox_trials', JSON.stringify(trials));
};

export interface FAQItem {
  id: string;
  category: 'STARTUP_PROCUREMENT' | 'GFR_RULES' | 'PILOT_SANDBOX' | 'GENERAL_CITIZEN';
  categoryLabel: string;
  question: string;
  askedBy: string;
  userType: 'Startup / Innovator' | 'Citizen' | 'Department Official';
  submittedDate: string;
  answer?: string;
  answeredByGovDepartment?: string;
  answeredDate?: string;
  isVerifiedPublicAnswer: boolean;
}

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'FAQ-001',
    category: 'STARTUP_PROCUREMENT',
    categoryLabel: 'Procurement & GeM',
    question: 'Are DPIIT recognized startups exempt from prior turnover and prior experience criteria for government procurement?',
    askedBy: 'AeroTech Systems Pvt Ltd',
    userType: 'Startup / Innovator',
    submittedDate: '12 Sep 2026',
    answer: 'Yes. Under Ministry of Finance OM No. F.20/2/2014-PPD and Rule 149 of the General Financial Rules (GFR), all state and central departments are mandated to exempt DPIIT-recognized startups from "prior turnover" and "prior experience" hurdles, provided the startup meets the required technical specifications and quality standards.',
    answeredByGovDepartment: 'Industries, Energy & Labour Department, Government of Maharashtra',
    answeredDate: '14 Sep 2026',
    isVerifiedPublicAnswer: true
  },
  {
    id: 'FAQ-002',
    category: 'PILOT_SANDBOX',
    categoryLabel: 'Pilot Sandboxes & Grants',
    question: 'How are sandbox pilot grants disbursed to startups during the 90-day testing phase?',
    askedBy: 'BioVitals Healthcare',
    userType: 'Startup / Innovator',
    submittedDate: '15 Sep 2026',
    answer: 'Sandbox trials approved by the State Innovation Committee receive milestone-linked tranches (up to ₹25 Lakhs) held in an escrow Direct Benefit Transfer (DBT) structure. 30% is disbursed upon field mobilization, 40% on mid-term telemetry data validation, and the final 30% upon independent evaluation panel sign-off.',
    answeredByGovDepartment: 'Maharashtra State Innovation Society (MSInS)',
    answeredDate: '16 Sep 2026',
    isVerifiedPublicAnswer: true
  },
  {
    id: 'FAQ-003',
    category: 'GFR_RULES',
    categoryLabel: 'Security Deposit (EMD)',
    question: 'Do startups need to deposit Earnest Money Deposit (EMD) or tender fees when bidding for departmental challenges?',
    askedBy: 'RoboClean India LLP',
    userType: 'Startup / Innovator',
    submittedDate: '18 Sep 2026',
    answer: 'No Earnest Money Deposit (EMD) or tender fees are required for registered startups submitting proposals on this portal. Under Maharashtra Innovation Procurement Policy, accredited startups only require active DPIIT recognition, CIN/GSTIN verification, and submission of a simple Bid Security Declaration.',
    answeredByGovDepartment: 'Finance Department, Government of Maharashtra',
    answeredDate: '19 Sep 2026',
    isVerifiedPublicAnswer: true
  },
  {
    id: 'FAQ-004',
    category: 'GENERAL_CITIZEN',
    categoryLabel: 'Public & Citizen Oversight',
    question: 'How does the government ensure that public funds spent on testing startup innovations yield actual improvements for citizens?',
    askedBy: 'Ramesh Kulkarni',
    userType: 'Citizen',
    submittedDate: '20 Sep 2026',
    answer: 'Every pilot project is bound by quantifiable public service KPIs (such as leak reduction percentage, response time reduction, or diagnostic accuracy). An independent validator panel (comprising professors from IIT Bombay, COEP Technological University, and technical directors) inspects the trial before any direct state purchase order can be sanctioned.',
    answeredByGovDepartment: 'Planning & Governance Department, Government of Maharashtra',
    answeredDate: '21 Sep 2026',
    isVerifiedPublicAnswer: true
  }
];

export const getStoredFAQs = (): FAQItem[] => {
  const saved = localStorage.getItem('ipp_faqs');
  if (saved) {
    try {
      const parsed: FAQItem[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map<string, FAQItem>();
        INITIAL_FAQS.forEach(f => map.set(f.id, f));
        parsed.forEach(f => map.set(f.id, f));
        return Array.from(map.values());
      }
    } catch {}
  }
  return INITIAL_FAQS;
};

export const addFAQQuestion = (newQuestion: {
  question: string;
  askedBy: string;
  userType: FAQItem['userType'];
  category: FAQItem['category'];
  categoryLabel: string;
}): FAQItem => {
  const currentList = getStoredFAQs();
  const created: FAQItem = {
    id: `FAQ-${Date.now().toString().slice(-4)}`,
    ...newQuestion,
    submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    isVerifiedPublicAnswer: false
  };
  currentList.unshift(created);
  localStorage.setItem('ipp_faqs', JSON.stringify(currentList));
  return created;
};

export const answerFAQQuestion = (
  faqId: string,
  answer: string,
  departmentName: string = 'Department of Governance & Innovation, GoM'
) => {
  const currentList = getStoredFAQs();
  const index = currentList.findIndex(f => f.id === faqId);
  if (index >= 0) {
    currentList[index].answer = answer;
    currentList[index].answeredByGovDepartment = departmentName;
    currentList[index].answeredDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    currentList[index].isVerifiedPublicAnswer = true;
    localStorage.setItem('ipp_faqs', JSON.stringify(currentList));
  }
};

