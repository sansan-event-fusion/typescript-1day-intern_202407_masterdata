import { NormalizeWorkflowStep } from 'src/types/normalize-workflow-step';
import { NormalizeZipCodeStep } from './normalize-zip-code.step';
import { NormalizeBusinessLocationNameStep } from './normalize-business-location-name.step';
import { NormalizeAddressStep } from './normalize-address.step';
import { NormalizePhoneNumberStep } from './normalize-phone-number.step';

export const NORMALIZE_WORKFLOW_STEPS: NormalizeWorkflowStep[] = [
  NormalizeZipCodeStep,
  NormalizePhoneNumberStep,
  NormalizeBusinessLocationNameStep,
  NormalizeAddressStep,
];
