# Services Architecture

This directory contains the modular Supabase services for the Clinica Edria application.

## Structure

```
services/
├── supabase-client.ts           # Supabase client configuration and shared types
├── base-service.ts              # Base service class with common functionality
├── patient-service.ts           # Patient-related operations
├── clinic-professional-service.ts # Clinic professional and admin operations
└── README.md                   # This documentation
```

## Services

### BaseService
Abstract base class that provides:
- Common error handling with `handleError()`
- Operation logging with `logOperation()`
- Singleton pattern support

### PatientService
Handles all patient-related database operations:
- `createPatient()` - Create a new patient
- `getPatientByUserId()` - Get patient by user ID
- `getPatientsWithCodeAndName()` - Get patients list with code and name
- `updatePatient()` - Update patient information
- `deletePatient()` - Delete a patient

### ClinicProfessionalService
Handles all clinic professional and admin operations:
- `createClinicProfessional()` - Create a new clinic professional or admin
- `getClinicProfessionals()` - Get all clinic professionals
- `getClinicProfessionalByUserId()` - Get clinic professional by user ID
- `updateClinicProfessional()` - Update clinic professional information
- `deleteClinicProfessional()` - Delete a clinic professional
- `getClinicProfessionalRole()` - Get the role of a clinic professional

**Note**: Clinic professionals can be created as either 'ADMIN' or 'CLINIC_PROFESSIONAL' roles. Only existing admins can create new professionals.

## Usage

### Import individual services
```typescript
import { PatientService } from '@/services/patient-service';
import { ClinicProfessionalService } from '@/services/clinic-professional-service';

const patientService = PatientService.getInstance();
const clinicProfessionalService = ClinicProfessionalService.getInstance();
```

### Import types
```typescript
import type { Patient } from '@/services/supabase-client';
import type { ClinicProfessional } from '@/services/clinic-professional-service';
```

### Import client directly
```typescript
import { supabase } from '@/services/supabase-client';
```

## Database Schema

### Patients Table
- `id` - Primary key
- `patient_id` - Unique patient identifier
- `name` - Patient's first name
- `surname` - Patient's last name
- `email` - Patient's email
- `user_id` - Firebase user ID
- `registration_date` - Date of registration
- `pdf_url` - Optional PDF document URL
- `created_at` - Record creation timestamp

### Clinic Professionals Table
- `id` - Primary key
- `name` - Professional's first name
- `surname` - Professional's last name
- `specialty` - Professional's specialty
- `email` - Professional's email
- `user_id` - Firebase user ID
- `phone` - Optional phone number
- `active` - Whether the professional is active
- `role` - Either 'ADMIN' or 'CLINIC_PROFESSIONAL'
- `created_at` - Record creation timestamp

## Benefits

1. **Separation of Concerns**: Each service handles a specific domain
2. **Better Maintainability**: Easier to find and modify specific functionality
3. **Improved Readability**: Smaller, focused files
4. **Enhanced Scalability**: Easy to add new services or extend existing ones
5. **Common Functionality**: Shared error handling and logging through BaseService
6. **Type Safety**: Proper TypeScript types for all operations
7. **Singleton Pattern**: Ensures single instances of services
8. **Direct Imports**: Clean, explicit imports without unnecessary abstraction layers
9. **No Overhead**: No unnecessary re-export layers or index files
10. **Role Management**: Integrated role management within clinic professional service

## Adding New Services

1. Create a new service file extending `BaseService`
2. Implement the singleton pattern
3. Import and use directly where needed

Example:
```typescript
import { BaseService } from './base-service';

export class NewService extends BaseService {
  private static instance: NewService;

  private constructor() {
    super();
  }

  public static getInstance(): NewService {
    if (!NewService.instance) {
      NewService.instance = new NewService();
    }
    return NewService.instance;
  }

  // Add your methods here
}
``` 