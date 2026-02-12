export interface TagCompliance {
  compliance: number;
}

export interface ComplianceResponse {
  account_id: string;
  timestamp: string;
  tags: Record<string, TagCompliance>;
}