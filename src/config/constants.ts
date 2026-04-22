// export const VALIDATION_RULES = {
//   email: {
//     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//   },
//   audioUrl: {
//     pattern: /^https?:\/\/.+/,
//   },
//   analystName: {
//     minLength: 2,
//     maxLength: 100,
//   },
//   callId: {
//     maxLength: 50,
//     pattern: /^[a-zA-Z0-9-_]+$/,
//   },
//   notes: {
//     maxLength: 2000,
//   },
//   audio: {
//     maxSizeMB: 50,
//   },
// };

// export const APP_CONFIG = {
//   appName: 'CallAudit AI',
//   siteName: 'AI Call Audit System',
//   defaultPageSize: 10,
//   debounceDelay: 300,
//   toastDuration: 4000,
// };

// export const ALLOWED_AUDIO_DOMAINS = [
//   'recordings.exotel.com',  // your current provider
//   'storage.googleapis.com',
//   'your-supabase-project.supabase.co'
// ];

// export const CALL_TYPES = ['inbound', 'outbound'] as const;

// export const AUDIT_STATUS = ['pending', 'passed', 'failed', 'flagged'] as const;

// export interface ParameterCategory {
//   name: string;
//   parameters: string[];
// }

// export const AUDIT_PARAMETERS_BY_CATEGORY: ParameterCategory[] = [
//   {
//     name: 'Opening',
//     parameters: [
//       'BDA Introduction Pitch',
//       'Legal Mandate Pitch',
//     ]
//   },
//   {
//     name: 'Lead Discovery',
//     parameters: [
//       'Lead Acknowledged about Course Enquiry',
//       'Profiling',
//       'Did BDA Understand Lead Need',
//     ]
//   },
//   {
//     name: 'Course Pitch',
//     parameters: [
//       'Highlighted USPs',
//       'Industry Trend References',
//       'Syllabus Pitched',
//       'Certification Pitched',
//       'Branding',
//     ]
//   },
//   {
//     name: 'Pricing Discussion',
//     parameters: [
//       'Admission Fee Pitch',
//       'Fees Structure Pitch',
//       'CTC Range Pitch',
//       'Payment Capacity Checked',
//     ]
//   },
//   {
//     name: 'Post-Course Benefits',
//     parameters: [
//       'Placement Training',
//       'Placement Support with Hyrenet',
//       'Refund Policy Pitched',
//     ]
//   },
//   {
//     name: 'Objections & Concerns',
//     parameters: [
//       'Lead Concern in Course Enrolment',
//       'Did BDA Addressed the Lead Concern',
//       'Lead Objections towards Course Enrollment',
//       'Did BDA Handled Objections Effectively',
//     ]
//   },
//   {
//     name: 'Closing & Analysis',
//     parameters: [
//       'Created Need for Course',
//       'Urgency Creation',
//       'Observations',
//       'Reason for No Conversion',
//       'Fatal Pitch',
//       'Missed Opportunities by BDA',
//       'BDAs Strength',
//       'BDAs AoI',
//     ]
//   }
// ];

// // Flat list for backward compatibility
// export const AUDIT_PARAMETERS: string[] = AUDIT_PARAMETERS_BY_CATEGORY.flatMap(cat => cat.parameters);


export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  audioUrl: {
    pattern: /^https?:\/\/.+/,
  },
  vcUrl: {
    pattern: /^https?:\/\/.+/,
  },
  analystName: {
    minLength: 2,
    maxLength: 100,
  },
  callId: {
    maxLength: 50,
    pattern: /^[a-zA-Z0-9-_]+$/,
  },
  notes: {
    maxLength: 2000,
  },
  audio: {
    maxSizeMB: 50,
  },
};

export const APP_CONFIG = {
  appName: 'CallAudit AI',
  siteName: 'AI Call Audit System',
  defaultPageSize: 10,
  debounceDelay: 300,
  toastDuration: 4000,
};

export const ALLOWED_AUDIO_DOMAINS = [
  'recordings.exotel.com',
  'storage.googleapis.com',
  'your-supabase-project.supabase.co',
];

export const CALL_TYPES = ['inbound', 'outbound'] as const;
export const AUDIT_STATUS = ['pending', 'passed', 'failed', 'flagged'] as const;

// ── VC Platform detection ─────────────────────────────────
export const VC_PLATFORMS = [
  { id: 'zoom',   label: 'Zoom',   pattern: /zoom\.us/i },
  { id: 'meet',   label: 'Google Meet', pattern: /meet\.google\.com/i },
  { id: 'teams',  label: 'Teams',  pattern: /teams\.microsoft\.com/i },
  { id: 'exotel', label: 'Exotel', pattern: /exotel\.com/i },
] as const;

export type VCPlatformId = typeof VC_PLATFORMS[number]['id'] | 'other';

export function detectVCPlatform(url: string): VCPlatformId {
  for (const p of VC_PLATFORMS) {
    if (p.pattern.test(url)) return p.id;
  }
  return 'other';
}

// ── Lead Stages (for LeadSquare integration) ───────────────
export const LEAD_STAGES = [
  { id: 'new-lead', label: 'New Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal Sent' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
  { id: 'on-hold', label: 'On Hold' },
] as const;
export interface ParameterCategory {
  name: string;
  parameters: string[];
}

export const AUDIT_PARAMETERS_BY_CATEGORY: ParameterCategory[] = [
  {
    name: 'Opening',
    parameters: [
      'BDA Introduction Pitch',
      'Legal Mandate Pitch',
    ],
  },
  {
    name: 'Lead Discovery',
    parameters: [
      'Lead Acknowledged about Course Enquiry',
      'Profiling',
      'Did BDA Understand Lead Need',
    ],
  },
  {
    name: 'Course Pitch',
    parameters: [
      'Highlighted USPs',
      'Industry Trend References',
      'Syllabus Pitched',
      'Certification Pitched',
      'Branding',
    ],
  },
  {
    name: 'Pricing Discussion',
    parameters: [
      'Admission Fee Pitch',
      'Fees Structure Pitch',
      'CTC Range Pitch',
      'Payment Capacity Checked',
    ],
  },
  {
    name: 'Post-Course Benefits',
    parameters: [
      'Placement Training',
      'Placement Support with Hyrenet',
      'Refund Policy Pitched',
    ],
  },
  {
    name: 'Objections & Concerns',
    parameters: [
      'Lead Concern in Course Enrolment',
      'Did BDA Addressed the Lead Concern',
      'Lead Objections towards Course Enrollment',
      'Did BDA Handled Objections Effectively',
    ],
  },
  {
    name: 'Closing & Analysis',
    parameters: [
      'Created Need for Course',
      'Urgency Creation',
      'Observations',
      'Reason for No Conversion',
      'Fatal Pitch',
      'Missed Opportunities by BDA',
      'BDAs Strength',
      'BDAs AoI',
    ],
  },
];

export const AUDIT_PARAMETERS: string[] = AUDIT_PARAMETERS_BY_CATEGORY.flatMap(
  (cat) => cat.parameters
);