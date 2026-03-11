// Provide a minimal Deno type so the TS compiler knows the global
declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AuditPayload {
  analyst_name: string;
  call_id: string;
  call_duration: number;
  call_type: string;
  notes?: string;
  audio?: {
    filename: string;
    size: number;
    url: string;
  };
}

interface Violation {
  type: string;
  description: string;
  timestamp?: number;
}

interface WebhookResponse {
  success: boolean;
  status: 'passed' | 'failed' | 'flagged' | 'pending';
  compliance_score: number;
  violations?: Violation[];
  processing_time_ms: number;
  agent_feedback?: string;
  error?: string;
}

function generateComplianceResult(payload: AuditPayload): WebhookResponse {
  const startTime = Date.now();

  const violationScenarios = [
    {
      violations: [
        { type: 'Unauthorized Recording', description: 'Missing consent disclosure at call start' },
        { type: 'Compliance Script Deviation', description: 'Agent did not follow required greeting script' },
      ],
      score: 45,
      status: 'failed' as const,
    },
    {
      violations: [
        { type: 'Response Time Violation', description: 'Exceeded 2-second response time threshold' },
      ],
      score: 72,
      status: 'flagged' as const,
    },
    {
      violations: [],
      score: 95,
      status: 'passed' as const,
    },
    {
      violations: [
        { type: 'Policy Violation', description: 'Did not offer required discount information' },
        { type: 'Tone Analysis', description: 'Detected frustrated tone during customer interaction' },
      ],
      score: 58,
      status: 'flagged' as const,
    },
  ];

  // Use call_id to deterministically select a scenario for consistent results
  const scenarioIndex = payload.call_id.charCodeAt(0) % violationScenarios.length;
  const scenario = violationScenarios[scenarioIndex];

  const processingTime = Math.random() * 2000 + 500;

  return {
    success: true,
    status: scenario.status,
    compliance_score: scenario.score, 
    violations: scenario.violations,
    processing_time_ms: Math.round(processingTime),
    agent_feedback:
      scenario.status === 'passed'
        ? 'Excellent call quality. Agent followed all compliance requirements.'
        : `Review needed for ${scenario.violations.length} compliance issues.`,
  };
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const payload: AuditPayload = await req.json();

    const result = generateComplianceResult(payload);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        status: 'failed',
        compliance_score: 0,
        error: errorMessage,
        processing_time_ms: 0,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
